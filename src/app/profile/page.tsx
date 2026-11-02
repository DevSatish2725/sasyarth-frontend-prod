"use client";

import { useMemo, useState } from "react";

import { BadgeCheck, MapPin, Phone, UserRound } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";

import EditProfileForm from "@/components/profile/EditProfileForm";
import ProfileField from "@/components/profile/ProfileField";
import EditSellerLocationForm from "@/components/profile/EditSellerLocationForm";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";
import { Option } from "@/components/location/SearchableLocationField";
export default function ProfilePage() {
  const { user } = useAuth();

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const t = useTranslations("Profile");

  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  const showAddress: Option | null = useMemo(() => {
    if (!user?.location) {
      return null;
    }

    const {
      habitation,
      mauja,
      village,
      block,
      district,
      state,
      habitationId,
      maujaId,
      villageId,
      blockId,
      districtId,
      stateId,
    } = user.location;
    const uniquePlace = () => {
      if (habitation.en === mauja.en && habitation.en === village.en) {
        return {
          en: habitation.en,
          hi: habitation.hi,
        };
      } else if (mauja.en === village.en) {
        return {
          en: `${habitation.en} < ${mauja.en}`,
          hi: `${habitation.hi} < ${mauja.hi}`,
        };
      } else if (habitation.en === mauja.en) {
        return {
          en: `${habitation.en} < ${village.en}`,
          hi: `${habitation.hi} < ${village.hi}`,
        };
      } else {
        return {
          en: `${habitation.en} < ${mauja.en} < ${village.en}`,
          hi: `${habitation.hi} < ${mauja.hi} < ${village.hi}`,
        };
      }
    };

    return {
      ids: {
        habitationId,
        maujaId,
        villageId,
        blockId,
        districtId,
        stateId,
      },
      displayNames: {
        en: `${uniquePlace().en} < ${block.en} < ${district.en} < ${state.en}`,
        hi: `${uniquePlace().hi} < ${block.hi} < ${district.hi} < ${state.hi}`,
      },
    };
  }, [user]);

  if (!user) {
    return null;
  }

  const sellerProfile = user.sellerProfile;

  const pincode = user.location?.pincode;

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pt-8 pb-22 lg:pt-8 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#17201a]">{t("title")}</h1>

        <p className="mt-1 text-sm text-[#536157]">{t("description")}</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-3xl border border-[#e7d8b9] bg-white p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#17201a]">
                {t("personalInformation.title")}
              </h2>

              <p className="mt-1 text-sm text-[#536157]">
                {t("personalInformation.description")}
              </p>
            </div>

            {!isEditingPersonal && (
              <button
                type="button"
                onClick={() => setIsEditingPersonal(true)}
                className="
                  rounded-xl
                  border
                  border-[#159447]
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-[#159447]
                  transition
                  hover:bg-[#edf8ef]
                "
              >
                {t("personalInformation.edit")}
              </button>
            )}
          </div>

          {isEditingPersonal ? (
            <EditProfileForm
              key={user.id}
              onCancel={() => setIsEditingPersonal(false)}
              onSuccess={() => setIsEditingPersonal(false)}
            />
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <ProfileField
                icon={<UserRound size={18} />}
                label={t("personalInformation.fullName")}
                value={user.fullName}
              />

              <ProfileField
                icon={<Phone size={18} />}
                label={t("personalInformation.mobileNumber")}
                value={user.mobileNumber}
                suffix={
                  user.isPhoneVerified ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-[#159447]">
                      <BadgeCheck size={14} />
                      {t("personalInformation.verified")}
                    </span>
                  ) : null
                }
              />
            </div>
          )}
        </section>

        {sellerProfile && (
          <>
            <section className="rounded-3xl border border-[#e7d8b9] bg-white p-6">
              <div>
                <h2 className="text-lg font-bold text-[#17201a]">
                  {t("sellerInformation.title")}
                </h2>

                <p className="mt-1 text-sm text-[#536157]">
                  {t("sellerInformation.description")}
                </p>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <ProfileField
                  label={t("sellerInformation.verificationStatus")}
                  value={sellerProfile.verificationStatus}
                />

                {"businessType" in sellerProfile &&
                  typeof sellerProfile.businessType === "string" && (
                    <ProfileField
                      label={t("sellerInformation.businessType")}
                      value={formatBusinessType(sellerProfile.businessType)}
                    />
                  )}
              </div>
            </section>

            <section className="rounded-3xl border border-[#e7d8b9] bg-white p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-[#159447]" />

                    <h2 className="text-lg font-bold text-[#17201a]">
                      {t("sellerLocation.title")}
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-[#536157]">
                    {t("sellerLocation.description")}
                  </p>
                </div>

                {!isEditingLocation && (
                  <button
                    type="button"
                    onClick={() => setIsEditingLocation(true)}
                    className="
                      rounded-xl
                      border
                      border-[#159447]
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-[#159447]
                      transition
                      hover:bg-[#edf8ef]
                    "
                  >
                    {t("sellerLocation.editLocation")}
                  </button>
                )}
              </div>

              {isEditingLocation ? (
                <EditSellerLocationForm
                  onCancel={() => setIsEditingLocation(false)}
                  onSuccess={() => setIsEditingLocation(false)}
                  currentLocation = {showAddress}
                />
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <ProfileField
                    label={t("sellerLocation.address")}
                    value={
                      showAddress?.displayNames[currentLocale] ?? "Not set"
                    }
                  />

                  <ProfileField
                    label={t("sellerLocation.pincode")}
                    value={pincode ?? "Not set"}
                  />
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function formatBusinessType(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
