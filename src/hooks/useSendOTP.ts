import { useRouter } from "next/navigation";

export const useSendOTP = () => {
  const router = useRouter();
  return (mobileNumber: string, returnTo: string) => {
    if (!window.sendOtp) {
      return;
    }
    const identifier = `91${mobileNumber}`;
    try {
      window.sendOtp(
        identifier,
        (data) => {
          const params = new URLSearchParams({
            mobileNumber,
            returnTo,
          });
          if (data.reqId) {
            sessionStorage.setItem("msg91ReqId", data.reqId);
          }
          router.push(`/login/verify-otp?${params.toString()}`);
        },

        () => {
        },
      );
    } catch (error) {
      console.error(error);
    }
  };
};
