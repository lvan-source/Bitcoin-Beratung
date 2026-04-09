import { NextResponse } from "next/server";

const MEMPOOL_API_BASE = "https://mempool.space/api";
const CACHE_TTL_MS = 15_000;
const REQUEST_TIMEOUT_MS = 8_000;
const CHAIN_BLOCK_COUNT = 30;

type FeesResponse = {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee: number;
  minimumFee: number;
};

type MempoolResponse = {
  count: number;
  vsize: number;
  total_fee: number;
};

type MempoolBlockResponse = {
  blockVSize: number;
  nTx: number;
  medianFee: number;
  feeRange: number[];
};

type BlockResponse = {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
  size: number;
};

type LiveBlockchainPayload = {
  fees: FeesResponse;
  mempool: {
    count: number;
    vsize: number;
    totalFee: number;
  };
  mempoolBlocks: Array<{
    blockVSize: number;
    transactionCount: number;
    medianFee: number;
    feeRange: number[];
  }>;
  blocks: Array<{
    id: string;
    height: number;
    timestamp: number;
    transactionCount: number;
    size: number;
  }>;
  updatedAt: string;
};

let cachedPayload: LiveBlockchainPayload | null = null;
let cachedAt = 0;
let inFlightRequest: Promise<LiveBlockchainPayload> | null = null;

export const dynamic = "force-dynamic";

async function fetchMempoolJson<T>(path: string): Promise<T> {
  const response = await fetch(`${MEMPOOL_API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`mempool.space request failed for ${path} with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchRecentBlocks(limit: number) {
  const firstPage = await fetchMempoolJson<BlockResponse[]>("/blocks");
  const blocks = [...firstPage];

  let nextStartHeight = firstPage.at(-1)?.height;

  while (blocks.length < limit && nextStartHeight) {
    const nextPage = await fetchMempoolJson<BlockResponse[]>(
      `/blocks/${nextStartHeight - 1}`,
    );

    if (nextPage.length === 0) {
      break;
    }

    blocks.push(...nextPage);
    nextStartHeight = nextPage.at(-1)?.height;
  }

  return blocks.slice(0, limit);
}

async function buildLiveBlockchainPayload(): Promise<LiveBlockchainPayload> {
  const [fees, mempool, mempoolBlocks, blocks] = await Promise.all([
    fetchMempoolJson<FeesResponse>("/v1/fees/recommended"),
    fetchMempoolJson<MempoolResponse>("/mempool"),
    fetchMempoolJson<MempoolBlockResponse[]>("/v1/fees/mempool-blocks"),
    fetchRecentBlocks(CHAIN_BLOCK_COUNT),
  ]);

  return {
    fees,
    mempool: {
      count: mempool.count,
      vsize: mempool.vsize,
      totalFee: mempool.total_fee,
    },
    mempoolBlocks: mempoolBlocks.slice(0, 6).map((block) => ({
      blockVSize: block.blockVSize,
      transactionCount: block.nTx,
      medianFee: block.medianFee,
      feeRange: block.feeRange,
    })),
    blocks: blocks.map((block) => ({
      id: block.id,
      height: block.height,
      timestamp: block.timestamp,
      transactionCount: block.tx_count,
      size: block.size,
    })),
    updatedAt: new Date().toISOString(),
  };
}

function createSuccessResponse(payload: LiveBlockchainPayload) {
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=15, stale-while-revalidate=30",
    },
  });
}

export async function GET() {
  const now = Date.now();

  if (cachedPayload && now - cachedAt < CACHE_TTL_MS) {
    return createSuccessResponse(cachedPayload);
  }

  if (!inFlightRequest) {
    inFlightRequest = buildLiveBlockchainPayload()
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
    console.error("Failed to load live blockchain data", error);

    if (cachedPayload) {
      return createSuccessResponse(cachedPayload);
    }

    return NextResponse.json(
      {
        message:
          "Die Live-Blockchain-Daten sind gerade nicht erreichbar. Bitte gleich erneut versuchen.",
      },
      { status: 503 },
    );
  }
}
