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

  if (searchLocation.village) {
    return {
      ...commonParams,
      scope: "village" as const,
      state: searchLocation.state,
      district: searchLocation.district,
      village: searchLocation.village,
    };
  }

  if (searchLocation.district) {
    return {
      ...commonParams,
      scope: "district" as const,
      state: searchLocation.state,
      district: searchLocation.district,
    };
  }

  return {
    ...commonParams,
    scope: "state" as const,
    state: searchLocation.state,
  };
}
