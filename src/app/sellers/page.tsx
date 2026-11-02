"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";

import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";

import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useTranslations } from "next-intl";

import MarketplaceHeader from "@/components/layout/MarketPlaceHeader";

import LocationSelector from "@/components/location/LocationSelector";

import SellerCard from "@/components/sellers/SellerCard";

import CallSellerCard from "@/components/sellers/CallSellerCard";

import GuestCallModal from "@/components/sellers/GuestCallModal";

import { VegetableMultiSelect } from "@/components/ui/VegetableMultiSelect";

import { sellerService } from "@/services/seller.service";

import { vegetableService } from "@/services/vegetable.service";

import { savedSellerService } from "@/services/saved-seller.service";

import { buildSellerParams } from "@/utils/buildSellerParams";

import { useSaveSeller } from "@/hooks/useSaveSeller";

import { useAuth } from "@/providers/AuthProvider";

import { useLocale } from "next-intl";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";

import type {
  SearchLocation,
  ManualLocation,
  LocationOption,
} from "@/types/location.types";

import type { SellerResponse } from "@/types/seller.types";

import type { VegetableResponse } from "@/types/vegetable.types";

import MobileFilterSheet from "@/components/sellers/MobileFilterSheet";

import SellerListSkeleton from "@/components/sellers/SellerListSkeleton";

import EmptySellersState from "@/components/sellers/EmptySellerState";

import DesktopFilters from "@/components/sellers/DesktopFilters";
import NotificationPermissionButton from "@/components/notifications/NotificationPermissionButton";

interface CurrentLocation {
  latitude: number;
  longitude: number;
}

interface AppliedFilters {
  vegetableIds: string[];
  searchLocation: SearchLocation | null;
  activeLocation: ManualLocation | null;
  selectedLocation: ManualLocation | null;
}

function getAppliedFilters(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): AppliedFilters {
  const vegetableIds =
    searchParams.get("vegetableIds")?.split(",").filter(Boolean) ?? [];

  const locationMode = searchParams.get("locationMode");

  if (locationMode === "CURRENT") {
    const latitudeParam = searchParams.get("latitude");
    const longitudeParam = searchParams.get("longitude");

    const latitude = Number(latitudeParam);
    const longitude = Number(longitudeParam);

    const hasCoordinates =
      latitudeParam !== null &&
      longitudeParam !== null &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude);

    return {
      vegetableIds,
      searchLocation: hasCoordinates
        ? {
            mode: "CURRENT",
            latitude,
            longitude,
          }
        : null,
      activeLocation: null,
      selectedLocation: null,
    };
  }

  const stateId = searchParams.get("stateId");
  const districtId = searchParams.get("districtId");
  const blockId = searchParams.get("blockId");
  const villageId = searchParams.get("villageId");
  const maujaId = searchParams.get("maujaId");
  const habitationId = searchParams.get("habitationId");
  const displayNameEn = searchParams.get("en");
  const displayNameHi = searchParams.get("hi");

  if (stateId) {
    const activeLocation: ManualLocation = {
      stateId: stateId ?? "",
      districtId: districtId ?? "",
      blockId: blockId ?? "",
      villageId: villageId ?? "",
      maujaId: maujaId ?? "",
      habitationId: habitationId ?? "",
      displayNames: {
        en: displayNameEn ?? "",
        hi: displayNameHi ?? "",
      },
    };

    const searchLocation: SearchLocation = {
      mode: "MANUAL",
      stateId: stateId ?? "",
      districtId: districtId ?? "",
      blockId: blockId ?? "",
      villageId: villageId ?? "",
      maujaId: maujaId ?? "",
      habitationId: habitationId ?? "",
    };

    return {
      vegetableIds,
      searchLocation,
      activeLocation,
      selectedLocation: activeLocation,
    };
  }

  return {
    vegetableIds,
    searchLocation: null,
    activeLocation: null,
    selectedLocation: null,
  };
}

export default function SellersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialFilters = useMemo(
    () => getAppliedFilters(searchParams),
    [searchParams],
  );

  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(
    () => initialFilters.searchLocation,
  );

  const [showManualLocationSelector, setShowManualLocationSelector] =
    useState(false);

  const [callSellerId, setCallSellerId] = useState<string | null>(null);

  const [selectedSeller, setSelectedSeller] = useState<{
    sellerId: string;
    sellerName: string;
  } | null>(null);

  const [selectedVegetableIds, setSelectedVegetableIds] = useState<string[]>(
    () => initialFilters.vegetableIds,
  );

  const [appliedVegetableIds, setAppliedVegetableIds] = useState<string[]>(
    () => initialFilters.vegetableIds,
  );

  const [activeLocation, setActiveLocation] = useState<ManualLocation | null>(
    () => initialFilters.activeLocation,
  );

  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption | null>(null);
  const [locationSearch, setLocationSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  function updateFilters(
    selectedLocation: ManualLocation | null,
    selectedVegetableIds: string[],
    locationSearch: SearchLocation | null,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedVegetableIds.length > 0) {
      params.set("vegetableIds", selectedVegetableIds.join(","));
    } else {
      params.delete("vegetableIds");
    }

    // Clear the previous location mode before applying the new one.
    params.delete("locationMode");
    params.delete("latitude");
    params.delete("longitude");
    params.delete("stateId");

    params.delete("districtId");

    params.delete("blockId");

    params.delete("villageId");

    params.delete("maujaId");

    params.delete("habitationId");

    params.delete("en");

    params.delete("hi");

    if (locationSearch?.mode === "CURRENT") {
      params.set("locationMode", "CURRENT");
      params.set("latitude", String(locationSearch.latitude));
      params.set("longitude", String(locationSearch.longitude));
    }

    if (locationSearch?.mode === "MANUAL" && selectedLocation) {
      params.set("locationMode", "MANUAL");
      params.set("stateId", selectedLocation.stateId);
      params.set("districtId", selectedLocation.districtId);
      params.set("blockId", selectedLocation.blockId);
      params.set("villageId", selectedLocation.villageId);
      params.set("maujaId", selectedLocation.maujaId);
      params.set("habitationId", selectedLocation.habitationId);
      params.set("en", selectedLocation.displayNames.en);
      params.set("hi", selectedLocation.displayNames.hi);
    }

    const query = params.toString();
    const sellersUrl = query ? `${pathname}?${query}` : pathname;

    // sessionStorage is only for restoring the last seller-listing URL from Navbar.
    sessionStorage.setItem("lastSellersUrl", sellersUrl);

    router.replace(sellersUrl, {
      scroll: false,
    });
  }

  const t = useTranslations("FindSellers");
  const tn = useTranslations("Notifications");

  const { user } = useAuth();

  const { saveSeller, removeSeller, isProcessing } = useSaveSeller();

  const returnTo =
    `/sellers?sellerId=${selectedSeller?.sellerId}` + `&action=call`;

  const handleClearManualLocation = () => {
    setSelectedLocation(null);
    setActiveLocation(null);
    setSearchLocation(null);
    setLocationSearch("");

    updateFilters(null, selectedVegetableIds, null);
  };

  const handleRemoveVegetableSearch = (vegetableId: string) => {
    const filteredVegetableIds = selectedVegetableIds.filter(
      (selectedVegetableId) => selectedVegetableId !== vegetableId,
    );

    setSelectedVegetableIds(filteredVegetableIds);
    setAppliedVegetableIds(filteredVegetableIds);

    updateFilters(activeLocation, filteredVegetableIds, searchLocation);
  };

  const handleLocationChange = (location: CurrentLocation) => {
    const currentLocation: SearchLocation = {
      mode: "CURRENT",
      latitude: location.latitude,
      longitude: location.longitude,
    };

    setSearchLocation(currentLocation);
    setActiveLocation(null);
    setLocationSearch("");

    updateFilters(null, selectedVegetableIds, currentLocation);
  };

  const handleChooseLocation = () => {
    setShowManualLocationSelector(true);
  };

  const handleManualLocationClose = () => {
    setShowManualLocationSelector(false);
  };

  const handleSellerSearch = () => {
    let activeLocationDetails: ManualLocation | null = null;
    let locationSearch: SearchLocation | null = searchLocation;

    if (selectedLocation) {
      const {
        ids: { stateId, districtId, blockId, villageId, maujaId, habitationId },
      } = selectedLocation;
      const searchLocationDetails: SearchLocation = {
        mode: "MANUAL",
        stateId,
        districtId,
        blockId,
        villageId,
        maujaId,
        habitationId,
      };

      setSearchLocation(searchLocationDetails);
      locationSearch = searchLocationDetails;

      activeLocationDetails = {
        stateId,
        districtId,
        blockId,
        villageId,
        maujaId,
        habitationId,
        displayNames: selectedLocation.displayNames,
      };

      setActiveLocation(activeLocationDetails);
    }

    // Applying an empty selection is also meaningful: it clears vegetable filters.
    setAppliedVegetableIds(selectedVegetableIds);

    updateFilters(activeLocationDetails, selectedVegetableIds, locationSearch);
  };

  const handleLocationSelect = (location: LocationOption) => {
    setSelectedLocation(location);
  };

  const handleLocationSearch = (location: string) => {
    setLocationSearch(location);
  };

  const getCallSellerId = (sellerId: string) => {
    setCallSellerId(sellerId);
  };

  const guestCallModalOpen = (sellerId: string, sellerName: string) => {
    setSelectedSeller({
      sellerId,

      sellerName,
    });
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

      return sellerService.getCallSeller(callSellerId);
    },

    enabled: Boolean(callSellerId),
  });

  const { data: vegetables = [], isLoading: isVegetablesLoading } = useQuery<
    VegetableResponse[]
  >({
    queryKey: ["vegetables"],

    queryFn: vegetableService.getVegetables,
  });

  const savedSellersQuery = useQuery({
    queryKey: ["saved-sellers"],

    queryFn: savedSellerService.getSavedSellers,

    enabled: Boolean(user),
  });

  const savedSellerIds = new Set(
    savedSellersQuery.data?.map((seller) => seller.sellerProfileId) ?? [],
  );

  const sellerQuery = useInfiniteQuery<
    SellerResponse,
    Error,
    InfiniteData<SellerResponse>,
    readonly unknown[],
    string | undefined
  >({
    queryKey: ["sellers", searchLocation, appliedVegetableIds],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const params = buildSellerParams({
        searchLocation,
        vegetableIds: appliedVegetableIds,
        cursor: pageParam,
      });

      const response = await sellerService.getSellers(params);

      return response;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.meta.nextCursor ?? undefined;
    },
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = sellerQuery;

  const sellers = sellerQuery.data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,

        // Start loading before user reaches bottom
        rootMargin: "300px",

        threshold: 0,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSaveToggle = (sellerId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const isSaved = savedSellerIds.has(sellerId);
    if (isSaved) {
      removeSeller(sellerId);

      return;
    }

    saveSeller(sellerId);
  };

  return (
    <main
      className="

      min-h-screen

      bg-background

      pb-[calc(76px+env(safe-area-inset-bottom))]

      lg:pb-8

    "
    >
      <div
        className="

        mx-auto

        w-full

        max-w-7xl

        px-3

        py-3



        sm:px-6

        sm:py-4



        lg:px-8

      "
      >
        <div
          className="

      rounded-2xl

      border

      border-border

      bg-surface

      p-4

      shadow-sm

      lg:hidden

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

            text-xs

            font-semibold

            uppercase

            tracking-wide

            text-primary

          "
              >
                {t("dailyFresh")}
              </p>

              <h1
                className="

            mt-0.5

            text-xl

            font-extrabold

            text-text-primary

          "
              >
                {t("vegetablesMarket")}
              </h1>
            </div>

            {!sellerQuery.isLoading && (
              <span
                className="

            rounded-full

            bg-primary-light

            px-3

            py-1.5

            text-xs

            font-bold

            text-primary

          "
              >
                {t("results.seller", { count: sellers.length })}
              </span>
            )}
          </div>

          {activeLocation && (
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

        "
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary" />

              <p
                className="

            min-w-0

            flex-1

            truncate

            text-sm

            font-semibold

            text-text-primary

          "
              >
                {activeLocation.displayNames[currentLocale]}
                {/* {[
                  currentLocale === "hi"
                    ? activeLocation.villageNameHi
                    : activeLocation.villageNameEn,

                  currentLocale === "hi"
                    ? activeLocation.districtNameHi
                    : activeLocation.districtNameEn,

                  currentLocale === "hi"
                    ? activeLocation.stateNameHi
                    : activeLocation.stateNameEn,
                ]

                  .filter(Boolean)

                  .join(", ")} */}
              </p>

              <button
                type="button"
                onClick={handleClearManualLocation}
                aria-label="Clear location"
                className="

            flex

            h-8

            w-8

            shrink-0

            items-center

            justify-center

            rounded-full

            text-text-muted



            active:bg-white

          "
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div
          className="

          sticky

          top-16

          z-30

          -mx-3

          mt-3

          border-y

          border-border/70

          bg-background/95

          px-3

          py-2.5

          backdrop-blur



          sm:-mx-6

          sm:px-6



          lg:hidden

        "
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="

              flex

              min-h-11

              items-center

              justify-center

              gap-2

              rounded-xl

              border

              border-border

              bg-surface

              px-3

              text-sm

              font-semibold

              text-text-primary

              shadow-sm

              transition



              active:scale-[0.99]

            "
            >
              <MapPin className="h-4 w-4 text-primary" />

              <span className="truncate">
                {activeLocation?.displayNames[currentLocale] ??
                  t("location.currentLocation.title")}
                {/* {currentLocale === "hi"
                  ? activeLocation?.villageNameHi ||
                    activeLocation?.districtNameHi ||
                    activeLocation?.stateNameHi ||
                    t("location.currentLocation.title")
                  : activeLocation?.villageNameEn ||
                    activeLocation?.districtNameEn ||
                    activeLocation?.stateNameEn ||
                    t("location.currentLocation.title")} */}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="

              relative

              flex

              min-h-11

              items-center

              justify-center

              gap-2

              rounded-xl

              border

              border-primary/20

              bg-primary-light

              px-3

              text-sm

              font-bold

              text-primary

              transition



              active:scale-[0.99]

            "
            >
              <SlidersHorizontal className="h-4 w-4" />

              {t("filters")}

              {appliedVegetableIds.length > 0 && (
                <span
                  className="

                  flex

                  h-5

                  min-w-5

                  items-center

                  justify-center

                  rounded-full

                  bg-primary

                  px-1

                  text-[10px]

                  font-bold

                  text-white

                "
                >
                  {appliedVegetableIds.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div
          className="

          mt-4

          grid

          grid-cols-1

          gap-4



          lg:mt-5

          lg:grid-cols-[340px_minmax(0,1fr)]

          lg:items-start

          lg:gap-5

        "
        >
          <aside
            className="

            hidden

            rounded-2xl

            border

            border-border

            bg-surface



            lg:sticky

            lg:top-20

            lg:block

            lg:max-h-[calc(100vh-2.5rem)]

          "
          >
            <DesktopFilters
              key={activeLocation?.habitationId ?? "no-location"}
              showManualLocationSelector={showManualLocationSelector}
              setShowManualLocationSelector={setShowManualLocationSelector}
              handleLocationChange={handleLocationChange}
              handleChooseLocation={handleChooseLocation}
              handleManualLocationClose={handleManualLocationClose}
              vegetables={vegetables}
              selectedVegetableIds={selectedVegetableIds}
              setSelectedVegetableIds={setSelectedVegetableIds}
              isVegetablesLoading={isVegetablesLoading}
              handleLocationSelect={handleLocationSelect}
              handleLocationSearch={handleLocationSearch}
              selectedLocation={selectedLocation}
              locationSearch={locationSearch}
              handleSellerSearch={handleSellerSearch}
            />
          </aside>

          <section className="min-w-0">
            <div
              className="

              mb-3

              flex

              items-center

              justify-between

              gap-3



              lg:hidden

            "
            >
              <div>
                <p
                  className="

                  text-sm

                  font-bold

                  text-text-primary

                "
                >
                  {sellerQuery.isLoading
                    ? t("findingNearbySellers")
                    : t("results.sellerCount", { count: sellers.length })}
                </p>

                <p
                  className="

                  mt-0.5

                  text-xs

                  text-text-secondary

                "
                >
                  {t("results.trustedSellers")}
                </p>
              </div>
            </div>

            <div className="hidden lg:block">
              <MarketplaceHeader
                activeLocation={activeLocation}
                locationMode={searchLocation?.mode ?? null}
                appliedVegetableIds={appliedVegetableIds}
                vegetables={vegetables}
                sellerCount={sellers.length}
                onClearLocation={handleClearManualLocation}
                onRemoveVegetable={handleRemoveVegetableSearch}
              />
            </div>

            {sellerQuery.isLoading ? (
              <SellerListSkeleton />
            ) : sellers.length === 0 ? (
              <EmptySellersState
                onOpenFilters={() => setShowMobileFilters(true)}
              />
            ) : (
              <>
                <div
                  className="
        grid
        gap-3
        sm:gap-4
      "
                >
                  <div className="flex justify-between rounded-2xl border border-green-200 bg-green-50/60 p-2">
                    <div className="flex gap-2 items-start">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                        🔔
                      </div>
                      {tn("exploreSellersReminder")}{" "}
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        {notificationStatus ? tn("enabled") : tn("disabled")}
                      </span>
                    </div>
                    <NotificationPermissionButton
                      onStatusChange={setNotificationStatus}
                    />
                  </div>
                  {sellers.map((seller) => (
                    <SellerCard
                      key={seller.sellerId}
                      seller={seller}
                      isProcessing={isProcessing}
                      isSaved={savedSellerIds.has(seller.sellerId)}
                      isLoading={callSellerData.isFetching}
                      getCallSellerId={getCallSellerId}
                      handleSaveToggle={handleSaveToggle}
                      guestCallModalOpen={guestCallModalOpen}
                    />
                  ))}
                </div>

                {sellerQuery.hasNextPage && (
                  <>
                    <div ref={loadMoreRef} className="h-6" />
                    <button
                      type="button"
                      disabled={sellerQuery.isFetchingNextPage}
                      onClick={() => sellerQuery.fetchNextPage()}
                    >
                      {sellerQuery.isFetchingNextPage
                        ? "Loading..."
                        : "Load more"}
                    </button>
                  </>
                )}

                {sellerQuery.isFetchingNextPage && (
                  <div className="mt-4">
                    <SellerListSkeleton />
                  </div>
                )}

                {!sellerQuery.hasNextPage && sellers.length > 0 && (
                  <p
                    className="
            mt-6
            text-center
            text-sm
            text-text-secondary
          "
                  >
                    No more sellers
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {showMobileFilters && (
        <MobileFilterSheet onClose={() => setShowMobileFilters(false)}>
          <LocationSelector
            location=""
            onLocationChange={(location) => {
              handleLocationChange(location);
            }}
            onChooseLocation={handleChooseLocation}
            isManualSelected={Boolean(activeLocation)}
            handleLocationSelect={handleLocationSelect}
            handleLocationSearch={handleLocationSearch}
            selectedLocation={selectedLocation}
            locationSearch={locationSearch}
          />

          <div
            className="

            mt-4

            border-t

            border-border

            pt-5

          "
          >
            <h3
              className="

              text-sm

              font-bold

              text-text-primary

            "
            >
              {t("vegetables.title")}
            </h3>

            <p
              className="

              mt-1

              text-xs

              leading-5

              text-text-secondary

            "
            >
              {t("vegetables.description")}
            </p>

            <div className="mt-3">
              <VegetableMultiSelect
                vegetables={vegetables}
                selectedIds={selectedVegetableIds}
                placeholder={t("vegetables.placeholder")}
                onChange={setSelectedVegetableIds}
                disabled={isVegetablesLoading}
              />
            </div>
          </div>

          <div
            className="

            sticky

            bottom-0

            -mx-4

            mt-6

            border-t

            border-border

            bg-white

            px-4

            pb-[calc(12px+env(safe-area-inset-bottom))]

            pt-3

          "
          >
            <button
              type="button"
              onClick={() => {
                handleSellerSearch();

                setShowMobileFilters(false);
              }}
              className="

              flex

              min-h-12

              w-full

              items-center

              justify-center

              gap-2

              rounded-xl

              bg-primary

              px-4

              text-sm

              font-bold

              text-white

            "
            >
              <Search className="h-4 w-4" />

              {t("vegetables.searchSellers")}
            </button>
          </div>
        </MobileFilterSheet>
      )}

      {callSellerData.data && (
        <CallSellerCard
          sellerName={callSellerData.data.data.fullName}
          mobileNumber={callSellerData.data.data.mobileNumber}
          location={callSellerData.data.data.location}
          onClose={() => setCallSellerId(null)}
        />
      )}

      {selectedSeller && (
        <GuestCallModal
          sellerName={selectedSeller.sellerName}
          onClose={guestCallModalClose}
          onLogin={() => {
            router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
          }}
        />
      )}
    </main>
  );
}
