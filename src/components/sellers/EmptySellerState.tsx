"use client";

import {
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { useTranslations } from "next-intl";

interface EmptySellersStateProps {
  onOpenFilters: () => void;
}

export default function EmptySellersState({
  onOpenFilters,
}: EmptySellersStateProps) {
  const t = useTranslations("FindSellers");

  return (
    <section
      className="
        flex
        min-h-[360px]
        items-center
        justify-center
        rounded-2xl
        border
        border-border
        bg-surface
        px-5
        py-10
        text-center
        shadow-[0_2px_12px_rgba(0,0,0,0.035)]

        sm:min-h-[420px]
        sm:px-8

        lg:min-h-[460px]
      "
    >
      <div className="w-full max-w-md">
        <div
          className="
            relative
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            bg-primary-light
            text-primary
          "
        >
          <MapPin className="h-8 w-8" />

          <div
            className="
              absolute
              -bottom-1
              -right-1
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border-4
              border-surface
              bg-accent-light
              text-accent
            "
          >
            <Search className="h-4 w-4" />
          </div>
        </div>

        <h2
          className="
            mt-5
            text-xl
            font-extrabold
            leading-tight
            text-text-primary

            sm:text-2xl
          "
        >
          {t("sellers.empty.title")}
        </h2>

        <p
          className="
            mx-auto
            mt-2
            max-w-sm
            text-sm
            leading-6
            text-text-secondary

            sm:text-base
          "
        >
          {t("sellers.empty.description")}
        </p>

        <div
          className="
            mx-auto
            mt-5
            max-w-sm
            rounded-2xl
            border
            border-accent/20
            bg-accent-light/40
            px-4
            py-3
            text-left
          "
        >
          <p
            className="
              text-xs
              font-bold
              uppercase
              tracking-wide
              text-accent
            "
          >
            {t("sellers.empty.tipTitle")}
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-text-secondary

              sm:text-sm
            "
          >
            {t("sellers.empty.tip")}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenFilters}
          className="
            mt-6
            inline-flex
            min-h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-5
            text-sm
            font-bold
            text-white
            shadow-sm
            transition

            active:scale-[0.99]

            hover:bg-primary-hover

            sm:w-auto
            sm:min-w-[190px]
          "
        >
          <SlidersHorizontal className="h-4 w-4" />

          {t("sellers.empty.adjustFilters")}
        </button>
      </div>
    </section>
  );
}