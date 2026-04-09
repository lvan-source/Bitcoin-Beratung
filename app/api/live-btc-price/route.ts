import { NextResponse } from "next/server";

const KRAKEN_API_BASE = "https://api.kraken.com/0/public";
const CACHE_TTL_MS = 20_000;
const REQUEST_TIMEOUT_MS = 8_000;
const DISPLAY_TIME_ZONE = "Europe/Zurich";

type KrakenTickerEntry = {
  c: [string, string];
};

type KrakenTickerResponse = {
  error: string[];
  result: Record<string, KrakenTickerEntry>;
};

type KrakenOhlcEntry = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];

type KrakenOhlcResponse = {
  error: string[];
  result: Record<string, KrakenOhlcEntry[] | number>;
};

type LiveBtcPricePayload = {
  chf: {
    current: number;
    dayOpen: number;
    percentChangeSinceMidnight: number;
    isUpSinceMidnight: boolean;
  };
  usd: {
    current: number;
    dayOpen: number;
    percentChangeSinceMidnight: number;
    isUpSinceMidnight: boolean;
  };
  source: string;
  timeZone: string;
  dayReference: string;
  updatedAt: string;
};

let cachedPayload: LiveBtcPricePayload | null = null;
let cachedAt = 0;
let inFlightRequest: Promise<LiveBtcPricePayload> | null = null;

export const dynamic = "force-dynamic";

function getDateTimeParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
    hour: Number(parts.find((part) => part.type === "hour")?.value),
    minute: Number(parts.find((part) => part.type === "minute")?.value),
    second: Number(parts.find((part) => part.type === "second")?.value),
  };
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = getDateTimeParts(date, timeZone);
  const asUtcTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return asUtcTimestamp - date.getTime();
}

function getStartOfDayUnix(timeZone: string) {
  const now = new Date();
  const parts = getDateTimeParts(now, timeZone);
  const utcGuess = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, 0, 0, 0),
  );
  const offsetMs = getTimeZoneOffsetMs(utcGuess, timeZone);

  return Math.floor((utcGuess.getTime() - offsetMs) / 1000);
}

async function fetchKrakenJson<T>(path: string): Promise<T> {
  const response = await fetch(`${KRAKEN_API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Kraken request failed for ${path} with ${response.status}`);
  }

  const payload = (await response.json()) as { error?: string[] };

  if (payload.error && payload.error.length > 0) {
    throw new Error(`Kraken returned an error for ${path}: ${payload.error.join(", ")}`);
  }

  return payload as T;
}

function getTickerEntry(
  result: Record<string, KrakenTickerEntry>,
  currency: "CHF" | "USD",
) {
  const entry = Object.entries(result).find(([pair]) => pair.endsWith(currency));

  if (!entry) {
    throw new Error(`Missing Kraken ticker entry for BTC/${currency}`);
  }

  return entry[1];
}

function getOhlcEntries(result: Record<string, KrakenOhlcEntry[] | number>) {
  const pairKey = Object.keys(result).find((key) => key !== "last");

  if (!pairKey) {
    throw new Error("Missing Kraken OHLC result key");
  }

  const entries = result[pairKey];

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error(`Missing Kraken OHLC entries for ${pairKey}`);
  }

  return entries;
}

function getOpeningPrice(entries: KrakenOhlcEntry[], startOfDayUnix: number) {
  const openingEntry =
    entries.find(([timestamp]) => timestamp >= startOfDayUnix) ?? entries[0];

  return Number(openingEntry[1]);
}

async function buildLiveBtcPricePayload(): Promise<LiveBtcPricePayload> {
  const startOfDayUnix = getStartOfDayUnix(DISPLAY_TIME_ZONE);

  const [tickerResponse, usdOhlcResponse, chfOhlcResponse] = await Promise.all([
    fetchKrakenJson<KrakenTickerResponse>("/Ticker?pair=BTCUSD,BTCCHF"),
    fetchKrakenJson<KrakenOhlcResponse>(
      `/OHLC?pair=BTCUSD&interval=5&since=${startOfDayUnix}`,
    ),
    fetchKrakenJson<KrakenOhlcResponse>(
      `/OHLC?pair=BTCCHF&interval=5&since=${startOfDayUnix}`,
    ),
  ]);

  const usdTicker = getTickerEntry(tickerResponse.result, "USD");
  const chfTicker = getTickerEntry(tickerResponse.result, "CHF");

  const usdCurrent = Number(usdTicker.c[0]);
  const chfCurrent = Number(chfTicker.c[0]);

  const usdDayOpen = getOpeningPrice(
    getOhlcEntries(usdOhlcResponse.result),
    startOfDayUnix,
  );
  const chfDayOpen = getOpeningPrice(
    getOhlcEntries(chfOhlcResponse.result),
    startOfDayUnix,
  );

  const usdPercentChange = ((usdCurrent - usdDayOpen) / usdDayOpen) * 100;
  const chfPercentChange = ((chfCurrent - chfDayOpen) / chfDayOpen) * 100;

  return {
    chf: {
      current: chfCurrent,
      dayOpen: chfDayOpen,
      percentChangeSinceMidnight: chfPercentChange,
      isUpSinceMidnight: chfCurrent >= chfDayOpen,
    },
    usd: {
      current: usdCurrent,
      dayOpen: usdDayOpen,
      percentChangeSinceMidnight: usdPercentChange,
      isUpSinceMidnight: usdCurrent >= usdDayOpen,
    },
    source: "Kraken",
    timeZone: DISPLAY_TIME_ZONE,
    dayReference: new Date(startOfDayUnix * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createSuccessResponse(payload: LiveBtcPricePayload) {
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=20, stale-while-revalidate=40",
    },
  });
}

export async function GET() {
  const now = Date.now();

  if (cachedPayload && now - cachedAt < CACHE_TTL_MS) {
    return createSuccessResponse(cachedPayload);
  }

  if (!inFlightRequest) {
    inFlightRequest = buildLiveBtcPricePayload()
      .then((payload) => {
        cachedPayload = payload;
        cachedAt = Date.now();
        return payload;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  try {
    const payload = await inFlightRequest;

    return createSuccessResponse(payload);
  } catch (error) {
    console.error("Failed to load live BTC price data", error);

    if (cachedPayload) {
      return createSuccessResponse(cachedPayload);
    }

    return NextResponse.json(
      {
        message:
          "Die Live-Bitcoin-Preise sind gerade nicht erreichbar. Bitte gleich erneut versuchen.",
      },
      { status: 503 },
    );
  }
}
