"use client";

import { useEffect, useState } from "react";

const BannerEvent = ({ image }: { image?: string }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const imageUrl = image || "https://res.cloudinary.com/subframe/image/upload/v1734728742/uploads/4760/j6hakzhqmpbzexv3k9ns.png";

  return (
    <>
      {/* Mobile: Simple con mismo radius que MobileEventInfo */}
      <div className="block lg:hidden">
        <img
          className="h-110 w-full flex-none object-cover"
          src={imageUrl}
          alt="Event banner"
          style={{
            borderRadius: '8px'
          }}
        />
      </div>

      {/* Desktop: Full width con gradiente */}
      <div className="hidden lg:block relative h-[600px] w-full overflow-hidden">
        {/* Main image full width */}
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src={imageUrl}
            alt="Event banner"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
    </>
  );
};

export default BannerEvent;