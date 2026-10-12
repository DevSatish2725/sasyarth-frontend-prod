"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const INSTALL_DISMISSED_KEY = "sasyarth-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];

  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt: () => Promise<void>;
}

interface PwaInstallContextValue {
  canInstall: boolean;
  canNativeInstall: boolean;

  isInstalled: boolean;
  isIOS: boolean;
  isStandalone: boolean;

  showInstallSheet: boolean;

  openInstallSheet: () => void;
  closeInstallSheet: () => void;

  installApp: () => Promise<void>;
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

function detectIOS() {
  if (typeof navigator === "undefined") {
    return false;
  }

  const userAgent = navigator.userAgent;

  const ios =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  return ios;
}
function detectStandalone() {
  if (typeof window === "undefined") {
    return false;
  }

  const mediaStandalone = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const iosStandalone = Boolean(
    (
      window.navigator as Navigator & {
        standalone?: boolean;
      }
    ).standalone,
  );

  return mediaStandalone || iosStandalone;
}

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showInstallSheet, setShowInstallSheet] = useState(false);

  const [isInstalled, setIsInstalled] = useState(false);

  const installTimerRef = useRef<number | null>(null);

  const isIOS = useMemo(() => detectIOS(), []);

  const openInstallSheet = useCallback(() => {
    setShowInstallSheet(true);
  }, []);

  const closeInstallSheet = useCallback(() => {
    localStorage.setItem(INSTALL_DISMISSED_KEY, Date.now().toString());

    if (installTimerRef.current) {
      window.clearTimeout(installTimerRef.current);

      installTimerRef.current = null;
    }

    setShowInstallSheet(false);
  }, []);

  const isStandalone = useMemo(
    () => isInstalled || detectStandalone(),
    [isInstalled],
  );

  useEffect(() => {
    installTimerRef.current = null;
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      const installEvent = event as BeforeInstallPromptEvent;

      setDeferredPrompt(installEvent);

      const dismissedAt = localStorage.getItem(INSTALL_DISMISSED_KEY);

      const dismissedTimestamp = dismissedAt ? Number(dismissedAt) : 0;

      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      const dismissedRecently =
        Number.isFinite(dismissedTimestamp) &&
        dismissedTimestamp > 0 &&
        Date.now() - dismissedTimestamp < sevenDays;

      if (dismissedRecently) {
        return;
      }

      installTimerRef.current = window.setTimeout(() => {
        setShowInstallSheet(true);
      }, 5000);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallSheet(false);
      setIsInstalled(true);

      localStorage.setItem("sasyarth-pwa-installed", "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener("appinstalled", handleAppInstalled);

      if (installTimerRef.current !== null) {
        window.clearTimeout(installTimerRef.current);
      }
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setShowInstallSheet(false);
    }

    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const value = useMemo<PwaInstallContextValue>(
    () => ({
      canInstall: !isStandalone,

      canNativeInstall: Boolean(deferredPrompt),

      isInstalled: isStandalone,

      isIOS,

      isStandalone,

      showInstallSheet,

      openInstallSheet,

      closeInstallSheet,

      installApp,
    }),
    [
      deferredPrompt,
      isIOS,
      isStandalone,
      showInstallSheet,
      openInstallSheet,
      closeInstallSheet,
      installApp,
    ],
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall() {
  const context = useContext(PwaInstallContext);

  if (!context) {
    throw new Error("usePwaInstall must be used inside PwaInstallProvider.");
  }

  return context;
}
