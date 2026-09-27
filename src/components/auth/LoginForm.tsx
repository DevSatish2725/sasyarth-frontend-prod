"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import { useSendOTP } from "@/hooks/useSendOTP";

export default function LoginForm() {
  const searchParams = useSearchParams();

  const t = useTranslations("Login");

  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");

  const sendOTP = useSendOTP();

  const returnTo = searchParams.get("returnTo") || "/sellers";

  /*
   * Sends login OTP to the entered mobile number.
   *
   * After successful OTP generation, user is redirected
   * to OTP verification page with mobile number and
   * original destination.
   */

  const sendOtpMutation = useMutation({
    mutationFn: authService.sendLoginOtp,

    onSuccess: () => {
      sendOTP(mobileNumber, returnTo);
    },

    onError: (mutationError) => {
      if (axios.isAxiosError(mutationError)) {
        setError(mutationError.response?.data?.message ?? t("sendOtpError"));

        return;
      }

      setError(t("somethingWentWrong"));
    },
  });

  /*
   * Validates Indian mobile number before requesting OTP.
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
   * Allow only numeric values and maximum
   * 10 digits for Indian mobile numbers.
   */
  const handleMobileNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const cleanedValue = event.target.value.replace(/\D/g, "").slice(0, 10);

    setMobileNumber(cleanedValue);

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
        placeholder="9876543210"
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
