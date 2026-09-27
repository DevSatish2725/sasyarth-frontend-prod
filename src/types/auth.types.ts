import { SupportedLanguage } from "./common.types";
import { SellerVerificationStatus } from "./seller.types";

export interface SendOtpPayload {
  mobileNumber: string;
}

export interface VerifyOtpPayload {
  mobileNumber: string;
  otp: string;
}

export interface RegisterPayload {
  fullName: string;
  preferredLanguage: SupportedLanguage
  registrationToken: string;
}

export interface UserLocation {
  state: {
    id: string;
    name: string;
  };
  district: {
    id: string;
    name: string;
  };
  village: {
    id: string;
    name: string;
  };
  pincode: string;
}

export interface SellerProfile {
  sellerId: string;
  verificationStatus: SellerVerificationStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  businessType: string;
}
export interface AuthUser {
  id: string;
  fullName: string;
  mobileNumber: string;
  isPhoneVerified: boolean;
  preferredLanguage: SupportedLanguage;
  location: UserLocation;
  geoLocation: {
    type: "Point";
    coordinates: [number, number];
  };
  status: string;
  sellerProfile: SellerProfile | null;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export type VerifyOtpData =
  | {
      action: "LOGIN";
      user: AuthUser;
      accessToken: string;
    }
  | {
      action: "REGISTER";
      mobileNumber: string;
      registrationToken: string;
    };

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: VerifyOtpData;
}

export interface RegisterResponse {
  success: boolean;
  message: string;

  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export interface VerifyLoginOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
  };
}

export interface VerifyRegistrationOtpResponse {
  success: boolean;
  message: string;
  data: {
    mobileNumber: string;
    registrationToken: string;
  };
}

export interface Msg91SendOtpResponse {
  reqId?: string;
  message?: string;
  type?: string;
  hasError?: boolean;
  status?: string;
}
export interface Msg91VerifySuccessResponse {
  message: string;
  type?: string;
}

export interface Msg91VerifyErrorResponse {
  message?: string;
  type?: string;
}

export interface Msg91RetrySuccessResponse {
  message?: string;
  type?: string;
  reqId?: string;
}

export interface Msg91RetryErrorResponse {
  message?: string;
  type?: string;
}

export interface Msg91SendOtpResult {
  reqId?: string;
  message?: string;
  type?: string;
  status?: string;
  hasError?: boolean;
}
