import axiosInstance from "@/lib/axios";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function getPushPermission() {
  if (typeof Notification === "undefined") {
    return "unsupported";
  }

  return Notification.permission;
}

export async function enablePushNotifications() {
  if (!isPushSupported()) {
    return {
      success: false,
      reason: "unsupported",
    } as const;
  }

  if (!VAPID_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing");
  }

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    return {
      success: false,
      reason: "permission-denied",
    } as const;
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,

      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  await axiosInstance.post("/push/subscribe", subscription.toJSON());

  return {
    success: true,
    subscription,
  } as const;
}

export async function disablePushNotifications() {
  if (!isPushSupported()) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return;
  }

  const endpoint = subscription.endpoint;

  await axiosInstance.delete("/push/unsubscribe", {
    data: {
      endpoint,
    },
  });

  await subscription.unsubscribe();
}

// export async function getPushStatus() {
//   if (!isPushSupported()) {
//     return {
//       supported: false,
//       permission: "unsupported" as const,
//       subscribed: false,
//     };
//   }

//   const permission = Notification.permission;

//   if (permission !== "granted") {
//     return {
//       supported: true,
//       permission,
//       subscribed: false,
//     };
//   }

//   const registration = await navigator.serviceWorker.ready;

//   const subscription = await registration.pushManager.getSubscription();

//   return {
//     supported: true,
//     permission,
//     subscribed: Boolean(subscription),
//   };
// }

export async function getPushStatus() {
  if (!isPushSupported()) {
    return {
      supported: false,
      permission: "unsupported" as const,
      browserSubscribed: false,
      backendSubscribed: false,
      enabled: false,
    };
  }

  const permission = Notification.permission;

  if (permission !== "granted") {
    return {
      supported: true,
      permission,
      browserSubscribed: false,
      backendSubscribed: false,
      enabled: false,
    };
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return {
      supported: true,
      permission,
      browserSubscribed: false,
      backendSubscribed: false,
      enabled: false,
    };
  }

  const response = await axiosInstance.post("/push/status", {
    endpoint: subscription.endpoint,
  });

  const backendSubscribed = Boolean(response.data?.data?.subscribed);

  // Add it here
  if (!backendSubscribed) {
    await axiosInstance.post("/push/subscribe", subscription.toJSON());

    return {
      supported: true,
      permission,
      browserSubscribed: true,
      backendSubscribed: true,
      enabled: true,
    };
  }

  // Normal success path
  return {
    supported: true,
    permission,
    browserSubscribed: true,
    backendSubscribed: true,
    enabled: true,
  };
}
