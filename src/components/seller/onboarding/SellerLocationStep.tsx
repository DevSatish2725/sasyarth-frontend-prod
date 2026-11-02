"use client";

import { useState } from "react";

import { ArrowLeft, Check, LocateFixed, MapPin } from "lucide-react";

import { useLocale, useTranslations } from "next-intl";

import SearchableLocationField from "@/components/location/SearchableLocationField";

import type { SellerOnboardingForm } from "./BecameSellerForm";
import { LocationOption } from "@/types/location.types";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";
import { useLocations } from "@/hooks/useLocations";
interface Props {
  form: SellerOnboardingForm;

  setForm: React.Dispatch<React.SetStateAction<SellerOnboardingForm>>;

  isSubmitting: boolean;

  onBack: () => void;

  onSubmit: () => void;

  isSellerProfile: boolean;
}

export default function SellerLocationStep({
  form,
  setForm,
  isSubmitting,
  onBack,
  onSubmit,
  isSellerProfile,
}: Props) {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationOption | null>(null);
  const [locationSearch, setLocationSearch] = useState("");

  const { locationList, locationsLoading } = useLocations(locationSearch);

  const t = useTranslations("BecomeSeller");

  const locale = useLocale();

  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  const [geoLoading, setGeoLoading] = useState(false);

  const [geoError, setGeoError] = useState("");

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError(t("locationNotSupported"));

      return;
    }

    setGeoLoading(true);

    setGeoError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,

          geoLocation: {
            latitude: position.coords.latitude,

            longitude: position.coords.longitude,
          },
        }));

        setGeoLoading(false);
      },

      (error) => {
        setGeoLoading(false);

        if (error.code === error.PERMISSION_DENIED) {
          setGeoError(t("locationPermissionDenied"));

          return;
        }

        setGeoError(t("currentLocationError"));
      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 60000,
      },
    );
  };

  const handleLocationSelect = (location: LocationOption) => {
    setForm((prev) => ({
      ...prev,
      location: {
        ...location,
        ids: location.ids,
      },
    }));
    setSelectedLocation(location);
  };

  return (
    <>
      <div>
        <h2
          className="
            text-2xl
            font-extrabold
            text-[#17201a]
          "
        >
          {t("locationTitle")}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-[#536157]
          "
        >
          {t("locationDescription")}
        </p>
      </div>
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={geoLoading}
        className="
          mt-6
          flex
          min-h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#159447]
          bg-[#edf8ef]
          px-4
          font-semibold
          text-[#159447]
          transition

          hover:bg-[#dff3e5]

          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {form.geoLocation ? (
          <Check className="h-5 w-5" />
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}

        {geoLoading
          ? t("gettingLocation")
          : form.geoLocation
            ? t("currentLocationAdded")
            : t("useCurrentLocation")}
      </button>
      {geoError && (
        <p
          className="
            mt-2
            text-sm
            font-medium
            text-red-600
          "
        >
          {geoError}
        </p>
      )}
      <div
        className="
          my-6
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            h-px
            flex-1
            bg-[#e1e5e2]
          "
        />

        <span
          className="
            text-xs
            font-medium
            text-[#7a857d]
          "
        >
          {t("locationDetails")}
        </span>

        <div
          className="
            h-px
            flex-1
            bg-[#e1e5e2]
          "
        />
      </div>
      <div className="space-y-5">
        <SearchableLocationField
          label={t("selectLocation")}
          placeholder={t("selectLocation")}
          value={selectedLocation}
          options={locationList}
          onSearchChange={setLocationSearch}
          onSelect={handleLocationSelect}
          isLoading={locationsLoading}
        />

        {selectedLocation && (
          <small>
            <strong>{t("selectedLocation")}: </strong>
            {selectedLocation?.displayNames[currentLocale]}
          </small>
        )}

        <div className="mt-4">
          <label
            htmlFor="pincode"
            className="
              mb-2
              block
              text-sm
              font-bold
              text-[#17201a]
            "
          >
            {t("pincode")}
          </label>

          <div className="relative">
            <MapPin
              className="
                absolute
                left-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-[#7a857d]
              "
            />

            <input
              id="pincode"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 6);

                setForm((previous) => ({
                  ...previous,

                  pincode: value,
                }));
              }}
              placeholder={t("pincodePlaceholder")}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[#d9dedb]
                bg-white
                pl-12
                pr-4
                text-sm
                outline-none
                transition

                focus:border-[#159447]
                focus:ring-2
                focus:ring-[#159447]/10
              "
            />
          </div>
        </div>
      </div>
      <div
        className="
          mt-7
          flex
          flex-col
          lg:flex-row
          gap-3
        "
      >
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="
            flex
            min-h-12
            flex-1
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#d9dedb]
            bg-white
            font-semibold
            text-[#536157]
            transition

            hover:bg-[#f6f8f6]

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <ArrowLeft className="h-5 w-5" />

          {t("back")}
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="
            flex
            min-h-12
            flex-2
            items-center
            justify-center
            rounded-xl
            bg-[#159447]
            px-5
            font-bold
            text-white
            transition

            hover:bg-[#107a3a]

            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting
            ? t("applying")
            : isSellerProfile
              ? t("reapplySeller")
              : t("applySeller")}
        </button>
      </div>
    </>
  );
}
