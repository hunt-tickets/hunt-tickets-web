"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from 'qrcode.react';

interface AppleWalletPassProps {
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  logoUrl?: string;
  stripImageUrl?: string;
  eventName?: string;
  venue?: string;
  date?: string;
  time?: string;
  seatInfo?: string;
  ticketNumber?: string;
  organizerName?: string;
  qrCodeValue?: string;
  importantInfo?: string;
  termsAndConditions?: string;
  className?: string;
}

const AppleWalletPass = ({
  backgroundColor = "#1a1a1a",
  foregroundColor = "#ffffff",
  labelColor = "#a0a0a0",
  logoUrl,
  stripImageUrl,
  eventName = "Nombre del Evento",
  venue = "Ubicación del Evento",
  date = "25 DIC 2024",
  time = "21:00",
  seatInfo = "GENERAL",
  ticketNumber = "TKT123456",
  organizerName = "HUNT",
  qrCodeValue = "https://hunt.com/ticket/TKT123456",
  importantInfo = "Este ticket es personal e intransferible. No se aceptan devoluciones.",
  termsAndConditions = "• Este ticket es válido únicamente para la fecha y hora especificada\n• No se permiten reembolsos ni cambios después de la compra\n• Presentar identificación válida en el ingreso al evento",
  className = "",
}: AppleWalletPassProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Format date to remove year
  const formatDateWithoutYear = (dateString: string) => {
    // If date contains year (like "25 DIC 2024"), remove it and format
    return dateString.replace(/\s+\d{4}$/, '').replace(/,/g, '').toUpperCase();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      <div className="relative w-full h-[500px] perspective-1000">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
          style={{ cursor: 'pointer' }}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div
              className="relative w-full h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ backgroundColor }}
            >

        {/* Header Section Background */}
        <div 
          className="absolute top-0 left-0 right-0 h-20"
          style={{
            background: `linear-gradient(180deg, ${backgroundColor}E6 0%, ${backgroundColor}B3 100%)`
          }}
        />

        {/* Strip Image */}
        {stripImageUrl && (
          <div className="absolute top-20 left-0 right-0 h-24 overflow-hidden">
            <Image
              src={stripImageUrl}
              alt="Strip image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        )}

        {/* Header Fields */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
          {/* Logo */}
          <div className="w-20 h-10 flex items-center justify-center">
            <Image
              src={logoUrl || "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png"}
              alt="Logo"
              width={80}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Date and Time - Header Field */}
          <div className="text-right">
            <div className="text-xs font-medium uppercase tracking-wide" style={{ color: labelColor }}>
              {time}
            </div>
            <div className="text-sm font-semibold" style={{ color: foregroundColor }}>
              {formatDateWithoutYear(date)}
            </div>
          </div>
        </div>

        {/* Secondary Fields - Event Info */}
        <div className={`absolute ${stripImageUrl ? 'top-48' : 'top-28'} left-6 right-6`}>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: labelColor }}>
                EVENTO
              </div>
              <div className="text-lg font-bold" style={{ color: foregroundColor }}>
                {eventName}
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: labelColor }}>
                  ENTRADA
                </div>
                <div className="text-sm font-semibold" style={{ color: foregroundColor }}>
                  {seatInfo}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: labelColor }}>
                  UBICACIÓN
                </div>
                <div className="text-sm font-semibold" style={{ color: foregroundColor }}>
                  {venue}
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* QR Code */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-center">
          <div className="bg-white rounded-xl p-3">
            <QRCodeSVG
              value={qrCodeValue}
              size={100}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
        </div>

        {/* App Logo */}
        <div className="absolute bottom-4 left-4">
          <Image
            src="https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png"
            alt="Hunt App"
            width={20}
            height={20}
            className="rounded-md"
          />
        </div>

        {/* Pass Border */}
        <div className="absolute inset-0 rounded-2xl border border-white/20" />
        
        {/* Subtle Inner Shadow */}
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)`
          }}
        />
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div
              className="relative w-full h-full rounded-2xl shadow-2xl"
              style={{ backgroundColor }}
            >
              {/* Header */}
              <div className="absolute top-6 left-6 right-6 text-center">
                <h3 className="text-lg font-bold" style={{ color: foregroundColor }}>
                  Información del Evento
                </h3>
              </div>

              {/* Scrollable Content */}
              <div className="absolute top-16 left-0 right-0 bottom-12 overflow-y-auto px-6" style={{ maxHeight: 'calc(100% - 112px)' }}>
                <div className="space-y-6 pb-4">
                  {/* Important Info */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: labelColor }}>
                      INFORMACIÓN IMPORTANTE
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: foregroundColor }}>
                      {importantInfo}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: labelColor }}>
                      TÉRMINOS Y CONDICIONES
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: `${foregroundColor}CC` }}>
                      {termsAndConditions.split('\n').map((line, index) => (
                        <div key={index} className="mb-1">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flip instruction */}
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <div className="text-xs" style={{ color: labelColor }}>
                  Toca para voltear
                </div>
              </div>

              {/* Pass Border */}
              <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none" />
              
              {/* Rounded corners mask */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ zIndex: -1 }}>
                <div className="w-full h-full" style={{ backgroundColor }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for 3D flip effect */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default AppleWalletPass;