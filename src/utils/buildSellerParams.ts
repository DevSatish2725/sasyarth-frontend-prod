import { SearchLocation } from "@/types/location.types";

export function buildSellerParams({
  searchLocation,
  vegetableIds,
  cursor,
}: {
  searchLocation: SearchLocation | null;
  vegetableIds: string[];
  cursor?: string;
}) {
  const commonParams = {
    vegetableIds,
    cursor,
    limit: 1,
  };

  if (!searchLocation) {
    return {
      ...commonParams,
    };
  }

  if (searchLocation.mode === "CURRENT") {
    return {
      ...commonParams,
      latitude: searchLocation.latitude,
      longitude: searchLocation.longitude,
      radiusInKm: 20,
    };
  }

  return {
    ...commonParams,
    // scope: "state" as const,
    stateId: searchLocation.stateId,
    districtId: searchLocation.districtId,
    blockId: searchLocation.blockId,
    villageId: searchLocation.villageId,
    maujaId: searchLocation.maujaId,
    habitationId: searchLocation.habitationId,
  };
}
