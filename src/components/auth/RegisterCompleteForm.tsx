"use client";

import {
  FormEvent,
  useState,
} from "react";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  ArrowRight,
  Languages,
  LoaderCircle,
  UserRound,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";

import {
  SupportedLanguage,
} from "@/types/common.types";

import {
  languages,
} from "@/constants/common.constants";

import {
  setClientLanguage,
} from "@/utils/language.utils";

import { useTranslations } from "next-intl";

export default function RegisterCompleteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    accessTokenSetter,
    getUserProfile,
  } = useAuth();

  const t = useTranslations("Register");

  const registrationToken =
    searchParams.get("registrationToken") ?? "";

  const returnTo =
    searchParams.get("returnTo") || "/sellers";

  const [fullName, setFullName] =
    useState("");

  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>("en");

  const [error, setError] =
    useState("");

  /*
   * Updates preferred app language.
   */
  const languageChangeHandler = (
    language: SupportedLanguage,
  ) => {
    setSelectedLanguage(language);
  };

  /*
   * Completes registration after OTP verification.
   */
  const registerMutation = useMutation({
    mutationFn:
      authService.completeRegistration,

    onSuccess: async (response) => {
      accessTokenSetter(
        response.data.accessToken,
      );

      if (
        response.data.user.preferredLanguage
      ) {
        setClientLanguage(
          response.data.user
            .preferredLanguage,
        );
      }

      await getUserProfile();

      router.refresh();

      router.replace(returnTo);
    },

    onError: (mutationError) => {
      if (
        axios.isAxiosError(mutationError)
      ) {
        setError(
          mutationError.response?.data
            ?.message ??
            t("createAccountError"),
        );

        return;
      }

      setError(
        t("somethingWentWrong"),
      );
    },
  });

  /*
   * Validates the final profile details
   * and creates the user account.
   */
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (registerMutation.isPending) {
      return;
    }

    const name =
      fullName.trim();

    if (name.length < 2) {
      setError(
        t("fullNameRequired"),
      );

      return;
    }

    if (!registrationToken) {
      setError(
        t("registrationSessionExpired"),
      );

      return;
    }

    setError("");

    registerMutation.mutate({
      fullName: name,
      preferredLanguage:
        selectedLanguage,
      registrationToken,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
    >

      <div>
        <div
          className="
            mb-2
            flex
            items-center
            gap-2
          "
        >
          <UserRound
            aria-hidden="true"
            className="
              h-4
              w-4
              text-primary
            "
          />

          <span
            className="
              text-sm
              font-semibold
              text-text-primary
            "
          >
            {t("fullName")}
          </span>
        </div>

        <Input
          id="fullName"
          name="fullName"
          label=""
          type="text"
          autoComplete="name"
          autoFocus
          placeholder={
            t("fullNamePlaceholder")
          }
          value={fullName}
          error={error}
          disabled={
            registerMutation.isPending
          }
          onChange={(event) => {
            setFullName(
              event.target.value,
            );

            if (error) {
              setError("");
            }
          }}
        />
      </div>


      <div className="mt-5">
        <div
          className="
            mb-2
            flex
            items-center
            gap-2
          "
        >
          <Languages
            aria-hidden="true"
            className="
              h-4
              w-4
              text-primary
            "
          />

          <label
            className="
              text-sm
              font-semibold
              text-text-primary
            "
          >
            {t("preferredLanguage")}
          </label>
        </div>

        <Dropdown
          value={selectedLanguage}
          options={languages}
          onChange={(value) =>
            languageChangeHandler(
              value as SupportedLanguage,
            )
          }
          getOptionLabel={(option) =>
            option.label
          }
          getOptionValue={(option) =>
            option.value
          }
        />

        <p
          className="
            mt-2
            text-xs
            leading-5
            text-text-secondary
          "
        >
          {t("languageHint")}
        </p>
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={
          registerMutation.isPending
        }
        className="
          mt-6
          min-h-12
          rounded-xl
          text-base
          font-bold
          shadow-sm
          transition-all
          duration-200
          active:scale-[0.99]
        "
      >
        {registerMutation.isPending ? (
          <span
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <LoaderCircle
              aria-hidden="true"
              className="
                h-5
                w-5
                animate-spin
              "
            />

            {t("creatingAccount")}
          </span>
        ) : (
          <span
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >
            {t("continue")}

            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </span>
        )}
      </Button>
    </form>
  );
}