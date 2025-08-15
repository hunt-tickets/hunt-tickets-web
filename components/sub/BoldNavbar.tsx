import { supabase } from "@/lib/supabaseBrowser";
import * as SubframeCore from "@subframe/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "../sub/Badge";
import { Button } from "./button";
import { LinkButton } from "./linkButton";

interface BoldNavbarProps {
  className?: string;
  user: any;
  profile: any;
  isMenuOpen?: boolean;
  setIsMenuOpen?: (open: boolean) => void;
}

const BoldNavbar = ({
  className,
  user = null,
  profile = null,
  isMenuOpen = false,
  setIsMenuOpen,
}: BoldNavbarProps) => {
  const router = useRouter();

  const handleProfile = () => {
    if (profile?.admin) {
      router.push("/dashboard");
    } else {
      router.push("/register");
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log("Error al cerrar sesión:", error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.log("Error inesperado:", err);
    }
  };

  // Función para obtener iniciales del usuario
  const getUserInitials = (user: any, profile: any) => {
    if (profile?.name) {
      const names = profile.name.split(' ');
      return names.map((name: string) => name.charAt(0).toUpperCase()).join('').slice(0, 2);
    }
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(' ');
      return names.map((name: string) => name.charAt(0).toUpperCase()).join('').slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div
      className={SubframeCore.twClassNames(
        "flex w-full flex-wrap items-center gap-4",
        className
      )}
    >
      <div className="flex h-12 flex-col items-start justify-center gap-2 px-4">
        <Link href="/">
          <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
            <img
              className="h-4 w-auto flex-none object-contain opacity-80"
              src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png"
            />
          </div>
        </Link>
      </div>
      <ul className="hidden md:flex px-4 mr-auto font-semibold font-heading space-x-12">
        <li>
          <Link href="/events" className="text-white/80 hover:text-white/60 transition-colors text-lg font-medium">
            Eventos
          </Link>
        </li>
        <li className="hidden">
          <Link href="/producers" className="text-white/50 cursor-not-allowed text-lg font-medium">
            Productores
          </Link>
        </li>
        <li>
          <Link href="/about-us" className="text-white/80 hover:text-white/60 transition-colors text-lg font-medium">
            Sobre nosotros
          </Link>
        </li>
      </ul>
      <div className="hidden">
        <LinkButton icon="FeatherSearch">Buscar</LinkButton>
        <LinkButton>Help</LinkButton>
      </div>
      <div className="hidden md:flex items-center gap-2 px-2">
        <div className="flex items-center gap-3">
          {/* Botón buscador circular */}
          <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200 flex items-center justify-center group">
            <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          
          {/* Botón menú lateral circular */}
          <button 
            onClick={() => setIsMenuOpen && setIsMenuOpen(!isMenuOpen)}
            className={`w-10 h-10 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200 flex items-center justify-center group ${
              isMenuOpen ? 'rotate-90' : ''
            }`}
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="3" x2="21" y1="6" y2="6"></line>
                <line x1="3" x2="21" y1="12" y2="12"></line>
                <line x1="3" x2="21" y1="18" y2="18"></line>
              </svg>
            )}
          </button>
          
          {/* Usuario logueado - círculo con iniciales o botón iniciar sesión */}
          {user?.id ? (
            <button
              onClick={handleProfile}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200"
            >
              <span className="text-white font-semibold text-sm">
                {getUserInitials(user, profile)}
              </span>
            </button>
          ) : (
            <Link href="/sign-mail">
              <div className="relative group">
                <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                  <span className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                    Iniciar sesión
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoldNavbar;
