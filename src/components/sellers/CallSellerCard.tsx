"use client";

import { Phone, X, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface CallSellerCardProps {
  sellerName: string;
  mobileNumber: string;

  location?: {
    village?: string;
    district?: string;
    state?: string;
  };

  onClose: () => void;
}

export default function CallSellerCard({
  sellerName,
  mobileNumber,
  location,
  onClose,
}: CallSellerCardProps) {
  const t = useTranslations("CallSeller");
  const tc = useTranslations("Common");

  const locationText = [location?.village, location?.district, location?.state]
    .filter(Boolean)
    .join(", ");

  const handleCall = () => {
    window.location.href = `tel:${mobileNumber}`;
  };

  return (
    <div
      className="
         fixed
    inset-0
    z-50
    flex
    items-end
    justify-center
    bg-black/40

    sm:items-center
    sm:p-4
      "
    >
      <div
        className="
         w-full
      rounded-t-[28px]
      bg-surface
      px-4
      pb-[calc(16px+env(safe-area-inset-bottom))]
      pt-2
      shadow-2xl

      sm:max-w-md
      sm:rounded-2xl
      sm:p-5
        "
      >
        <div
          className="
        mb-2
        flex
        justify-center

        sm:hidden
      "
        >
          <span
            className="
          h-1
          w-10
          rounded-full
          bg-border
        "
          />
        </div>

        <div
          className="
          flex
          items-start
          justify-between
          gap-3
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
          "
          >
            <div
              className="
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
              <Phone className="h-5 w-5" />
            </div>

            <div>
              <h2
                className="
                text-lg
                font-bold
                text-text-primary
              "
              >
                {t("callSeller")}
              </h2>

              <p
                className="
                text-sm
                text-text-secondary
              "
              >
                {t("contactSellerDirectly")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-text-muted
            transition
            hover:bg-surface-muted
          "
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="
          mt-5
          rounded-xl
          bg-surface-muted
          p-4
        "
        >
          <p
            className="
            font-bold
            text-text-primary
          "
          >
            {sellerName}
          </p>

          {locationText && (
            <div
              className="
              mt-1
              flex
              items-center
              gap-1.5
              text-sm
              text-text-secondary
            "
            >
              <MapPin className="h-4 w-4" />

              <span>{locationText}</span>
            </div>
          )}
        </div>

        <div className="mt-5">
          <p
            className="
            text-xs
            font-semibold
            uppercase
            tracking-wide
            text-text-muted
          "
          >
            {t("contactNumber")}
          </p>

          <a
            href={`tel:${mobileNumber}`}
            className="
    mt-1
    block
    text-2xl
    font-extrabold
    tracking-wide
    text-primary
  "
          >
            {mobileNumber}
          </a>
        </div>

        <div
          className="
          mt-4
          rounded-xl
          border border-accent/30
          bg-accent-light
          p-3
        "
        >
          <p
            className="
            text-sm
            leading-5
            text-text-secondary
          "
          >
            {t("contactNote")}
          </p>
        </div>

        <div
          className="
          mt-5
          grid
          grid-cols-2
          gap-3
        "
        >
          <button
            type="button"
            onClick={onClose}
            className="
            min-h-12
            rounded-xl
            border border-border
            bg-white
            px-4
            text-sm
            font-bold
            text-text-primary
            transition
            hover:bg-surface-muted
          "
          >
            {tc("cancel")}
          </button>

          <button
            type="button"
            onClick={handleCall}
            className="
            flex
            min-h-12
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-4
            text-sm
            font-bold
            text-white
            transition
            hover:bg-primary-hover
          "
          >
            <Phone className="h-5 w-5" />
            {t("callNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
