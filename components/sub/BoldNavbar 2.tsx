import { supabase } from "@/lib/supabaseBrowser";
import * as SubframeCore from "@subframe/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "../sub/Badge";
import { Button } from "./button";
import { LinkButton } from "./linkButton";
import { useState, useRef, useEffect } from "react";

interface BoldNavbarProps {
  className?: string;
  user: any;
  profile: any;
}

const BoldNavbar = ({
  className,
  user = null,
  profile = null,
}: BoldNavbarProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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
        {user?.id ? (
          <>
            <div className="flex items-center gap-2 px-2">
              <Button
                variant="brand-tertiary"
                icon="FeatherUser"
                onClick={handleProfile}
              >
                <span>
                  <Badge>
                    <b>{profile?.name || user?.email}</b>
                  </Badge>
                </span>
              </Button>
              <Button
                variant="brand-tertiary"
                icon="FeatherLogOut"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            {/* Botón buscador circular */}
            <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200 flex items-center justify-center group">
              <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            
            {/* Botón menú lateral circular */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200 flex items-center justify-center group"
              >
                <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="3" x2="21" y1="6" y2="6"></line>
                  <line x1="3" x2="21" y1="12" y2="12"></line>
                  <line x1="3" x2="21" y1="18" y2="18"></line>
                </svg>
              </button>
              
              {/* Menú pantalla completa */}
              {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center">
                  <div className="w-full max-w-md mx-4">
                    {/* Botón cerrar */}
                    <div className="flex justify-end mb-8">
                      <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="w-12 h-12 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/20 transition-all duration-200 flex items-center justify-center group"
                      >
                        <svg className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Contenido del menú */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 space-y-6">
                      {/* Logo */}
                      <div className="text-center mb-8">
                        <img
                          className="h-12 w-auto mx-auto opacity-90"
                          src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png"
                          alt="Hunt Logo"
                        />
                      </div>

                      {/* Navegación principal */}
                      <div className="space-y-3">
                        <Link 
                          href="/events" 
                          onClick={() => setIsMenuOpen(false)} 
                          className="flex items-center px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-lg font-medium"
                        >
                          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Eventos
                        </Link>
                        
                        <Link 
                          href="/about-us" 
                          onClick={() => setIsMenuOpen(false)} 
                          className="flex items-center px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-lg font-medium"
                        >
                          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Sobre nosotros
                        </Link>
                      </div>
                      
                      {/* Línea divisoria */}
                      <div className="border-t border-white/20 my-6"></div>
                      
                      {/* Sección de usuario */}
                      {user?.id ? (
                        <div className="space-y-3">
                          <button 
                            onClick={() => { handleProfile(); setIsMenuOpen(false); }} 
                            className="flex items-center px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-lg font-medium"
                          >
                            <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {profile?.name || user?.email}
                          </button>
                          
                          <button 
                            onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                            className="flex items-center px-6 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full text-lg font-medium"
                          >
                            <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar sesión
                          </button>
                        </div>
                      ) : (
                        <Link 
                          href="/sign-mail" 
                          onClick={() => setIsMenuOpen(false)} 
                          className="flex items-center justify-center px-6 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 text-lg font-medium border border-white/30"
                        >
                          <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Iniciar sesión
                        </Link>
                      )}
                      
                      {/* Información adicional */}
                      <div className="text-center pt-6">
                        <p className="text-white/60 text-sm">
                          Descubre eventos únicos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Botón iniciar sesión */}
            <Link href="/sign-mail">
              <div className="relative group">
                <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                  <span className="text-white/80 text-sm font-medium hover:text-white transition-colors">
                    Iniciar sesión
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoldNavbar;
