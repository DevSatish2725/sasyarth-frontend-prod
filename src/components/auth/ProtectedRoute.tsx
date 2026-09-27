"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;

  requireSeller?: boolean;

  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireSeller = false,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    user,
    isLoading,
  } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (
      requireSeller &&
      !user.sellerProfile
    ) {
      router.replace("/become-seller");
    }
  }, [
    isLoading,
    user,
    requireSeller,
    redirectTo,
    router,
  ]);

  if (isLoading) {
    return (
      <div
        className="
          flex
          min-h-[60vh]
          items-center
          justify-center
        "
      >
        <p className="text-text-secondary">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (
    requireSeller &&
    !user.sellerProfile
  ) {
    return null;
  }

  return children;
}