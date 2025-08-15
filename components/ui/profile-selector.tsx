"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId, useState, useEffect } from "react";
import { getLatestProducers } from "@/supabase/producersService";
import { Producer } from "@/types/site";

interface ProfileSelectorProps {
  onProfileChange?: (profileId: string) => void;
  className?: string;
}

export function ProfileSelector({ onProfileChange, className }: ProfileSelectorProps) {
  const id = useId();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<string>("");

  useEffect(() => {
    const fetchProducers = async () => {
      setLoading(true);
      try {
        const { data, error } = await getLatestProducers();
        if (error) {
          console.log("Error fetching producers:", error);
          setProducers([]);
        } else {
          setProducers(data || []);
          // Set first producer as default if available
          if (data && data.length > 0) {
            setSelectedProfile(data[0].id);
            onProfileChange?.(data[0].id);
          }
        }
      } catch (err) {
        console.error("Error:", err);
        setProducers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, [onProfileChange]);

  const handleValueChange = (value: string) => {
    setSelectedProfile(value);
    onProfileChange?.(value);
  };

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Label className="text-white/90 text-sm font-medium">Perfil Activo</Label>
        <div className="h-16 bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] rounded-xl animate-pulse shadow-lg shadow-black/20">
          <div className="flex items-center gap-3 p-3 h-full">
            <div className="w-10 h-10 bg-white/[0.15] rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-white/[0.15] rounded animate-pulse"></div>
              <div className="h-2 bg-white/[0.10] rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={id} className="text-white/90 text-sm font-medium">
        Perfil Activo
      </Label>
      <Select value={selectedProfile} onValueChange={handleValueChange}>
        <SelectTrigger
          id={id}
          className="h-auto ps-3 py-3 bg-white/[0.08] backdrop-blur-xl border border-white/[0.15] hover:border-white/[0.25] focus:border-white/[0.35] rounded-xl text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-white/[0.12] [&>span]:flex [&>span]:items-center [&>span]:gap-3 [&>span_img]:shrink-0"
        >
          <SelectValue placeholder="Seleccionar perfil" />
        </SelectTrigger>
        <SelectContent className="bg-black/80 backdrop-blur-2xl border border-white/[0.15] rounded-xl shadow-2xl shadow-black/50 [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-3">
          {producers.map((producer) => (
            <SelectItem 
              key={producer.id} 
              value={producer.id}
              className="hover:bg-white/[0.08] focus:bg-white/[0.12] rounded-lg mx-1 transition-all duration-200"
            >
              <span className="flex items-center gap-3">
                <div className="relative">
                  <img
                    className="rounded-full ring-2 ring-white/[0.15] shadow-md"
                    src={producer.logo || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                    alt={producer.name}
                    width={40}
                    height={40}
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                </div>
                <span>
                  <span className="block font-semibold text-white drop-shadow-sm">{producer.name}</span>
                  <span className="mt-0.5 block text-xs text-white/70 font-medium">
                    @{producer.name.toLowerCase().replace(/\s+/g, '')}
                  </span>
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}