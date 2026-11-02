import { SearchLocation } from "./location.types";

export interface Vegetable {
  id: string;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
  sellerPrice: number;
  unit: string;
  availableQty: number;
  imageUrl?: string;
}

export interface SellerCardProps {
  sellerId: string;
  fullName: string;
  isVerified?: boolean;
  distanceInKm?: number;

  location: {
    state: {
      id: string;
      displayNames: {
        en: string;
        hi: string;
      };
    };
    district: {
      id: string;
      displayNames: {
        en: string;
        hi: string;
      };
    };
    block: {
      id: string;
      displayNames: {
        en: string;
        hi: string;
      };
    };
    village: {
      id: string;
      displayNames: {
        en: string;
        hi: string;
      };
    };
    mauja: {
      id: string;
      displayNames: {
        en: string;
        hi: string;
      };
    };
    habitation: {
      id: string;
      displayNames: {
        en: string;
        hi: string;
      };
    };
  };

  reputation?: {
    averageRating?: number;
    totalDeals?: number;
  };

  averageRating: number;
  ratingCount: number;
  vegetables: Vegetable[];
}

export interface SellerResponse {
  data: SellerCardProps[];
  meta: {
    matchingMode: string;
    nextCursor: string | null;
  };
}

export type getCallSellerId = (sellerId: string) => void;

export interface SellerSearchParams {
  latitude?: number;
  longitude?: number;

  state?: string;
  district?: string;
  village?: string;

  vegetableIds?: string[];

  cursor?: string;
  limit?: number;
}

export type SellerVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface SellerApply {
  businessType: string;
  documents: {
    type: string;
    url: string;
  }[];
  location: {
    stateId: string;
    districtId: string;
    villageId: string;
    pincode: string;
  };
  geoLocation?: {
    type: "Point";
    coordinates: number[];
  };
}

export interface AppliedSearchParams {
  searchLocationDetails: {
    stateId: string;
    stateName: string;

    districtId: string;
    districtName: string;

    villageId: string;
    villageName: string;
  };

  locationSearch: SearchLocation | null;
  searchVegetableIds: string[];
}
