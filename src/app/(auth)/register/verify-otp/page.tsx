import VerifyOtpForm from "@/components/auth/VerifyOtpForm";
import { useTranslations } from "next-intl";

export default function RegisterVerifyOtpPage() {
  const t = useTranslations("Register");
  return (
    <main
      className="
    min-h-[calc(100dvh-64px)]
    bg-background
    pb-[calc(80px+env(safe-area-inset-bottom))]
    lg:min-h-[calc(100dvh-72px)]
    lg:pb-6
  "
    >
      <div
        className="
      mx-auto
      flex
      min-h-[calc(100dvh-144px)]
      w-full
      max-w-md
      flex-col
      px-4
      pt-6

      sm:px-6
      sm:pt-8

      lg:min-h-[calc(100dvh-104px)]
      lg:justify-center
      lg:px-0
      lg:py-8
    "
      >
        <div className="mb-6">
          <p className="text-sm font-bold text-primary">{t("otpSent")}</p>

          <h1
            className="
          mt-1
          text-[28px]
          font-bold
          leading-tight
          tracking-tight
          text-text-primary

          sm:text-3xl
        "
          >
            {t("verifyMobileNumber")}
          </h1>

          <p
            className="
          mt-2
          text-sm
          leading-6
          text-text-secondary
        "
          >
            {t("enterSixDigitOtp")}
          </p>
        </div>

        <VerifyOtpForm mode="register" />
      </div>
    </main>
  );
}
