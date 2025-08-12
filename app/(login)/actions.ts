"use server";

import { createClient } from "@/supabase/server";

export async function signInWithPhone(phone: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) return { error: error.message };
  return { success: `OTP enviado a ${phone}` };
}

export async function signInWithEmailOTP(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ 
    email,
    options: { shouldCreateUser: true }
  });
  if (error) return { error: error.message };
  return { success: `OTP enviado a ${email}` };
}

export async function verifyPhoneOTP(phone: string, token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) return { error: error.message };
  return { success: "Verificado correctamente" };
}

export async function verifyEmailOTP(email: string, token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) return { error: error.message };
  return { success: "Verificado correctamente" };
}