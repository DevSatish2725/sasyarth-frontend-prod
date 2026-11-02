import axiosInstance from "@/lib/axios";

import type {
  StateOption,
  DistrictOption,
  VillageOption,
} from "@/types/location.types";

interface DistrictSearchParams {
  stateId: string;
  search: string;
  limit?: number;
}

interface VillageSearchParams {
  districtId: string;
  search: string;
  limit?: number;
}

export const locationService = {
  async getStates(): Promise<StateOption[]> {
    const response = await axiosInstance.get("/locations/states");

    return response.data.data;
  },

  async searchDistricts({
    stateId,
    search,
    limit = 20,
  }: DistrictSearchParams): Promise<DistrictOption[]> {
    const response = await axiosInstance.get(
      `/locations/states/${stateId}/districts`,
      {
        params: {
          search,
          limit,
        },
      },
    );

    return response.data.data;
  },

  async searchVillages({
    districtId,
    search,
    limit = 20,
  }: VillageSearchParams): Promise<VillageOption[]> {
    const response = await axiosInstance.get(
      `/locations/districts/${districtId}/villages`,
      {
        params: {
          search,
          limit,
        },
      },
    );

    return response.data.data;
  },

  async searchLocations({
    searchQuery,
    limit,
  }: {
    searchQuery: string;
    limit?: number;
  }) {
    const response = await axiosInstance.get("/locations/search", {
      params: {
        q: searchQuery,
        limit,
      },
    });

    return response.data;
  },
};
