"use client";

import {
  ArrowRight,
  Building2,
  Package,
  Sprout,
  Store,
} from "lucide-react";

import { useTranslations } from "next-intl";

import type {
  BusinessType,
  SellerOnboardingForm,
} from "./BecameSellerForm";

interface Props {
  form: SellerOnboardingForm;

  setForm: React.Dispatch<
    React.SetStateAction<SellerOnboardingForm>
  >;

  onContinue: () => void;
}

const businessTypes: {
  value: BusinessType;
  title: string;
  hindi: string;
  descriptionKey:
    | "businessTypes.farmer"
    | "businessTypes.fpo"
    | "businessTypes.trader"
    | "businessTypes.wholesaler";
  icon: React.ReactNode;
}[] = [
  {
    value: "INDIVIDUAL_FARMER",
    title: "Individual Farmer",
    hindi: "व्यक्तिगत किसान",
    descriptionKey: "businessTypes.farmer",
    icon: <Sprout className="h-6 w-6" />,
  },

  {
    value: "FPO",
    title: "FPO",
    hindi: "किसान उत्पादक संगठन",
    descriptionKey: "businessTypes.fpo",
    icon: <Building2 className="h-6 w-6" />,
  },

  {
    value: "TRADER",
    title: "Trader",
    hindi: "व्यापारी",
    descriptionKey: "businessTypes.trader",
    icon: <Store className="h-6 w-6" />,
  },

  {
    value: "WHOLESALER",
    title: "Wholesaler",
    hindi: "थोक विक्रेता",
    descriptionKey: "businessTypes.wholesaler",
    icon: <Package className="h-6 w-6" />,
  },
];

export default function SellerDetailsStep({
  form,
  setForm,
  onContinue,
}: Props) {
  const t = useTranslations("BecomeSeller");

  const handleBusinessType = (
    businessType: BusinessType,
  ) => {
    setForm((previous) => ({
      ...previous,
      businessType,
    }));
  };

  return (
    <>
      <div>
        <h2
          className="
            text-2xl
            font-extrabold
            text-[#17201a]
          "
        >
          {t("aboutTitle")}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-[#536157]
          "
        >
          {t("aboutDescription")}
        </p>
      </div>

      <div
        className="
          mt-6
          grid
          gap-4
          sm:grid-cols-2
        "
      >
        {businessTypes.map((business) => {
          const selected =
            form.businessType === business.value;

          return (
            <button
              key={business.value}
              type="button"
              onClick={() =>
                handleBusinessType(
                  business.value,
                )
              }
              className={`
                relative
                flex
                min-h-28
                items-center
                gap-4
                rounded-xl
                border
                p-4
                text-left
                transition

                ${
                  selected
                    ? "border-[#159447] bg-[#f2fbf4] ring-1 ring-[#159447]"
                    : "border-[#e1e5e2] bg-white hover:border-[#9fcfad]"
                }
              `}
            >
              <div
                className={`
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-full

                  ${
                    selected
                      ? "bg-[#dff3e5] text-[#159447]"
                      : "bg-[#f3f6f4] text-[#536157]"
                  }
                `}
              >
                {business.icon}
              </div>

              <div className="min-w-0">
                <p
                  className="
                    font-bold
                    text-[#17201a]
                  "
                >
                  {business.title}
                </p>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-[#536157]
                  "
                >
                  {business.hindi}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-5
                    text-[#7a857d]
                  "
                >
                  {t(
                    business.descriptionKey,
                  )}
                </p>
              </div>

              <div
                className={`
                  absolute
                  right-2
                  top-4
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  border

                  ${
                    selected
                      ? "border-[#159447]"
                      : "border-[#aeb8b1]"
                  }
                `}
              >
                {selected && (
                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-[#159447]
                    "
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="
          mt-6
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#159447]
          font-bold
          text-white
          transition
          hover:bg-[#107a3a]
        "
      >
        {t("continue")}

        <ArrowRight className="h-5 w-5" />
      </button>
    </>
  );
}