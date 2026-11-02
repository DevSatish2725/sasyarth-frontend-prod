import { NoInventoryProps } from "@/types/inventory.types";
import axios from "axios";
import { Package, Plus, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NoInventory({
  onCreateFresh,
  onCopyYesterday,
  isCopying,
  copyError,
}: NoInventoryProps) {
  const t = useTranslations("SellerInventory");
  const noYesterdayInventory =
    axios.isAxiosError(copyError) && copyError.response?.status === 404;

  return (
    <section className="mt-8 rounded-2xl border border-[#e7d8b9] bg-white p-6 sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf8ef] text-[#159447]">
          <Package className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-xl font-extrabold text-[#17201a]">
          {t("empty.title")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#536157]">
          {t("empty.description")}
        </p>

        {noYesterdayInventory && (
          <p className="mt-4 rounded-xl bg-[#fff3dc] px-4 py-3 text-sm font-medium text-[#a85f00]">
            {t("empty.yesterdayInventoryNotFound")}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCreateFresh}
            disabled={isCopying}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#159447] px-5 text-sm font-bold text-white transition hover:bg-[#107a3a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {t("empty.createFresh")}
          </button>

          <button
            type="button"
            onClick={onCopyYesterday}
            disabled={isCopying}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#159447] px-5 text-sm font-bold text-[#159447] transition hover:bg-[#edf8ef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className="h-4 w-4" />

            {isCopying ? t("empty.copying") : t("empty.copyYesterday")}
          </button>
        </div>
      </div>
    </section>
  );
}
