import type { InventoryDetailsProps } from "@/types/inventory.types";
import InventoryItemCard from "./InventoryItemCard";
import InventoryStatusBadge from "./InventoryStatusBadge";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useTranslations } from "next-intl";
import { Pencil, Send, PackageCheck } from "lucide-react";

export default function InventoryDetails({
  inventory,
  onEdit,
  onPublish,
  isPublishing,
  publishError,
}: InventoryDetailsProps) {
  const t = useTranslations("SellerInventory");

  const canEdit =
    inventory.status === "DRAFT" || inventory.status === "PUBLISHED";

  const publishErrorMessage = publishError
    ? getErrorMessage(publishError)
    : null;

  const itemCount = inventory.items.length;

  return (
    <section className="mt-6 sm:mt-8">
      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-border
          bg-surface
          shadow-sm
        "
      >
        <div
          className="
            flex flex-col
            gap-5
            p-4
            sm:p-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-primary-light
                  text-primary
                "
              >
                <PackageCheck size={20} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    className="
                      text-lg font-extrabold
                      text-text-primary
                      sm:text-xl
                    "
                  >
                    {t("inventory")}
                  </h2>

                  <InventoryStatusBadge status={inventory.status} />
                </div>

                <p className="mt-0.5 text-sm text-text-secondary">
                  {itemCount === 1
                    ? t("vegetableListedToday", { count: itemCount })
                    : t("vegetablesListedToday", { count: itemCount })}
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              flex 
              w-full
              flex-col
              lg:flex-row
              gap-2.5
              md:w-auto
              md:shrink-0
            "
          >
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="
                  inline-flex min-h-12
                  flex-1 items-center justify-center
                  gap-2
                  rounded-xl
                  border border-primary
                  px-4
                  text-sm font-bold
                  text-primary
                  transition
                  hover:bg-primary-light
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  focus-visible:ring-offset-2
                  md:flex-none
                "
              >
                <Pencil size={16} />
                {t("editInventory")}
              </button>
            )}

            {inventory.status === "DRAFT" && (
              <button
                type="button"
                onClick={onPublish}
                disabled={isPublishing}
                className="
                  inline-flex min-h-12
                  flex-1 items-center justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-5
                  text-sm font-bold
                  text-white
                  transition
                  hover:bg-primary-hover
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary
                  focus-visible:ring-offset-2
                  md:flex-none
                "
              >
                <Send size={16} />

                {isPublishing
                  ? t("publishing")
                  : t("publishInventory")}
              </button>
            )}
          </div>
        </div>

        {inventory.status === "PUBLISHED" && (
          <div
            className="
              border-t border-border
              bg-primary-light/50
              px-4 py-2.5
              sm:px-5
            "
          >
            <p className="text-xs font-medium text-primary sm:text-sm">
              {t("publishedInventoryHint")}
            </p>
          </div>
        )}
      </div>

      {publishErrorMessage && (
        <div
          role="alert"
          className="
            mt-4
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
          "
        >
          <p className="text-sm font-semibold text-red-700">
            {publishErrorMessage}
          </p>

          <p className="mt-1 text-xs text-red-600">
            {t("editBeforePublishing")}
          </p>
        </div>
      )}

      {itemCount > 0 ? (
        <div
          className="
            mt-4
            grid grid-cols-1
            gap-3
            md:grid-cols-2
            xl:gap-4
          "
        >
          {inventory.items.map((item) => (
            <InventoryItemCard
              key={item._id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div
          className="
            mt-4
            rounded-2xl
            border border-dashed border-border
            bg-surface
            px-5 py-10
            text-center
          "
        >
          <PackageCheck
            size={28}
            className="mx-auto text-text-secondary"
          />

          <p className="mt-3 font-bold text-text-primary">
            {t("noVegetables")}
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            {t("noVegetablesDescription")}
          </p>
        </div>
      )}
    </section>
  );
}