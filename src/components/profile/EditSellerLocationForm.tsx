"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import SearchableLocationField from "@/components/location/SearchableLocationField";

import { useAuth } from "@/providers/AuthProvider";

import { locationService } from "@/services/location.service";
import { profileService } from "@/services/profile.service";

import type {
  StateOption,
  DistrictOption,
  VillageOption,
} from "@/types/location.types";

import type {
  GeoLocation,
  UpdateProfilePayload,
  UserProfile,
} from "@/types/profile.types";

import type { API_ERROR } from "@/lib/axios";
import { useTranslations } from "next-intl";

interface EditSellerLocationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditSellerLocationForm({
  onCancel,
  onSuccess,
}: EditSellerLocationFormProps) {
  const { user, getUserProfile } = useAuth();

  /*
   * Location selection
   */

  const [selectedState, setSelectedState] = useState<StateOption | null>(
    user?.location.state || null,
  );

  const [selectedDistrict, setSelectedDistrict] =
    useState<DistrictOption | null>(user?.location.district || null);

  const [selectedVillage, setSelectedVillage] = useState<VillageOption | null>(
    user?.location.village || null,
  );

  /*
   * Search values
   */

  const [districtSearch, setDistrictSearch] = useState(
    user?.location.district.name || "",
  );

  const [villageSearch, setVillageSearch] = useState(
    user?.location.village.name || "",
  );

  /*
   * Pincode + coordinates
   */

  const [pincode, setPincode] = useState(user?.location.pincode || "");

  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);

  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [locationError, setLocationError] = useState("");

  const t = useTranslations("Profile");
  const tc = useTranslations("Common");

  /*
   * --------------------------------
   * Queries
   * --------------------------------
   */

  const statesQuery = useQuery({
    queryKey: ["locations", "states"],

    queryFn: locationService.getStates,
  });

  const districtsQuery = useQuery({
    queryKey: ["locations", "districts", selectedState?.id, districtSearch],

    queryFn: () =>
      locationService.searchDistricts({
        stateId: selectedState!.id,
        search: districtSearch.trim(),
      }),

    enabled: !!selectedState && districtSearch.trim().length >= 2,
  });

  const villagesQuery = useQuery({
    queryKey: ["locations", "villages", selectedDistrict?.id, villageSearch],

    queryFn: () =>
      locationService.searchVillages({
        districtId: selectedDistrict!.id,

        search: villageSearch.trim(),
      }),

    enabled: !!selectedDistrict && villageSearch.trim().length >= 2,
  });

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

  /*
   * --------------------------------
   * Selection handlers
   * --------------------------------
   */

  const handleStateSelect = (state: StateOption) => {
    setSelectedState(state);

    /*
     * State changed.
     * District + village belonging to
     * previous state are invalid.
     */
    setSelectedDistrict(null);
    setSelectedVillage(null);

    setDistrictSearch("");
    setVillageSearch("");

    setPincode("");

    /*
     * Never retain coordinates when
     * textual location changes.
     */
    setGeoLocation(null);

    setLocationError("");
  };

  const handleDistrictSelect = (district: DistrictOption) => {
    setSelectedDistrict(district);

    /*
     * District changed, so old village
     * is invalid.
     */
    setSelectedVillage(null);

    setVillageSearch("");

    setPincode("");

    setGeoLocation(null);

    setLocationError("");
  };

  const handleVillageSelect = (village: VillageOption) => {
    setSelectedVillage(village);

    /*
     * Coordinates must represent
     * newly selected village.
     */
    setGeoLocation(null);

    setLocationError("");
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
    if (!selectedState) {
      setLocationError(t("sellerLocation.selectStateFirst"));

      return;
    }

    if (!selectedDistrict) {
      setLocationError(t("sellerLocation.selectDistrict"));

      return;
    }

    if (!selectedVillage) {
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

  /*
   * --------------------------------
   * Submit
   * --------------------------------
   */

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedState) {
      setLocationError(t("sellerLocation.selectStateFirst"));

      return;
    }

    if (!selectedDistrict) {
      setLocationError(t("sellerLocation.selectDistrict"));

      return;
    }

    if (!selectedVillage) {
      setLocationError(t("sellerLocation.selectVillage"));

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
        stateId: selectedState.id,
        districtId: selectedDistrict.id,
        villageId: selectedVillage.id,
        pincode,
      },

      ...(geoLocation ? { geoLocation } : {}),
    };

    updateLocationMutation.mutate(payload);
  };

  const isSubmitting = updateLocationMutation.isPending;

  const { state, district, village, pincode: existingPincode } = user.location;

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

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-[#536157]
                "
              >
                {[village.name, district.name, state.name, existingPincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        <SearchableLocationField
          key={`state-${selectedState?.id ?? "empty"}`}
          label={t("sellerLocation.state")}
          placeholder={t("sellerLocation.searchOrSelectState")}
          value={selectedState ?? state}
          options={statesQuery.data ?? []}
          onSelect={handleStateSelect}
          disabled={isSubmitting}
          isLoading={statesQuery.isLoading}
          localSearch
        />

        <SearchableLocationField
          key={`district-${selectedState?.id ?? "empty"}-${selectedDistrict?.id ?? "empty"}`}
          label={t("sellerLocation.district")}
          placeholder={
            selectedState
              ? t("sellerLocation.searchDistrict")
              : t("sellerLocation.selectStateFirst")
          }
          value={selectedDistrict ?? district}
          options={districtsQuery.data ?? []}
          onSearchChange={setDistrictSearch}
          onSelect={handleDistrictSelect}
          disabled={!selectedState || isSubmitting}
          isLoading={districtsQuery.isFetching}
          minimumSearchLength={2}
        />

        <SearchableLocationField
          key={`village-${selectedDistrict?.id ?? "empty"}-${selectedVillage?.id ?? "empty"}`}
          label={t("sellerLocation.village")}
          placeholder={
            selectedDistrict
              ? t("sellerLocation.searchVillage")
              : t("sellerLocation.selectDistrictFirst")
          }
          value={selectedVillage ?? village}
          options={villagesQuery.data ?? []}
          onSearchChange={setVillageSearch}
          onSelect={handleVillageSelect}
          disabled={!selectedDistrict || isSubmitting}
          isLoading={villagesQuery.isFetching}
          minimumSearchLength={2}
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
            value={pincode ?? existingPincode}
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
