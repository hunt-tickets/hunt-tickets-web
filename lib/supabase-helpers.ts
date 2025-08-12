import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";

export const cookieOptions: CookieOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const cookieNames = {
  auth: "sb-auth-token",
  refresh: "sb-refresh-token",
} as const;