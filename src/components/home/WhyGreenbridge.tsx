"use client";

import {
  BadgeCheck,
  IndianRupee,
  Leaf,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

import { useTranslations } from "next-intl";

export default function WhyGreenBridge() {
  const t = useTranslations("Home.why");

  const features = [
    {
      icon: MapPin,
      title: t("local.title"),
      description: t("local.description"),
      variant: "green",
    },
    {
      icon: Leaf,
      title: t("availability.title"),
      description: t("availability.description"),
      variant: "warm",
    },
    {
      icon: IndianRupee,
      title: t("prices.title"),
      description: t("prices.description"),
      variant: "green",
    },
    {
      icon: BadgeCheck,
      title: t("verified.title"),
      description: t("verified.description"),
      variant: "warm",
    },
    {
      icon: Star,
      title: t("ratings.title"),
      description: t("ratings.description"),
      variant: "green",
    },
    {
      icon: Phone,
      title: t("contact.title"),
      description: t("contact.description"),
      variant: "warm",
    },
  ];

  return (
    <section
      className="
        bg-[#fff8e9]
        px-4
        py-8

        sm:px-6
        sm:py-10

        lg:px-8
        lg:py-14
      "
    >
      <div className="mx-auto max-w-7xl">

        <div className="lg:hidden">

          <h2
            className="
              mt-1.5
              text-[26px]
              font-extrabold
              leading-[1.12]
              tracking-[-0.02em]
              text-[#17201a]

              sm:text-3xl
            "
          >
            {t("title")}
          </h2>

          <p
            className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-[#536157]

              sm:text-base
            "
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          className="
            hidden
            text-center

            lg:block
          "
        >
          <h2
            className="
              text-4xl
              font-extrabold
              tracking-tight
              text-[#17201a]
            "
          >
            {t("title")}
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-base
              text-[#536157]
            "
          >
            {t("subtitle")}
          </p>
        </div>


        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3

            sm:hidden
          "
        >
          {features.map(
            ({
              icon: Icon,
              title,
              description,
              variant,
            }) => {
              const isGreen =
                variant === "green";

              return (
                <article
                  key={title}
                  className={`
                    flex
                    min-h-[150px]
                    flex-col
                    rounded-2xl
                    border
                    p-4
                    shadow-[0_2px_10px_rgba(0,0,0,0.035)]

                    ${
                      isGreen
                        ? `
                            border-[#cfe7d5]
                            bg-[#eef8ef]
                          `
                        : `
                            border-[#ead3a5]
                            bg-[#fff3dc]
                          `
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        isGreen
                          ? `
                              bg-[#d9f0df]
                              text-[#159447]
                            `
                          : `
                              bg-[#f8dfb3]
                              text-[#b66f12]
                            `
                      }
                    `}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={1.9}
                    />
                  </div>

                  <h3
                    className="
                      mt-3
                      text-sm
                      font-bold
                      leading-5
                      text-[#17201a]
                    "
                  >
                    {title}
                  </h3>

                  <p
                    className="
                      mt-1
                      line-clamp-3
                      text-[12px]
                      leading-[1.45]
                      text-[#536157]
                    "
                  >
                    {description}
                  </p>
                </article>
              );
            },
          )}
        </div>

        <div
          className="
            mt-8
            hidden
            gap-4

            sm:grid
            sm:grid-cols-2

            lg:grid-cols-3
          "
        >
          {features.map(
            ({
              icon: Icon,
              title,
              description,
              variant,
            }) => {
              const isGreen =
                variant === "green";

              return (
                <div
                  key={title}
                  className={`
                    flex
                    gap-4
                    rounded-2xl
                    border
                    p-5
                    transition
                    duration-200

                    hover:-translate-y-0.5
                    hover:shadow-md

                    ${
                      isGreen
                        ? `
                            border-[#cfe7d5]
                            bg-[#eef8ef]
                          `
                        : `
                            border-[#ead3a5]
                            bg-[#fff3dc]
                          `
                    }
                  `}
                >
                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl

                      ${
                        isGreen
                          ? `
                              bg-[#d9f0df]
                              text-[#159447]
                            `
                          : `
                              bg-[#f8dfb3]
                              text-[#b66f12]
                            `
                      }
                    `}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div>
                    <h3
                      className="
                        font-bold
                        text-[#17201a]
                      "
                    >
                      {title}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        leading-5
                        text-[#536157]
                      "
                    >
                      {description}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}