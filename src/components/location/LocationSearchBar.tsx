"use client";

import { useLocale, useTranslations } from "next-intl";

import { defaultLocale, isSupportedLocale } from "@/i18n/config";

import SearchableLocationField from "./SearchableLocationField";

import type { LocationOption } from "@/types/location.types";
import { useLocations } from "@/hooks/useLocations";

interface LocationSearchBarProps {
  handleLocationSelect: (selectedLocation: LocationOption) => void;
  handleLocationSearch: (location: string) => void;
  selectedLocation: LocationOption | null;
  locationSearch: string;
}

export default function LocationSearchBar({
  handleLocationSelect,
  handleLocationSearch,
  selectedLocation,
  locationSearch,
}: LocationSearchBarProps) {

  const t = useTranslations("FindSellers");

  const locale = useLocale();

  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  const { locationList, locationsLoading } = useLocations(locationSearch);

  return (
    <section>
      {!selectedLocation && (
        <p
          className="
          mb-4
          text-sm
          leading-5
          text-text-secondary
        "
        >
          {t("location.selectLocationHint")}
        </p>
      )}

      <div>
        <SearchableLocationField
          key={"location-search"}
          label={t("location.selectLocation")}
          placeholder={t("location.selectLocation")}
          value={selectedLocation}
          locationSearch={locationSearch}
          options={locationList}
          isLoading={locationsLoading}
          minimumSearchLength={2}
          onSearchChange={handleLocationSearch}
          onSelect={handleLocationSelect}
        />

        {selectedLocation && (
          <small>
            <strong>{t("location.selectedLocation")}: </strong>
            {selectedLocation?.displayNames[currentLocale]}
          </small>
        )}
      </div>
    </section>
  );
}
