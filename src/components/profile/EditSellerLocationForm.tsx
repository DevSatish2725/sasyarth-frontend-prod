"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import SearchableLocationField, {
  Option,
} from "@/components/location/SearchableLocationField";

import { useAuth } from "@/providers/AuthProvider";

import { profileService } from "@/services/profile.service";

import type {
  StateOption,
  DistrictOption,
  VillageOption,
  LocationOption,
} from "@/types/location.types";

import type {
  GeoLocation,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/profile.types";

import type { API_ERROR } from "@/lib/axios";
import { useLocale, useTranslations } from "next-intl";
import { useLocations } from "@/hooks/useLocations";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";

interface EditSellerLocationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  currentLocation: Option | null;
}

export default function EditSellerLocationForm({
  onCancel,
  onSuccess,
  currentLocation,
}: EditSellerLocationFormProps) {
  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const { user, getUserProfile } = useAuth();

  const [pincode, setPincode] = useState(user?.location.pincode || "");

  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [locationError, setLocationError] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocation, setSelectedLocations] =
    useState<LocationOption | null>(currentLocation);

  const { locationList, locationsLoading } = useLocations(locationSearch);

  const t = useTranslations("Profile");
  const tc = useTranslations("Common");

  /*
   * --------------------------------
   * Mutation
   * --------------------------------
   */

  const updateLocationMutation = useMutation<
    UserProfile,
    API_ERROR,
    UpdateProfilePayload
  >({
    mutationFn: profileService.updateProfile,

    onSuccess: async () => {
      /*
       * Refresh /me so ProfilePage,
       * Navbar and seller information
       * immediately receive the
       * updated location.
       */
      await getUserProfile();

      toast.success(t("sellerLocation.sellerLocationUpdated"));

      onSuccess();
    },

    onError: (error) => {
      toast.error(
        error.response?.data.message ??
          t("sellerLocation.unableToUpdateSellerLocation"),
      );
    },
  });

  if (!user) {
    return null;
  }

  const handleLocationSelect = (location: LocationOption) => {
    setSelectedLocations(location);
  };

  const handlePincodeChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, 6);

    setPincode(sanitized);

    /*
     * Since pincode is part of the
     * address, old coordinates should
     * no longer be trusted.
     */
    setGeoLocation(null);

    setLocationError("");
  };

  /*
   * --------------------------------
   * Browser location
   * --------------------------------
   */

  const handleUseCurrentLocation = () => {
    /*
     * First require complete textual
     * location.
     */
    if (!selectedLocation) {
      setLocationError(t("sellerLocation.selectVillage"));

      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setLocationError(t("sellerLocation.invalidPincode"));

      return;
    }

    if (!navigator.geolocation) {
      toast.error(t("sellerLocation.locationNotSupported"));

      return;
    }

    setLocationError("");
    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        /*
         * GeoJSON order:
         *
         * [longitude, latitude]
         *
         * NOT:
         * [latitude, longitude]
         */

        setGeoLocation({
          type: "Point",

          coordinates: [position.coords.longitude, position.coords.latitude],
        });

        setIsGettingLocation(false);

        setLocationError("");

        toast.success(t("sellerLocation.currentLocationCaptured"));
      },

      (error) => {
        setIsGettingLocation(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(t("sellerLocation.locationPermissionDenied"));

            break;

          case error.POSITION_UNAVAILABLE:
            toast.error(t("sellerLocation.currentLocationUnavailable"));

            break;

          case error.TIMEOUT:
            toast.error(t("sellerLocation.locationRequestTimedOut"));

            break;

          default:
            toast.error(t("sellerLocation.unableToGetCurrentLocation"));
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedLocation) {
      setLocationError(t("sellerLocation.selectLocation"));

      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      setLocationError(t("sellerLocation.invalidPincode"));

      return;
    }

    if (!geoLocation && user?.geoLocation) {
      setLocationError(t("sellerLocation.captureCurrentLocationRequired"));

      return;
    }

    const payload: UpdateProfilePayload = {
      location: {
        ...selectedLocation!.ids,
        pincode,
      },

      ...(geoLocation ? { geoLocation } : {}),
    };

    updateLocationMutation.mutate(payload);
  };

  const isSubmitting = updateLocationMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {user.location && (
        <div
          className="
            mb-6
            rounded-2xl
            border
            border-[#e7d8b9]
            bg-[#fff8e9]
            p-4
          "
        >
          <div className="flex gap-3">
            <MapPin
              size={19}
              className="
                mt-0.5
                shrink-0
                text-[#159447]
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-[#17201a]
                "
              >
                {t("sellerLocation.currentLocation")}
              </p>
              <p>{selectedLocation?.displayNames[currentLocale]}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <SearchableLocationField
          label={t("sellerLocation.selectLocation")}
          placeholder={t("sellerLocation.selectLocation")}
          value={selectedLocation}
          options={locationList}
          onSearchChange={setLocationSearch}
          onSelect={handleLocationSelect}
          isLoading={locationsLoading}
        />

        <div>
          <label
            htmlFor="seller-pincode"
            className="
              mb-2
              block
              text-sm
              font-bold
              text-[#17201a]
            "
          >
            {t("sellerLocation.pincode")}
          </label>

          <input
            id="seller-pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode ?? user.location.pincode}
            disabled={isSubmitting}
            placeholder={t("sellerLocation.pincodePlaceholder")}
            onChange={(event) => handlePincodeChange(event.target.value)}
            className="
              h-12
              w-full
              rounded-xl
              border
              border-[#e7d8b9]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#17201a]
              outline-none
              transition
              placeholder:text-[#7a857d]
              focus:border-[#159447]
              focus:ring-2
              focus:ring-[#159447]/10
              disabled:cursor-not-allowed
              disabled:bg-gray-50
            "
          />
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#e7d8b9]
            bg-[#f8faf7]
            p-4
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <LocateFixed size={18} className="text-[#159447]" />

                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#17201a]
                  "
                >
                  {t("sellerLocation.preciseLocation")}
                </p>
              </div>

              <p
                className="
                  mt-1
                  max-w-md
                  text-xs
                  leading-5
                  text-[#536157]
                "
              >
                {t("sellerLocation.preciseLocationDescription")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isGettingLocation || isSubmitting}
              className="
                flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#159447]
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#107a3a]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isGettingLocation ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <LocateFixed size={17} />
              )}

              {isGettingLocation
                ? t("sellerLocation.locating")
                : geoLocation
                  ? t("sellerLocation.locationCaptured")
                  : t("sellerLocation.useCurrentLocation")}
            </button>
          </div>

          {geoLocation && (
            <div
              className="
                mt-3
                rounded-xl
                bg-[#edf8ef]
                px-3
                py-2
              "
            >
              <p
                className="
                  text-xs
                  font-semibold
                  text-[#159447]
                "
              >
                ✓ {t("sellerLocation.locationCapturedSuccessfully")}
              </p>
            </div>
          )}
        </div>

        {locationError && (
          <p
            className="
              text-sm
              font-medium
              text-red-600
            "
          >
            {locationError}
          </p>
        )}
      </div>

      <div
        className="
          mt-6
          flex
          flex-col
          lg:flex-row
          justify-end
          gap-3
        "
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="
            rounded-xl
            border
            border-[#e7d8b9]
            bg-white
            px-5
            py-2.5
            text-sm
            font-semibold
            text-[#536157]
            transition
            hover:bg-[#fff8e9]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {tc("cancel")}
        </button>

        <button
          type="submit"
          disabled={isSubmitting || isGettingLocation}
          className="
            flex
            min-w-37.5
            items-center
            justify-center
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isSubmitting && <LoaderCircle size={17} className="animate-spin" />}

          {isSubmitting ? tc("saving") : t("sellerLocation.saveLocation")}
        </button>
      </div>
    </form>
  );
}
