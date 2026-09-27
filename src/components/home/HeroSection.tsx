"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  ArrowRight,
  BadgeCheck,
  IndianRupee,
  Leaf,
  MapPin,
  Search,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const t = useTranslations("Home.hero");

  const mobileBenefits = [
    {
      icon: MapPin,
      title: t("benefits.local.title"),
      variant: "green",
    },
    {
      icon: Leaf,
      title: t("benefits.availability.title"),
      variant: "green",
    },
    {
      icon: IndianRupee,
      title: t("benefits.prices.title"),
      variant: "warm",
    },
    {
      icon: BadgeCheck,
      title: t("benefits.verified.title"),
      variant: "green",
    },
  ];

  const desktopBenefits = [
    {
      icon: MapPin,
      title: t("benefits.local.title"),
    },
    {
      icon: Leaf,
      title: t("benefits.availability.title"),
    },
    {
      icon: IndianRupee,
      title: t("benefits.prices.title"),
    },
    {
      icon: BadgeCheck,
      title: t("benefits.verified.title"),
    },
  ];

  return (
    <section
      className="
        w-full
        border-b
        border-[#e7d8b9]
        bg-[#f7f7ef]
      "
    >

      <div className="lg:hidden">
        <div
          className="
            mx-auto
            flex
            min-h-[calc(100dvh-128px)]
            w-full
            flex-col
            overflow-hidden
            pb-0
            pt-4
          "
        >
          <div className="px-4">

            <div
              className="
              inline-flex
              w-fit
              items-center
              gap-1.5
              rounded-full
              bg-[#eaf6dc]
              px-2.5
              py-1.5
              text-[11px]
              font-bold
              text-[#107a3a]
            "
            >
              <Leaf className="h-3.5 w-3.5 shrink-0" />

              <span>{t("badge")}</span>
            </div>


            <h1
              className="
              mt-3
              max-w-82.5
              text-[31px]
              font-extrabold
              leading-[1.03]
              tracking-[-0.035em]
              text-[#17201a]

              min-[390px]:text-[33px]
            "
            >
              {t("title")}
            </h1>


            <p
              className="
              mt-2.5
              max-w-[320px]
              text-[12px]
              leading-[1.45]
              text-[#4f5b53]

              min-[390px]:text-[13px]
            "
            >
              {t("description")}
            </p>

            <div
              className="
              mt-4
              flex
              flex-col
              gap-2
            "
            >
              <button
                type="button"
                onClick={() => router.push("/sellers")}
                className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#159447]
                px-4
                text-sm
                font-bold
                text-white
                shadow-sm
                transition

                active:scale-[0.99]

                hover:bg-[#107a3a]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#159447]/30
                focus-visible:ring-offset-2
              "
              >
                <Search className="h-4 w-4 shrink-0" />

                <span>{t("findSellers")}</span>

                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/become-seller")}
                className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#b98944]
                bg-white/80
                px-4
                text-sm
                font-bold
                text-[#7b4f12]
                transition

                active:scale-[0.99]

                hover:bg-[#fff6e6]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#b98944]/30
                focus-visible:ring-offset-2
              "
              >
                <span>{t("becomeSeller")}</span>

                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>

            <div
              className="
              mt-4
              grid
              grid-cols-2
              gap-x-5
              gap-y-3
              px-1
            "
            >
              {mobileBenefits.map(({ icon: Icon, title, variant }) => {
                const isWarm = variant === "warm";

                return (
                  <div
                    key={title}
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full

                        ${
                          isWarm
                            ? `
                                bg-[#fff0c8]
                                text-[#b46b09]
                              `
                            : `
                                bg-[#e4f3dc]
                                text-[#159447]
                              `
                        }
                      `}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <p
                      className="
                        text-[11px]
                        font-bold
                        leading-[1.15]
                        text-[#17201a]
                      "
                    >
                      {title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="
              relative
              mt-4
              min-h-72.5
              flex-1
              overflow-hidden
              rounded-t-[20px]
              bg-[#dfead5]
            "
          >
            <Image
              src="/images/home/hero-farmer-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="
      object-cover
      object-center
    "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-12
                bg-linear-to-b
                from-[#f7f7ef]
                to-transparent
              "
            />
          </div>
        </div>
      </div>

      <div
        className="
          relative
          hidden
          min-h-107.5
          overflow-hidden

          lg:block

          xl:min-h-112.5
        "
      >
        <Image
          src="/images/home/hero-farmer.webp"
          alt=""
          fill
          priority
          sizes="50vw"
          className="
      object-cover
      object-[78%_26%]
    "
        />

        <div
          className="
            absolute
            inset-0
            bg-linear-to-r
            from-[#f4f9ed]
            from-0%
            via-[#f4f9ed]/95
            via-40%
            to-[#f4f9ed]/5
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-107.5
            w-full
            max-w-7xl
            items-center
            px-10
            py-10

            xl:min-h-112.5
          "
        >
          <div
            className="
              w-full
              max-w-152.5

              xl:max-w-162.5
            "
          >
            <div
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#e8f7eb]/95
                px-3.5
                py-1.5
                text-sm
                font-semibold
                text-[#107a3a]
                shadow-[0_1px_2px_rgba(0,0,0,0.03)]
              "
            >
              <Leaf size={16} className="shrink-0" />

              <span>{t("badge")}</span>
            </div>

            <h1
              className="
                max-w-170
                text-[3.15rem]
                font-extrabold
                leading-[1.1]
                tracking-tight
                text-[#17201a]

                xl:text-[3.35rem]
              "
            >
              {t("title")}
            </h1>

            <p
              className="
                mt-4
                max-w-147.5
                text-[17px]
                leading-7
                text-[#455249]
              "
            >
              {t("description")}
            </p>

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
              "
            >
              <button
                type="button"
                onClick={() => router.push("/sellers")}
                className="
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#159447]
                  px-6
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#107a3a]
                  hover:shadow-md

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#159447]
                  focus-visible:ring-offset-2
                "
              >
                <Search size={19} className="shrink-0" />

                <span>{t("findSellers")}</span>

                <ArrowRight size={18} className="shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/become-seller")}
                className="
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#159447]
                  bg-white/90
                  px-6
                  font-semibold
                  text-[#159447]
                  shadow-sm
                  backdrop-blur-sm
                  transition-all
                  duration-200

                  hover:-translate-y-0.5
                  hover:bg-[#edf8ef]
                  hover:shadow-md

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#159447]
                  focus-visible:ring-offset-2
                "
              >
                <Leaf size={19} className="shrink-0" />

                <span>{t("becomeSeller")}</span>

                <ArrowRight size={18} className="shrink-0" />
              </button>
            </div>

            <div
              className="
                mt-5
                flex
                max-w-140
                items-center
                gap-2
                text-[15px]
                leading-5
                text-[#455249]
              "
            >
              <BadgeCheck
                size={19}
                className="
                  shrink-0
                  text-[#159447]
                "
              />

              <span>{t("verifiedMessage")}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          relative
          z-20
          hidden
          border-t
          border-white/60
          bg-white/95
          backdrop-blur-sm

          lg:block
        "
      >
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-7xl
            grid-cols-4
            px-10
          "
        >
          {desktopBenefits.map(({ icon: Icon, title }, index) => (
            <div
              key={title}
              className={`
                  flex
                  min-h-22
                  items-center
                  justify-center
                  gap-3
                  px-5

                  ${
                    index > 0
                      ? `
                          border-l
                          border-[#dce8d9]
                        `
                      : ""
                  }
                `}
            >
              <div
                className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#e4f5e8]
                    text-[#159447]
                  "
              >
                <Icon size={19} />
              </div>

              <p
                className="
                    text-[15px]
                    font-bold
                    text-[#17201a]
                  "
              >
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
