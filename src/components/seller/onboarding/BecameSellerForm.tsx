"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import SellerDetailsStep from "./SellerDetailsStep";
import SellerLocationStep from "./SellerLocationStep";

import { sellerService } from "@/services/seller.service";
import { useAuth } from "@/providers/AuthProvider";
import { API_ERROR } from "@/lib/axios";

import { toast } from "sonner";

export type BusinessType =
  | "INDIVIDUAL_FARMER"
  | "FPO"
  | "TRADER"
  | "WHOLESALER";

export interface LocationOption {
  id: string;
  name: string;
}

export interface SellerOnboardingForm {
  businessType: BusinessType | "";

  state: LocationOption | null;
  district: LocationOption | null;
  village: LocationOption | null;

  pincode: string;

  geoLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const initialForm: SellerOnboardingForm = {
  businessType: "",

  state: null,
  district: null,
  village: null,

  pincode: "",

  geoLocation: null,
};

export default function BecomeSellerForm() {
  const router = useRouter();

  const { user, getUserProfile } = useAuth();

  const t = useTranslations("BecomeSeller");

  const [step, setStep] = useState<1 | 2>(1);

  const [form, setForm] = useState<SellerOnboardingForm>(initialForm);

  const [error, setError] = useState("");

  const applyForSellerMutation = useMutation({
    mutationFn: async () => {
      if (
        !form.businessType ||
        !form.state ||
        !form.district ||
        !form.village ||
        !form.pincode
      ) {
        throw new Error(t("completeRequiredFields"));
      }

      const payload = {
        businessType: form.businessType,
        documents: [
          {
            type: "PAN",

            url: "https://pan-card.jpg",
          },
        ],

        location: {
          stateId: form.state.id,

          districtId: form.district.id,

          villageId: form.village.id,

          pincode: form.pincode,
        },

        ...(form.geoLocation
          ? {
              geoLocation: {
                type: "Point" as const,

                coordinates: [
                  form.geoLocation.longitude,

                  form.geoLocation.latitude,
                ] as [number, number],
              },
            }
          : {}),
      };

      return user?.sellerProfile
        ? sellerService.reApplyForSeller(payload)
        : sellerService.applyForSeller(payload);
    },

    onSuccess: async () => {
      /*
       * SellerProfile has now been created
       * in backend, but AuthProvider can still
       * contain the previous user state.
       */

      const currentUser = await getUserProfile();

      if (!currentUser?.sellerProfile) {
        setError(t("profileCreatedRefreshFailed"));

        return;
      }

      router.replace("/seller/dashboard");
    },

    onError: (error: API_ERROR) => {
      toast.error(error.response?.data?.message ?? t("somethingWentWrong"));
    },
  });

  const handleContinue = () => {
    setError("");

    if (!form.businessType) {
      setError(t("selectBusinessTypeError"));

      return;
    }

    setStep(2);
  };

  const handleSubmit = () => {
    setError("");

    if (!form.state || !form.district || !form.village) {
      setError(t("selectCompleteLocationError"));

      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError(t("invalidPincodeError"));

      return;
    }

    applyForSellerMutation.mutate();
  };

  return (
    <main
      className="
        min-h-[calc(100vh-72px)]
        bg-[#fffaf0]
        px-4
        pt-8 pb-22 lg:pt-8 lg:pb-8

        sm:px-6

        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
        "
      >
        <div className="text-center">
          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-[#17201a]

              sm:text-4xl
            "
          >
            {t("title")}
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-[#536157]

              sm:text-base
            "
          >
            {t("subtitle")}
          </p>
        </div>

        <SellerStepper step={step} />

        <div
          className="
            mt-8
            grid
            gap-8

            lg:grid-cols-[minmax(0,1fr)_300px]
          "
        >
          <section
            className="
              rounded-2xl
              border
              border-[#e7d8b9]
              bg-white
              p-5
              shadow-sm

              sm:p-7
            "
          >
            {error && (
              <div
                className="
                  mb-4
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {step === 1 ? (
              <SellerDetailsStep
                form={form}
                setForm={setForm}
                onContinue={handleContinue}
              />
            ) : (
              <SellerLocationStep
                form={form}
                setForm={setForm}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
                isSellerProfile={Boolean(user?.sellerProfile)}
                isSubmitting={applyForSellerMutation.isPending}
              />
            )}
          </section>

          <SellerBenefits />
        </div>
      </div>
    </main>
  );
}

function SellerStepper({ step }: { step: 1 | 2 }) {
  const t = useTranslations("BecomeSeller");

  return (
    <div
      className="
        mx-auto
        mt-6
        flex
        max-w-xs
        items-start
        justify-center
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          w-20
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-[#159447]
            font-bold
            text-white
          "
        >
          1
        </div>

        <span
          className="
            mt-2
            text-xs
            font-semibold
            text-[#159447]
          "
        >
          {t("sellerDetails")}
        </span>
      </div>

      <div
        className={`
          mt-5
          h-0.5
          w-20

          sm:w-28

          ${step === 2 ? "bg-[#159447]" : "bg-[#d9dedb]"}
        `}
      />

      <div
        className="
          flex
          flex-col
          items-center
          w-20
        "
      >
        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            font-bold

            ${
              step === 2
                ? "bg-[#159447] text-white"
                : "bg-[#edf0ee] text-[#536157]"
            }
          `}
        >
          2
        </div>

        <span
          className={`
            mt-2
            text-xs
            font-semibold

            ${step === 2 ? "text-[#159447]" : "text-[#536157]"}
          `}
        >
          {t("location")}
        </span>
      </div>
    </div>
  );
}

function SellerBenefits() {
  const t = useTranslations("BecomeSeller");

  return (
    <aside
      className="
        self-start
        rounded-2xl
        border
        border-[#e7d8b9]
        bg-white
        p-6

        lg:sticky
        lg:top-24
      "
    >
      <div
        className="
          mb-5
          flex
          h-32
          items-center
          justify-center
          rounded-2xl
          bg-[#edf8ef]
          text-6xl
        "
      >
        👨‍🌾
      </div>

      <h2
        className="
          text-xl
          font-extrabold
          text-[#17201a]
        "
      >
        {t("whySellTitle")}
      </h2>

      <div
        className="
          mt-5
          space-y-4
        "
      >
        <Benefit>🌱 {t("reachMoreBuyers")}</Benefit>

        <Benefit><span className="border p-0.5 rounded-2xl">₹</span> {t("getBetterPrice")}</Benefit>

        <Benefit>🤝 {t("connectDirectly")}</Benefit>

        <Benefit>📈 {t("growYourBusiness")}</Benefit>

        <Benefit>❤️ {t("supportLocalCommunities")}</Benefit>
      </div>

      <div
        className="
          mt-6
          rounded-xl
          bg-[#edf8ef]
          p-4
          text-sm
          font-semibold
          leading-6
          text-[#107a3a]
        "
      >
        {t("communityMessage")}
      </div>
    </aside>
  );
}

function Benefit({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        text-sm
        font-medium
        text-[#536157]
      "
    >
      {children}
    </div>
  );
}
