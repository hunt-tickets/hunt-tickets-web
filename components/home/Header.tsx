"use client";
import { useProfiles } from "@/hook/useProfiles";
import { useUser } from "@/lib/UserContext";
import { useEffect, useState, useRef } from "react";
import BoldNavbar from "../sub/BoldNavbar";
import { BoldNavbarMobile } from "../sub/BoldNavbarMobile";

const Header = () => {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, updateUserProfile } = useProfiles();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // Set initial state to false (hidden)
    setScrolled(false);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header 
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'h-screen' : 'h-auto'
      }`}
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="flex w-full flex-col h-full">
        {/* Header normal - siempre visible */}
        <div className="flex w-full items-center justify-center gap-2 px-6 py-4 mobile:px-2 mobile:py-2 border-b border-white/10">
          <BoldNavbar 
            className="hidden md:flex" 
            user={user} 
            profile={profile} 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
          <BoldNavbarMobile className="flex md:hidden" user={user} />
        </div>

        {/* Contenido del menú expandido */}
        {isMenuOpen && (
          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="max-w-2xl w-full">
              {/* Navegación principal */}
              <div className="space-y-8 mb-16">
                <a 
                  href="/events" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-4xl md:text-6xl font-bold text-white/90 hover:text-white transition-all duration-300 hover:translate-x-4 cursor-pointer"
                >
                  Eventos
                </a>
                
                <a 
                  href="/about-us" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-4xl md:text-6xl font-bold text-white/90 hover:text-white transition-all duration-300 hover:translate-x-4 cursor-pointer"
                >
                  Sobre nosotros
                </a>
              </div>
              
              {/* Línea divisoria */}
              <div className="border-t border-white/20 my-12"></div>
              
              {/* Sección de usuario */}
              {user?.id ? (
                <div className="space-y-6">
                  <button 
                    onClick={() => { 
                      if (profile?.admin) {
                        window.location.href = "/dashboard";
                      } else {
                        window.location.href = "/register";
                      }
                      setIsMenuOpen(false); 
                    }} 
                    className="flex items-center text-2xl text-white/80 hover:text-white transition-all duration-300 hover:translate-x-4"
                  >
                    <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {profile?.name || user?.email}
                  </button>
                  
                  <button 
                    onClick={async () => { 
                      const { supabase } = await import("@/lib/supabaseBrowser");
                      await supabase.auth.signOut();
                      window.location.href = "/";
                      setIsMenuOpen(false); 
                    }} 
                    className="flex items-center text-2xl text-white/80 hover:text-white transition-all duration-300 hover:translate-x-4"
                  >
                    <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <a 
                  href="/sign-mail" 
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 text-xl font-medium border border-white/20 hover:translate-x-4 cursor-pointer"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Iniciar sesión
                </a>
              )}

              {/* Footer del menú */}
              <div className="mt-16 pt-8 border-t border-white/10">
                <p className="text-white/40 text-lg">
                  Descubre eventos únicos y experiencias inolvidables
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
