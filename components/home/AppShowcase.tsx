"use client";

import React from "react";

const AppShowcase = () => {
  return (
    <section className="w-full bg-default-background py-20">
      <div className="w-full px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Descubre los mejores eventos en{" "}
                <span className="text-white/60">tu ciudad</span>
              </h2>
              
              <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                Nuestra app móvil te permite explorar, filtrar y comprar tickets 
                para los eventos más exclusivos desde cualquier lugar.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {[
                {
                  icon: "🎯",
                  title: "Eventos Personalizados",
                  description: "Descubre eventos basados en tus gustos e intereses"
                },
                {
                  icon: "📍",
                  title: "Cerca de Ti",
                  description: "Encuentra eventos en tu ciudad o donde planees viajar"
                },
                {
                  icon: "⚡",
                  title: "Compra Rápida",
                  description: "Proceso de compra simplificado en segundos"
                },
                {
                  icon: "🎟️",
                  title: "Tickets Digitales",
                  description: "Todos tus tickets organizados en un solo lugar"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-4 group p-6 rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-white/5 hover:border-white/20"
                  style={{
                    animationName: 'fadeInLeft',
                    animationDuration: '0.8s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards',
                    animationDelay: `${index * 200}ms`,
                    background: 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button 
                className="flex items-center justify-center space-x-3 px-8 py-4 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.49-2.08-.49-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Descargar en</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </button>
              
              <button 
                className="flex items-center justify-center space-x-3 px-8 py-4 text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Disponible en</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right - iPhone 3D Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            
            {/* Background decorative elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>
            
            {/* iPhone 3D Container */}
            <div 
              className="relative z-10 perspective-1000"
              style={{
                animation: 'float3D 6s ease-in-out infinite'
              }}
            >
              {/* iPhone Frame */}
              <div 
                className="relative w-72 h-[600px] rounded-[3rem] border-8 shadow-2xl transform rotate-y-12 rotate-x-5"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
                  borderColor: '#404040',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 2px rgba(255,255,255,0.05)'
                }}
              >
                
                {/* Screen */}
                <div 
                  className="absolute inset-1 rounded-[2.8rem] overflow-hidden"
                  style={{
                    background: '#000000',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
                  }}
                >
                  
                  {/* App Interface Mockup */}
                  <div className="relative w-full h-full bg-black">
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center px-6 pt-4 pb-2">
                      <span className="text-white text-sm font-medium">9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="px-6 py-4">
                      <h3 className="text-white text-2xl font-black">Hunt</h3>
                      <p className="text-gray-400 text-sm">Eventos cerca de ti</p>
                    </div>
                    
                    {/* Featured Event Card */}
                    <div className="px-6 mb-4">
                      <div className="relative h-48 rounded-2xl overflow-hidden">
                        <div 
                          className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600"
                          style={{
                            backgroundImage: 'linear-gradient(45deg, #8B5CF6, #3B82F6)',
                          }}
                        ></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-xs opacity-80">HOY</p>
                          <h4 className="text-lg font-bold">Concierto Rock</h4>
                          <p className="text-sm opacity-90">Movistar Arena</p>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full">
                          <span className="text-white text-xs">$45.000</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    <div className="px-6 mb-4">
                      <div className="flex space-x-3">
                        {["🎵 Música", "🎭 Teatro", "🏃 Deportes"].map((category, index) => (
                          <div 
                            key={index}
                            className="px-4 py-2 bg-white/10 rounded-full"
                          >
                            <span className="text-white text-xs">{category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Event List */}
                    <div className="px-6 space-y-3">
                      {[1, 2, 3].map((_, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl"></div>
                          <div className="flex-1">
                            <h5 className="text-white text-sm font-medium">Evento {index + 1}</h5>
                            <p className="text-gray-400 text-xs">Venue Name</p>
                          </div>
                          <span className="text-white text-sm">$25k</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for 3D animations */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-y-12 {
          transform: rotateY(-12deg) rotateX(5deg);
        }
        
        @keyframes float3D {
          0%, 100% { 
            transform: rotateY(-12deg) rotateX(5deg) translateY(0px);
          }
          50% { 
            transform: rotateY(-15deg) rotateX(8deg) translateY(-10px);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default AppShowcase;