"use client";

import React from "react";

const CompanyLogos = () => {
  // Array de logos de empresas - puedes agregar más logos aquí
  const companyLogos = [
    {
      name: "Inside",
      src: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/perro-negro/inside_logo.jpg",
      alt: "Inside"
    },
    {
      name: "Andres",
      src: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/website/logo_andres.png", 
      alt: "Andres"
    },
    {
      name: "Octava",
      src: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/website/octava_logo.png",
      alt: "Octava"
    },
    {
      name: "Netflix",
      src: "/logos/netflix.png",
      alt: "Netflix"
    },
    {
      name: "Apple",
      src: "/logos/apple.png",
      alt: "Apple"
    },
    {
      name: "Meta",
      src: "/logos/meta.png",
      alt: "Meta"
    }
  ];

  return (
    <section className="w-full bg-default-background py-16">
      <div className="w-full px-6">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Empresas que confían en nosotros
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hemos trabajado con las mejores empresas para crear experiencias inolvidables
          </p>
        </div>

        {/* Infinite Carousel with fade overlays */}
        <div className="relative overflow-hidden w-full">
          {/* Left fade overlay */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgb(10, 10, 10) 0%, transparent 100%)'
            }}
          ></div>
          
          {/* Right fade overlay */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to left, rgb(10, 10, 10) 0%, transparent 100%)'
            }}
          ></div>
          
          <div className="flex animate-scroll-logos space-x-12">
            {/* Triple the logos for seamless infinite scroll */}
            {[...companyLogos, ...companyLogos, ...companyLogos].map((company, index) => (
              <img
                key={`scroll-${index}`}
                src={company.src}
                alt={company.alt}
                className="flex-none w-48 h-24 object-contain filter grayscale brightness-200 contrast-50 opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const textElement = document.createElement('div');
                  textElement.className = 'flex-none w-32 h-16 flex items-center justify-center text-white/50 text-sm font-medium';
                  textElement.textContent = company.name;
                  e.currentTarget.parentElement!.insertBefore(textElement, e.currentTarget);
                }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* CSS for infinite scroll animation */}
      <style jsx>{`
        @keyframes scroll-logos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        
        .animate-scroll-logos {
          animation: scroll-logos 45s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default CompanyLogos;