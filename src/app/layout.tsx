import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";

import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import Msg91Provider from "@/providers/MSG91Provider";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import InstallSasyarthSheet from "@/providers/InstallSasyarthSheet";
import { PwaInstallProvider } from "@/providers/PwaInstallProvider";

export const metadata: Metadata = {
  title: {
    default: "Sasyarth",
    template: "%s | Sasyarth",
  },

  description: "Discover trusted local sellers and fresh produce near you.",

  applicationName: "Sasyarth",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sasyarth",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#159447",

  width: "device-width",

  initialScale: 1,

  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider>
          <QueryProvider>
            <PwaInstallProvider>
              <ServiceWorkerRegistration />

              <Msg91Provider />

              <AuthProvider>
                <Navbar />

                {children}
              </AuthProvider>

              <InstallSasyarthSheet />
            </PwaInstallProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
