import Image from "next/image";
import { useTranslations } from "next-intl";

import type { InventoryItem } from "@/types/inventory.types";

export default function InventoryItemCard({ item }: { item: InventoryItem }) {
  const t = useTranslations("SellerInventory");

  const vegetable = item.vegetableId;

  return (
    <article
      className="
        overflow-hidden rounded-2xl
        border border-[#e7d8b9]
        bg-white
        transition-shadow
        hover:shadow-sm
      "
    >
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div
          className="
            relative h-20 w-20 shrink-0
            overflow-hidden rounded-xl
            border border-[#e4eadf]
            sm:h-24 sm:w-24
          "
        >
          <Image
            src={vegetable.imageUrl || "/images/vegetables/default.webp"}
            alt={vegetable.name}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="
                object-contain
                p-2
                transition-transform
                duration-300
                group-hover:scale-[1.03]
              "
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#7a857d]">{t("vegetable")}</p>

          <h3
            className="
              mt-0.5 truncate
              text-base font-bold
              text-[#17201a]
              sm:text-lg
            "
          >
            {vegetable.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#159447]">
              ₹{item.sellerPrice}
            </span>

            <span className="text-xs text-[#7a857d]">/ {item.unit}</span>
          </div>

          <div
            className="
              mt-2 flex flex-wrap
              items-center gap-x-4 gap-y-1
              text-xs sm:text-sm
            "
          >
            <span className="text-[#536157]">
              {t("available")}:{" "}
              <strong className="font-semibold text-[#17201a]">
                {item.availableQty} {item.unit}
              </strong>
            </span>

            {item.marketPrice != null && (
              <span className="text-[#7a857d]">
                {t("market")}: ₹{item.marketPrice}/{item.unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
