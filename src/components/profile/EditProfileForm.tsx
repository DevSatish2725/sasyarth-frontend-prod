"use client";

import { FormEvent, useState } from "react";

import { LoaderCircle, Phone, UserRound } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

import { profileService } from "@/services/profile.service";

import type { UpdateProfilePayload, UserProfile } from "@/types/profile.types";

import type { API_ERROR } from "@/lib/axios";
import { useTranslations } from "next-intl";

interface EditProfileFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProfileForm({
  onCancel,
  onSuccess,
}: EditProfileFormProps) {
  const { user, getUserProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? "");

  const [nameError, setNameError] = useState("");

  const t = useTranslations("Profile");
  const tc = useTranslations("Common");

  const updateProfileMutation = useMutation<
    UserProfile,
    API_ERROR,
    UpdateProfilePayload
  >({
    mutationFn: profileService.updateProfile,

    onSuccess: async () => {
      /*
       * Refresh authenticated user so
       * ProfilePage and Navbar both get
       * the updated information.
       */
      await getUserProfile();

      toast.success("Personal information updated.");

      onSuccess();
    },

    onError: (error) => {
      toast.error(error.response?.data.message ?? "Unable to update profile.");
    },
  });

  if (!user) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = fullName.trim();

    if (name.length < 2) {
      setNameError("Full name must contain at least 2 characters.");

      return;
    }

    if (name.length > 100) {
      setNameError("Full name cannot exceed 100 characters.");

      return;
    }

    if (name === user.fullName) {
      toast.info("No changes to update.");

      return;
    }

    const payload: UpdateProfilePayload = {
      fullName: name,
    };

    updateProfileMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-[#17201a]
            "
          >
            {t("personalInformation.fullName")}
          </label>

          <div className="relative">
            <UserRound
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#159447]
              "
            />

            <input
              id="fullName"
              type="text"
              value={fullName}
              maxLength={100}
              disabled={updateProfileMutation.isPending}
              onChange={(event) => {
                setFullName(event.target.value);

                if (nameError) {
                  setNameError("");
                }
              }}
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[#e7d8b9]
                bg-white
                pl-11
                pr-4
                text-sm
                font-medium
                text-[#17201a]
                outline-none
                transition
                focus:border-[#159447]
                focus:ring-2
                focus:ring-[#159447]/10
                disabled:cursor-not-allowed
                disabled:bg-gray-50
              "
            />
          </div>

          {nameError && (
            <p className="mt-1.5 text-sm text-red-600">{nameError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="mobileNumber"
            className="
              mb-2
              block
              text-sm
              font-semibold
              text-[#17201a]
            "
          >
            {t("personalInformation.mobileNumber")}
          </label>

          <div className="relative">
            <Phone
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#7a857d]
              "
            />

            <input
              id="mobileNumber"
              type="text"
              value={user.mobileNumber}
              disabled
              className="
                h-12
                w-full
                cursor-not-allowed
                rounded-xl
                border
                border-[#e7d8b9]
                bg-[#f7f7f4]
                pl-11
                pr-4
                text-sm
                font-medium
                text-[#536157]
              "
            />
          </div>

          <p className="mt-1.5 text-xs text-[#7a857d]">
            {t("personalInformation.verifiedMobileCannotBeChanged")}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={updateProfileMutation.isPending}
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
            disabled:opacity-60
          "
        >
          {tc("cancel")}
        </button>

        <button
          type="submit"
          disabled={updateProfileMutation.isPending}
          className="
            flex
            min-w-32.5
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
          {updateProfileMutation.isPending && (
            <LoaderCircle size={17} className="animate-spin" />
          )}

          {updateProfileMutation.isPending ? tc("saving") : tc("save")}
        </button>
      </div>
    </form>
  );
}
