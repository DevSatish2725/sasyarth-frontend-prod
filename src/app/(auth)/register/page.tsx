import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";

import RegisterMobileForm from "@/components/auth/RegisterMobileForm";

export default function RegisterPage() {
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
        <div className="mb-6 sm:mb-7">
          <p
            className="
              text-sm
              font-bold
              text-primary
              sm:text-base
            "
          >
            {t("welcome")}
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
            {t("title")}
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
            {t("description")}
          </p>
        </div>

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
          <RegisterMobileForm />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span
              className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-text-muted
              "
            >
              {t("or")}
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <p
            className="
              text-center
              text-sm
              leading-6
              text-text-secondary
            "
          >
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/login"
              className="
                font-bold
                text-primary
                transition-colors
                duration-150
                hover:text-primary-hover
                hover:underline
                focus-visible:rounded
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary/30
              "
            >
              {t("login")}
            </Link>
          </p>
        </section>

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            px-4
            text-center
          "
        >
          <LockKeyhole
            aria-hidden="true"
            className="
              h-4
              w-4
              shrink-0
              text-text-muted
            "
          />

          <p
            className="
              text-xs
              leading-5
              text-text-muted
            "
          >
            {t("mobileVerificationInfo")}
          </p>
        </div>
      </div>
    </main>
  );
}