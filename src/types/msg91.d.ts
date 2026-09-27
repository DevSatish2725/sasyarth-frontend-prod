export {};

declare global {
  interface Msg91SendOtpResponse {
    reqId?: string;
    message?: string;
    type?: string;
    hasError?: boolean;
    status?: string;
  }

  interface Msg91VerifyOtpResponse {
    message?: string;
    type?: string;
    hasError?: boolean;
    status?: string;
    reqId?: string;
  }

  interface Msg91ErrorResponse {
    message?: string;
    type?: string;
    hasError?: boolean;
    status?: string;
  }

  interface Window {
    sendOtp?: (
      identifier: string,
      success: (
        data: Msg91SendOtpResponse,
      ) => void,
      failure: (
        error: Msg91ErrorResponse,
      ) => void,
    ) => void;

    verifyOtp?: (
      otp: string | number,
      success: (
        data: Msg91VerifyOtpResponse,
      ) => void,
      failure: (
        error: Msg91ErrorResponse,
      ) => void,
      reqId?: string,
    ) => void;

    retryOtp?: (
      channel: string,
      success: (
        data: Msg91SendOtpResponse,
      ) => void,
      failure: (
        error: Msg91ErrorResponse,
      ) => void,
      reqId?: string,
    ) => void;
  }
}