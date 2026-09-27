"use client";

import { Plus, LoaderCircle } from "lucide-react";

import { useState } from "react";

import type {
  CreateInventoryPayload,
  InventoryFormItem,
  CreateInventoryFormProps,
} from "@/types/inventory.types";
import InventoryItemRow from "./InventoryItemRow";
import { useTranslations } from "next-intl";

function createEmptyItem(): InventoryFormItem {
  return {
    id: crypto.randomUUID(),

    vegetableId: "",

    vegetableName: "",

    unit: "KG",

    availableQty: "",

    marketPrice: "",

    sellerPrice: "",
  };
}

export default function CreateInventoryForm({
  vegetables,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: CreateInventoryFormProps) {
  const [items, setItems] = useState<InventoryFormItem[]>([createEmptyItem()]);

  const t = useTranslations("SellerInventory");
  const tc = useTranslations("Common");
  const td = useTranslations("SellerDashboard");

  function handleItemChange<K extends keyof InventoryFormItem>(
    id: string,
    field: K,
    value: InventoryFormItem[K],
  ) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  function handleAddItem() {
    setItems((currentItems) => [...currentItems, createEmptyItem()]);
  }

  function handleRemoveItem(id: string) {
    setItems((currentItems) => {
      if (currentItems.length === 1) {
        return currentItems;
      }

      return currentItems.filter((item) => item.id !== id);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: CreateInventoryPayload = {
      items: items.map((item) => ({
        vegetableId: item.vegetableId,

        unit: item.unit,

        availableQty: Number(item.availableQty),

        marketPrice: Number(item.marketPrice),

        sellerPrice: Number(item.sellerPrice),
      })),
    };

    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#e7d8b9] bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-[#17201a]">
          {t("createTodayInventory")}
        </h2>

        <p className="mt-1 text-sm text-[#536157]">
          {t("createTodayInventoryDescription")}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-6">
        {items.map((item, index) => (
          <InventoryItemRow
            key={item.id}
            index={index}
            item={item}
            vegetables={vegetables}
            canRemove={items.length > 1}
            onChange={handleItemChange}
            onRemove={handleRemoveItem}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-[#159447] px-4 text-sm font-bold text-[#159447] transition hover:bg-[#edf8ef]"
      >
        <Plus className="h-4 w-4" />
        {t("addAnotherVegetable")}
      </button>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e7d8b9] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 rounded-xl border border-[#d9c9aa] px-5 text-sm font-bold text-[#536157] transition hover:bg-[#fff8e9] disabled:opacity-50"
        >
          {tc("cancel")}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#159447] px-5 text-sm font-bold text-white transition hover:bg-[#107a3a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}

          {isSubmitting ? tc("creating") : td("inventory.create")}
        </button>
      </div>
    </form>
  );
}
