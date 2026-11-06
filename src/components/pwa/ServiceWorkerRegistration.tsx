"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {

    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((_registration) => {})
      .catch((_error) => {});
  }, []);

  return null;
}
