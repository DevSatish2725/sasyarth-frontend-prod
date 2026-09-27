import axiosInstance from "@/lib/axios";
import { SellerShopData, SellerShopResponse } from "@/types/seller-shop.types";

import type { SellerApply, SellerResponse, SellerSearchParams } from "@/types/seller.types";

export const sellerService = {
  async getSellers(params: SellerSearchParams): Promise<SellerResponse> {
    const response = await axiosInstance.get<SellerResponse>("/sellers", {
      params: {
        ...params,
        vegetableIds: params.vegetableIds?.length
          ? params.vegetableIds.join(",")
          : undefined,
      },
    });

    return response.data;
  },

  async getCallSeller(sellerId: string) {
    const response = await axiosInstance.get(`/sellers/${sellerId}/contact`);
    return response.data;
  },

  async getSellerShop(sellerId: string): Promise<SellerShopData> {
    const response = await axiosInstance.get<SellerShopResponse>(
      `/sellers/${sellerId}/shop`,
    );

    return response.data.data;
  },

  async applyForSeller(payload: SellerApply) {
    const response = await axiosInstance.post("/seller/apply", payload);
    return response.data;
  },

  async reApplyForSeller(payload: SellerApply) {
    const response = await axiosInstance.patch("/seller/apply", payload);
    return response.data;
  },
};
