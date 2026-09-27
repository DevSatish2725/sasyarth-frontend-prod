"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function HomeCTA() {
  const router = useRouter();
  const t = useTranslations("Home.cta");

  return (
    <section className="relative w-full overflow-hidden">
      <Image
        src="/images/home/farm-landscape.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-[#fff8e9]/30" />

      <div
        className="
          absolute inset-0
          bg-[radial-gradient(ellipse_at_center,rgba(255,248,233,0.88)_0%,rgba(255,248,233,0.72)_30%,rgba(255,248,233,0.32)_60%,rgba(255,248,233,0.08)_100%)]
        "
      />

      <div
        className="
          absolute inset-0
          bg-linear-to-b
          from-white/35
          via-[#fff8e9]/25
          to-transparent
        "
      />

      <div
        className="
          relative z-10
          mx-auto flex
          min-h-[250px]
          max-w-7xl
          items-center
          justify-center
          px-4
          py-8

          sm:min-h-[260px]
          sm:px-6
          sm:py-10

          lg:min-h-[250px]
          lg:px-8
        "
      >
        <div
          className="
            w-full
            max-w-2xl
            text-center
          "
        >
          <h2
            className="
              mx-auto
              max-w-[320px]
              text-[26px]
              font-extrabold
              leading-[1.12]
              tracking-tight
              text-[#17201a]

              sm:max-w-none
              sm:text-3xl

              lg:text-[2rem]
            "
          >
            {t("title")}
          </h2>

          <p
            className="
              mx-auto
              mt-2.5
              max-w-[340px]
              text-sm
              font-medium
              leading-6
              text-[#455249]

              sm:max-w-xl
              sm:text-base
            "
          >
            {t("description")}
          </p>

          <div
            className="
              mx-auto
              mt-5
              flex
              w-full
              max-w-[360px]
              flex-col
              gap-2.5

              sm:max-w-none
              sm:flex-row
              sm:items-center
              sm:justify-center
              sm:gap-3
            "
          >
            <button
              type="button"
              onClick={() => router.push("/sellers")}
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#159447]
                px-5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                duration-200

                active:scale-[0.99]

                hover:bg-[#107a3a]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#159447]/30
                focus-visible:ring-offset-2

                sm:min-h-11
                sm:w-auto
                sm:min-w-[150px]
                sm:rounded-lg
                sm:px-6
                sm:font-semibold
              "
            >
              {t("findSellers")}

              <ArrowRight
                size={17}
                className="shrink-0"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                router.push("/become-seller")
              }
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#159447]
                bg-white/90
                px-5
                text-sm
                font-bold
                text-[#159447]
                shadow-sm
                backdrop-blur-sm
                transition
                duration-200

                active:scale-[0.99]

                hover:bg-[#eef8ef]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#159447]/30
                focus-visible:ring-offset-2

                sm:min-h-11
                sm:w-auto
                sm:min-w-[165px]
                sm:rounded-lg
                sm:px-6
                sm:font-semibold
              "
            >
              {t("becomeSeller")}

              <ArrowRight
                size={17}
                className="shrink-0"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}