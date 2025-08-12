import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  console.log('🔧 MIDDLEWARE EJECUTADO:', request.url);
  
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          console.log('🍪 MIDDLEWARE: Setting cookies:', cookiesToSet.map(c => `${c.name}=${c.value ? 'value' : 'empty'}`));
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log('🍪 MIDDLEWARE: Setting response cookie:', name, options);
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Solo obtener el usuario para mantener la sesión activa
  // Supabase maneja automáticamente el refresh de tokens cuando es necesario
  try {
    console.log('🔧 Middleware: Getting user for', request.url);
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('⚠️ Middleware: Error getting user:', error.message);
    } else if (user) {
      console.log('✅ Middleware: User found:', user.id);
    } else {
      console.log('❌ Middleware: No user found');
    }
    
    // Log cookies en el middleware
    const cookies = request.cookies.getAll();
    const supabaseCookies = cookies.filter(cookie => 
      cookie.name.startsWith('sb-') || 
      cookie.name.includes('supabase') ||
      cookie.name.includes('access_token') ||
      cookie.name.includes('refresh_token')
    );
    console.log('🍪 Middleware cookies:', supabaseCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`));
    
    // Verificar tokens específicos
    const hasMainToken = cookies.some(c => c.name === 'sb-jtfcfsnksywotlbsddqb-auth-token');
    const hasCodeVerifier = cookies.some(c => c.name === 'sb-jtfcfsnksywotlbsddqb-auth-token-code-verifier');
    console.log('🔧 Middleware token status:', { hasMainToken, hasCodeVerifier, url: request.url });
    
  } catch (error) {
    console.log('❌ Middleware: Unexpected error:', error);
  }

  return supabaseResponse;
}