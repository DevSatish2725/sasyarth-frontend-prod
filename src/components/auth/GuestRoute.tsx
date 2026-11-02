"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface GuestRouteProps {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const returnTo = searchParams.get("returnTo");

    if (user?.sellerProfile) {
      router.replace("/seller/dashboard");
    } else if (user && !user?.sellerProfile) {
      router.replace("/sellers");
    } else if (user && returnTo) {
      router.replace(returnTo ?? "/");
    }
  }, [isLoading, user, router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (user) {
    return null;
  }

  return children;
}
