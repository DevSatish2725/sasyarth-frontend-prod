"use client";

import { useState } from "react";
import Link from "next/link";

import { Check, ChevronDown, ChevronUp, Clock3, X } from "lucide-react";
import { useTranslations } from "next-intl";

type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

interface SellerApplicationStatusProps {
  status: VerificationStatus;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
}

export default function SellerApplicationStatus({
  status,
  rejectionReason,
  reviewedAt,
}: SellerApplicationStatusProps) {
  const [showReason, setShowReason] = useState(false);
  const t = useTranslations("SellerApplication");

  const isPending = status === "PENDING";

  const isVerified = status === "VERIFIED";

  const isRejected = status === "REJECTED";

  return (
    <section
      className="
        rounded-xl
        border
        border-border
        bg-white
        px-4
        py-3
        sm:px-5
      "
    >
      <div
        className="
          flex
          flex-col
          gap-3
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        <div className="shrink-0">
          <p className="text-sm font-bold text-text-primary">
            Seller Application
          </p>

          <p className="text-xs text-text-secondary">Verification progress</p>
        </div>

        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            lg:max-w-xl
          "
        >
          <CompactStep label="Submitted" state="completed" />

          <Connector active />

          <CompactStep
            label={isPending ? "Under Review" : "Reviewed"}
            state={isPending ? "current" : "completed"}
          />

          <Connector active={isVerified || isRejected} rejected={isRejected} />

          <CompactStep
            label={
              isVerified ? "Verified" : isRejected ? "Rejected" : "Decision"
            }
            state={
              isVerified ? "completed" : isRejected ? "rejected" : "upcoming"
            }
          />
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-2
          "
        >
          {isRejected && (
            <>
              <button
                type="button"
                onClick={() => setShowReason((previous) => !previous)}
                aria-expanded={showReason}
                className="
                  inline-flex
                  h-9
                  items-center
                  gap-1.5
                  rounded-lg
                  px-3
                  text-xs
                  font-bold
                  text-red-600
                  transition
                  hover:bg-red-50
                "
              >
                {t("viewReason")}
                {showReason ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              <Link
                href="/become-seller"
                className="
                  inline-flex
                  h-9
                  items-center
                  rounded-lg
                  bg-primary
                  px-3
                  text-xs
                  font-bold
                  text-white
                  transition
                  hover:bg-primary-hover
                "
              >
               {t("reapply")}
              </Link>
            </>
          )}

          {isPending && (
            <span
              className="
                rounded-full
                bg-amber-50
                px-3
                py-1.5
                text-xs
                font-semibold
                text-amber-700
              "
            >
              {t("underReview")}
            </span>
          )}
        </div>
      </div>

      {isRejected && showReason && (
        <div
          className="
              mt-3
              flex
              flex-col
              gap-1
              rounded-lg
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
        >
          <div>
            <p className="text-xs font-bold text-red-700">{t("rejectionReason")}</p>

            <p className="mt-0.5 text-sm text-red-700">
              {rejectionReason || "No rejection reason was provided."}
            </p>
          </div>

          {reviewedAt && (
            <p className="shrink-0 text-xs text-red-500">
             {t("reviewed")}
              {new Date(reviewedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

type StepState = "completed" | "current" | "upcoming" | "rejected";

function CompactStep({ label, state }: { label: string; state: StepState }) {
  const circleClass = {
    completed: "border-primary bg-primary text-white",

    current: "border-amber-400 bg-amber-50 text-amber-600",

    upcoming: "border-border bg-surface-muted text-text-muted",

    rejected: "border-red-400 bg-red-50 text-red-600",
  }[state];

  const labelClass = {
    completed: "text-text-primary",

    current: "text-amber-700",

    upcoming: "text-text-muted",

    rejected: "text-red-600",
  }[state];

  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-1.5
      "
    >
      <span
        className={`
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${circleClass}
        `}
      >
        {state === "rejected" ? (
          <X className="h-3.5 w-3.5" />
        ) : state === "current" ? (
          <Clock3 className="h-3.5 w-3.5" />
        ) : state === "completed" ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </span>

      <span
        className={`
          hidden
          whitespace-nowrap
          text-xs
          font-semibold
          sm:block
          ${labelClass}
        `}
      >
        {label}
      </span>
    </div>
  );
}

function Connector({
  active,
  rejected = false,
}: {
  active: boolean;
  rejected?: boolean;
}) {
  return (
    <div
      className={`
        mx-2
        h-px
        min-w-4
        flex-1

        ${rejected ? "bg-red-300" : active ? "bg-primary" : "bg-border"}
      `}
    />
  );
}
