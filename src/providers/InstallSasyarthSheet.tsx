"use client";

import { Download } from "lucide-react";

import { usePwaInstall } from "@/providers/PwaInstallProvider";

export default function InstallSasyarthSheet() {
  const {
    showInstallSheet,
    closeInstallSheet,
    installApp,
    canNativeInstall,
    isIOS,
    isInstalled,
  } = usePwaInstall();

  if (!showInstallSheet || isInstalled) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40">
      <div className="w-full rounded-t-3xl bg-white p-5">
        <h2 className="text-lg font-bold text-text-primary">
          Install Sasyarth
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          Add Sasyarth to your home screen for faster access.
        </p>

        {canNativeInstall && !isIOS && (
          <button
            type="button"
            onClick={installApp}
            className="
              mt-5
              flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-primary
              px-4
              font-semibold
              text-white
            "
          >
            <Download className="h-5 w-5" />
            Install
          </button>
        )}

        {!canNativeInstall && !isIOS && (
          <div
            className="
              mt-5
              rounded-xl
              bg-surface-muted
              p-4
              text-sm
              text-text-secondary
            "
          >
            Open your browser menu and choose
            <strong> Install Sasyarth </strong>
            or
            <strong> Install app</strong>.
          </div>
        )}

        {isIOS && (
          <div
            className="
              mt-5
              rounded-xl
              bg-surface-muted
              p-4
              text-sm
              text-text-secondary
            "
          >
            Tap the Share button in Safari, then choose
            <strong> Add to Home Screen</strong>.
          </div>
        )}

        <button
          type="button"
          onClick={closeInstallSheet}
          className="
            mt-3
            min-h-11
            w-full
            text-sm
            font-medium
            text-text-secondary
          "
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
