import Dropdown from "@/components/ui/Dropdown";
import { unitOptions } from "@/constants/vegetable.constants";
import { InventoryItemRowProps, UnitType } from "@/types/inventory.types";
import { VegetableResponse } from "@/types/vegetable.types";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { useLocale } from "next-intl";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";

export default function InventoryItemRow({
  index,
  item,
  vegetables,
  canRemove,
  onChange,
  onRemove,
}: InventoryItemRowProps) {
  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const t = useTranslations("SellerInventory");

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

  return (
    <div className="rounded-2xl border border-[#e7d8b9] bg-[#fffdf8] p-4 sm:p-5 flex-1">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold text-[#17201a]">
          {t("vegetable")} {index + 1}
        </h3>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
            aria-label="Remove vegetable"
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
          <Dropdown
            options={vegetables}
            value={item.vegetableId}
            onChange={(value) => onChange(item.id, "vegetableId", value)}
            getOptionLabel={(vegetable) => vegetable.displayNames[currentLocale]}
            getOptionValue={(vegetable) => vegetable._id}
            getDisplayName={(vegetable) => vegetable.displayNames.hi ?? ""}
            placeholder="Select vegetable"
            searchable
            searchPlaceholder="Search vegetable..."
            filterOption={matchesVegetableSearch}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[#17201a]">
            {t("unit")}
          </label>

          <Dropdown
            options={unitOptions}
            value={item.unit}
            onChange={(value) => onChange(item.id, "unit", value as UnitType)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder="Select unit"
          />
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
              onChange(item.id, "availableQty", event.target.value)
            }
            required
            placeholder="20"
            className="h-11 w-full rounded-xl border border-[#d9c9aa] bg-white px-3 text-sm outline-none transition focus:border-[#159447]"
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
              onChange(item.id, "marketPrice", event.target.value)
            }
            required
            placeholder="38"
            className="h-11 w-full rounded-xl border border-[#d9c9aa] bg-white px-3 text-sm outline-none transition focus:border-[#159447]"
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
              onChange(item.id, "sellerPrice", event.target.value)
            }
            required
            placeholder="40"
            className="h-11 w-full rounded-xl border border-[#d9c9aa] bg-white px-3 text-sm outline-none transition focus:border-[#159447]"
          />
        </div>
      </div>
    </div>
  );
}
