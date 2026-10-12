export interface VegetableDisplayNames {
  en: string;
  hi: string;
}

export interface VegetableResponse {
  _id: string;

  name: string;

  displayNames: {
    en: string;
    hi: string;
  };

  searchAliases?: string[];

  imageUrl?: string | null;

  defaultUnit: string;
  allowedUnits: string[];

  isActive: boolean;
}

export type VegetableShow = Pick<VegetableResponse, "_id" | "name">;
