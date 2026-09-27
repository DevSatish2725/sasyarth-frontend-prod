import axiosInstance from "@/lib/axios";
import {SavedSeller } from "@/types/saved-seller.types";

export const savedSellerService = {
  saveSeller: async (
    sellerProfileId: string,
  ) => {
    const response =
      await axiosInstance.post(
        `/sellers/${sellerProfileId}/save`,
      );

    return response.data;
  },

  removeSavedSeller: async (
    sellerProfileId: string,
  ) => {
    const response =
      await axiosInstance.delete(
        `/sellers/${sellerProfileId}/save`,
      );

    return response.data;
  },

  getSavedSellers: async (): Promise<SavedSeller[]> => {
    const response =
      await axiosInstance.get(
        "/sellers/saved",
      );

    return response.data.data;
  },
};