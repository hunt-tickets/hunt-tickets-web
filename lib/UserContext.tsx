"use client";

import { supabase } from "@/lib/supabaseBrowser";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string | null;
  phone: string | null;
  email: string | null;
};

interface UserContextProps {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🏁 UserContext initialized');
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event);
        console.log('📊 Session data:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          expiresAt: session?.expires_at,
          refreshToken: session?.refresh_token ? 'exists' : 'missing',
          accessToken: session?.access_token ? 'exists' : 'missing',
        });
        
        // Verificar cookies manualmente
        if (typeof document !== 'undefined') {
          const cookies = document.cookie;
          console.log('🍪 Current cookies:', cookies);
          
          // Buscar tokens específicos de Supabase
          const supabaseCookies = cookies.split(';').filter(cookie => 
            cookie.trim().startsWith('sb-') || 
            cookie.trim().includes('supabase') ||
            cookie.trim().includes('access_token') ||
            cookie.trim().includes('refresh_token')
          );
          console.log('🍪 Supabase cookies:', supabaseCookies);
          
          // Verificar específicamente el token principal
          const hasMainToken = cookies.includes('sb-jtfcfsnksywotlbsddqb-auth-token=');
          const hasCodeVerifier = cookies.includes('sb-jtfcfsnksywotlbsddqb-auth-token-code-verifier=');
          console.log('🔑 Token status:', { hasMainToken, hasCodeVerifier });
          
          // Si no hay token principal pero sí code verifier, algo lo eliminó
          if (!hasMainToken && hasCodeVerifier) {
            console.log('🚨 PROBLEMA: Token principal eliminado pero code verifier presente');
          }
        }
        
        if (event === 'INITIAL_SESSION') {
          console.log('🎯 Processing INITIAL_SESSION');
          if (session?.user) {
            console.log('✅ Initial session found:', session.user.id);
            console.log('📱 User phone:', session.user.phone);
            console.log('📧 User email:', session.user.email);
            setUser({
              id: session.user.id,
              phone: session.user.phone || null,
              email: session.user.email || null,
            });
          } else {
            console.log('❌ No initial session found');
            setUser(null);
          }
          setLoading(false);
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in:', session.user.id);
          setUser({
            id: session.user.id,
            phone: session.user.phone || null,
            email: session.user.email || null,
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ User signed out - checking reason');
          console.log('🔍 Session at signout:', session);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 Token refreshed for user:', session.user.id);
          setUser({
            id: session.user.id,
            phone: session.user.phone || null,
            email: session.user.email || null,
          });
        } else {
          console.log('❓ Unhandled auth event:', event);
        }
      }
    );

    return () => {
      console.log('🧹 UserContext cleanup');
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);