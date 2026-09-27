"use client";

import Script from "next/script";

interface Msg91Configuration {
  widgetId: string;
  tokenAuth: string;
  identifier?: string;
  exposeMethods: boolean;
  captchaRenderId?: string;

  success?: (
    data: Msg91VerifyOtpResponse,
  ) => void;

  failure?: (
    error: Msg91ErrorResponse,
  ) => void;
}

declare global {
  interface Window {
    initSendOTP?: (
      config: Msg91Configuration,
    ) => void;
  }
}

export default function Msg91Provider() {
  const initializeMsg91 = () => {
    if (!window.initSendOTP) {
      console.error(
        "MSG91 SDK not loaded",
      );

      return;
    }

    const widgetId =
      process.env
        .NEXT_PUBLIC_MSG91_WIDGET_ID;

    const tokenAuth =
      process.env
        .NEXT_PUBLIC_MSG91_WIDGET_TOKEN;

    if (!widgetId || !tokenAuth) {
      console.error(
        "MSG91 configuration missing",
      );

      return;
    }

    const configuration: Msg91Configuration = {
      widgetId,
      tokenAuth,

      exposeMethods: true,

      success: () => {
      },

      failure: (error) => {
        console.error(
          "MSG91 verification failed:",
          error,
        );
      },
    };

    window.initSendOTP(
      configuration,
    );
  };

  return (
    <Script
      src="https://verify.msg91.com/otp-provider.js"
      strategy="afterInteractive"
      onLoad={initializeMsg91}
    />
  );
}