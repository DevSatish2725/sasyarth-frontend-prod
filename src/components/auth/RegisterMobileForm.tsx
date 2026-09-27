"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import axios from "axios";

export default function RegisterMobileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("Register");

  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const sendOtpMutation = useMutation({
    mutationFn: async ({ mobileNumber }: { mobileNumber: string }) => {
      await authService.sendRegistrationOtp({ mobileNumber });
      await authService.sendMsg91Otp(mobileNumber);
    },

    onSuccess: () => {
      const params = new URLSearchParams({
        mobileNumber,
        returnTo,
      });

      router.push(`/register/verify-otp?${params.toString()}`);
    },

    onError: (mutationError) => {
      if (axios.isAxiosError(mutationError)) {
        setError(mutationError.response?.data?.message ?? t("sendOtpError"));

        return;
      }

      if (mutationError instanceof Error) {
        setError(mutationError.message);

        return;
      }

      setError(t("somethingWentWrong"));
    },
  });

  /*
   * Validates Indian mobile number
   * before requesting OTP.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (sendOtpMutation.isPending) {
      return;
    }

    const cleanedMobileNumber = mobileNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanedMobileNumber)) {
      setError(t("invalidMobileNumber"));

      return;
    }

    setError("");

    sendOtpMutation.mutate({
      mobileNumber: cleanedMobileNumber,
    });
  };

  /*
   * Keeps mobile input numeric and
   * limited to 10 digits.
   */
  const handleMobileNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setMobileNumber(value);

    if (error) {
      setError("");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <Input
        id="mobileNumber"
        name="mobileNumber"
        label={t("mobileNumber")}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        autoFocus
        placeholder={t("mobilePlaceholder")}
        maxLength={10}
        value={mobileNumber}
        error={error}
        disabled={sendOtpMutation.isPending}
        onChange={handleMobileNumberChange}
      />

      {!error && (
        <p
          className="
            mt-2.5
            text-xs
            leading-5
            text-text-secondary
            sm:text-sm
          "
        >
          {t("otpHint")}
        </p>
      )}

      <Button
        type="submit"
        fullWidth
        disabled={sendOtpMutation.isPending}
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
        {sendOtpMutation.isPending ? (
          <span
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />

            {t("sendingOtp")}
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
            {t("sendOtp")}

            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
