"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import LocationSelector from "@/components/location/LocationSelector";
import LocationSearchBar from "@/components/location/LocationSearchBar";
import { VegetableMultiSelect } from "@/components/ui/VegetableMultiSelect";

import type {
  StateOption,
  DistrictOption,
  VillageOption,
} from "@/types/location.types";

import type { VegetableResponse } from "@/types/vegetable.types";

interface CurrentLocation {
  latitude: number;
  longitude: number;
}

interface DesktopFiltersProps {
  showManualLocationSelector: boolean;

  setShowManualLocationSelector: (
    value: boolean,
  ) => void;

  handleLocationChange: (
    location: CurrentLocation,
  ) => void;

  handleChooseLocation: () => void;

  handleManualLocationClose: () => void;

  handleStateSelect: (
    selectedState: StateOption,
  ) => void;

  handleDistrictSelect: (
    selectedDistrict: DistrictOption,
  ) => void;

  handleVillageSelect: (
    selectedVillage: VillageOption,
  ) => void;

  handleDistrictSearch: (
    district: string,
  ) => void;

  handleVillageSearch: (
    village: string,
  ) => void;

  selectedState: StateOption | null;

  selectedDistrict: DistrictOption | null;

  selectedVillage: VillageOption | null;

  districtSearch: string;

  villageSearch: string;

  vegetables: VegetableResponse[];

  selectedVegetableIds: string[];

  setSelectedVegetableIds: (
    ids: string[],
  ) => void;

  isVegetablesLoading: boolean;

  handleSellerSearch: () => void;
}

export default function DesktopFilters({
  showManualLocationSelector,
  setShowManualLocationSelector,

  handleLocationChange,
  handleChooseLocation,
  handleManualLocationClose,

  handleStateSelect,
  handleDistrictSelect,
  handleVillageSelect,

  handleDistrictSearch,
  handleVillageSearch,

  selectedState,
  selectedDistrict,
  selectedVillage,

  districtSearch,
  villageSearch,

  vegetables,
  selectedVegetableIds,
  setSelectedVegetableIds,

  isVegetablesLoading,

  handleSellerSearch,
}: DesktopFiltersProps) {
  const t = useTranslations("FindSellers");

  return (
    <div
      className="
        relative
        p-4
      "
    >

      {!showManualLocationSelector && (
        <LocationSelector
          location=""
          onLocationChange={
            handleLocationChange
          }
          onChooseLocation={
            handleChooseLocation
          }
          handleManualLocationClose={
            handleManualLocationClose
          }
          isManualSelected={
            showManualLocationSelector
          }
        />
      )}

      {showManualLocationSelector && (
        <div
          className="
            relative

            lg:max-h-[calc(100vh-22rem)]
            lg:overflow-y-auto

            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-border
          "
        >

          <button
            type="button"
            onClick={() =>
              setShowManualLocationSelector(
                false,
              )
            }
            aria-label="Close manual location"
            className="
              absolute
              right-0
              top-0
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-accent/40
              bg-white
              text-warning
              shadow-sm
              transition

              hover:bg-accent-light
            "
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-1">
            <LocationSearchBar
              handleStateSelect={
                handleStateSelect
              }
              handleDistrictSelect={
                handleDistrictSelect
              }
              handleVillageSelect={
                handleVillageSelect
              }
              handleDistrictSearch={
                handleDistrictSearch
              }
              handleVillageSearch={
                handleVillageSearch
              }
              selectedState={
                selectedState
              }
              selectedDistrict={
                selectedDistrict
              }
              selectedVillage={
                selectedVillage
              }
              villageSearch={
                villageSearch
              }
              districtSearch={
                districtSearch
              }
            />
          </div>
        </div>
      )}

      <div
        className="
          mt-4
          border-t
          border-border
          pt-4
        "
      >
        <div className="mb-3">
          <h2
            className="
              text-sm
              font-bold
              text-text-primary
            "
          >
            {t("vegetables.title")}
          </h2>

          <p
            className="
              mt-0.5
              text-xs
              leading-5
              text-text-secondary
            "
          >
            {t(
              "vegetables.description",
            )}
          </p>
        </div>

        <VegetableMultiSelect
          vegetables={vegetables}
          selectedIds={
            selectedVegetableIds
          }
          placeholder={t(
            "vegetables.placeholder",
          )}
          onChange={
            setSelectedVegetableIds
          }
          disabled={
            isVegetablesLoading
          }
        />

        <button
          type="button"
          onClick={handleSellerSearch}
          disabled={
            isVegetablesLoading
          }
          className="
            mt-3
            flex
            min-h-11
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

            hover:bg-primary-hover

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <Search className="h-4 w-4" />

          {t(
            "vegetables.searchSellers",
          )}
        </button>
      </div>
    </div>
  );
}