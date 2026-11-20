"use client";

import { useEffect, useState } from "react";
import { Bell} from "lucide-react";
import { enablePushNotifications } from "@/lib/pushNotifications";

interface NotificationPromptProps {
  userId: string;
  title: string;
  description: string;
}

const REMINDER_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days
const INITIAL_DELAY = 2500; // 2.5 seconds

export default function NotificationPrompt({
  userId,
  title,
  description
}: NotificationPromptProps) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    // Do not display the prompt if push notifications are unsupported.
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    // Browser permission has already been decided.
    if (Notification.permission !== "default") return;

    // Store the dismissal timestamp separately for each user.
    const storageKey = `push-prompt-dismissed-${userId}`;

    const dismissedAt = localStorage.getItem(storageKey);

    // Don't interrupt the user again within the reminder interval.
    if (dismissedAt && Date.now() - Number(dismissedAt) < REMINDER_INTERVAL) {
      return;
    }

    let cancelled = false;

    // Check whether this browser already has a push subscription.
    const checkSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.getSubscription();

        if (cancelled) return;

        // A subscription exists, so there is no need to ask again.
        if (subscription) return;

        // Give the user time to settle on the marketplace before asking.
        const timeout = window.setTimeout(() => {
          if (!cancelled) setVisible(true);
        }, INITIAL_DELAY);

        return () => window.clearTimeout(timeout);
      } catch (err) {
        console.error("Unable to check push subscription:", err);
      }
    };

    let timeoutId: number | undefined;

    const schedulePrompt = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;

        const subscription = await registration.pushManager.getSubscription();

        if (cancelled || subscription) return;

        timeoutId = window.setTimeout(() => {
          setVisible(true);
        }, INITIAL_DELAY);
      } catch (err) {
        console.error("Unable to check push subscription:", err);
      }
    };

    void checkSubscription();
    void schedulePrompt();

    return () => {
      cancelled = true;

      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [userId]);

  // Dismiss the prompt and remember when the user postponed enabling notifications.
  // const handleDismiss = () => {
  //   localStorage.setItem(
  //     `push-prompt-dismissed-${userId}`,
  //     Date.now().toString(),
  //   );

  //   setVisible(false);
  // };

  // Request permission and create or reuse the browser push subscription.
  const handleEnable = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await enablePushNotifications();

      if (result.success) {
        setVisible(false);
        localStorage.removeItem(`push-prompt-dismissed-${userId}`);
      } else if (result.reason === "permission-denied") {
        setVisible(false);
      } else if (result.reason === "unsupported") {
        setVisible(false);
      }
    } catch (err) {
      console.error("Failed to enable push notifications:", err);
      setError("Unable to enable notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-1000 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-prompt-title"
        className="relative w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        {/* Close button */}
        {/* <button
          type="button"
          onClick={handleDismiss}
          disabled={loading}
          aria-label="Close notification prompt"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button> */}

        {/* Notification illustration */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Bell size={30} className="text-green-700" />
        </div>

        <h2
          id="notification-prompt-title"
          className="text-center text-xl font-semibold text-gray-900"
        >
          {title}
        </h2>

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          {description}
        </p>

        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}

        {/* Enable notifications */}
        <button
          type="button"
          onClick={handleEnable}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enabling notifications..." : "Enable notifications"}
        </button>

        {/* Postpone notification permission request */}
        {/* <button
          type="button"
          onClick={handleDismiss}
          disabled={loading}
          className="mt-3 w-full rounded-xl px-4 py-3 font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-60"
        >
          Maybe later
        </button> */}
      </div>
    </div>
  );
}
