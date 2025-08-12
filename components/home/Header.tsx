"use client";
import { useProfiles } from "@/hook/useProfiles";
import { useUser } from "@/lib/UserContext";
import { useEffect, useState } from "react";
import BoldNavbar from "../sub/BoldNavbar";
import { BoldNavbarMobile } from "../sub/BoldNavbarMobile";

const Header = () => {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, updateUserProfile } = useProfiles();
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header 
      className="fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300"
      style={{
        opacity: scrolled ? 1 : 0,
        transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.4)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.3)' : 'none'
      }}
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 px-6 py-4 mobile:px-2 mobile:py-2">
        <BoldNavbar className="hidden md:flex" user={user} profile={profile} />
        <BoldNavbarMobile className="flex md:hidden" user={user} />
      </div>
    </header>
  );
};

export default Header;
