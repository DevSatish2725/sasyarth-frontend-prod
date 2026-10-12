export interface ManualLocation {
  stateId: string;
  stateNameEn: string;
  stateNameHi: string;

  districtId?: string;
  districtNameEn?: string;
  districtNameHi?: string;

  villageId?: string;
  villageNameEn?: string;
  villageNameHi?: string;
}

export interface StateOption {
  id: string;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
}

export interface DistrictOption {
  id: string;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
}

export interface VillageOption {
  id: string;
  name: string;
  displayNames: {
    en: string;
    hi: string;
  };
}

export type SearchLocation =
  | {
      mode: "CURRENT";
      latitude: number;
      longitude: number;
    }
  | {
      mode: "MANUAL";
      state: string;
      district?: string;
      village?: string;
    };
