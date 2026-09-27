"use client";

import { useState } from "react";

import {
  Handshake,
  Leaf,
  MapPin,
  PackageOpen,
  Phone,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

import { useTranslations } from "next-intl";

type Audience = "buyer" | "seller";

export default function HowGreenBridgeWorks() {
  const [audience, setAudience] = useState<Audience>("buyer");

  const t = useTranslations("Home.howItWorks");

  const buyerSteps = [
    {
      icon: Search,
      title: t("buyer.discover.title"),
      description: t("buyer.discover.description"),
    },
    {
      icon: Leaf,
      title: t("buyer.check.title"),
      description: t("buyer.check.description"),
    },
    {
      icon: UserRound,
      title: t("buyer.login.title"),
      description: t("buyer.login.description"),
    },
    {
      icon: Phone,
      title: t("buyer.contact.title"),
      description: t("buyer.contact.description"),
    },
    {
      icon: Handshake,
      title: t("buyer.deal.title"),
      description: t("buyer.deal.description"),
    },
  ];

  const sellerSteps = [
    {
      icon: UserRound,
      title: t("seller.account.title"),
      description: t("seller.account.description"),
    },
    {
      icon: ShieldCheck,
      title: t("seller.verify.title"),
      description: t("seller.verify.description"),
    },
    {
      icon: PackageOpen,
      title: t("seller.inventory.title"),
      description: t("seller.inventory.description"),
    },
    {
      icon: MapPin,
      title: t("seller.discovered.title"),
      description: t("seller.discovered.description"),
    },
    {
      icon: Star,
      title: t("seller.reputation.title"),
      description: t("seller.reputation.description"),
    },
  ];

  const isBuyer = audience === "buyer";

  const steps = isBuyer ? buyerSteps : sellerSteps;

  return (
    <section
      className="
        bg-[#f7faf3]
        px-4
        py-7

        sm:px-6
        sm:py-10

        lg:px-8
        lg:py-14
      "
    >
      <div className="mx-auto max-w-7xl">

        <div
          className="
            lg:hidden
          "
        >
          <h2
            className="
              mt-1.5
              text-[26px]
              font-extrabold
              leading-[1.12]

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
              mt-1
              text-4xl
              font-extrabold
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
            mt-5
            grid
            grid-cols-2
            gap-1
            rounded-2xl
            border
            border-[#e1e8dc]
            bg-white
            p-1
            shadow-[0_2px_8px_rgba(0,0,0,0.03)]

            sm:mx-auto
            sm:w-fit
          "
        >
          <button
            type="button"
            onClick={() => setAudience("buyer")}
            aria-pressed={isBuyer}
            className={`
              flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              text-sm
              font-bold
              transition-all
              duration-200

              sm:min-w-[150px]

              ${
                isBuyer
                  ? `
                      bg-[#159447]
                      text-white
                      shadow-sm
                    `
                  : `
                      text-[#536157]
                      hover:bg-[#eef8ef]
                      hover:text-[#159447]
                    `
              }
            `}
          >
            <UserRound className="h-4 w-4" />

            {t("buyerTab")}
          </button>

          <button
            type="button"
            onClick={() => setAudience("seller")}
            aria-pressed={!isBuyer}
            className={`
              flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-xl
              px-4
              text-sm
              font-bold
              transition-all
              duration-200

              sm:min-w-[150px]

              ${
                !isBuyer
                  ? `
                      bg-[#efa536]
                      text-white
                      shadow-sm
                    `
                  : `
                      text-[#536157]
                      hover:bg-[#fff3dc]
                      hover:text-[#a96712]
                    `
              }
            `}
          >
            <Leaf className="h-4 w-4" />

            {t("sellerTab")}
          </button>
        </div>


        <div
          className="
            mt-6

            lg:hidden
          "
        >
          {steps.map(({ icon: Icon, title, description }, index) => {
            const isLast = index === steps.length - 1;

            return (
              <div
                key={`${audience}-${title}`}
                className="
                    relative
                    flex
                    gap-3
                    pb-4
                    last:pb-0
                  "
              >

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`
                        absolute
                        left-[22px]
                        top-[46px]
                        bottom-0
                        w-[2px]

                        ${isBuyer ? "bg-[#d9eadc]" : "bg-[#f1d7ad]"}
                      `}
                  />
                )}

                <div
                  className={`
                      relative
                      z-10
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      shadow-sm

                      ${
                        isBuyer
                          ? `
                              border-[#cfe7d5]
                              bg-[#eef8ef]
                              text-[#159447]
                            `
                          : `
                              border-[#ead3a5]
                              bg-[#fff3dc]
                              text-[#c47b18]
                            `
                      }
                    `}
                >
                  <Icon
                    className="
                        h-5
                        w-5
                      "
                    strokeWidth={1.9}
                  />

                  <span
                    className={`
                        absolute
                        -right-1.5
                        -top-1.5
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        px-1
                        text-[10px]
                        font-extrabold
                        text-white
                        shadow-sm

                        ${isBuyer ? "bg-[#159447]" : "bg-[#efa536]"}
                      `}
                  >
                    {index + 1}
                  </span>
                </div>

                <div
                  className="
                      min-w-0
                      flex-1
                      rounded-2xl
                      border
                      border-[#e5ebe1]
                      bg-white
                      px-4
                      py-3.5
                      shadow-[0_2px_10px_rgba(0,0,0,0.035)]
                    "
                >
                  <h3
                    className="
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
                        text-[13px]
                        leading-5
                        text-[#536157]
                      "
                  >
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="
            relative
            mt-10
            hidden

            lg:block
          "
        >

          <div
            aria-hidden="true"
            className={`
              absolute
              left-[10%]
              right-[10%]
              top-8
              h-px

              ${isBuyer ? "bg-[#cfe7d5]" : "bg-[#ead3a5]"}
            `}
          />

          <div
            className="
              relative
              grid
              grid-cols-5
              gap-5
            "
          >
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div key={`${audience}-${title}`} className="text-center">
                <div
                  className={`
                      relative
                      z-10
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-full
                      ring-8
                      ring-[#f7faf3]

                      ${
                        isBuyer
                          ? `
                              bg-[#eef8ef]
                              text-[#159447]
                            `
                          : `
                              bg-[#fff3dc]
                              text-[#c47b18]
                            `
                      }
                    `}
                >
                  <Icon size={27} strokeWidth={1.8} />

                  <span
                    className={`
                        absolute
                        -left-2
                        -top-2
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        text-xs
                        font-bold

                        ${
                          isBuyer
                            ? `
                                bg-[#d5f2dc]
                                text-[#107a3a]
                              `
                            : `
                                bg-[#f8dfb3]
                                text-[#8a5515]
                              `
                        }
                      `}
                  >
                    {index + 1}
                  </span>
                </div>

                <h3
                  className="
                      mt-4
                      text-base
                      font-bold
                      text-[#17201a]
                    "
                >
                  {title}
                </h3>

                <p
                  className="
                      mx-auto
                      mt-1.5
                      max-w-[210px]
                      text-sm
                      leading-5
                      text-[#536157]
                    "
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
