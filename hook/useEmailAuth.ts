import { useState } from 'react';
import { supabase } from '@/lib/supabaseBrowser';

interface UseEmailAuthReturn {
  signInWithEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  resendOTP: (email: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  error: string | null;
}

export const useEmailAuth = (): UseEmailAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return { success: false, error: signInError.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el código';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (verifyError) {
        setError(verifyError.message);
        return { success: false, error: verifyError.message };
      }

      if (!data.user) {
        setError('No se pudo verificar el usuario');
        return { success: false, error: 'No se pudo verificar el usuario' };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar el código';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    return signInWithEmail(email);
  };

  return {
    signInWithEmail,
    verifyOTP,
    resendOTP,
    loading,
    error,
  };
};