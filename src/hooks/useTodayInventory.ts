import { useQuery } from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory.service";
import type { Inventory } from "@/types/inventory.types";

export function useTodayInventory(isVerified: boolean) {
  return useQuery<Inventory>({
    queryKey: ["seller", "inventory", "today"],

    queryFn: () => inventoryService.getTodayInventory(),
    enabled: isVerified,
  });
}
