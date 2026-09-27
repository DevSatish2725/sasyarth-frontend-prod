"use client";

import {
  ReactNode,
  useEffect,
} from "react";

import { X } from "lucide-react";

interface MobileFilterSheetProps {
  children: ReactNode;
  onClose: () => void;
}

export default function MobileFilterSheet({
  children,
  onClose,
}: MobileFilterSheetProps) {
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, []);

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        lg:hidden
      "
    >
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/35
          backdrop-blur-[1px]
        "
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Seller filters"
        className="
          absolute
          inset-x-0
          bottom-0
          flex
          max-h-[88dvh]
          flex-col
          rounded-t-[28px]
          bg-white
          shadow-2xl
        "
      >
        <div
          className="
            flex
            justify-center
            pb-1
            pt-2.5
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
            min-h-14
            items-center
            justify-between
            border-b
            border-border/70
            px-4
          "
        >
          <div>
            <h2
              className="
                text-base
                font-bold
                text-text-primary
              "
            >
              Search & filters
            </h2>

            <p
              className="
                text-xs
                text-text-secondary
              "
            >
              Find sellers near you
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-text-secondary

              active:bg-surface-muted
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            py-4
          "
        >
          {children}
        </div>
      </section>
    </div>
  );
}