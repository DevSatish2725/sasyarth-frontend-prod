import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import RegisterCompleteForm from "@/components/auth/RegisterCompleteForm";

export default function RegisterCompletePage() {
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
          <div
            className="
              mb-4
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              bg-primary-light
              text-primary
            "
          >
            <CheckCircle2
              aria-hidden="true"
              className="h-5 w-5"
            />
          </div>

          <p
            className="
              text-sm
              font-bold
              text-primary
            "
          >
            {t("almostDone")}
          </p>

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
            {t("completeProfile")}
          </h1>

          <p
            className="
              mt-2
              max-w-sm
              text-sm
              leading-6
              text-text-secondary
            "
          >
            {t("completeProfileDescription")}
          </p>
        </div>

        {/* ====================================== */}
        {/* FORM CARD */}
        {/* ====================================== */}

        <section
          className="
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
          <RegisterCompleteForm />
        </section>

        <p
          className="
            mt-5
            px-4
            text-center
            text-xs
            leading-5
            text-text-muted
          "
        >
          {t("profileInfoMessage")}
        </p>
      </div>
    </main>
  );
}