export interface ManualLocation {
  stateId: string;
  districtId: string;
  blockId: string;
  villageId: string;
  maujaId: string;
  habitationId: string;
  displayNames: {
    en: string;
    hi: string;
  };
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

export interface LocationOption {
  ids: {
    habitationId: string;
    maujaId: string;
    villageId: string;
    blockId: string;
    districtId: string;
    stateId: string;
  };
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
      stateId: string;
      districtId: string;
      blockId: string;
      villageId: string;
      maujaId: string;
      habitationId: string;
    };

export interface Location {
  habitationId: string;
  habitation: {
    en: string;
    hi: string;
  };
  maujaId: string;
  mauja: {
    en: string;
    hi: string;
  };
  villageId: string;
  village: {
    en: string;
    hi: string;
  };
  blockId: string;
  block: {
    en: string;
    hi: string;
  };
  districtId: string;
  district: {
    en: string;
    hi: string;
  };
  stateId: string;
  state: {
    en: string;
    hi: string;
  };
}
