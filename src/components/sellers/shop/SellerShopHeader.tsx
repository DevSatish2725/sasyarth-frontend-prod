"use client";

import Image from "next/image";

import {
  Bookmark,
  CheckCircle2,
  Leaf,
  MapPin,
  MessageCircle,
  Star,
} from "lucide-react";

import CallSellerButton from "@/components/ui/CallSellerButton";

import type { SellerRatingSummary } from "@/types/seller-rating";

import { useTranslations } from "next-intl";

interface SellerShopHeaderProps {
  seller: {
    name: string;
    bannerImage?: string;
    profileImage?: string;

    location: {
      village?: string;
      district?: string;
      state?: string;
      pincode?: string;
    };

    isSaved: boolean;
    shopOwner: boolean;

    sellerRatingSummary: SellerRatingSummary;
  };

  sellerId: string;
  isLoading: boolean;

  getCallSellerId: (sellerId: string) => void;

  guestCallModalOpen: (sellerId: string, sellerName: string) => void;

  onSave: () => void;
}

export default function SellerShopHeader({
  seller,
  sellerId,
  isLoading,
  getCallSellerId,
  guestCallModalOpen,
  onSave,
}: SellerShopHeaderProps) {
  const t = useTranslations("SellerShop");
  const tc = useTranslations("Common")

  const locationText = [
    seller?.location?.village,
    seller?.location?.district,
    seller?.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const { averageRating, ratingCount } = seller.sellerRatingSummary;

  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-white
        shadow-sm
      "
    >

      <div
        className="
          relative
          h-32
          overflow-hidden
          bg-primary-light

          sm:h-36

          lg:h-36
        "
      >
        {seller.bannerImage ? (
          <Image
            src={seller.bannerImage}
            alt={`${seller.name} farm`}
            fill
            priority
            sizes="
              (max-width: 1023px) 100vw,
              460px
            "
            className="object-cover"
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              bg-linear-to-r
              from-primary-light
              via-[#f8f7dd]
              to-accent-light
            "
          >
            <div className="text-center">
              <Leaf
                className="
                  mx-auto
                  h-8
                  w-8
                  text-primary

                  lg:h-9
                  lg:w-9
                "
              />

              <p
                className="
                  mt-1.5
                  text-lg
                  font-bold
                  text-primary

                  lg:text-xl
                "
              >
                Fresh Vegetables
              </p>

              <p
                className="
                  text-xs
                  text-text-secondary

                  lg:text-sm
                "
              >
                Direct from farm to families
              </p>
            </div>
          </div>
        )}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-12
            bg-linear-to-t
            from-black/10
            to-transparent

            lg:hidden
          "
        />
      </div>

      <div
        className="
          px-4
          pb-4

          sm:px-6
          sm:pb-5
        "
      >
        <div
          className="
            flex
            items-start
            gap-3

            lg:gap-4
          "
        >
          <div
            className="
              min-w-0
              flex-1
              pt-2.5

              lg:pt-3
            "
          >

            <span
              className="
                inline-flex
                items-center
                gap-1
                rounded-full
                bg-primary-light
                px-2
                py-1
                text-[10px]
                font-bold
                text-primary

                lg:bg-primary
                lg:px-2.5
                lg:text-xs
                lg:font-semibold
                lg:text-white
              "
            >
              <CheckCircle2 className="h-3.5 w-3.5" />

              {t("verified")}
            </span>


            <h1
              className="
                mt-1.5
                truncate
                text-lg
                font-extrabold
                leading-tight
                text-text-primary

                lg:text-base
                lg:font-bold
              "
            >
              {seller.name}
            </h1>

            {locationText && (
              <div
                className="
              mt-3
              flex
              items-center
              gap-2
              rounded-xl
              bg-surface-muted
              px-3
              py-2.5

              lg:bg-transparent
              lg:p-0
            "
              >
                <MapPin
                  className="
                h-4
                w-4
                shrink-0
                text-primary

                lg:text-text-secondary
              "
                />

                <span
                  className="
                min-w-0
                truncate
                text-xs
                font-medium
                text-text-secondary

                lg:text-sm
                lg:font-normal
              "
                >
                  {locationText}
                </span>
              </div>
            )}


            <div className="mt-1.5">
              {ratingCount > 0 ? (
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-1.5
                    text-xs

                    lg:text-sm
                  "
                >
                  <Star
                    className="
                      h-4
                      w-4
                      fill-warning
                      text-warning

                      lg:h-5
                      lg:w-5
                    "
                  />

                  <span className="font-bold">{averageRating.toFixed(1)}</span>

                  <span
                    className="
                      h-1
                      w-1
                      rounded-full
                      bg-text-muted
                    "
                  />

                  <span
                    className="
                      font-medium
                      text-text-secondary

                      lg:font-bold
                      lg:text-text-primary
                    "
                  >
                    {ratingCount === 1 ? "1 rating" : `${ratingCount} ratings`}
                  </span>
                </div>
              ) : (
                <span
                  className="
                    text-xs
                    text-text-secondary
                  "
                >
                  {t("noRatingsYet")}
                </span>
              )}
            </div>
          </div>
        </div>

        {!seller.shopOwner && (
          <div
            className="
              mt-4
              flex
              gap-2
              lg:mt-5
            "
          >
            <button
              type="button"
              onClick={onSave}
              aria-label={
                seller.isSaved ? "Remove saved seller" : "Save seller"
              }
              className="
                flex
                flex-1/2
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-border
                bg-white
                px-3
                font-semibold
                transition

                active:scale-[0.98]

                hover:bg-surface-muted

                lg:px-4
              "
            >
              <Bookmark
                className={`
                  h-5
                  w-5

                  ${
                    seller.isSaved
                      ? "fill-primary text-primary"
                      : "text-text-secondary"
                  }
                `}
              />

              <span>{tc("save")}</span>
            </button>

            <div className="flex-1/2">
              <CallSellerButton
                sellerId={sellerId}
                isLoading={isLoading}
                getCallSellerId={getCallSellerId}
                guestCallModalOpen={() =>
                  guestCallModalOpen(sellerId, seller.name)
                }
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
