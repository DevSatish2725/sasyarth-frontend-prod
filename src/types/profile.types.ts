export interface EditProfileFormProps {
  initialEditLocation?: boolean;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export interface FormErrors {
  fullName?: string;
  location?: string;
}

export interface ProfileLocation {
  habitationId: string;
  maujaId: string;
  blockId: string;
  villageId: string;
  districtId: string;
  stateId: string;
  pincode: string;
}

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface UpdateProfilePayload {
  fullName?: string;
  preferredLanguage?: string;
  location?: ProfileLocation;
  geoLocation?: GeoLocation | null;
}

export interface UserProfile {
  id: string;
  fullName: string;
  mobileNumber: string;
  preferredLanguage?: string;
  location?: ProfileLocation | null;
  geoLocation?: GeoLocation | null;
}

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED";

export interface AccountStatusBadgeProps {
  status: string;
}
