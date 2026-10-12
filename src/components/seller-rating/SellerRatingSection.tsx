"use client";

import { useState } from "react";

import { Star } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import { sellerRatingService } from "@/services/seller-rating.service";

import { RATING_TAG_LABELS } from "@/constants/seller-rating.constants";

import { SellerRatingSummary, SellerRatingTag } from "@/types/seller-rating";

import RatingModal from "./SellerRating.model";
import { API_ERROR } from "@/lib/axios";
import { useTranslations } from "next-intl";

interface SellerRatingSummaryWithOther extends SellerRatingSummary {
  isLoading: boolean;
  isError: boolean;
}

interface SellerRatingSectionProps {
  sellerId: string;
  isLoggedIn: boolean;
  sellerRatingSummary: SellerRatingSummaryWithOther;
  shopOwner: boolean;
}

export default function SellerRatingSection({
  sellerId,
  isLoggedIn,
  sellerRatingSummary,
  shopOwner,
}: SellerRatingSectionProps) {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = useTranslations("SellerShop");
  const tsr = useTranslations("SellerRating");

  const ratingStatusQuery = useQuery({
    queryKey: ["seller-rating-me", sellerId],

    queryFn: () => sellerRatingService.getMyRatingStatus(sellerId),

    enabled: isLoggedIn,
  });

  const existingRating = ratingStatusQuery.data?.rating;

  const createMutation = useMutation({
    mutationFn: (payload: { rating: number; tags: SellerRatingTag[] }) =>
      sellerRatingService.createRating({
        sellerId,
        ...payload,
      }),

    onSuccess: async () => {
      toast.success("Rating submitted successfully.");

      setIsModalOpen(false);

      await refreshRatingData();
    },

    onError: (error: API_ERROR) => {
      toast.error(error.response?.data?.message ?? "Unable to submit rating.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { rating: number; tags: SellerRatingTag[] }) =>
      sellerRatingService.updateRating({ sellerId, ...payload }),

    onSuccess: async () => {
      toast.success("Rating updated successfully.");

      setIsModalOpen(false);

      await refreshRatingData();
    },

    onError: (error: API_ERROR) => {
      toast.error(error.response?.data?.message ?? "Unable to update rating.");
    },
  });

  async function refreshRatingData() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["seller-rating-me", sellerId],
      }),

      queryClient.invalidateQueries({
        queryKey: ["seller-rating-summary", sellerId],
      }),

      queryClient.invalidateQueries({
        queryKey: ["sellers"],
      }),
    ]);
  }

  const handleSubmit = (payload: {
    rating: number;
    tags: SellerRatingTag[];
  }) => {
    if (existingRating) {
      updateMutation.mutate(payload);

      return;
    }

    createMutation.mutate(payload);
  };

  const status = ratingStatusQuery.data;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <section
        className="    rounded-2xl
    border
    border-border
    bg-white
    p-4
    shadow-sm

    lg:mt-5
    lg:rounded-none
    lg:border-x-0
    lg:border-b-0
    lg:border-t
    lg:border-[#e7d8b9]
    lg:bg-transparent
    lg:p-0
    lg:pt-5
    lg:shadow-none"
      >
        <div
          className="flex
    items-start
    justify-between
    gap-3"
        >
          <div>
            <h3
              className=" text-base
    font-extrabold
    text-[#17201a]

    lg:text-lg
    lg:font-bold"
            >
              {t("ratingsAndFeedback")}
            </h3>

            <p
              className="  mt-1
    max-w-57.5
    text-xs
    leading-5
    text-[#536157]

    sm:max-w-none
    sm:text-sm"
            >
              {t("ratingsDescription")}
            </p>
          </div>

          {sellerRatingSummary.ratingCount > 0 && (
            <div
              className="
      flex
      shrink-0
      items-center
      gap-1.5
      rounded-xl
      bg-[#fff3dc]
      px-2.5
      py-2

      lg:gap-2
      lg:px-3
    "
            >
              <Star
                className="
        h-4
        w-4
        fill-[#efa536]
        text-[#efa536]

        lg:h-4.5
        lg:w-4.5
      "
              />

              <span
                className="
        text-sm
        font-extrabold
        text-[#17201a]

        lg:text-base
        lg:font-bold
      "
              >
                {sellerRatingSummary.averageRating.toFixed(1)}
              </span>

              <span
                className="
        text-xs
        text-[#536157]

        lg:text-sm
      "
              >
                ({sellerRatingSummary.ratingCount})
              </span>
            </div>
          )}
        </div>

        {sellerRatingSummary.ratingCount > 0 ? (
          <>
            <div
              className="
    -mx-1
    mt-4
    flex
    gap-2
    overflow-x-auto
    px-1
    pb-1

    scrollbar-none
    [&::-webkit-scrollbar]:hidden

    lg:mx-0
    lg:flex-wrap
    lg:overflow-visible
    lg:px-0
    lg:pb-0
  "
            >
              {Object.entries(sellerRatingSummary.tagCounts)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([tag, count]) => (
                  <span
                    key={tag}
                    className="
          shrink-0
          rounded-full
          bg-[#edf8ef]
          px-3
          py-1.5
          text-xs
          font-medium
          text-[#107a3a]
        "
                  >
                    {tsr(`tags.${tag}`)}

                    {" · "}

                    {count}
                  </span>
                ))}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-xl bg-white/60 px-4 py-3">
            <p className="text-sm font-medium text-[#17201a]">
              {t("noRatingsYet")}
            </p>
            <p className="mt-1 text-sm text-[#536157]">
              {t("beFirstToShareExperience")}
            </p>
          </div>
        )}

        {isLoggedIn && !shopOwner && (
          <div className="mt-5">
            {status?.reason === "CONTACT_REQUIRED" && (
              <div className="rounded-xl border border-[#e7d8b9] bg-white px-4 py-3">
                <p className="text-sm font-medium text-[#17201a]">
                  {t("wantToLeaveRating")}
                </p>

                <p className="mt-1 text-sm text-[#536157]">
                  {t("contactBeforeRating")}
                </p>
              </div>
            )}

            {status?.reason === "WAITING_PERIOD" && (
              <div className="rounded-xl border border-[#e7d8b9] bg-white px-4 py-3">
                <p className="text-sm font-medium text-[#17201a]">
                  Rating will be available soon
                </p>

                <p className="mt-1 text-sm text-[#536157]">
                  You can rate this seller after your contact waiting period is
                  complete.
                </p>

                {status.eligibleAt && (
                  <p className="mt-1 text-xs text-[#536157]">
                    Available after{" "}
                    {new Date(status.eligibleAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {status?.canRate && !status.hasRated && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="
        flex
        min-h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-[#159447]
        px-4
        text-sm
        font-bold
        text-white
        transition

        active:scale-[0.99]

        hover:bg-[#107a3a]

        lg:min-h-0
        lg:py-3
        lg:font-semibold
      "
              >
                <Star className="h-4 w-4" />
                Rate this seller
              </button>
            )}

            {status?.hasRated && existingRating && (
              <div
                className="
        rounded-2xl
        border
        border-[#dcebdc]
        bg-[#edf8ef]
        p-4
      "
              >
                <div
                  className="
          flex
          items-start
          justify-between
          gap-3
        "
                >
                  <div>
                    <p
                      className="
              text-sm
              font-bold
              text-[#17201a]
            "
                    >
                      Your rating
                    </p>

                    <div
                      className="
              mt-2
              flex
              items-center
              gap-1
            "
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className={
                            star <= existingRating.rating
                              ? "fill-[#efa536] text-[#efa536]"
                              : "text-[#cfcfcf]"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="
            rounded-lg
            bg-white
            px-3
            py-1.5
            text-xs
            font-bold
            text-[#159447]
            shadow-sm

            lg:bg-transparent
            lg:px-0
            lg:py-0
            lg:text-sm
            lg:font-semibold
            lg:shadow-none
          "
                  >
                    Edit
                  </button>
                </div>

                {existingRating.tags.length > 0 && (
                  <div
                    className="
            mt-3
            flex
            flex-wrap
            gap-2
          "
                  >
                    {existingRating.tags.map((tag) => (
                      <span
                        key={tag}
                        className="
                  rounded-full
                  bg-white
                  px-2.5
                  py-1
                  text-xs
                  text-[#536157]
                "
                      >
                        {RATING_TAG_LABELS[tag]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <RatingModal
        key={`${existingRating?._id ?? "new"}-${isModalOpen}`}
        open={isModalOpen}
        mode={existingRating ? "EDIT" : "CREATE"}
        initialRating={existingRating?.rating ?? 0}
        initialTags={existingRating?.tags ?? []}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
