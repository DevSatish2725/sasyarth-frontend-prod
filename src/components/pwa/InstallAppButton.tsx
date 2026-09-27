"use client";

import {
  Download,
} from "lucide-react";

import { usePwaInstall } from "@/providers/PwaInstallProvider";

export default function InstallAppButton() {
  const {
    canInstall,
    isInstalled,
    openInstallSheet,
  } = usePwaInstall();

  if (
    isInstalled ||
    !canInstall
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={
        openInstallSheet
      }
      className="
        flex
        min-h-12
        w-full
        items-center
        gap-3
        rounded-xl
        border
        border-border
        bg-white
        px-4
        text-left
        transition

        active:scale-[0.99]
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-primary-light
          text-primary
        "
      >
        <Download className="h-5 w-5" />
      </div>

      <div>
        <p
          className="
            text-sm
            font-bold
            text-text-primary
          "
        >
          Install Sasyarth
        </p>

        <p
          className="
            mt-0.5
            text-xs
            text-text-secondary
          "
        >
          Add Sasyarth to your
          home screen
        </p>
      </div>
    </button>
  );
}