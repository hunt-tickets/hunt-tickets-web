"use client";

import { useState, useCallback, useEffect } from "react";
import AppleWalletPass from "./apple-wallet-pass";
import { Upload, Download, RotateCcw, Check, Sun, Moon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerFormat,
  ColorPickerEyeDropper
} from "@/components/ui/color-picker";

interface WalletPassConfig {
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  logoUrl: string;
  stripImageUrl: string;
  iconUrl: string;
  eventName: string;
  venue: string;
  date: string;
  time: string;
  seatInfo: string;
  ticketNumber: string;
  organizerName: string;
  qrCodeValue: string;
  importantInfo: string;
  termsAndConditions: string;
}

interface AppleWalletCustomizerProps {
  eventData?: any;
  onSave?: (config: WalletPassConfig) => void;
}

const AppleWalletCustomizer = ({ eventData, onSave }: AppleWalletCustomizerProps) => {
  const [hasLoadedConfig, setHasLoadedConfig] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Function to ensure hex value has # prefix
  const formatHexColor = (hex: string | undefined | null): string => {
    if (!hex) return "#1a1a1a"; // Default fallback
    const cleanHex = hex.trim();
    return cleanHex.startsWith('#') ? cleanHex : `#${cleanHex}`;
  };
  
  const [config, setConfig] = useState<WalletPassConfig>(() => {
    // Try to load saved configuration from localStorage
    if (typeof window !== 'undefined' && eventData?.id) {
      const savedConfig = localStorage.getItem(`wallet-pass-config-${eventData.id}`);
      if (savedConfig) {
        try {
          setHasLoadedConfig(true);
          return JSON.parse(savedConfig);
        } catch (error) {
          console.error('Error loading saved configuration:', error);
        }
      }
    }
    
    // Default configuration
    return {
      backgroundColor: formatHexColor(eventData?.hex),
      foregroundColor: "#ffffff",
      labelColor: "#a0a0a0",
      logoUrl: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png",
      stripImageUrl: eventData?.flyer_apple || eventData?.flyer || "",
      iconUrl: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png",
      eventName: eventData?.name || "Nombre del Evento",
      venue: eventData?.location || "Ubicación del Evento",
      date: eventData?.date || "25 DIC 2024",
      time: eventData?.hour || "21:00",
      seatInfo: "GENERAL",
      ticketNumber: "TKT123456",
      organizerName: "HUNT",
      qrCodeValue: `https://hunt.com/events/${eventData?.id || 'event'}`,
      importantInfo: "Este ticket es personal e intransferible. No se aceptan devoluciones.",
      termsAndConditions: `• Este ticket es válido únicamente para la fecha y hora especificada
• No se permiten reembolsos ni cambios después de la compra
• Presentar identificación válida en el ingreso al evento
• Prohibido el reingreso al evento una vez se haya salido
• El ticket debe presentarse en formato digital o impreso
• La reventa de este ticket está prohibida
• El organizador se reserva el derecho de admisión
• En caso de cancelación del evento, se notificará con 48 horas de anticipación
• Los menores de edad deben estar acompañados por un adulto responsable
• No se permite el ingreso de elementos prohibidos según las normas del venue`,
    };
  });

  const updateConfig = (key: keyof WalletPassConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    setConfig({
      backgroundColor: formatHexColor(eventData?.hex),
      foregroundColor: "#ffffff",
      labelColor: "#a0a0a0",
      logoUrl: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png",
      stripImageUrl: eventData?.flyer_apple || eventData?.flyer || "",
      iconUrl: "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png",
      eventName: eventData?.name || "Nombre del Evento",
      venue: eventData?.location || "Ubicación del Evento",
      date: eventData?.date || "25 DIC 2024",
      time: eventData?.hour || "21:00",
      seatInfo: "GENERAL",
      ticketNumber: "TKT123456",
      organizerName: "HUNT",
      qrCodeValue: `https://hunt.com/events/${eventData?.id || 'event'}`,
      importantInfo: "Este ticket es personal e intransferible. No se aceptan devoluciones.",
      termsAndConditions: `• Este ticket es válido únicamente para la fecha y hora especificada
• No se permiten reembolsos ni cambios después de la compra
• Presentar identificación válida en el ingreso al evento
• Prohibido el reingreso al evento una vez se haya salido
• El ticket debe presentarse en formato digital o impreso
• La reventa de este ticket está prohibida
• El organizador se reserva el derecho de admisión
• En caso de cancelación del evento, se notificará con 48 horas de anticipación
• Los menores de edad deben estar acompañados por un adulto responsable
• No se permite el ingreso de elementos prohibidos según las normas del venue`,
    });
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wallet-pass-config-${eventData?.name?.replace(/\s+/g, '-').toLowerCase() || 'event'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImageUpload = useCallback((key: 'logoUrl' | 'stripImageUrl' | 'iconUrl', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateConfig(key, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls Section */}
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/[0.08] space-y-6">
          <h3 className="text-xl font-semibold text-white">Personalización</h3>
          
          {/* Colors Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Colores</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Fondo
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer shadow-sm hover:border-white/40 transition-colors"
                          style={{ backgroundColor: config.backgroundColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-[#1a1a1a] border-white/20">
                        <ColorPicker 
                          value={config.backgroundColor}
                          onChange={(color) => updateConfig('backgroundColor', color)}
                          className="w-full"
                        >
                          <ColorPickerSelection />
                          <div className="flex items-center gap-4 mt-3">
                            <ColorPickerEyeDropper />
                            <div className="w-full grid gap-2">
                              <ColorPickerHue />
                            </div>
                          </div>
                          <ColorPickerFormat className="mt-3" />
                        </ColorPicker>
                      </PopoverContent>
                    </Popover>
                    <input
                      type="text"
                      value={config.backgroundColor}
                      onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-white/5 border border-white/20 rounded-md text-white text-xs focus:border-white/40 focus:outline-none"
                      placeholder="#1a1a1a"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Texto
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer shadow-sm hover:border-white/40 transition-colors"
                          style={{ backgroundColor: config.foregroundColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-[#1a1a1a] border-white/20">
                        <ColorPicker 
                          value={config.foregroundColor}
                          onChange={(color) => updateConfig('foregroundColor', color)}
                          className="w-full"
                        >
                          <ColorPickerSelection />
                          <div className="flex items-center gap-4 mt-3">
                            <ColorPickerEyeDropper />
                            <div className="w-full grid gap-2">
                              <ColorPickerHue />
                            </div>
                          </div>
                          <ColorPickerFormat className="mt-3" />
                        </ColorPicker>
                      </PopoverContent>
                    </Popover>
                    <input
                      type="text"
                      value={config.foregroundColor}
                      onChange={(e) => updateConfig('foregroundColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-white/5 border border-white/20 rounded-md text-white text-xs focus:border-white/40 focus:outline-none"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Etiquetas
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer shadow-sm hover:border-white/40 transition-colors"
                          style={{ backgroundColor: config.labelColor }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-[#1a1a1a] border-white/20">
                        <ColorPicker 
                          value={config.labelColor}
                          onChange={(color) => updateConfig('labelColor', color)}
                          className="w-full"
                        >
                          <ColorPickerSelection />
                          <div className="flex items-center gap-4 mt-3">
                            <ColorPickerEyeDropper />
                            <div className="w-full grid gap-2">
                              <ColorPickerHue />
                            </div>
                          </div>
                          <ColorPickerFormat className="mt-3" />
                        </ColorPicker>
                      </PopoverContent>
                    </Popover>
                    <input
                      type="text"
                      value={config.labelColor}
                      onChange={(e) => updateConfig('labelColor', e.target.value)}
                      className="flex-1 px-2 py-1.5 bg-white/5 border border-white/20 rounded-md text-white text-xs focus:border-white/40 focus:outline-none"
                      placeholder="#a0a0a0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Imágenes</h4>
            
            <div className="space-y-4">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Logo (32x32px recomendado)
                </label>
                <div className="space-y-3">
                  <label className="relative w-16 h-16 rounded-lg border border-white/20 bg-white/5 overflow-hidden cursor-pointer hover:border-white/40 transition-colors group block">
                    <img 
                      src={config.logoUrl || "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png"} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.src = "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_logo.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('logoUrl', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Imagen de Fondo (375x160px recomendado)
                </label>
                <div className="space-y-3">
                  <label className="relative w-48 h-20 rounded-lg border border-white/20 bg-white/5 overflow-hidden cursor-pointer hover:border-white/40 transition-colors group block">
                    <img 
                      src={config.stripImageUrl || "https://via.placeholder.com/375x160/333/666?text=Sin+Imagen"} 
                      alt="Strip image preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/375x160/333/666?text=Sin+Imagen";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('stripImageUrl', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Icono Push (29x29px recomendado)
                </label>
                <div className="space-y-3">
                  <label className="relative w-16 h-16 rounded-lg border border-white/20 bg-white/5 overflow-hidden cursor-pointer hover:border-white/40 transition-colors group block">
                    <img 
                      src={config.iconUrl || "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png"} 
                      alt="Icon preview" 
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.currentTarget.src = "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('iconUrl', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Back Side Information Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white">Información de la Parte Trasera</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Información Importante
                </label>
                <textarea
                  value={config.importantInfo}
                  onChange={(e) => updateConfig('importantInfo', e.target.value)}
                  className="w-full px-3 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:border-white/40 focus:outline-none resize-none"
                  placeholder="Información importante sobre el ticket..."
                  rows={3}
                  maxLength={200}
                />
                <div className="text-xs text-white/50 mt-1">
                  {config.importantInfo.length}/200 caracteres
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Términos y Condiciones
                </label>
                <textarea
                  value={config.termsAndConditions}
                  onChange={(e) => updateConfig('termsAndConditions', e.target.value)}
                  className="w-full px-3 py-3 bg-white/5 border border-white/20 rounded-lg text-white text-sm focus:border-white/40 focus:outline-none resize-none"
                  placeholder="• Escriba aquí los términos y condiciones..."
                  rows={8}
                  maxLength={1500}
                />
                <div className="text-xs text-white/50 mt-1">
                  {config.termsAndConditions.length}/1500 caracteres
                </div>
                <div className="text-xs text-white/40 mt-1">
                  Tip: Use • para viñetas. Cada línea será un punto separado.
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {onSave && (
            <button
              onClick={() => onSave(config)}
              className="w-full px-6 py-3 bg-[#d9d9d9] hover:bg-white hover:scale-[1.02] rounded-xl transition-all duration-300 text-black font-medium"
            >
              Guardar Configuración
            </button>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className={`rounded-xl p-6 border transition-all duration-500 ${
            isDarkMode 
              ? 'bg-white/[0.02] border-white/10' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className={`text-xl font-semibold transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Vista Previa</h3>
                {hasLoadedConfig && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Config. cargada</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300"
                  title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
                </button>
                <button
                  onClick={resetToDefaults}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300"
                  title="Restablecer valores"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={exportConfig}
                  className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300"
                  title="Exportar configuración"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <AppleWalletPass {...config} />
            </div>
          </div>
          
          {/* Push Notification Preview */}
          <div className={`rounded-xl p-6 border transition-all duration-500 ${
            isDarkMode 
              ? 'bg-white/[0.02] border-white/10' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <h4 className={`text-lg font-medium mb-4 transition-colors duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Vista Previa Notificación Push</h4>
            <div className={`backdrop-blur-xl rounded-2xl p-4 max-w-sm mx-auto shadow-2xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-3xl group ${
              isDarkMode 
                ? 'bg-white/[0.15] border border-white/20 hover:bg-white/[0.2] hover:border-white/30' 
                : 'bg-black/80 border border-black/30 hover:bg-black/85 hover:border-black/40'
            }`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <img 
                    src={config.iconUrl || "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png"} 
                    alt="App icon" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://jtfcfsnksywotlbsddqb.supabase.co/storage/v1/object/public/default/hunt_app.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm drop-shadow-sm transition-all duration-300 group-hover:text-white/95 group-hover:drop-shadow-md">Hunt</span>
                    <span className="text-white/70 text-xs font-medium transition-opacity duration-300 group-hover:text-white/80">ahora</span>
                  </div>
                  <p className="text-white/95 text-sm leading-tight font-medium drop-shadow-sm transition-all duration-300 group-hover:text-white group-hover:drop-shadow-md">
                    Tu entrada para {config.eventName} está lista en Wallet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleWalletCustomizer;