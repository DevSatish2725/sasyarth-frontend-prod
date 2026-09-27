"use client";

import {
  BadgeCheck,
  Heart,
  LoaderCircle,
  MapPin,
  Star,
  Store,
} from "lucide-react";

import Link from "next/link";

import type {
  SavedSeller,
  SavedSellerCardProps,
} from "@/types/saved-seller.types";
import { useTranslations } from "next-intl";

export default function SavedSellerCard({
  seller,
  isRemoving,
  onRemove,
}: SavedSellerCardProps) {
  const t = useTranslations("SavedSellers");
  const isAvailable = seller.availabilityStatus === "AVAILABLE";

  const hasNoInventory = seller.availabilityStatus === "NO_INVENTORY";

  const isSellerUnavailable =
    seller.availabilityStatus === "SELLER_UNAVAILABLE";

  const locationText = seller.location
    ? [seller.location.village, seller.location.district, seller.location.state]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <article
      className="
        flex
        h-full
        flex-col
        rounded-2xl
        border
        border-[#e7d8b9]
        bg-white
        p-5
        transition-all
        hover:border-[#159447]/30
        hover:shadow-md
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-[#17201a]">
              {seller.name}
            </h2>

            {seller.verificationStatus === "VERIFIED" && (
              <BadgeCheck size={18} className="shrink-0 text-[#159447]" />
            )}
          </div>

          {locationText && (
            <div className="mt-2 flex items-start gap-1.5 text-sm text-[#536157]">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#159447]" />

              <span>{locationText}</span>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={isRemoving}
          onClick={() => onRemove(seller.sellerProfileId)}
          aria-label={`Remove ${seller.name} from saved sellers`}
          title="Remove from saved sellers"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#edf8ef]
            text-[#159447]
            transition
            hover:bg-red-50
            hover:text-red-600
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isRemoving ? (
            <LoaderCircle size={19} className="animate-spin" />
          ) : (
            <Heart size={19} fill="currentColor" />
          )}
        </button>
      </div>

      <div className="mt-4">
        {seller.ratingCount > 0 ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Star size={17} className="text-[#efa536]" fill="currentColor" />

            <span className="font-semibold text-[#17201a]">
              {seller.averageRating.toFixed(1)}
            </span>

            <span className="text-[#536157]">
              ({seller.ratingCount}{" "}
              {seller.ratingCount === 1 ? "rating" : "ratings"})
            </span>
          </div>
        ) : (
          <span className="text-sm text-[#7a857d]">{t("noRatingsYet")}</span>
        )}
      </div>

      <div className="mt-5">
        {isAvailable && <AvailableSellerContent seller={seller} />}

        {hasNoInventory && <NoInventoryContent />}

        {isSellerUnavailable && <UnavailableSellerContent />}
      </div>

      <div className="mt-auto pt-6">
        {isSellerUnavailable ? (
          <button
            type="button"
            disabled
            className="
              flex
              w-full
              cursor-not-allowed
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#f1f1ed]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#8a918c]
            "
          >
            <Store size={17} />
            Shop Unavailable
          </button>
        ) : (
          <Link
            href={`/sellers/${seller.sellerProfileId}`}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#159447]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#107a3a]
            "
          >
            <Store size={17} />
            View Shop
          </Link>
        )}
      </div>
    </article>
  );
}

function AvailableSellerContent({ seller }: { seller: SavedSeller }) {
  const t = useTranslations("SavedSellers");
  const vegetables = seller.availableVegetables.slice(0, 5);

  const remaining = seller.availableVegetables.length - vegetables.length;

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#159447]" />

        <p className="text-sm font-semibold text-[#107a3a]">
          {t("availableToday")}
        </p>
      </div>

      {vegetables.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {vegetables.map((vegetable) => (
            <span
              key={vegetable.id}
              className="
                  rounded-full
                  bg-[#edf8ef]
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-[#107a3a]
                "
            >
              {vegetable.name}
            </span>
          ))}

          {remaining > 0 && (
            <span
              className="
                rounded-full
                bg-[#fff3dc]
                px-3
                py-1.5
                text-xs
                font-medium
                text-[#8a5a00]
              "
            >
              +{t("more", { count: remaining })}
            </span>
          )}
        </div>
      )}
    </>
  );
}

function NoInventoryContent() {
  const t = useTranslations("SavedSellers");
  return (
    <div className="rounded-xl border border-[#e7d8b9] bg-[#fffaf0] p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#efa536]" />

        <p className="text-sm font-semibold text-[#72521b]">
          {t("notAvailableToday")}
        </p>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-[#7a6b50]">
        {t("notAvailableTodayDescription")}
      </p>
    </div>
  );
}

function UnavailableSellerContent() {
  const t = useTranslations("SavedSellers");
  return (
    <div className="rounded-xl border border-[#e2e3df] bg-[#f7f7f4] p-4">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#8a918c]" />

        <p className="text-sm font-semibold text-[#536157]">
          {t("sellerCurrentlyUnavailable")}
        </p>
      </div>

      <p className="mt-1.5 text-xs leading-5 text-[#7a857d]">
        {t("sellerCurrentlyUnavailableDescription")}
      </p>
    </div>
  );
}
