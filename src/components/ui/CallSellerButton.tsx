"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Phone } from "lucide-react";
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
      flex
      justify-center
      items-center
      gap-2
        min-h-12 w-full rounded-xl
        bg-primary px-4 font-bold text-white
        hover:bg-primary-hover
        disabled:opacity-60
      "
    >
      {callSellerLoading ? (
        t("sellers.gettingCallDetails")
      ) : (
        <>
          <span>
            <Phone />
          </span>
          <span className="hidden lg:block">{`${t("sellers.call")}`}</span>
        </>
      )}
    </button>
  );
}
