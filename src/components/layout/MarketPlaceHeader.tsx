"use client";
import { useMemo, useRef, useState, useLayoutEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { ManualLocation } from "@/types/location.types";
import type { VegetableResponse } from "@/types/vegetable.types";
import { useTranslations } from "next-intl";

import { useLocale } from "next-intl";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";
interface MarketplaceHeaderProps {
  activeLocation: ManualLocation | null;
  appliedVegetableIds: string[];
  vegetables: VegetableResponse[];
  sellerCount: number;
  onClearLocation?: () => void;
  onRemoveVegetable?: (vegetableId: string) => void;
  locationMode: "MANUAL" | "CURRENT" | null;
}
export default function MarketplaceHeader({
  activeLocation,
  appliedVegetableIds,
  vegetables,
  sellerCount,
  onClearLocation,
  onRemoveVegetable,
  locationMode,
}: MarketplaceHeaderProps) {
  const vegetableScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  const t = useTranslations("FindSellers");

  const selectedVegetables = useMemo(() => {
    return vegetables.filter((vegetable: VegetableResponse) =>
      appliedVegetableIds.includes(vegetable._id || vegetable._id),
    );
  }, [vegetables, appliedVegetableIds]);
  const updateVegetableScrollState = () => {
    const element = vegetableScrollRef.current;
    if (!element) return;
    const { scrollLeft, scrollWidth, clientWidth } = element;
    const hasOverflow = scrollWidth > clientWidth + 1;
    setCanScrollLeft(hasOverflow && scrollLeft > 1);
    setCanScrollRight(
      hasOverflow && scrollLeft + clientWidth < scrollWidth - 1,
    );
  };
  useLayoutEffect(() => {
    const element = vegetableScrollRef.current;
    if (!element) return;
    const update = () => {
      updateVegetableScrollState();
    };
    /*
     * Measure immediately after DOM layout.
     */
    update();
    /*
     * Measure again on the next frame.
     * Useful when parent grid/card dimensions
     * are still settling.
     */
    const frame = requestAnimationFrame(update);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [selectedVegetables.length]);
  const scrollVegetables = (direction: "left" | "right") => {
    const element = vegetableScrollRef.current;
    if (!element) return;
    const amount = element.clientWidth * 0.65;
    element.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };
  return (
    <section
      className="
    rounded-2xl
    border border-border
    bg-surface
    shadow-sm
    mb-4
    overflow-hidden
  "
    >
      <div
        className="
      grid
      grid-cols-1
      gap-0
      md:grid-cols-2
      xl:grid-cols-[210px_minmax(360px,1fr)_160px]
      xl:items-center
    "
      >
        <div
          className="
        flex items-center gap-4
        border-b border-border
        px-4 py-5
        md:border-r
        xl:border-b-0
      "
        >
          <div>
            <h1
              className="
            text-xl font-bold
            leading-tight
            text-text-primary
          "
            >
              {t("dailyFresh")}
            </h1>
            <p
              className="
            text-xl font-bold
            leading-tight
            text-primary
          "
            >
              {t("vegetablesMarket")}
            </p>
          </div>
        </div>
        <div
          className="
        min-w-0
        border-b border-border
        px-4 py-5
        xl:border-b-0
      "
        >
          <div className="flex items-center gap-3">
            <div className="w-full">
              <div className="flex justify-between items-center"></div>
              {activeLocation ? (
                <div
                  className="
                mt-1
                flex flex-wrap
                items-center
                gap-x-2
                text-base
                font-semibold
                text-text-primary
              "
                >
                  {activeLocation.villageNameEn && (
                    <span>
                      {currentLocale === "en"
                        ? activeLocation.villageNameEn
                        : activeLocation.villageNameHi}
                    </span>
                  )}

                  {activeLocation.districtNameEn && (
                    <>
                      <span className="text-text-muted">›</span>
                      <span>
                        {currentLocale === "en"
                          ? activeLocation.districtNameEn
                          : activeLocation.districtNameHi}
                      </span>
                    </>
                  )}

                  <span className="text-text-muted">›</span>
                  <span>
                    {currentLocale === "en"
                      ? activeLocation.stateNameEn
                      : activeLocation.stateNameHi}
                  </span>

                  <button
                    type="button"
                    onClick={onClearLocation}
                    className="
                    ml-auto
          h-8
          w-full
          rounded-xl
          border
          border-warning
          bg-surface
          px-2
          text-[12px]
          font-semibold
          text-warning
          transition
          hover:bg-warning/5
          xl:w-auto
        "
                  >
                    {t("location.clearLocation")}
                  </button>
                </div>
              ) : (
                <p
                  className="
                mt-1
                text-base
                font-semibold
                text-text-primary
              "
                >
                  {locationMode === "CURRENT"
                    ? t("nearbySellers")
                    : t("allLocationSellers")}
                </p>
              )}
            </div>
          </div>
          <div
            className="
    mt-3
    flex
    min-w-0
    items-center
    border-t
    border-border/70
    pt-3
  "
          >
            {selectedVegetables.length === 0 ? (
              <p className="text-sm text-text-secondary">
                {t("showingAllAvailableVegetables")}
              </p>
            ) : (
              <div
                className="
        flex
        min-w-0
        flex-1
        items-center
        gap-1.5
      "
              >
                <button
                  type="button"
                  aria-label="Scroll vegetables left"
                  disabled={!canScrollLeft}
                  onClick={() => scrollVegetables("left")}
                  className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-surface
          text-text-secondary
          shadow-sm
          transition-all
          ${
            canScrollLeft
              ? `
                  cursor-pointer
                  opacity-100
                  hover:border-primary/30
                  hover:bg-primary-light
                  hover:text-primary
                `
              : `
                  pointer-events-none
                  opacity-0
                `
          }
        `}
                >
                  <ChevronLeft size={15} />
                </button>
                <div
                  ref={vegetableScrollRef}
                  onScroll={updateVegetableScrollState}
                  className="
          flex
          min-w-0
          flex-1
          items-center
          gap-2
          overflow-x-auto
          scroll-smooth
          whitespace-nowrap
          scrollbar-none
          [&::-webkit-scrollbar]:hidden
        "
                >
                  {selectedVegetables.map((vegetable) => (
                    <span
                      key={vegetable._id}
                      className="
                inline-flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-primary/20
                bg-primary-light
                px-3
                py-1
                text-xs
                font-medium
                text-text-primary
              "
                    >
                      <span
                        className="
                  max-w-35
                  truncate
                "
                      >
                        {vegetable.displayNames[currentLocale] ??
                          vegetable.name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${vegetable.name}`}
                        onClick={() => onRemoveVegetable?.(vegetable._id)}
                        className="
                  flex
                  h-4
                  w-4
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-text-secondary
                  transition
                  hover:bg-primary/10
                  hover:text-primary
                "
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Scroll vegetables right"
                  disabled={!canScrollRight}
                  onClick={() => scrollVegetables("right")}
                  className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-surface
          text-text-secondary
          shadow-sm
          transition-all
          ${
            canScrollRight
              ? `
                  cursor-pointer
                  opacity-100
                  hover:border-primary/30
                  hover:bg-primary-light
                  hover:text-primary
                `
              : `
                  pointer-events-none
                  opacity-0
                `
          }
        `}
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div
          className="
        flex
        items-center
        gap-3
        border-border
        px-4
        py-5
        xl:border-b-0
        xl: border-l
      "
        >
          <div>
            <p
              className="
            whitespace-nowrap
            text-lg
            font-bold
            text-text-primary
          "
            >
              {sellerCount === 1
                ? t("results.seller", { count: sellerCount })
                : t("results.sellers", { count: sellerCount })}
            </p>
            <p
              className="
            mt-0.5
            whitespace-nowrap
            text-sm
            text-text-secondary
          "
            >
              {t("results.trustedLocalSellers")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
