"use client";

import { useMemo, useState } from "react";

import { Leaf, Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import SellerShopHeader from "@/components/sellers/shop/SellerShopHeader";
import VegetableCard from "@/components/sellers/shop/VegetableCard";
import { useQuery } from "@tanstack/react-query";
import { sellerService } from "@/services/seller.service";
import { SellerShopData } from "@/types/seller-shop.types";
import GuestCallModal from "@/components/sellers/GuestCallModal";
import CallSellerCard from "@/components/sellers/CallSellerCard";
import { sellerRatingService } from "@/services/seller-rating.service";
import { useAuth } from "@/providers/AuthProvider";
import SellerRatingSection from "@/components/seller-rating/SellerRatingSection";
import { useSaveSeller } from "@/hooks/useSaveSeller";
import { savedSellerService } from "@/services/saved-seller.service";
import { useTranslations } from "next-intl";
import { VegetableResponse } from "@/types/vegetable.types";

export default function SellerShopPage() {
  const [search, setSearch] = useState("");
  const [callSellerId, setCallSellerId] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<{
    sellerId: string;
    sellerName: string;
  } | null>(null);

  const params = useParams<{
    sellerId: string;
  }>();
  const sellerId = params.sellerId;

  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const t = useTranslations("SellerShop");
  const tc = useTranslations("Common");

  const getCallSellerId = (sellerId: string) => {
    setCallSellerId(sellerId);
  };

  const guestCallModalOpen = (sellerId: string, sellerName: string) => {
    setSelectedSeller({ sellerName, sellerId });
  };

  const guestCallModalClose = () => {
    setSelectedSeller(null);
  };

  const callSellerData = useQuery({
    queryKey: ["callSeller", callSellerId],
    queryFn: async () => {
      if (!callSellerId) {
        throw new Error("Seller id is required to get details.");
      }
      const result = await sellerService.getCallSeller(callSellerId);
      return result;
    },
    enabled: Boolean(callSellerId),
  });

  const {
    data: seller,
    isLoading,
    isError,
  } = useQuery<SellerShopData>({
    queryKey: ["seller-shop", sellerId],

    queryFn: () => sellerService.getSellerShop(sellerId),

    enabled: Boolean(sellerId) && !isAuthLoading,

    staleTime: 1000 * 60 * 2,
  });

  const ratingSummaryQuery = useQuery({
    queryKey: ["seller-rating-summary", sellerId],
    queryFn: () => sellerRatingService.getRatingSummary(sellerId),
  });

  const { saveSeller, removeSeller } = useSaveSeller();

  const savedSellersQuery = useQuery({
    queryKey: ["saved-sellers"],
    queryFn: savedSellerService.getSavedSellers,
  });

  const matchesVegetableSearch = (
    vegetable: VegetableResponse,
    search: string,
  ) => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) {
      return true;
    }

    const searchableValues = [
      vegetable.name,
      vegetable.displayNames?.en,
      vegetable.displayNames?.hi,
      ...(vegetable.searchAliases ?? []),
    ];

    return searchableValues.some((value) =>
      value?.toLocaleLowerCase().includes(query),
    );
  };

  const filteredVegetables = useMemo(() => {
    return seller?.inventory.items.filter((vegetable) => {
      return matchesVegetableSearch(vegetable, search);
    });
  }, [seller?.inventory.items, search]);

  if (isLoading || ratingSummaryQuery.isLoading) {
    return <p>{tc("loading")}</p>;
  }

  if (isError || !seller) {
    return <p>{t("unableToLoadShop")}</p>;
  }

  if (ratingSummaryQuery.isError) {
    return <p>{t("unableToLoadRatingSummary")}</p>;
  }

  const savedSellerIds = new Set(
    savedSellersQuery.data?.map((seller) => seller.sellerProfileId) ?? [],
  );

  const handleSaveToggle = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isSaved = savedSellerIds.has(sellerId);

    if (isSaved) {
      removeSeller(sellerId);
    } else {
      saveSeller(sellerId);
    }
  };

  return (
    <main
      className="
      min-h-screen
      bg-background
      pb-[calc(80px+env(safe-area-inset-bottom))]

      lg:pb-10
    "
    >
      <div
        className="
        mx-auto
        w-full
        max-w-7xl
        px-3
        py-3

        sm:px-5
        sm:py-4

        lg:px-6
      "
      >
        <div
          className="
          grid
          grid-cols-1
          gap-4

          lg:grid-cols-[420px_minmax(0,1fr)]
          lg:gap-5

          xl:grid-cols-[460px_minmax(0,1fr)]
        "
        >

          <div className="space-y-4 lg:space-y-5">
            <SellerShopHeader
              seller={{
                name: seller.seller.name ?? "",

                location: {
                  ...seller.seller.location,
                },

                isSaved: savedSellerIds.has(sellerId),

                shopOwner: seller.seller.shopOwner,

                sellerRatingSummary: {
                  averageRating: ratingSummaryQuery.data!.averageRating,

                  ratingCount: ratingSummaryQuery.data!.ratingCount,

                  tagCounts: ratingSummaryQuery.data!.tagCounts,
                },
              }}
              sellerId={sellerId}
              isLoading={callSellerData.isFetching}
              getCallSellerId={getCallSellerId}
              guestCallModalOpen={guestCallModalOpen}
              onSave={handleSaveToggle}
            />

            <div className="hidden lg:block">
              <SellerRatingSection
                sellerId={sellerId}
                isLoggedIn={Boolean(user)}
                shopOwner={seller.seller.shopOwner}
                sellerRatingSummary={{
                  averageRating: ratingSummaryQuery.data!.averageRating,

                  ratingCount: ratingSummaryQuery.data!.ratingCount,

                  tagCounts: ratingSummaryQuery.data!.tagCounts,

                  isLoading: ratingSummaryQuery.isLoading,

                  isError: ratingSummaryQuery.isError,
                }}
              />
            </div>
          </div>

          <section id="vegetables">
            <div
              className="
              overflow-hidden
              rounded-2xl
              border
              border-border
              bg-white
              shadow-sm

              lg:p-5
            "
            >

              <div
                className="
                flex
                lg:justify-between
                lg:items-start
                lg:flex-row
                flex-col
                px-4
                pb-3
                pt-4

                lg:p-0
              "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-3
                "
                >
                  <div
                    className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-primary-light
                    text-primary

                    lg:rounded-full
                  "
                  >
                    <Leaf className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2
                      className="
                      text-lg
                      font-extrabold
                      text-text-primary

                      lg:text-xl
                      lg:font-bold
                    "
                    >
                      {t("availableToday")}
                    </h2>

                    <p
                      className="
                      mt-0.5
                      text-xs
                      text-text-secondary

                      lg:text-sm
                    "
                    >
                      {seller.inventory.items.length === 1
                        ? t("vegetableAvailableToday", {
                            count: 1,
                          })
                        : t("vegetablesAvailableToday", {
                            count: seller.inventory.items.length,
                          })}
                    </p>
                  </div>
                </div>


                <div
                  className="
                  relative                  w-full

                  lg:max-w-xs
                "
                >
                  <Search
                    className="
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-text-muted
                  "
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t("searchInShop")}
                    className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-surface-muted/40
                    pl-10
                    pr-3
                    text-sm
                    outline-none
                    transition

                    focus:border-primary
                    focus:bg-white
                    focus:ring-2
                    focus:ring-primary/10

                    lg:h-11
                    lg:bg-white
                  "
                  />
                </div>
              </div>


              <div
                className="
                grid
                grid-cols-1
                gap-2.5
                border-t
                border-border/70
                bg-surface-muted/30
                p-3

                sm:grid-cols-2

                lg:mt-4
                lg:gap-3
                lg:border-0
                lg:bg-transparent
                lg:p-0

                xl:grid-cols-3
              "
              >
                {filteredVegetables?.map((vegetable) => (
                  <VegetableCard key={vegetable.itemId} vegetable={vegetable} />
                ))}
              </div>

              {filteredVegetables?.length === 0 && (
                <div
                  className="
                  m-4
                  rounded-2xl
                  bg-surface-muted
                  px-5
                  py-8
                  text-center

                  lg:m-0
                  lg:mt-5
                "
                >
                  <div
                    className="
                    mx-auto
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-primary-light
                    text-primary
                  "
                  >
                    <Search className="h-5 w-5" />
                  </div>

                  <p
                    className="
                    mt-3
                    font-bold
                    text-text-primary
                  "
                  >
                    No vegetables found
                  </p>

                  <p
                    className="
                    mt-1
                    text-sm
                    text-text-secondary
                  "
                  >
                    Try searching another vegetable.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-4 lg:hidden">
          <SellerRatingSection
            sellerId={sellerId}
            isLoggedIn={Boolean(user)}
            shopOwner={seller.seller.shopOwner}
            sellerRatingSummary={{
              averageRating: ratingSummaryQuery.data!.averageRating,

              ratingCount: ratingSummaryQuery.data!.ratingCount,

              tagCounts: ratingSummaryQuery.data!.tagCounts,

              isLoading: ratingSummaryQuery.isLoading,

              isError: ratingSummaryQuery.isError,
            }}
          />
        </div>
      </div>

      {callSellerId ? (
        <CallSellerCard
          sellerName={callSellerData?.data?.data.fullName}
          mobileNumber={callSellerData?.data?.data.mobileNumber}
          onClose={() => setCallSellerId(null)}
        />
      ) : null}

      {selectedSeller ? (
        <GuestCallModal
          sellerName={selectedSeller.sellerName}
          onClose={guestCallModalClose}
          onLogin={() => {
            router.push(
              `/login?returnTo=${encodeURIComponent(
                `/sellers/${sellerId}/shop`,
              )}`,
            );
          }}
        />
      ) : null}
    </main>
  );
}
