"use client";

import { useCallback, useState } from "react";
import { Plus, Trash2, LoaderCircle } from "lucide-react";

import Dropdown from "@/components/ui/Dropdown";
import type {
  EditInventoryFormProps,
  InventoryFormItem,
  UnitType,
  UpdateInventoryPayload,
  UpdatePublishedInventoryPayload,
} from "@/types/inventory.types";
import { useTranslations } from "next-intl";
import { VegetableResponse } from "@/types/vegetable.types";

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

export default function EditDraftInventoryForm({
  inventory,
  vegetables,
  isSubmitting,
  onSubmitDraft,
  onSubmitPublished,
  onCancel,
}: EditInventoryFormProps) {
  const [items, setItems] = useState<InventoryFormItem[]>(
    inventory.items.map((item) => ({
      id: item._id,
      vegetableId: item.vegetableId._id,
      vegetableName: item.vegetableId.name,
      unit: item.unit,
      availableQty: String(item.availableQty),
      marketPrice: String(item.marketPrice),
      sellerPrice: String(item.sellerPrice),
      isNegotiable: item.isNegotiable,
    })),
  );

  const t = useTranslations("SellerInventory");
  const tc = useTranslations("Common");

  const matchesVegetableSearch = useCallback(
    (vegetable: VegetableResponse, search: string) => {
      const query = search.trim().toLocaleLowerCase();

      if (!query) {
        return true;
      }

      const searchableValues = [
        vegetable.name,
        vegetable.displayNames?.en,
        vegetable.displayNames?.hi,
        ...(vegetable.searchAliases ?? []),
      ];

      return searchableValues.some((value) =>
        value?.toLocaleLowerCase().includes(query),
      );
    },
    [],
  );

  const isPublished = inventory.status === "PUBLISHED";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (inventory.status === "PUBLISHED") {
      const payload: UpdatePublishedInventoryPayload = {
        items: items.map((item) => ({
          itemId: item.id,
          availableQty: Number(item.availableQty),
          marketPrice: Number(item.marketPrice),
          sellerPrice: Number(item.sellerPrice),
        })),
      };

      onSubmitPublished(payload);
      return;
    }

    const payload: UpdateInventoryPayload = {
      items: items.map((item) => ({
        vegetableId: item.vegetableId,
        unit: item.unit,
        availableQty: Number(item.availableQty),
        marketPrice: Number(item.marketPrice),
        sellerPrice: Number(item.sellerPrice),
      })),
    };

    onSubmitDraft(payload);
  }

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
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  const submitButtonText =
    inventory.status === "PUBLISHED"
      ? t("updateLiveInventory")
      : t("saveChanges");

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#e7d8b9] bg-white p-5 shadow-sm sm:p-6"
    >
      <div>
        <h2 className="text-xl font-extrabold text-[#17201a]">
          {t("editTodayInventory")}
        </h2>

        <p className="mt-1 text-sm text-[#536157]">
          {t("editTodayInventoryDescription")}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#e7d8b9] bg-[#fffdf8] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#17201a]">
                {t("vegetable")} {index + 1}
              </h3>
              {!isPublished && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#17201a]">
                  {t("vegetable")}
                </label>

                {isPublished ? (
                  <div className="flex h-11 items-center rounded-xl border border-[#e7d8b9] bg-[#f8f5ee] px-3 text-sm font-medium text-[#536157]">
                    {item.vegetableName}
                  </div>
                ) : (
                  <Dropdown
                    options={vegetables}
                    value={item.vegetableId}
                    onChange={(value) =>
                      handleItemChange(item.id, "vegetableId", value)
                    }
                    getOptionLabel={(vegetable) => vegetable.name}
                    getOptionValue={(vegetable) => vegetable._id}
                    getDisplayName={(vegetable) =>
                      vegetable.displayNames.hi ?? ""
                    }
                    placeholder="Select vegetable"
                    searchable
                    filterOption={matchesVegetableSearch}
                  />
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#17201a]">
                  {t("unit")}
                </label>
                {isPublished ? (
                  <div className="flex h-11 items-center rounded-xl border border-[#e7d8b9] bg-[#f8f5ee] px-3 text-sm font-medium text-[#536157]">
                    {item.unit}
                  </div>
                ) : (
                  <Dropdown
                    options={[
                      {
                        value: "KG",
                        label: "KG",
                      },
                      {
                        value: "PIECE",
                        label: "Piece",
                      },
                      {
                        value: "BUNDLE",
                        label: "Bundle",
                      },
                      {
                        value: "DOZEN",
                        label: "Dozen",
                      },
                    ]}
                    value={item.unit}
                    onChange={(value) =>
                      handleItemChange(item.id, "unit", value as UnitType)
                    }
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                  />
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#17201a]">
                  {t("availableQuantity")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.availableQty}
                  onChange={(event) =>
                    handleItemChange(
                      item.id,
                      "availableQty",
                      event.target.value,
                    )
                  }
                  required
                  className="h-11 w-full rounded-xl border border-[#d9c9aa] bg-white px-3 text-sm outline-none focus:border-[#159447]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#17201a]">
                  {t("marketPrice")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.marketPrice}
                  onChange={(event) =>
                    handleItemChange(item.id, "marketPrice", event.target.value)
                  }
                  required
                  className="h-11 w-full rounded-xl border border-[#d9c9aa] bg-white px-3 text-sm outline-none focus:border-[#159447]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#17201a]">
                  {t("sellerPrice")}
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.sellerPrice}
                  onChange={(event) =>
                    handleItemChange(item.id, "sellerPrice", event.target.value)
                  }
                  required
                  className="h-11 w-full rounded-xl border border-[#d9c9aa] bg-white px-3 text-sm outline-none focus:border-[#159447]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isPublished && (
        <button
          type="button"
          onClick={handleAddItem}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border border-[#159447] px-4 text-sm font-bold text-[#159447] hover:bg-[#edf8ef]"
        >
          <Plus className="h-4 w-4" />
          {t("addVegetable")}
        </button>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#e7d8b9] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-11 rounded-xl border border-[#d9c9aa] px-5 text-sm font-bold text-[#536157]"
        >
          {tc("cancel")}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#159447] px-5 text-sm font-bold text-white disabled:opacity-60"
        >
          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}

          {isSubmitting ? tc("saving") : submitButtonText}
        </button>
      </div>
    </form>
  );
}
