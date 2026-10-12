"use client";

import { useEffect, useState } from "react";

import {
  disablePushNotifications,
  enablePushNotifications,
  getPushStatus,
} from "@/lib/pushNotifications";
import { useTranslations } from "next-intl";

type NotificationStatus =
  | "loading"
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

interface Props {
  onStatusChange?: (status: boolean) => void;
}

export default function NotificationPermissionButton({
  onStatusChange,
}: Props) {
  const [status, setStatus] = useState<NotificationStatus>("loading");

  const [loading, setLoading] = useState(false);
  const t = useTranslations("Notifications");

  useEffect(() => {
    let cancelled = false;

    const loadPushStatus = async () => {
      const pushStatus = await getPushStatus();

      if (cancelled) {
        return;
      }

      if (!pushStatus.supported) {
        setStatus("unsupported");
        onStatusChange!(false);
        return;
      }

      if (pushStatus.permission === "denied") {
        setStatus("denied");
        onStatusChange!(false);
        return;
      }

      if (pushStatus.enabled) {
        setStatus("granted");
        onStatusChange!(true);

        return;
      }
      setStatus("default");
      onStatusChange!(false);
    };

    void loadPushStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEnable = async () => {
    try {
      setLoading(true);
      const result = await enablePushNotifications();
      if (result.success) {
        setStatus("granted");
        onStatusChange!(true);
        return;
      }
      if (result.reason === "unsupported") {
        setStatus("unsupported");
        onStatusChange!(false);
        return;
      }

      setStatus(Notification.permission);
    } catch (error) {
      console.error("Failed to enable notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);

      await disablePushNotifications();

      /**
       * Browser permission remains
       * "granted".
       *
       * We only unsubscribe this app.
       */
      setStatus("default");
      onStatusChange!(false);
    } catch (error) {
      console.error("Failed to disable notifications", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return null;
  }

  if (status === "unsupported") {
    return <p>Push notifications are not supported on this device.</p>;
  }

  if (status === "denied") {
    return <p>Notifications are blocked in your browser settings.</p>;
  }

  if (status === "granted") {
    return (
      <button type="button" disabled={loading} onClick={handleDisable}>
        {loading ? t("disabling") : t("disable")}
      </button>
    );
  }

  return (
    <button type="button" disabled={loading} onClick={handleEnable}>
      {loading ? t("enabling") : t("enable")}
    </button>
  );
}
