import { getUser } from "@/queries/user";
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const encodedRedirectTo = requestUrl.searchParams.get("redirect") || "/app";
  const priceId = decodeURIComponent(
    requestUrl.searchParams.get("priceId") || ""
  );
  const discountCode = decodeURIComponent(
    requestUrl.searchParams.get("discountCode") || ""
  );
  const redirectTo = decodeURIComponent(encodedRedirectTo);

  const supabase = await createClient();

  if (code) {
    try {
      // Intercambiar código por sesión
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Error exchanging code:", error);
        return NextResponse.redirect(`${requestUrl.origin}/sign-phone?error=auth`);
      }

      // Forzar refresh para establecer cookies correctamente
      if (data?.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      // Obtener datos del usuario después de establecer sesión
      const userData = await getUser();
      
      // Crear respuesta con redirección
      const response = NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
      
      return response;
    } catch (error) {
      console.error("Callback error:", error);
      return NextResponse.redirect(`${requestUrl.origin}/sign-phone?error=callback`);
    }
  }

  // Si no hay código, redirigir
  return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
}