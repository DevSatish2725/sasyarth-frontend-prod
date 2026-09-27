import axiosInstance from "@/lib/axios";
import refreshClient from "@/lib/refresh-client";

import type {
  RegisterPayload,
  RegisterResponse,
  SendOtpPayload,
  SendOtpResponse,
  MeResponse,
  RefreshTokenResponse,
  VerifyLoginOtpResponse,
  VerifyRegistrationOtpResponse,
  Msg91VerifyErrorResponse,
  Msg91VerifySuccessResponse,
} from "@/types/auth.types";

export const authService = {
  async sendLoginOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const response = await axiosInstance.post("/auth/login/send-otp", payload);

    return response.data;
  },

  async verifyLoginOtp(
    msgAccessToken: string,
  ): Promise<VerifyLoginOtpResponse> {
    const response = await axiosInstance.post<VerifyLoginOtpResponse>(
      "/auth/msg91/verify",
      { msgAccessToken },
    );

    return response.data;
  },

  async sendRegistrationOtp(payload: SendOtpPayload): Promise<SendOtpResponse> {
    const response = await axiosInstance.post(
      "/auth/register/send-otp",
      payload,
    );

    return response.data;
  },

  async verifyRegistrationOtp(payload: {
    mobileNumber: string;
    otp: string;
  }): Promise<VerifyRegistrationOtpResponse> {
    const response = await axiosInstance.post<VerifyRegistrationOtpResponse>(
      "/auth/verify-otp",
      payload,
    );

    return response.data;
  },
  async completeRegistration(data: RegisterPayload): Promise<RegisterResponse> {
    const { fullName, registrationToken } = data;
    const response = await axiosInstance.post(
      "/auth/register",
      { fullName },
      {
        headers: {
          Authorization: `Bearer ${registrationToken}`,
        },
      },
    );

    return response.data;
  },

  async getMe(): Promise<MeResponse> {
    const response = await axiosInstance.get<MeResponse>("/auth/me");
    return response.data;
  },

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await refreshClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
    );

    return response.data;
  },

  async logout(): Promise<void> {
    await axiosInstance.post("/auth/logout");
  },

  async verifyMsg91Otp(otp: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.verifyOtp) {
        reject(new Error("MSG91 verifyOtp is not ready."));

        return;
      }
      window.verifyOtp(
        otp,
        (data) => {
          const response = data as Msg91VerifySuccessResponse;
          const accessToken = response.message;
          if (!accessToken) {
            reject(new Error("MSG91 access token was not returned."));

            return;
          }
          resolve(accessToken);
        },

        (error) => {
          const response = error as Msg91VerifyErrorResponse;
          reject(new Error(response.message ?? "OTP verification failed."));
        },
      );
    });
  },

  async resendMsg91Otp(reqId: string, channel: string = "11") {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.retryOtp) {
        reject(new Error("MSG91 retryOtp is not ready."));

        return;
      }

      window.retryOtp(
        channel,

        (data) => {
          resolve(data);
        },

        (error) => {
          console.error("MSG91 RESEND ERROR:", error);

          reject(error);
        },

        reqId,
      );
    });
  },
};
