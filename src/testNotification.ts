import axiosInstance from "@/lib/axios";

export async function testPushAfterFiveMinutes() {
  console.log("Push notification test scheduled for 5 minutes from now.");

  setTimeout(async () => {
    try {
      const response = await axiosInstance.post("/push/test");

      console.log("Push test API response:", response.data);
    } catch (error) {
      console.error("Push notification test failed:", error);
    }
  }, 1000);
}
