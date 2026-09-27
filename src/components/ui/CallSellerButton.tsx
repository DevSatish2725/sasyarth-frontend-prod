"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";

interface CallSellerButtonProps {
  sellerId: string;
  isLoading: boolean;
  getCallSellerId: (sellerId: string) => void;
  guestCallModalOpen: () => void;
}

export default function CallSellerButton({
  sellerId,
  getCallSellerId,
  guestCallModalOpen,
  isLoading: callSellerLoading,
}: CallSellerButtonProps) {
  const { isAuthenticated, isLoading } = useAuth();

  const t = useTranslations("FindSellers");

  const handleCall = () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      guestCallModalOpen();
      return;
    }
    getCallSellerId(sellerId);
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleCall}
      className="
        min-h-12 w-full rounded-xl
        bg-primary px-4 font-bold text-white
        hover:bg-primary-hover
        disabled:opacity-60
      "
    >
      {callSellerLoading
        ? t("sellers.gettingCallDetails")
        : `📞 ${t("sellers.call")}`}
    </button>
  );
}
