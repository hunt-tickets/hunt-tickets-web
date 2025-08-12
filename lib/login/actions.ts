"use client";

import { supabase } from "@/lib/supabaseBrowser";

export const signInWithPhone = async (phoneNumber: string) => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      console.log("Error sending OTP:", error.message);
      return { error: "Failed to send SMS. Please try again." };
    }

    return { success: "OTP enviado a " + phoneNumber };
  } catch (err) {
    console.log("Unexpected error:", err);
    return { error: "Unexpected error occurred. Please try again." };
  }
};

export const verifyPhoneOTP = async (phoneNumber: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: token,
      type: "sms",
    });

    if (error) {
      console.log("Error verifying OTP:", error.message);
      return { error: "Failed to verify OTP. Please try again." };
    }

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      console.log("Error: No active session after OTP verification.");
      return { error: "Failed to fetch session after OTP verification." };
    }

    return {
      success: "Phone verified successfully!",
      session: sessionData.session,
    };
  } catch (err) {
    console.log("Unexpected error:", err);
    return { error: "Unexpected error occurred. Please try again." };
  }
};

export const signInWithEmailOTP = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.log("Error sending email OTP:", error.message);
      return { error: "Failed to send OTP. Please try again." };
    }

    return { success: `OTP sent to ${email}` };
  } catch (err) {
    console.log("Unexpected error:", err);
    return { error: "Unexpected error occurred. Please try again." };
  }
};

export const verifyEmailOTP = async (email: string, token: string) => {
  try {
    const { data: session, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      console.log("Error verifying email OTP:", error.message);
      return { error: "Failed to verify OTP. Please try again." };
    }

    return { success: "Email verified successfully!", session };
  } catch (err) {
    console.log("Unexpected error:", err);
    return { error: "Unexpected error occurred. Please try again." };
  }
};
