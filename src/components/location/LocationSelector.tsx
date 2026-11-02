"use client";

import { useState } from "react";
import { CheckCircle2, LocateFixed, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import LocationSearchBar from "./LocationSearchBar";
import { LocationOption } from "@/types/location.types";

export interface CurrentLocation {
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  location?: string;
  isManualSelected: boolean;
  onLocationChange: (location: CurrentLocation) => void;
  onChooseLocation: () => void;
  handleLocationSelect: (selectedLocation: LocationOption) => void;
  handleLocationSearch: (location: string) => void;
  selectedLocation: LocationOption | null;
  locationSearch: string;
}

export default function LocationSelector({
  onLocationChange,
  handleLocationSelect,
  handleLocationSearch,
  selectedLocation,
  locationSearch,
}: LocationSelectorProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("FindSellers");

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location.");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setIsLocating(false);
        setIsCurrentLocation(true);
      },

      (geolocationError) => {
        setIsLocating(false);
        setIsCurrentLocation(false);

        switch (geolocationError.code) {
          case geolocationError.PERMISSION_DENIED:
            setError(
              "Location permission denied. You can choose your location manually.",
            );
            break;

          case geolocationError.POSITION_UNAVAILABLE:
            setError(
              "Current location is unavailable. Please choose your location manually.",
            );
            break;

          case geolocationError.TIMEOUT:
            setError("Location request timed out. Please try again.");
            break;

          default:
            setError("Unable to get your current location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  };

  return (
    <section>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div
            className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-accent-light
            text-accent
          "
          >
            <MapPin className="h-4.5 w-4.5" />
          </div>

          <div>
            <h2
              className="
              text-sm
              font-bold
              text-text-primary
            "
            >
              {t("subtitle")}
            </h2>

            <p
              className="
              mt-0.5
              text-xs
              leading-4
              text-text-secondary
            "
            >
              {t("location.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          disabled={isLocating}
          onClick={() => {
            handleUseCurrentLocation();
          }}
          className="
          flex
          min-h-16.5
          w-full
          items-center
          gap-3
          rounded-2xl
          bg-primary
          px-4
          py-3
          text-left
          text-white
          shadow-sm
          transition

          active:scale-[0.99]

          disabled:opacity-60
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
            rounded-full
            bg-white/15
          "
          >
            <LocateFixed className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              {isLocating
                ? t("location.currentLocation.gettingLocation")
                : t("location.currentLocation.title")}
            </p>

            <p
              className="
              mt-0.5
              text-xs
              leading-4
              text-white/80
            "
            >
              {t("location.currentLocation.description")}
            </p>
          </div>

          {isCurrentLocation && <CheckCircle2 className="h-5 w-5" />}
        </button>

        <LocationSearchBar
          handleLocationSelect={handleLocationSelect}
          handleLocationSearch={handleLocationSearch}
          selectedLocation={selectedLocation}
          locationSearch={locationSearch}
        />
      </div>

      {error && (
        <div
          role="alert"
          className="
          mt-3
          rounded-xl
          bg-red-50
          px-3
          py-2.5
          text-xs
          leading-5
          text-error
        "
        >
          {error}
        </div>
      )}
    </section>
  );
}
