"use client";

import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AudienceCards() {
  const router = useRouter();
  const t = useTranslations("Home.audience");

  const buyerBenefits = [
    t("buyer.points.nearby"),
    t("buyer.points.availability"),
    t("buyer.points.compare"),
    t("buyer.points.contact"),
  ];

  const sellerBenefits = [
    t("seller.points.availability"),
    t("seller.points.prices"),
    t("seller.points.discovered"),
    t("seller.points.reputation"),
  ];

  return (
    <section
      className="
        bg-background
        px-4
        py-7
        sm:px-6
        sm:py-8
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          gap-4
          lg:grid-cols-2
          lg:gap-5
        "
      >
        <AudienceCard
          title={t("buyer.title")}
          subtitle={t("buyer.subtitle")}
          benefits={buyerBenefits}
          button={t("buyer.button")}
          onClick={() => router.push("/sellers")}
          image="/images/home/buyer-illustration.webp"
          variant="buyer"
        />

        <AudienceCard
          title={t("seller.title")}
          subtitle={t("seller.subtitle")}
          benefits={sellerBenefits}
          button={t("seller.button")}
          onClick={() =>
            router.push("/become-seller")
          }
          image="/images/home/seller-illustration.webp"
          variant="seller"
        />
      </div>
    </section>
  );
}

interface AudienceCardProps {
  title: string;
  subtitle: string;
  benefits: string[];
  button: string;
  image: string;
  variant: "buyer" | "seller";
  onClick: () => void;
}

function AudienceCard({
  title,
  subtitle,
  benefits,
  button,
  image,
  variant,
  onClick,
}: AudienceCardProps) {
  const buyer = variant === "buyer";

  return (
    <article
      className={`
        overflow-hidden
        rounded-3xl
        border
        shadow-[0_4px_18px_rgba(0,0,0,0.04)]

        lg:relative
        lg:min-h-61.25
        lg:rounded-2xl
        lg:shadow-none

        ${
          buyer
            ? "border-[#cfe7d5] bg-[#eef8ef]"
            : "border-[#ead3a5] bg-[#fff3dc]"
        }
      `}
    >

      <div
        className="
          relative
          aspect-video
          w-full
          overflow-hidden
          lg:hidden
        "
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="
            object-cover
            object-left
          "
        />

        <div
          className={`
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-linear-to-t
            to-transparent

            ${
              buyer
                ? "from-[#eef8ef]"
                : "from-[#fff3dc]"
            }
          `}
        />
      </div>

      <div
        className="
          p-5

          sm:p-6

          lg:hidden
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              className="
                text-xl
                font-extrabold
                leading-tight
                text-[#17201a]
              "
            >
              {title}
            </h2>

            <p
              className={`
                mt-1
                text-sm
                font-semibold
                leading-5

                ${
                  buyer
                    ? "text-[#159447]"
                    : "text-accent"
                }
              `}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div
          className="
            mt-4
            grid
            gap-2.5
          "
        >
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="
                flex
                items-start
                gap-2.5
                text-[13px]
                leading-5
                text-[#26332a]
              "
            >
              <CheckCircle2
                className={`
                  mt-0.5
                  h-4
                  w-4
                  shrink-0

                  ${
                    buyer
                      ? "text-[#159447]"
                      : "text-accent"
                  }
                `}
              />

              <span className="min-w-0">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClick}
          className={`
            mt-5
            inline-flex
            min-h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            px-5
            text-sm
            font-bold
            text-white
            shadow-sm
            transition-all
            duration-200

            active:scale-[0.99]

            ${
              buyer
                ? `
                    bg-[#159447]
                    hover:bg-[#107a3a]
                  `
                : `
                    bg-accent
                    hover:bg-[#744b00]
                  `
            }
          `}
        >
          <span>{button}</span>

          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="hidden lg:block">

        <Image
          src={image}
          alt=""
          fill
          sizes="50vw"
          className="object-cover object-left"
        />

        <div
          className={`
            absolute
            inset-0
            z-1

            ${
              buyer
                ? `
                    bg-linear-to-l
                    from-[#eef8ef]/98
                    via-[#eef8ef]/90
                    to-transparent
                  `
                : `
                    bg-linear-to-l
                    from-[#fff6e6]/98
                    via-[#fff6e6]/90
                    to-transparent
                  `
            }
          `}
        />

        <div
          className="
            relative
            z-10
            min-h-61.25
            px-6
            py-5
          "
        >
          <div
            className="
              ml-auto
              flex
              w-[52%]
              flex-col
            "
          >
            <h2
              className="
                text-xl
                font-extrabold
                leading-tight
                text-[#17201a]
                xl:text-2xl
              "
            >
              {title}
            </h2>

            <p
              className={`
                mt-1
                text-sm
                font-semibold

                ${
                  buyer
                    ? "text-[#159447]"
                    : "text-accent"
                }
              `}
            >
              {subtitle}
            </p>

            <div
              className="
                mt-4
                space-y-2
              "
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="
                    flex
                    items-start
                    gap-2
                    text-[13px]
                    leading-5
                    text-[#26332a]
                  "
                >
                  <CheckCircle2
                    size={15}
                    className={`
                      mt-0.5
                      shrink-0

                      ${
                        buyer
                          ? "text-[#159447]"
                          : "text-accent"
                      }
                    `}
                  />

                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onClick}
              className={`
                mt-4
                inline-flex
                min-h-10
                w-fit
                items-center
                justify-center
                gap-2
                rounded-lg
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition

                ${
                  buyer
                    ? `
                        bg-[#159447]
                        hover:bg-[#107a3a]
                      `
                    : `
                        bg-accent
                        hover:bg-[#744b00]
                      `
                }
              `}
            >
              {button}

              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}