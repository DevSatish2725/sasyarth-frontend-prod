"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import LocationSelector from "@/components/location/LocationSelector";
import { VegetableMultiSelect } from "@/components/ui/VegetableMultiSelect";

import type { LocationOption } from "@/types/location.types";

import type { VegetableResponse } from "@/types/vegetable.types";
interface CurrentLocation {
  latitude: number;
  longitude: number;
}

interface DesktopFiltersProps {
  showManualLocationSelector: boolean;

  setShowManualLocationSelector: (value: boolean) => void;

  handleLocationChange: (location: CurrentLocation) => void;

  handleChooseLocation: () => void;

  handleManualLocationClose: () => void;

  vegetables: VegetableResponse[];

  selectedVegetableIds: string[];

  setSelectedVegetableIds: (ids: string[]) => void;

  isVegetablesLoading: boolean;

  handleLocationSelect: (selectedLocation: LocationOption) => void;

  handleLocationSearch: (location: string) => void;

  selectedLocation: LocationOption | null;

  locationSearch: string;

  handleSellerSearch: () => void;
}

export default function DesktopFilters({
  showManualLocationSelector,
  handleLocationChange,
  handleChooseLocation,
  vegetables,
  selectedVegetableIds,
  setSelectedVegetableIds,

  isVegetablesLoading,

  handleLocationSelect,
  handleLocationSearch,
  selectedLocation,
  locationSearch,

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
      <LocationSelector
        location=""
        onLocationChange={handleLocationChange}
        onChooseLocation={handleChooseLocation}
        isManualSelected={showManualLocationSelector}
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
            {t("vegetables.description")}
          </p>
        </div>

        <VegetableMultiSelect
          vegetables={vegetables}
          selectedIds={selectedVegetableIds}
          placeholder={t("vegetables.placeholder")}
          onChange={setSelectedVegetableIds}
          disabled={isVegetablesLoading}
        />

        <button
          type="button"
          onClick={handleSellerSearch}
          disabled={isVegetablesLoading}
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

          {t("vegetables.searchSellers")}
        </button>
      </div>
    </div>
  );
}
