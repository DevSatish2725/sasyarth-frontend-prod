"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ArrowRight,
  Clock3,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { authService } from "@/services/auth.service";
import { useAuth } from "@/providers/AuthProvider";

import { setClientLanguage } from "@/utils/language.utils";

import { useTranslations } from "next-intl";

interface VerifyOtpFormProps {
  mode: "login" | "register";
}

const OTP_EXPIRY_SECONDS = 1 * 60;

export default function VerifyOtpForm({ mode }: VerifyOtpFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { accessTokenSetter, getUserProfile } = useAuth();

  const t = useTranslations("Login");

  const mobileNumber = searchParams.get("mobileNumber") ?? "";

  const returnTo = searchParams.get("returnTo") || "/sellers";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);

  const isExpired = timeLeft <= 0;

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  useEffect(() => {
    if (isExpired) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isExpired]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (mode === "login") {
        const msgAccessToken = await authService.verifyMsg91Otp(otp);

        const response = await authService.verifyLoginOtp(msgAccessToken);

        return {
          type: "LOGIN" as const,
          response,
        };
      }

      const msgAccessToken = await authService.verifyMsg91Otp(otp);

      const response = await authService.verifyRegistrationOtp(msgAccessToken);

      return {
        type: "REGISTER" as const,
        response,
      };
    },

    onSuccess: async (result) => {
      if (result.type === "LOGIN") {
        accessTokenSetter(result.response.data.accessToken);

        if (result.response.data.user.preferredLanguage) {
          setClientLanguage(result.response.data.user.preferredLanguage);
        }

        const currentUser = await getUserProfile();

        router.refresh();
        if (returnTo === "/become-seller") {
          if (currentUser?.sellerProfile) {
            router.replace("/seller/dashboard");
          } else {
            router.replace("/become-seller");
          }

          return;
        }
        if (currentUser?.sellerProfile) {
          router.replace("/seller/dashboard");

          return;
        }

        router.replace(returnTo);

        return;
      }

      const params = new URLSearchParams({
        registrationToken: result.response.data.registrationToken,

        returnTo,
      });

      router.replace(`/register/complete?${params.toString()}`);
    },

    onError: (mutationError) => {
      if (axios.isAxiosError(mutationError)) {
        setError(mutationError.response?.data?.message ?? t("invalidOtp"));

        return;
      }

      setError(t("somethingWentWrong"));
    },
  });

  /*
   * Requests another OTP after the
   * previous OTP has expired.
   */

  const resendMutation = useMutation({
    mutationFn: async () => {
      const reqId = sessionStorage.getItem("msg91ReqId");
      return await authService.resendMsg91Otp(reqId!, "11");
    },

    onSuccess: () => {
      setTimeLeft(OTP_EXPIRY_SECONDS);
      setError("");
    },

    onError: (error) => {
      setError(
        error instanceof Error ? error.message : "Unable to resend OTP.",
      );
    },
  });

  /*
   * Validate and submit OTP.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (verifyMutation.isPending || resendMutation.isPending) {
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(t("enterSixDigitOtp"));

      return;
    }

    setError("");

    verifyMutation.mutate();
  };

  /*
   * OTP can only be resent when
   * the existing OTP has expired.
   */
  const handleResendOtp = () => {
    if (!isExpired || resendMutation.isPending) {
      return;
    }

    resendMutation.mutate();
  };

  /*
   * Keep OTP numeric and limited
   * to six digits.
   */
  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);

    setOtp(value);

    if (error) {
      setError("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="
        w-full
        rounded-3xl
        border
        border-border/80
        bg-surface
        p-5
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]

        sm:p-6
        lg:rounded-2xl
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-primary/10
          bg-primary-light/60
          p-3.5
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-primary/10
            text-primary
          "
        >
          <ShieldCheck aria-hidden="true" className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-xs
              font-medium
              text-text-secondary
            "
          >
            {t("otpSent")}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-base
              font-bold
              tracking-wide
              text-text-primary
            "
          >
            +91 {mobileNumber}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Input
          id="otp"
          name="otp"
          label={t("sixDigitOtp")}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="••••••"
          maxLength={6}
          value={otp}
          error={error}
          disabled={verifyMutation.isPending || resendMutation.isPending}
          onChange={handleOtpChange}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={
          verifyMutation.isPending || resendMutation.isPending
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
        {verifyMutation.isPending ? (
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

            {t("verifying")}
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
            {t("verify")}

            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        )}
      </Button>

      <div
        className="
          mt-4
          flex
          items-center
          justify-center
        "
      >
        <button
          type="button"
          onClick={() => {
            if (!isExpired || resendMutation.isPending) return;
            handleResendOtp();
          }}
          disabled={!isExpired || resendMutation.isPending}
          className="
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            px-4
            text-sm
            font-semibold
            text-primary
            transition-colors
            duration-150

            hover:bg-primary-light

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-primary/30

            disabled:cursor-not-allowed
            disabled:text-text-muted
            disabled:hover:bg-transparent
          "
        >
          {resendMutation.isPending ? (
            <LoaderCircle
              aria-hidden="true"
              className="
                h-4
                w-4
                animate-spin
              "
            />
          ) : (
            <RefreshCw aria-hidden="true" className="h-4 w-4" />
          )}

          {resendMutation.isPending ? t("sendingOtp") : t("resendOtp")}
          {!isExpired && (
            <span
              aria-live="polite"
              className="
              shrink-0
              text-sm
              font-bold
              tabular-nums
              text-text-primary
            "
            >
              {formattedTime}
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
