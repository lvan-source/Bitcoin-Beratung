"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useMemo, useState } from "react";

type LiveBtcPricePayload = {
  chf: {
    current: number;
    percentChangeSinceMidnight: number;
    isUpSinceMidnight: boolean;
  };
  updatedAt: string;
};

type Slide = {
  iconSrc: string;
  iconAlt: string;
  label: string;
  tone: "brand" | "up" | "down";
  mono?: boolean;
};

const DISPLAY_HOLD_MS = 3000;
const TRANSITION_MS = 1150;
const FETCH_INTERVAL_MS = 30_000;

const priceFormatter = new Intl.NumberFormat("de-CH", {
  maximumFractionDigits: 0,
});

const brandSlide: Slide = {
  iconSrc: "/Flag.png",
  iconAlt: "PeakSpark Logo",
  label: "PeakSpark",
  tone: "brand",
};

function formatPercentLabel(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "" : "+";

  return `${sign}${value.toFixed(2)}%`;
}

function formatPriceLabel(price: number, percentChange: number) {
  return `CHF ${priceFormatter.format(price)} (${formatPercentLabel(percentChange)})`;
}

function getToneClass(slide: Slide) {
  if (slide.tone === "down") {
    return "text-rose-500";
  }

  return "text-black";
}

function TickerContent({ slide }: { slide: Slide }) {
  return (
    <span className="flex h-full items-center gap-3 whitespace-nowrap">
      <Image
        src={slide.iconSrc}
        alt={slide.iconAlt}
        width={28}
        height={28}
        className="h-7 w-7 shrink-0 object-contain"
      />
      <span
        className={`${
          slide.mono ? "font-mono text-lg sm:text-xl" : "text-lg sm:text-xl"
        } ${getToneClass(slide)}`}
      >
        <span
          className={`${slide.mono ? "font-bold" : "font-semibold"} tracking-tight`}
        >
          {slide.label}
        </span>
      </span>
    </span>
  );
}

export default function NavbarBrandTicker() {
  const [priceData, setPriceData] = useState<LiveBtcPricePayload | null>(null);
  const [currentSide, setCurrentSide] = useState<"brand" | "price">("brand");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const hasPrice = priceData !== null;

  const priceSlide = useMemo<Slide | null>(() => {
    if (!priceData) {
      return null;
    }

    return {
      iconSrc: "/B.png",
      iconAlt: "Bitcoin Icon",
      label: formatPriceLabel(
        priceData.chf.current,
        priceData.chf.percentChangeSinceMidnight,
      ),
      tone: priceData.chf.isUpSinceMidnight ? "up" : "down",
      mono: true,
    };
  }, [priceData]);

  const loadPriceData = useEffectEvent(async () => {
    try {
      const response = await fetch("/api/live-btc-price", {
        cache: "no-store",
      });

      const payload = (await response.json()) as
        | LiveBtcPricePayload
        | { message: string };

      if (!response.ok || !("updatedAt" in payload)) {
        throw new Error(
          "message" in payload
            ? payload.message
            : "Die Live-Bitcoin-Preise konnten nicht geladen werden.",
        );
      }

      setPriceData(payload);
    } catch (error) {
      console.error("Failed to load navbar BTC prices", error);
    }
  });

  useEffect(() => {
    void loadPriceData();

    const priceInterval = window.setInterval(() => {
      void loadPriceData();
    }, FETCH_INTERVAL_MS);

    return () => {
      window.clearInterval(priceInterval);
    };
  }, []);

  useEffect(() => {
    if (!hasPrice) {
      setCurrentSide("brand");
      setIsAnimating(false);
      setIsResetting(false);
      return;
    }

    if (isAnimating || isResetting) {
      return;
    }

    const holdTimeout = window.setTimeout(() => {
      setIsAnimating(true);
    }, DISPLAY_HOLD_MS);

    return () => {
      window.clearTimeout(holdTimeout);
    };
  }, [currentSide, hasPrice, isAnimating, isResetting]);

  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    const finishTimeout = window.setTimeout(() => {
      setCurrentSide((current) => (current === "brand" ? "price" : "brand"));
      setIsAnimating(false);
      setIsResetting(true);
    }, TRANSITION_MS);

    return () => {
      window.clearTimeout(finishTimeout);
    };
  }, [isAnimating]);

  useEffect(() => {
    if (!isResetting) {
      return;
    }

    const resetFrame = window.requestAnimationFrame(() => {
      setIsResetting(false);
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
    };
  }, [isResetting]);

  const cubeDepth = 16;
  const currentSlide =
    currentSide === "price" && priceSlide ? priceSlide : brandSlide;
  const nextSlide = currentSide === "brand" && priceSlide ? priceSlide : brandSlide;

  return (
    <div className="relative h-8 w-[290px] overflow-hidden [perspective:900px] sm:h-9 sm:w-[345px]">
      <div
        className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
        style={{
          transform: `translateZ(-${cubeDepth}px) rotateX(${isAnimating ? "-90deg" : "0deg"})`,
          transition: isResetting
            ? "none"
            : `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <div
          className="absolute inset-0 flex items-center bg-white/90"
          style={{
            backfaceVisibility: "hidden",
            transform: `translateZ(${cubeDepth}px)`,
          }}
        >
          <TickerContent slide={currentSlide} />
        </div>

        <div
          className="absolute inset-0 flex items-center bg-white/90"
          style={{
            backfaceVisibility: "hidden",
            transform: `rotateX(90deg) translateZ(${cubeDepth}px)`,
          }}
        >
          <TickerContent slide={nextSlide} />
        </div>
      </div>
    </div>
  );
}
