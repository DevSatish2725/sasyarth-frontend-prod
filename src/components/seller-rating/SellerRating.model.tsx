"use client";

import { useState } from "react";

import { X, LoaderCircle } from "lucide-react";

import { SellerRatingTag, SELLER_RATING_TAGS } from "@/types/seller-rating";

import { RATING_TAG_LABELS } from "@/constants/seller-rating.constants";

import RatingStars from "./RatingStars";
import { useTranslations } from "next-intl";

interface RatingModalProps {
  open: boolean;

  mode: "CREATE" | "EDIT";

  initialRating?: number;

  initialTags?: SellerRatingTag[];

  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (payload: { rating: number; tags: SellerRatingTag[] }) => void;
}

const tags = Object.values(SELLER_RATING_TAGS);

export default function RatingModal({
  open,
  mode,
  initialRating = 0,
  initialTags = [],
  isSubmitting,
  onClose,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(initialRating);

  const [selectedTags, setSelectedTags] =
    useState<SellerRatingTag[]>(initialTags);

  const [error, setError] = useState("");

  const t = useTranslations("SellerRating");

  const tc = useTranslations("Common");

  if (!open) {
    return null;
  }

  const handleTagToggle = (tag: SellerRatingTag) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }

      if (current.length >= 5) {
        return current;
      }

      return [...current, tag];
    });
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Please select a rating.");

      return;
    }

    setError("");

    onSubmit({
      rating,
      tags: selectedTags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7d8b9] px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#17201a]">
              {mode === "CREATE" ? t("rateThisSeller") : t("editYourRating")}
            </h2>

            <p className="mt-1 text-sm text-[#536157]">
              {t("shareExperience")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-[#536157] transition hover:bg-[#edf8ef]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-[#17201a]">
              {t("howWasExperience")}
            </p>

            <RatingStars value={rating} onChange={setRating} size={32} />

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#17201a]">
                {t("whatStoodOut")}
              </p>

              <span className="text-xs text-[#536157]">{t("optional")}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const selected = selectedTags.includes(tag);

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      selected
                        ? "border-[#159447] bg-[#edf8ef] font-medium text-[#159447]"
                        : "border-[#e7d8b9] bg-white text-[#536157] hover:border-[#159447]"
                    }`}
                  >
                    {RATING_TAG_LABELS[tag]}
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-xs text-[#536157]">{t("selectUpToFive")}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e7d8b9] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-[#e7d8b9] px-5 py-2.5 text-sm font-medium text-[#17201a] transition hover:bg-[#fff8e9]"
          >
            {tc("cancel")}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex min-w-32.5 items-center justify-center gap-2 rounded-xl bg-[#159447] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#107a3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <LoaderCircle size={17} className="animate-spin" />
            )}

            {mode === "CREATE" ? t("submitRating") : t("updateRating")}
          </button>
        </div>
      </div>
    </div>
  );
}
