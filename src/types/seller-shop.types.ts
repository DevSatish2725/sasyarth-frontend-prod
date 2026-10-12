export interface SellerShopItem {
  itemId: string;
  vegetableId: string;
  vegetableName: string;
  unit: string;
  availableQty: number;
  sellerPrice: number;
  isNegotiable: boolean;
  displayOrder: number;
  imageOverride?: string | null;

  _id: string;

  name: string;

  displayNames: {
    en: string;
    hi: string;
  };

  searchAliases?: string[];

  imageUrl?: string;

  defaultUnit: string;
  allowedUnits: string[];

  isActive: boolean;
}

export interface SellerShopData {
  seller: {
    id: string;
    name: string;
    location: {
      state: string;
      district: string;
      village: string;
      pincode: string;
    };
    reputation: {
      averageRating: number;
      completedDeals: number;
    };
    isSaved: boolean;
    shopOwner: boolean;
  };

  inventory: {
    id: string;
    date: Date;
    items: SellerShopItem[];
  };
}

export interface SellerShopResponse {
  success: boolean;
  message: string;
  data: SellerShopData;
}
