import { getCallSellerId, SellerCardProps } from "@/types/seller.types";
import Image from "next/image";
import Link from "next/link";
import CallSellerButton from "../ui/CallSellerButton";
import { Bookmark, Package } from "lucide-react";
import { useTranslations } from "next-intl";

import { useLocale } from "next-intl";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";

export default function SellerCard({
  seller,
  isProcessing,
  isSaved,
  getCallSellerId,
  isLoading,
  handleSaveToggle,
  guestCallModalOpen,
}: {
  seller: SellerCardProps;
  isProcessing: boolean;
  isSaved?: boolean;
  getCallSellerId: getCallSellerId;
  isLoading: boolean;
  guestCallModalOpen: (sellerName: string, sellerId: string) => void;
  handleSaveToggle: (sellerId: string) => void;
}) {
  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const t = useTranslations("FindSellers");
  const visibleVegetables = seller.vegetables.slice(0, 3);

  const remainingCount = seller.vegetables.length - visibleVegetables.length;

  const locationText = [
    seller.location?.villageDisplayNames[currentLocale],
    seller.location?.districtDisplayNames[currentLocale],
    seller.location?.stateDisplayNames[currentLocale],
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      className="
    overflow-hidden
    rounded-2xl
    border
    border-border
    bg-surface
    shadow-[0_2px_12px_rgba(0,0,0,0.04)]

    sm:p-4
  "
    >
      <div className="p-4 sm:p-0">
        <div>
          <div className="flex justify-between items-center gap-2">
            <h2
              className="
                  truncate
                  text-lg
                  font-bold
                  text-text-primary
                  sm:text-base
                "
            >
              {seller.fullName}
            </h2>
            <div className="flex gap-2 items-center">
              <div className="shrink-0 text-right">
                {seller.ratingCount > 0 ? (
                  <>
                    <span className="text-[#efa536]">★</span>

                    <span className="font-semibold text-[#17201a]">
                      {seller.averageRating.toFixed(1)}
                    </span>

                    <span className="text-[#536157]">
                      ({seller.ratingCount})
                    </span>
                  </>
                ) : (
                  <span className="text-[#536157]">
                    {t("sellers.noRatingsYet")}
                  </span>
                )}
              </div>{" "}
              <span className="h-1 w-1 bg-black rounded-full"></span>
              <button
                type="button"
                onClick={() => handleSaveToggle(seller.sellerId)}
                disabled={isProcessing}
                aria-label={
                  isSaved ? "Remove from saved sellers" : "Save seller"
                }
                title={isSaved ? "Remove saved seller" : "Save seller"}
                className="
      flex
      h-8
      w-8
      shrink-0
      justify-center
      items-center
      rounded-full
      transition
      hover:bg-primary-light
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
              >
                <Bookmark
                  size={20}
                  className={
                    isSaved
                      ? "fill-primary text-primary"
                      : "text-text-secondary"
                  }
                />
              </button>
            </div>
          </div>

          <div
            className="
                mt-1
                flex flex-wrap
                items-center
                gap-x-2
                gap-y-1
                text-[11px]
                text-text-secondary
                sm:text-xs
              "
          >
            {locationText && (
              <span className="truncate">📍 {locationText}</span>
            )}

            {seller.distanceInKm !== undefined && (
              <>
                <span className="text-text-muted">•</span>

                <span>
                  📍{" "}
                  {t("sellers.distanceAway", {
                    distance: seller.distanceInKm.toFixed(1),
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className="
    border-y
    border-border/70
    bg-surface-muted/60
    px-4
    py-3

    sm:mt-3
    sm:rounded-xl
    sm:border
    sm:border-primary/10
  "
      >
        <div
          className="
      mb-3
      flex
      items-center
      justify-between
      gap-3
    "
        >
          <div
            className="
        flex
        items-center
        gap-2
      "
          >
            <Package className="h-4 w-4 text-primary" />

            <p
              className="
          text-xs
          font-bold
          text-text-primary
        "
            >
              {t("sellers.availableToday")}
            </p>
          </div>

          {remainingCount > 0 && (
            <Link
              href={`/sellers/${seller.sellerId}`}
              className="
          rounded-full
          bg-primary-light
          px-2.5
          py-1
          text-[10px]
          font-bold
          text-primary
        "
            >
              +
              {t("sellers.more", {
                count: remainingCount,
              })}
            </Link>
          )}
        </div>

        <div
          className="
      grid
      grid-cols-1
      gap-2
      lg:grid-cols-3
    "
        >
          {visibleVegetables.map((vegetable) => (
            <div
              key={vegetable.id}
              className="
          flex
          min-w-0
          items-center
          gap-2.5
          rounded-xl
          border
          border-border/70
          bg-surface
          p-2
        "
            >
              <div
                className="
            relative
            h-14 w-14
            shrink-0
            overflow-hidden
            rounded-lg
            bg-white
          "
              >
                {vegetable.imageUrl ? (
                  <Image
                    src={vegetable.imageUrl}
                    alt={
                      vegetable.displayNames[currentLocale] ?? vegetable.name
                    }
                    fill
                    sizes="56px"
                    className="
                object-contain
                p-0.5
              "
                  />
                ) : (
                  <div
                    className="
                flex
                h-full w-full
                items-center justify-center
                text-2xl
              "
                  >
                    🥬
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  title={
                    vegetable.displayNames[currentLocale] ?? vegetable.name
                  }
                  className="
              truncate
              text-xs
              font-bold
              leading-tight
              text-text-primary
              sm:text-sm
            "
                >
                  {vegetable.displayNames[currentLocale] ?? vegetable.name}
                </p>

                <div className="mt-1 flex items-baseline">
                  <span
                    className="
                text-base
                font-extrabold
                leading-none
                text-primary
                sm:text-lg
              "
                  >
                    ₹{vegetable.sellerPrice}
                  </span>

                  <span
                    className="
                ml-0.5
                text-[10px]
                font-medium
                text-text-secondary
                sm:text-xs
              "
                  >
                    /{vegetable.unit.toLowerCase()}
                  </span>
                </div>

                <div
                  className="
              mt-1.5
              flex
              items-center
              gap-1.5
              text-[10px]
              text-text-secondary
              sm:text-[11px]
            "
                >
                  <Package
                    className="
                h-3.5 w-3.5
                shrink-0
                text-primary
              "
                    strokeWidth={2}
                  />

                  <span className="truncate">
                    <span className="font-semibold text-text-primary">
                      {vegetable.availableQty} {vegetable.unit.toLowerCase()}
                    </span>{" "}
                    {t("sellers.available")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="
    grid
    grid-cols-2
    gap-2
    p-4

    sm:px-0
    sm:pb-0
  "
      >
        <CallSellerButton
          sellerId={seller.sellerId}
          getCallSellerId={getCallSellerId}
          isLoading={isLoading}
          guestCallModalOpen={() =>
            guestCallModalOpen(seller.sellerId, seller.fullName)
          }
        />
        <Link
          href={`/sellers/${seller.sellerId}`}
          className="
            flex min-h-11
            items-center
            justify-center
            gap-2
            rounded-lg
            border border-accent
            bg-surface
            px-3
            text-sm
            font-bold
            text-warning
            transition-colors
            hover:bg-accent-light
          "
        >
          🏪 {t("sellers.viewShop")}
        </Link>
      </div>
    </article>
  );
}
