import { createClient } from "@/supabase/server";

export const verifyPhoneOTP = async (phone: string, token: string) => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });

    if (error) {
      console.log("Error verifying OTP:", error.message);
      return { error: "Failed to verify OTP. Please try again." };
    }

    return { success: "Phone verified successfully!" };
  } catch (err) {
    console.log("Unexpected error:", err);
    return { error: "Unexpected error occurred. Please try again." };
  }
};
