import { VegetableResponse } from "./vegetable.types";

export interface Inventory {
  _id: string;
  sellerProfileId: string;
  status: InventoryStatus;
  inventoryDate: string;
  items: InventoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NoInventoryProps {
  onCreateFresh: () => void;
  onCopyYesterday: () => void;
  isCopying: boolean;
  copyError: Error | null;
}

export interface InventoryDetailsProps {
  inventory: Inventory;
  onEdit: () => void;
  onPublish: () => void;
  isPublishing: boolean;
  publishError: Error | null;
}

export interface CreateInventoryItemPayload {
  vegetableId: string;
  unit: UnitType;
  availableQty: number;
  marketPrice: number;
  sellerPrice: number;
}

export interface CreateInventoryPayload {
  items: CreateInventoryItemPayload[];
}

export interface CreateInventoryFormProps {
  vegetables: VegetableResponse[];
  isSubmitting?: boolean;
  onSubmit: (payload: CreateInventoryPayload) => void;

  onCancel: () => void;
}

export interface InventoryFormItem {
  id: string;
  vegetableId: string;
  vegetableName: string;
  unit: UnitType;
  availableQty: string;
  marketPrice: string;
  sellerPrice: string;
}

export interface InventoryItemRowProps {
  index: number;

  item: InventoryFormItem;

  vegetables: VegetableResponse[];

  canRemove: boolean;

  onChange: <K extends keyof InventoryFormItem>(
    id: string,
    field: K,
    value: InventoryFormItem[K],
  ) => void;

  onRemove: (id: string) => void;
}

export type InventoryFormMode = "CREATE" | "EDIT" | null;

export interface InventoryItemPayload {
  vegetableId: string;
  unit: UnitType;
  availableQty: number;
  marketPrice: number;
  sellerPrice: number;
}

export interface UpdateInventoryPayload {
  items: InventoryItemPayload[];
}

export interface UpdateDraftInventoryPayload {
  items: {
    vegetableId: string;
    unit: UnitType;
    availableQty: number;
    marketPrice: number;
    sellerPrice: number;
  }[];
}

export const INVENTORY_STATUS = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  UNAVAILABLE: "UNAVAILABLE",
  ARCHIVED: "ARCHIVED",
} as const;

export type InventoryStatus =
  (typeof INVENTORY_STATUS)[keyof typeof INVENTORY_STATUS];

export const UNIT = {
  KG: "KG",
  PIECE: "PIECE",
  BUNDLE: "BUNDLE",
  DOZEN: "DOZEN",
} as const;

export type UnitType = (typeof UNIT)[keyof typeof UNIT];

export interface InventoryVegetable {
  _id: string;
  name: string;
  imageUrl?: string;
}

export interface InventoryItem {
  _id: string;

  vegetableId: InventoryVegetable;

  unit: UnitType;

  availableQty: number;
  committedQty: number;

  marketPrice: number;
  sellerPrice: number;

  isNegotiable: boolean;

  displayOrder: number;

  imageOverride?: string;
}

export interface EditInventoryFormProps {
  inventory: Inventory;
  vegetables: VegetableResponse[];
  isSubmitting: boolean;

  onSubmitDraft: (payload: UpdateInventoryPayload) => void;

  onSubmitPublished: (payload: UpdatePublishedInventoryPayload) => void;

  onCancel: () => void;
}

export interface UpdatePublishedInventoryItemPayload {
  itemId: string;
  availableQty?: number;
  marketPrice?: number;
  sellerPrice?: number;
  isNegotiable?: boolean;
  displayOrder?: number;
  imageOverride?: string;
}

export interface UpdatePublishedInventoryPayload {
  items: UpdatePublishedInventoryItemPayload[];
}
