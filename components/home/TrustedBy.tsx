const TrustedBy = () => {
  const companies = [
    { 
      name: "Spotify", 
      logo: "https://logo.clearbit.com/spotify.com"
    },
    { 
      name: "Apple", 
      logo: "https://logo.clearbit.com/apple.com"
    },
    { 
      name: "Nike", 
      logo: "https://logo.clearbit.com/nike.com"
    },
    { 
      name: "Netflix", 
      logo: "https://logo.clearbit.com/netflix.com"
    },
    { 
      name: "Tesla", 
      logo: "https://logo.clearbit.com/tesla.com"
    },
    { 
      name: "Google", 
      logo: "https://logo.clearbit.com/google.com"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-black via-gray-900 to-black py-20 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
          animation: 'pulse 4s ease-in-out infinite'
        }}></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="text-white/40 text-xs uppercase tracking-[0.3em] font-light mb-4 block">
              Trusted by
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-white/30"></div>
              <div className="w-2 h-2 bg-white/20 rotate-45"></div>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-white/30"></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
          {companies.map((company, index) => (
            <div 
              key={company.name}
              className="group relative"
              style={{ 
                animationDelay: `${index * 200}ms`,
              }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/5 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Logo container */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={company.logo} 
                    alt={`${company.name} logo`}
                    className="w-8 h-8 md:w-10 md:h-10 opacity-30 group-hover:opacity-100 transition-all duration-500 filter drop-shadow-lg group-hover:scale-110 object-contain"
                  />
                </div>
                
                {/* Rotating border */}
                <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors duration-500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.2), transparent)',
                  animation: 'spin 2s linear infinite',
                  mask: 'radial-gradient(circle, transparent 50%, black 51%)'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;