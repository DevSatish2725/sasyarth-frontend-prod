"use client";

import { Heart, RefreshCw, Search } from "lucide-react";

import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SavedSellerCard from "@/components/seller/saved-seller/SavedSellerCard";
import PageLoader from "@/components/ui/PageLoader";

import { savedSellerService } from "@/services/saved-seller.service";

import type { API_ERROR } from "@/lib/axios";
import { useTranslations } from "next-intl";

export default function SavedSellersPage() {
  return (
    <ProtectedRoute>
      <SavedSellersContent />
    </ProtectedRoute>
  );
}

function SavedSellersContent() {
  const queryClient = useQueryClient();

  const t = useTranslations("SavedSellers");

  const {
    data: sellers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["saved-sellers"],

    queryFn: savedSellerService.getSavedSellers,
  });

  const removeMutation = useMutation<void, API_ERROR, string>({
    mutationFn: savedSellerService.removeSavedSeller,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["saved-sellers"],
      });

      toast.success("Seller removed from saved sellers.");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Unable to remove seller.");
    },
  });

  if (isLoading) {
    return <PageLoader message={t("loadingSavedSellers")} />;
  }

  if (isError) {
    return <SavedSellersError onRetry={() => void refetch()} />;
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#fff8e9]">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-22 lg:pt-8 lg:pb-8 sm:px-6 lg:px-8">

        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#edf8ef]
              "
            >
              <Heart size={22} className="text-[#159447]" fill="currentColor" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#17201a] sm:text-3xl">
                {t("savedSellers")}
              </h1>

              <p className="mt-1 text-sm text-[#536157]">
                {t("savedSellersDescription")}
              </p>
            </div>
          </div>
        </div>


        {sellers.length === 0 ? (
          <EmptySavedSellers />
        ) : (
          <>
            <p className="mb-4 text-sm text-[#536157]">
              {sellers.length}{" "}
              {sellers.length === 1 ? "saved seller" : "saved sellers"}
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {sellers.map((seller) => (
                <SavedSellerCard
                  key={seller.savedSellerId}
                  seller={seller}
                  isRemoving={
                    removeMutation.isPending &&
                    removeMutation.variables === seller.sellerProfileId
                  }
                  onRemove={(sellerProfileId) => {
                    removeMutation.mutate(sellerProfileId);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function EmptySavedSellers() {
  const t = useTranslations("SavedSellers");
  return (
    <div
      className="
        rounded-2xl
        border
        border-dashed
        border-[#e7d8b9]
        bg-white
        px-6
        py-14
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-[#edf8ef]
        "
      >
        <Heart size={25} className="text-[#159447]" />
      </div>

      <h2 className="mt-4 text-lg font-bold text-[#17201a]">
        {t("noSavedSellers")}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#536157]">
        {t("noSavedSellersDescription")}
      </p>

      <Link
        href="/sellers"
        className="
          mx-auto
          mt-6
          flex
          w-fit
          items-center
          gap-2
          rounded-xl
          bg-[#159447]
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-[#107a3a]
        "
      >
        <Search size={17} />
        {t("findSellers")}
      </Link>
    </div>
  );
}

function SavedSellersError({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("SavedSellers");
  const tc = useTranslations("Common");
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#fff8e9]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="
            rounded-2xl
            border
            border-[#e7d8b9]
            bg-white
            px-6
            py-14
            text-center
          "
        >
          <h2 className="text-lg font-bold text-[#17201a]">
            {t("unableToLoadSavedSellers")}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-[#536157]">
            {t("savedSellersLoadError")}
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="
              mx-auto
              mt-5
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#159447]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#107a3a]
            "
          >
            <RefreshCw size={17} />
            {tc("retry")}
          </button>
        </div>
      </div>
    </main>
  );
}
