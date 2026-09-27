"use client";

import { MapPin, Package, Store, UserRound } from "lucide-react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/providers/AuthProvider";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { useTodayInventory } from "@/hooks/useTodayInventory";
import SellerApplicationStatus from "@/components/seller/SellerApplicationStatus";
import SellerApplicationStatusBadge from "@/components/seller/SellerApllicationStatusBadge";
import { useTranslations } from "next-intl";

export default function SellerDashboardPage() {
  return (
    <ProtectedRoute requireSeller>
      <SellerDashboard />
    </ProtectedRoute>
  );
}

function SellerDashboard() {
  const { user } = useAuth();

  const hasSellerProfile = Boolean(user?.sellerProfile);

  const verificationStatus = user?.sellerProfile?.verificationStatus;

  const isPendingSeller = verificationStatus === "PENDING";

  const isVerifiedSeller = verificationStatus === "VERIFIED";

  const isSellerRejected = verificationStatus === "REJECTED";
  const todayInventory = useTodayInventory(isVerifiedSeller);
  const t = useTranslations("SellerDashboard");

  return (
    <main className="min-h-screen bg-[#fff8e9] px-4 pt-8 pb-22 lg:pt-8 lg:pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-primary">{t("title")}</p>

            {isVerifiedSeller && (
              <SellerApplicationStatusBadge status={t("verified")} />
            )}
          </div>

          <h1 className="mt-1 text-3xl font-extrabold text-[#17201a]">
            {t("greeting", { name: user?.fullName ?? "" })}
          </h1>

          {hasSellerProfile && !isVerifiedSeller && (
            <div className="mt-7">
              <SellerApplicationStatus
                status={verificationStatus ? verificationStatus : "PENDING"}
                rejectionReason={user?.sellerProfile?.rejectionReason}
                reviewedAt={user?.sellerProfile?.reviewedAt}
              />
            </div>
          )}
          <p className="mt-4 text-[#536157]">{t("subtitle")}</p>
        </section>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            icon={<Package className="h-6 w-6" />}
            title={t("inventory.title")}
            description={
              isPendingSeller
                ? t("inventory.inventoryAvailableAfterVerification")
                : isSellerRejected
                  ? t("inventory.inventoryUnavailableRejected")
                  : todayInventory?.data
                    ? `${todayInventory?.data?.items.length} vegetables listed today . ${todayInventory?.data?.status}`
                    : t("inventory.empty")
            }
            href={isVerifiedSeller ? "/seller/inventory" : "/seller/dashboard"}
            action={
              isPendingSeller
                ? t("inventory.verificationPending")
                : isSellerRejected
                  ? t("inventory.unavailable")
                  : todayInventory?.data
                    ? t("inventory.manageInventory")
                    : t("inventory.create")
            }
            disabled={!isVerifiedSeller}
          />

          <DashboardCard
            icon={<Store className="h-6 w-6" />}
            title={t("shop.title")}
            description={
              !isVerifiedSeller
                ? t("shop.shopAvailableAfterVerification")
                : !todayInventory?.data
                  ? t("shop.empty")
                  : todayInventory?.data?.status !== "PUBLISHED"
                    ? t("shop.viewShopAsBuyer")
                    : t("shop.viewShopAsBuyer")
            }
            href={
              isVerifiedSeller && todayInventory?.data?.status === "PUBLISHED"
                ? `/sellers/${user?.sellerProfile?.sellerId}`
                : ""
            }
            action={
              !isVerifiedSeller
                ? t("inventory.unavailable")
                : todayInventory?.data?.status === "PUBLISHED"
                  ? t("shop.viewShop")
                  : t("inventory.unavailable")
            }
            disabled={
              !isVerifiedSeller ||
              (todayInventory?.data?.status &&
                todayInventory.data.status !== "PUBLISHED")
            }
          />

          <DashboardCard
            icon={<UserRound className="h-6 w-6" />}
            title={t("profile.title")}
            description={t("profile.description")}
            href="/profile"
            action={t("profile.edit")}
            disabled={false}
          />
        </div>

        <section className="mt-8 rounded-2xl border border-[#e7d8b9] bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf8ef] text-[#159447]">
              <MapPin className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#17201a]">
                {t("inventoryReminder.title")}
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#536157]">
                {t("inventoryReminder.description")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
