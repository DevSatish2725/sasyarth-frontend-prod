"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

import PageLoader from "@/components/ui/PageLoader";

import VerifiedSellerRoute from "@/components/auth/VerifiedSellerRoute";

import { useTodayInventory } from "@/hooks/useTodayInventory";
import NoInventory from "@/components/seller/inventory/NoInventory";
import InventoryDetails from "@/components/seller/inventory/InventoryDetails";
import InventoryError from "@/components/seller/inventory/InventoryError";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import { useState } from "react";
import CreateInventoryForm from "@/components/seller/inventory/CreateInventoryForm";
import { vegetableService } from "@/services/vegetable.service";
import { VegetableResponse } from "@/types/vegetable.types";
import {
  InventoryFormMode,
  UpdateInventoryPayload,
  UpdatePublishedInventoryPayload,
} from "@/types/inventory.types";
import EditDraftInventoryForm from "@/components/seller/inventory/EditInventoryForm";
import { API_ERROR } from "@/lib/axios";
import { useTranslations } from "next-intl";

export default function SellerInventoryPage() {
  return (
    <VerifiedSellerRoute>
      <SellerInventoryContent />
    </VerifiedSellerRoute>
  );
}

function SellerInventoryContent() {
  const [formMode, setFormMode] = useState<InventoryFormMode>(null);
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const t = useTranslations("SellerInventory");
  const tc = useTranslations("Common");

  const { data: vegetables = [], isLoading: isVegetablesLoading } = useQuery<
    VegetableResponse[]
  >({
    queryKey: ["vegetables"],
    queryFn: vegetableService.getVegetables,
  });

  const createFreshMutation = useMutation({
    mutationFn: inventoryService.createFreshInventory,

    onSuccess: (createdInventory) => {
      queryClient.setQueryData(
        ["seller", "inventory", "today"],
        createdInventory,
      );

      setFormMode(null);
    },
    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something got wrong.");
    },
  });

  const updateDraftMutation = useMutation({
    mutationFn: (payload: UpdateInventoryPayload) =>
      inventoryService.updateDraftInventory(inventory?._id ?? "", payload),

    onSuccess: (updatedInventory) => {
      queryClient.setQueryData(
        ["seller", "inventory", "today"],
        updatedInventory,
      );

      setFormMode(null);
    },

    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something got wrong.");
    },
  });

  const copyYesterdayMutation = useMutation({
    mutationFn: inventoryService.copyYesterdayInventory,

    onSuccess: (createdInventory) => {
      queryClient.setQueryData(
        ["seller", "inventory", "today"],
        createdInventory,
      );
    },
    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something got wrong.");
    },
  });

  const publishMutation = useMutation({
    mutationFn: inventoryService.publishInventory,

    onSuccess: (updatedInventory) => {
      queryClient.setQueryData(
        ["seller", "inventory", "today"],
        updatedInventory,
      );
    },
    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something got wrong.");
    },
  });

  const updatePublishedMutation = useMutation({
    mutationFn: (payload: UpdatePublishedInventoryPayload) =>
      inventoryService.updatePublishedInventory(inventory?._id ?? "", payload),

    onSuccess: (updatedInventory) => {
      queryClient.setQueryData(
        ["seller", "inventory", "today"],
        updatedInventory,
      );

      setFormMode(null);
    },
    onError: (error: API_ERROR) => {
      toast.error(error.response?.data.message || "Something got wrong.");
    },
  });

  const isVerifiedSeller =
    user?.sellerProfile?.verificationStatus === "VERIFIED";

  const {
    data: inventory,
    isLoading,
    isError,
  } = useTodayInventory(isVerifiedSeller);

  if (isLoading) {
    return <PageLoader message={t("loadingInventory")} />;
  }

  if (isError) {
    return <InventoryError />;
  }

  if (isVegetablesLoading) {
    return tc("loading");
  }

  function renderInventoryContent() {
    if (formMode === "CREATE") {
      return (
        <CreateInventoryForm
          vegetables={vegetables}
          isSubmitting={createFreshMutation.isPending}
          onCancel={() => setFormMode(null)}
          onSubmit={(payload) => createFreshMutation.mutate(payload)}
        />
      );
    }

    if (formMode === "EDIT" && inventory) {
      return (
        <EditDraftInventoryForm
          inventory={inventory}
          vegetables={vegetables}
          isSubmitting={
            updateDraftMutation.isPending || updatePublishedMutation.isPending
          }
          onCancel={() => setFormMode(null)}
          onSubmitDraft={(payload) => updateDraftMutation.mutate(payload)}
          onSubmitPublished={(payload) =>
            updatePublishedMutation.mutate(payload)
          }
        />
      );
    }

    if (inventory) {
      return (
        <InventoryDetails
          inventory={inventory}
          onEdit={() => setFormMode("EDIT")}
          onPublish={() => publishMutation.mutate(inventory._id)}
          isPublishing={publishMutation.isPending}
          publishError={publishMutation.error}
        />
      );
    }

    return (
      <NoInventory
        onCreateFresh={() => setFormMode("CREATE")}
        onCopyYesterday={() => copyYesterdayMutation.mutate()}
        isCopying={copyYesterdayMutation.isPending}
        copyError={copyYesterdayMutation.error}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#fff8e9] px-4 pt-8 pb-22 lg:pt-8 lg:pb-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/seller/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#536157] hover:text-[#159447]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToDashboard")}
        </Link>

        <div className="mt-2">
          <p className="text-sm font-semibold text-[#159447]">{t("eyebrow")}</p>

          <h1 className="mt-1 text-3xl font-extrabold text-[#17201a]">
            {t("title")}
          </h1>

          <p className="my-2 text-[#536157]">{t("subtitle")}</p>
        </div>
        {renderInventoryContent()}
      </div>
    </main>
  );
}
