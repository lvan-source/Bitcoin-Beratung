"use client";

import { Fragment, startTransition, useEffect, useEffectEvent, useMemo, useState } from "react";

type LiveBlockchainData = {
  fees: {
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  };
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

const POLL_INTERVAL_MS = 15000;
const TARGET_BLOCK_INTERVAL_SECONDS = 600;
const HALVING_INTERVAL = 210_000;

const integerFormatter = new Intl.NumberFormat("de-CH");
const compactFormatter = new Intl.NumberFormat("de-CH", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const btcFormatter = new Intl.NumberFormat("de-CH", {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
};

type KnowledgeItemProps = {
  id: string;
  title: string;
  value: string;
  teaser: string;
  body: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
};

function formatFee(value: number) {
  const digits = value >= 10 ? 0 : value >= 1 ? 1 : 3;

  return `${new Intl.NumberFormat("de-CH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value)} sat/vB`;
}

function formatBytesToMb(value: number) {
  return `${new Intl.NumberFormat("de-CH", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1_000_000)} MB`;
}

function formatBtcFromSats(value: number) {
  return `${btcFormatter.format(value / 100_000_000)} BTC`;
}

function formatTimeAgo(timestamp: number, now: number) {
  const diffInSeconds = Math.max(0, Math.floor(now / 1000 - timestamp));

  if (diffInSeconds < 60) {
    return "gerade eben";
  }

  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} Min.`;
  }

  return `${Math.floor(diffInSeconds / 3600)} Std.`;
}

function formatHash(hash: string, length = 12) {
  return `${hash.slice(0, length)}...`;
}

function formatNextBlockEta(timestamp: number, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor(now / 1000 - timestamp));
  const remainingSeconds = Math.max(0, TARGET_BLOCK_INTERVAL_SECONDS - elapsedSeconds);

  if (remainingSeconds <= 30) {
    return "jetzt";
  }

  if (remainingSeconds < 90) {
    return "~1 Min.";
  }

  return `~${Math.ceil(remainingSeconds / 60)} Min.`;
}

function getNextHalvingHeight(height: number) {
  return (Math.floor(height / HALVING_INTERVAL) + 1) * HALVING_INTERVAL;
}

function formatDaysUntilHalving(height: number) {
  const remainingBlocks = Math.max(0, getNextHalvingHeight(height) - height);
  const remainingDays = Math.max(
    1,
    Math.round((remainingBlocks * TARGET_BLOCK_INTERVAL_SECONDS) / 86_400),
  );

  return `~${integerFormatter.format(remainingDays)} ${
    remainingDays === 1 ? "Tag" : "Tage"
  }`;
}

function MetricCard({ label, value, detail, accent = false }: MetricCardProps) {
  return (
    <div
      className={`rounded-[1.5rem] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${
        accent
          ? "border-orange-400/30 bg-orange-500/10"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
        {label}
      </p>
      <p className="mt-4 font-mono text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-white/60">{detail}</p>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="h-3 w-24 rounded-full bg-white/10" />
      <div className="mt-4 h-8 w-40 rounded-full bg-white/10" />
      <div className="mt-3 h-3 w-28 rounded-full bg-white/10" />
      <div className="mt-6 h-2 w-full rounded-full bg-white/10" />
      <div className="mt-4 h-3 w-24 rounded-full bg-white/10" />
    </div>
  );
}

function KnowledgeItem({
  id,
  title,
  value,
  teaser,
  body,
  isOpen,
  onToggle,
}: KnowledgeItemProps) {
  return (
    <article className="rounded-[1.35rem] border border-white/10 bg-black/20">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        aria-controls={`knowledge-panel-${id}`}
        className="flex w-full items-start justify-between gap-4 px-4 py-4 text-left"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-white">{title}</span>
            <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-orange-200">
              {value}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/60">{teaser}</p>
        </div>

        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-white/65 transition-transform duration-300 ${
            isOpen ? "rotate-45 border-orange-300/40 text-orange-200" : ""
          }`}
        >
          +
        </span>
      </button>

      <div
        id={`knowledge-panel-${id}`}
        className={`grid overflow-hidden px-4 transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0"
        }`}
      >
        <div className="overflow-hidden border-t border-white/8 pt-3">
          <p
            className={`text-sm leading-6 text-white/78 transition-all duration-300 ${
              isOpen ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            {body}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function LiveBlockchainSection() {
  const [data, setData] = useState<LiveBlockchainData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [refreshTick, setRefreshTick] = useState(0);
  const [openKnowledgeId, setOpenKnowledgeId] = useState("blockchain");

  const loadLiveData = useEffectEvent(async (mode: "initial" | "refresh") => {
    if (mode === "initial") {
      setIsInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const response = await fetch("/api/live-blockchain", {
        cache: "no-store",
      });

      const payload = (await response.json()) as LiveBlockchainData | { message: string };

      if (!response.ok || !("updatedAt" in payload)) {
        throw new Error(
          "message" in payload
            ? payload.message
            : "Die Live-Blockchain-Daten konnten nicht geladen werden.",
        );
      }

      startTransition(() => {
        setData(payload);
        setError(null);
      });
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Die Live-Blockchain-Daten konnten nicht geladen werden.";

      setError(message);
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  });

  useEffect(() => {
    void loadLiveData(refreshTick === 0 ? "initial" : "refresh");
  }, [refreshTick]);

  useEffect(() => {
    const refreshInterval = window.setInterval(() => {
      setRefreshTick((currentTick) => currentTick + 1);
    }, POLL_INTERVAL_MS);

    const clockInterval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(refreshInterval);
      window.clearInterval(clockInterval);
    };
  }, []);

  const updatedLabel = useMemo(() => {
    if (!data) {
      return "Wird geladen...";
    }

    const seconds = Math.max(
      0,
      Math.floor((now - new Date(data.updatedAt).getTime()) / 1000),
    );

    if (seconds < 10) {
      return "soeben aktualisiert";
    }

    return `vor ${seconds} Sek. aktualisiert`;
  }, [data, now]);

  const latestBlock = data?.blocks[0] ?? null;
  const pendingBlocks = data?.mempoolBlocks.slice(0, 4) ?? [];
  const confirmedBlocks = data?.blocks ?? [];
  const nextBlockEtaLabel = latestBlock
    ? formatNextBlockEta(latestBlock.timestamp, now)
    : "...";
  const halvingDaysLabel = latestBlock
    ? formatDaysUntilHalving(latestBlock.height)
    : "~...";
  const nextHalvingHeightLabel = latestBlock
    ? `#${integerFormatter.format(getNextHalvingHeight(latestBlock.height))}`
    : "nächsten Halving";
  const projectedQueueDepth =
    data && data.mempool.vsize > 0 ? Math.ceil(data.mempool.vsize / 1_000_000) : null;
  const knowledgeItems = useMemo(
    () => [
      {
        id: "subsidy",
        title: "Block Subsidy",
        value: halvingDaysLabel,
        teaser: `Bis zum nächsten Halving bei ${nextHalvingHeightLabel}.`,
        body:
          `Die Block Subsidy liegt aktuell bei 3.125 BTC pro Block. Ein Halving halbiert diesen neu ausgegebenen Teil der Miner-Belohnung ungefähr alle 210'000 Blöcke; die Fees bleiben bestehen.`,
      },
      {
        id: "hash",
        title: "Hash",
        value: latestBlock ? formatHash(latestBlock.id, 10) : "SHA-256",
        teaser: "Ein Hash ist der kryptografische Fingerabdruck eines Blocks.",
        body:
          "Ein Hash verdichtet alle Blockdaten zu einer festen Zeichenkette. Schon die kleinste Änderung erzeugt einen komplett anderen Hash und macht Manipulation sofort sichtbar.",
      },
      {
        id: "blockchain",
        title: "Was ist eine Blockchain?",
        value: latestBlock ? `#${integerFormatter.format(latestBlock.height)}` : "Verkettet",
        teaser: "Jeder Block verweist auf den Hash des vorherigen Blocks.",
        body:
          "Dadurch hängt die Historie kryptografisch zusammen. Wer einen alten Block ändern will, müsste alle nachfolgenden Blöcke neu berechnen und das gesamte Netzwerk überholen.",
      },
      {
        id: "timechain",
        title: "Wieso auch Timechain?",
        value: "10 Min Takt",
        teaser: "Bitcoin ordnet Ereignisse nicht nur nach Daten, sondern nach Block-Zeit.",
        body:
          "Jeder bestätigte Block setzt einen überprüfbaren Zeitanker. Deshalb sprechen viele Bitcoiner von einer Timechain: Die Reihenfolge bestätigter Blöcke ist zugleich eine neutrale, globale Uhr.",
      },
      {
        id: "difficulty",
        title: "Difficulty Adjustment",
        value: "2016 Blöcke",
        teaser: "Der Mining-Schwierigkeitsgrad wird regelmässig nachjustiert.",
        body:
          "Ungefähr alle 2016 Blöcke passt Bitcoin die Difficulty an, damit neue Blöcke im Mittel weiter etwa alle zehn Minuten gefunden werden, selbst wenn sich die Hashrate stark verändert.",
      },
      {
        id: "fees",
        title: "Fees & Mempool",
        value: data ? formatFee(data.fees.fastestFee) : "Live",
        teaser: "Fees bestimmen, welche Transaktionen zuerst Platz im nächsten Block bekommen.",
        body:
          "Wenn mehr Transaktionen warten als in einen Block passen, entsteht ein Gebührenmarkt. Höhere Fees erhöhen die Priorität, niedrige Fees warten länger im Mempool.",
      },
    ],
    [data, halvingDaysLabel, latestBlock, nextHalvingHeightLabel],
  );

  return (
    <section id="live-blockchain" className="scroll-mt-28 px-6 py-16 md:py-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-[#2a2d32] bg-[#090b0f] text-white shadow-[0_35px_90px_rgba(0,0,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(56,189,248,0.12),transparent_22%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="relative px-6 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">
                Live-Blockchain
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                Technischer, direkter und näher an der echten Blockchain.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                Scroll nach rechts und schau der Chain beim Weiterschreiben zu.
              </p>
            </div>

            <div className="flex max-w-md flex-col gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/75 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isRefreshing ? "animate-pulse bg-orange-400" : "bg-emerald-400"
                  }`}
                />
                <span>{updatedLabel}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRefreshTick((currentTick) => currentTick + 1)}
                  className="w-fit rounded-full border border-white/15 px-4 py-2 font-medium text-white transition hover:border-orange-300 hover:text-orange-200"
                >
                  Aktualisieren
                </button>
                <a
                  href="https://mempool.space"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.18em] text-orange-200 transition hover:text-orange-100"
                >
                  mempool.space
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Next Block Fee"
              value={data ? formatFee(data.fees.fastestFee) : "..."}
              detail="Orientierung für eine schnelle Bestätigung im nächsten Block."
              accent
            />
            <MetricCard
              label="Mempool Queue"
              value={data ? compactFormatter.format(data.mempool.count) : "..."}
              detail="Transaktionen, die aktuell noch auf einen Platz warten."
            />
            <MetricCard
              label="Queue Depth"
              value={data ? formatBytesToMb(data.mempool.vsize) : "..."}
              detail="Virtuelle Grösse der Warteschlange im Netzwerk."
            />
            <MetricCard
              label="Latest Block"
              value={latestBlock ? `#${integerFormatter.format(latestBlock.height)}` : "..."}
              detail={
                latestBlock
                  ? `${formatTimeAgo(latestBlock.timestamp, now)} bestätigt`
                  : "Letzte Bestätigung wird geladen."
              }
            />
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(249,115,22,0.08)_0%,rgba(13,16,21,0.94)_34%,rgba(34,211,238,0.05)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_0_1px_rgba(249,115,22,0.04)] p-4 sm:p-6">
              <div className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">
                    Projected Block Flow
                  </p>
                  <p className="mt-2 text-lg text-white/75">
                    Links siehst du die nächsten Blöcke im Mempool, rechts die zuletzt
                    bestätigte Chain.
                  </p>
                </div>

                <div className="grid gap-2 text-sm text-white/60 sm:grid-cols-3">
                  <div className="rounded-2xl border border-orange-300/16 bg-[linear-gradient(180deg,rgba(249,115,22,0.12)_0%,rgba(24,27,33,0.76)_100%)] px-2.5 py-2.5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange-100/55">
                      projected blocks
                    </p>
                    <p className="mt-1.5 text-[15px] font-semibold text-orange-50">
                      {projectedQueueDepth ? `~${projectedQueueDepth}` : "..."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-300/14 bg-[linear-gradient(180deg,rgba(16,185,129,0.1)_0%,rgba(19,22,28,0.74)_100%)] px-2.5 py-2.5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-100/55">
                      waiting fees
                    </p>
                    <p className="mt-1.5 text-[15px] font-semibold text-emerald-50">
                      {data ? formatBtcFromSats(data.mempool.totalFee) : "..."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyan-300/14 bg-[linear-gradient(180deg,rgba(34,211,238,0.1)_0%,rgba(19,22,28,0.74)_100%)] px-2.5 py-2.5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-100/55">
                      head hash
                    </p>
                    <p className="mt-1.5 font-mono text-[15px] font-semibold text-cyan-50">
                      {latestBlock ? formatHash(latestBlock.id, 8) : "..."}
                    </p>
                  </div>
                </div>
              </div>

              {error && !data ? (
                <div className="mt-6 rounded-[1.5rem] border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-100">
                  {error}
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div className="overflow-x-auto overflow-y-hidden rounded-[1.45rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.09),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(11,16,22,0.84)_100%)] px-1.5 pb-3 pt-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_0_0_1px_rgba(249,115,22,0.03)] [scrollbar-color:rgba(249,115,22,0.82)_rgba(255,255,255,0.08)] [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/[0.06] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500/80 [&::-webkit-scrollbar-corner]:bg-transparent">
                    <div className="flex min-w-max items-stretch gap-2">
                      {isInitialLoading && !data ? (
                        <>
                          <LoadingCard />
                          <LoadingCard />
                          <LoadingCard />
                        </>
                      ) : (
                        <>
                          {pendingBlocks.map((block, index) => (
                            <Fragment key={`mempool-${index}`}>
                              <article
                                className="flow-card flow-card-mempool flex h-[12.25rem] w-44 shrink-0 flex-col rounded-[1.35rem] border border-orange-400/18 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.17),transparent_42%),linear-gradient(180deg,rgba(24,28,34,0.94)_0%,rgba(15,18,24,0.96)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
                                style={{ animationDelay: `${index * 90}ms` }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-200/75">
                                    mempool
                                  </span>
                                  <span className="rounded-full border border-orange-300/20 bg-orange-400/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-orange-100">
                                    +{index + 1}
                                  </span>
                                </div>

                                <p className="mt-3.5 font-mono text-[1.45rem] font-semibold text-white">
                                  {formatFee(block.medianFee)}
                                </p>
                                <p className="mt-1 min-h-[2.5rem] text-[12px] leading-5 text-white/60">
                                  Median Fee bei {compactFormatter.format(block.transactionCount)} TX
                                </p>

                                <div className="mt-3.5 h-1.5 rounded-full bg-white/10">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-orange-300 via-orange-400 to-yellow-300"
                                    style={{
                                      width: `${Math.min(100, (block.blockVSize / 1_000_000) * 100)}%`,
                                    }}
                                  />
                                </div>

                                <div className="mt-auto grid grid-cols-2 gap-2 pt-3.5 text-[12px] text-white/62">
                                  <div>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                                      block size
                                    </p>
                                    <p className="mt-1 font-mono text-white/78">
                                      {formatBytesToMb(block.blockVSize)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                                      fee floor
                                    </p>
                                    <p className="mt-1 font-mono text-white/78">
                                      {formatFee(block.feeRange[0] ?? block.medianFee)}
                                    </p>
                                  </div>
                                </div>
                              </article>

                              <div className="mt-12 flex shrink-0 items-center">
                                <div className="flow-connector relative h-px w-5 overflow-hidden rounded-full bg-gradient-to-r from-orange-300/26 via-orange-200/18 to-cyan-300/14">
                                  <span className="flow-connector__beam absolute inset-0" />
                                </div>
                              </div>
                            </Fragment>
                          ))}

                          <div className="flex shrink-0 items-center">
                            <div
                              className="live-node flex h-[4.2rem] w-[4.2rem] flex-col items-center justify-center rounded-full border border-cyan-200/20 bg-[radial-gradient(circle_at_30%_30%,rgba(103,232,249,0.18),rgba(34,211,238,0.07)_45%,rgba(249,115,22,0.05)_72%,rgba(8,47,73,0.1)_100%)] px-2 text-center shadow-[0_0_16px_rgba(103,232,249,0.08)]"
                              style={{ animationDelay: `${pendingBlocks.length * 90}ms` }}
                            >
                              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-50">
                                Live
                              </span>
                              <span className="mt-1 text-[10px] font-medium leading-4 text-cyan-50/92">
                                next {nextBlockEtaLabel}
                              </span>
                            </div>
                          </div>

                          {confirmedBlocks.map((block, index) => (
                            <Fragment key={block.id}>
                              <div className="mt-12 flex shrink-0 items-center">
                                <div className="flow-connector relative h-px w-5 overflow-hidden rounded-full bg-gradient-to-r from-cyan-300/18 to-white/14">
                                  <span className="flow-connector__beam absolute inset-0" />
                                </div>
                              </div>

                              <article
                                className="flow-card flow-card-confirmed flex h-[12.25rem] w-52 shrink-0 flex-col rounded-[1.35rem] border border-cyan-300/12 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_46%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.06),transparent_34%),linear-gradient(180deg,rgba(23,30,42,0.94)_0%,rgba(13,17,24,0.96)_100%)] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                                style={{
                                  animationDelay: `${pendingBlocks.length * 90 + 120 + index * 90}ms`,
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-100/55">
                                    confirmed
                                  </span>
                                  <span className="rounded-full border border-cyan-200/15 bg-cyan-300/[0.08] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-50/80">
                                    {index === 0 ? "head" : `-${index}`}
                                  </span>
                                </div>

                                <div className="mt-3 grid min-h-[2.65rem] grid-cols-[minmax(0,1fr)_3.95rem] items-end gap-2">
                                  <p className="min-w-0 font-mono text-[1.45rem] font-semibold text-white">
                                    #{integerFormatter.format(block.height)}
                                  </p>
                                  <div className="w-[3.95rem] justify-self-end text-right font-mono tabular-nums">
                                    <p className="text-[10px] leading-4 text-cyan-50/72">
                                      {formatTimeAgo(block.timestamp, now)}
                                    </p>
                                    <p className="mt-1 text-[10px] leading-4 text-white/55">
                                      {integerFormatter.format(block.transactionCount)} TX
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-auto rounded-[0.95rem] border border-cyan-200/12 bg-cyan-300/[0.04] px-2.5 py-2">
                                  <div className="flex items-center justify-between text-[12px] text-white/62">
                                    <span className="font-mono">{formatBytesToMb(block.size)}</span>
                                    <span>{index === 0 ? "aktuell" : `${index} Block zurück`}</span>
                                  </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[11px] text-white/45">
                                  <span>Bestätigt</span>
                                  <span className="font-mono text-cyan-50/65">
                                    {index === 0 ? "chain head" : "archiviert"}
                                  </span>
                                </div>
                              </article>
                            </Fragment>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                        half hour fee
                      </p>
                      <p className="mt-2 font-mono text-xl font-semibold text-white">
                        {data ? formatFee(data.fees.halfHourFee) : "..."}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                        economy fee
                      </p>
                      <p className="mt-2 font-mono text-xl font-semibold text-white">
                        {data ? formatFee(data.fees.economyFee) : "..."}
                      </p>
                    </div>
                    <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                        base minimum
                      </p>
                      <p className="mt-2 font-mono text-xl font-semibold text-white">
                        {data ? formatFee(data.fees.minimumFee) : "..."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="grid gap-6 xl:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.28fr)] xl:items-start">
                <div>
                  <div className="border-b border-white/10 pb-5">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-orange-300">
                      Chain Notes
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      Wichtigste Begriffe, kurz erklärt.
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/68">
                      Klick auf einen Begriff und der zweite Teil klappt weich auf. So bleibt
                      die Section technisch und trotzdem verständlich.
                    </p>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                      live context
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3">
                        <p className="text-xs text-white/45">Head Hash</p>
                        <p className="mt-2 font-mono text-sm text-white/80">
                          {latestBlock ? formatHash(latestBlock.id, 14) : "wird geladen"}
                        </p>
                      </div>
                      <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] p-3">
                        <p className="text-xs text-white/45">Block Subsidy</p>
                        <p className="mt-2 font-mono text-sm text-white/80">
                          3.125 BTC + Fees
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {knowledgeItems.map((item) => (
                    <KnowledgeItem
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      value={item.value}
                      teaser={item.teaser}
                      body={item.body}
                      isOpen={openKnowledgeId === item.id}
                      onToggle={(id) =>
                        setOpenKnowledgeId((currentId) => (currentId === id ? "" : id))
                      }
                    />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
        <style jsx>{`
          .flow-card {
            opacity: 0;
            transform: translateY(14px) scale(0.985);
            animation: flowCardEnter 720ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
            will-change: transform, opacity;
          }

          .flow-card-mempool:hover,
          .flow-card-confirmed:hover {
            transform: translateY(-2px);
            transition: transform 180ms ease;
          }

          .flow-connector__beam {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.05) 25%,
              rgba(249, 115, 22, 0.55) 55%,
              rgba(255, 255, 255, 0.08) 82%,
              transparent 100%
            );
            transform: translateX(-140%);
            animation: flowConnectorPulse 2.6s ease-in-out infinite;
          }

          .live-node {
            position: relative;
            animation: liveNodeFloat 4.2s ease-in-out infinite;
            will-change: transform;
          }

          .live-node::after {
            content: "";
            position: absolute;
            inset: -8px;
            border-radius: 9999px;
            border: 1px solid rgba(103, 232, 249, 0.14);
            opacity: 0;
            animation: liveNodeRing 2.8s ease-out infinite;
          }

          @keyframes flowCardEnter {
            0% {
              opacity: 0;
              transform: translateY(14px) scale(0.985);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes flowConnectorPulse {
            0% {
              transform: translateX(-140%);
            }

            100% {
              transform: translateX(140%);
            }
          }

          @keyframes liveNodeFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-4px);
            }
          }

          @keyframes liveNodeRing {
            0% {
              opacity: 0;
              transform: scale(0.82);
            }

            32% {
              opacity: 0.45;
            }

            100% {
              opacity: 0;
              transform: scale(1.18);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .flow-card,
            .flow-connector__beam,
            .live-node,
            .live-node::after {
              animation: none !important;
              opacity: 1;
              transform: none;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
