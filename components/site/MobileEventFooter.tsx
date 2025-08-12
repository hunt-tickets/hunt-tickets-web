"use client";

import android from "@/assets/android.svg";
import ios from "@/assets/ios.svg";
import Link from "next/link";

const MobileEventFooter = () => {
  return (
    <footer className="lg:hidden w-full bg-black/10 backdrop-blur-md border-t border-white/20 py-8 mt-8" style={{
      backdropFilter: 'blur(16px) saturate(120%)',
      WebkitBackdropFilter: 'blur(16px) saturate(120%)',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1)',
    }}>
      <div className="flex flex-col items-center gap-6 w-full">
        
        {/* Logo */}
        <div className="flex items-center">
          <img
            className="h-6 object-cover"
            src="https://res.cloudinary.com/subframe/image/upload/v1733254448/uploads/4760/jdot6rdprtl4kwxkfxqb.png"
            alt="Hunt Tickets"
          />
        </div>

        {/* Descargar app */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm px-4">
          <Link 
            href="https://apps.apple.com/app/id1658242880" 
            target="_blank"
            className="flex items-center justify-center gap-2 h-12 px-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white flex-shrink-0">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-neutral-400 leading-tight">Descargar en</span>
              <span className="text-xs text-white font-medium leading-tight">App Store</span>
            </div>
          </Link>
          
          <Link 
            href="https://play.google.com/store/apps/details?id=com.hunt.ticket" 
            target="_blank"
            className="flex items-center justify-center gap-2 h-12 px-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white flex-shrink-0">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
            </svg>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-neutral-400 leading-tight">Descargar en</span>
              <span className="text-xs text-white font-medium leading-tight">Google Play</span>
            </div>
          </Link>
        </div>

        {/* Enlaces principales */}
        <div className="flex items-center gap-6 text-sm">
          <Link 
            href="/events" 
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Eventos
          </Link>
          <Link 
            href="/about-us" 
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Nosotros
          </Link>
          <Link 
            href="https://wa.me/573228597640" 
            target="_blank"
            className="text-neutral-400 hover:text-white transition-colors"
          >
            Ayuda
          </Link>
        </div>

        {/* Redes sociales */}
        <div className="flex items-center gap-4">
          <Link
            href="https://www.instagram.com/hunt____tickets/"
            target="_blank"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </Link>
          
          <Link
            href="https://www.linkedin.com/company/hunt-tickets-co/"
            target="_blank"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </Link>
          
          <Link
            href="https://wa.me/573228597640"
            target="_blank"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </Link>
        </div>

        {/* Enlaces legales */}
        <div className="flex items-center gap-4 text-xs text-center">
          <Link 
            href="/resources/terms-and-conditions" 
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Términos
          </Link>
          <span className="text-neutral-600">•</span>
          <Link 
            href="/resources/privacy" 
            className="text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Privacidad
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-neutral-600 text-center">
          © 2024 Hunt Tickets. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
};

export default MobileEventFooter;