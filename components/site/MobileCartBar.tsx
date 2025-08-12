"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/sub/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/UserContext";
import { useEmailAuth } from "@/hook/useEmailAuth";
import { useVariableFee } from "@/hook/useVariableFee";
import { useBoldCheckout } from "@/hook/useBoldCheckout";
import { useCreateTransaction } from "@/hook/useCreateTransaction";
import { useProfiles } from "@/hook/useProfiles";
import TermsCheckbox from "@/components/site/TermsCheckbox";
import FullscreenSelector from "@/components/site/FullscreenSelector";
import { motion, AnimatePresence } from "framer-motion";
import { numberToSpanish } from "@/utils/numberToSpanish";

type CartState = 'initial' | 'email' | 'otp' | 'profile' | 'summary';

// Constantes para animaciones
const CUSTOM_EASING = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  anticipate: [0.175, 0.885, 0.32, 1.275],
  gentle: [0.4, 0, 0.2, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
} as const;

const CONTENT_VARIANTS = {
  initial: { 
    opacity: 0, 
    y: 20, 
    scale: 0.97,
    filter: "blur(4px)"
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: CUSTOM_EASING.smooth,
      opacity: { duration: 0.3 },
      scale: { duration: 0.4, ease: CUSTOM_EASING.anticipate },
      y: { duration: 0.4, ease: CUSTOM_EASING.gentle },
      filter: { duration: 0.3 }
    }
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    scale: 0.98,
    filter: "blur(2px)",
    transition: {
      duration: 0.3,
      ease: CUSTOM_EASING.gentle,
      opacity: { duration: 0.2 }
    }
  }
};


// Función para obtener SVG de banderas
const getFlagSvg = (prefix: string) => {
  switch(prefix) {
    case '+57': return ( // Colombia
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFDA44" d="M0 0h513v342H0z"/>
        <path fill="#D80027" d="M0 256.5h513V342H0z"/>
        <path fill="#0052B4" d="M0 171h513v85.5H0z"/>
      </svg>
    );
    case '+1': return ( // Estados Unidos / Canadá
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#B22234" d="M0 0h513v342H0z"/>
        <path fill="#FFFFFF" d="M0 26.3h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0z"/>
        <path fill="#3C3B6E" d="M0 0h256.5v184.1H0z"/>
      </svg>
    );
    case '+34': return ( // España
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#AD1519" d="M0 0h513v342H0z"/>
        <path fill="#FFDA44" d="M0 85.5h513v171H0z"/>
      </svg>
    );
    case '+52': return ( // México
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M171 0h171v342H171z"/>
        <path fill="#006847" d="M0 0h171v342H0z"/>
        <path fill="#CE1126" d="M342 0h171v342H342z"/>
      </svg>
    );
    case '+33': return ( // Francia
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M171 0h171v342H171z"/>
        <path fill="#002654" d="M0 0h171v342H0z"/>
        <path fill="#CE1126" d="M342 0h171v342H342z"/>
      </svg>
    );
    case '+49': return ( // Alemania
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#000000" d="M0 0h513v114H0z"/>
        <path fill="#DD0000" d="M0 114h513v114H0z"/>
        <path fill="#FFCE00" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+44': return ( // Reino Unido
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#012169" d="M0 0h513v342H0z"/>
        <path fill="#FFFFFF" d="m0 0 513 342M513 0 0 342"/>
        <path fill="#C8102E" d="m0 0 513 342M513 0 0 342"/>
        <path fill="#FFFFFF" d="M213.3 0v342h86.4V0z"/>
        <path fill="#FFFFFF" d="M0 113.4v115.2h513V113.4z"/>
        <path fill="#C8102E" d="M0 137.8v66.4h513V137.8z"/>
        <path fill="#C8102E" d="M233.4 0v342h46.2V0z"/>
      </svg>
    );
    case '+54': return ( // Argentina
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#74ACDF" d="M0 0h513v114H0z"/>
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#74ACDF" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+55': return ( // Brasil
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#009739" d="M0 0h513v342H0z"/>
        <path fill="#FEDF00" d="M256.5 171 467.8 89.5l0 163L256.5 171z"/>
        <path fill="#FEDF00" d="M256.5 171 45.2 89.5l0 163L256.5 171z"/>
        <path fill="#FEDF00" d="M256.5 171 467.8 252.5l0-163L256.5 171z"/>
        <path fill="#FEDF00" d="M256.5 171 45.2 252.5l0-163L256.5 171z"/>
      </svg>
    );
    case '+56': return ( // Chile
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M0 0h513v171H0z"/>
        <path fill="#D52B1E" d="M0 171h513v171H0z"/>
        <path fill="#0039A6" d="M0 0h171v171H0z"/>
      </svg>
    );
    case '+58': return ( // Venezuela
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFDA44" d="M0 0h513v114H0z"/>
        <path fill="#0052B4" d="M0 114h513v114H0z"/>
        <path fill="#D80027" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+39': return ( // Italia
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M171 0h171v342H171z"/>
        <path fill="#009246" d="M0 0h171v342H0z"/>
        <path fill="#CE2B37" d="M342 0h171v342H342z"/>
      </svg>
    );
    case '+351': return ( // Portugal
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FF0000" d="M205.2 0h307.8v342H205.2z"/>
        <path fill="#046A38" d="M0 0h205.2v342H0z"/>
      </svg>
    );
    case '+31': return ( // Países Bajos
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#21468B" d="M0 228h513v114H0z"/>
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#AE1C28" d="M0 0h513v114H0z"/>
      </svg>
    );
    case '+32': return ( // Bélgica
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFDA44" d="M342 0h171v342H342z"/>
        <path fill="#FFFFFF" d="M171 0h171v342H171z"/>
        <path fill="#000000" d="M0 0h171v342H0z"/>
      </svg>
    );
    case '+41': return ( // Suiza
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FF0000" d="M0 0h513v342H0z"/>
        <path fill="#FFFFFF" d="M205.2 137.1h102.6v68.4H205.2z"/>
        <path fill="#FFFFFF" d="M239.4 102.9h34.2v136.8h-34.2z"/>
      </svg>
    );
    case '+43': return ( // Austria
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#ED2939" d="M0 0h513v114H0z"/>
        <path fill="#ED2939" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+45': return ( // Dinamarca
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#C8102E" d="M0 0h513v342H0z"/>
        <path fill="#FFFFFF" d="M205.2 0h34.2v342h-34.2z"/>
        <path fill="#FFFFFF" d="M0 153.9h513v34.2H0z"/>
      </svg>
    );
    case '+46': return ( // Suecia
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#006AA7" d="M0 0h513v342H0z"/>
        <path fill="#FECC00" d="M205.2 0h34.2v342h-34.2z"/>
        <path fill="#FECC00" d="M0 153.9h513v34.2H0z"/>
      </svg>
    );
    case '+47': return ( // Noruega
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#EF2B2D" d="M0 0h513v342H0z"/>
        <path fill="#FFFFFF" d="M205.2 0h34.2v342h-34.2z"/>
        <path fill="#FFFFFF" d="M0 153.9h513v34.2H0z"/>
        <path fill="#002868" d="M222.6 0h17.1v342h-17.1z"/>
        <path fill="#002868" d="M0 162.6h513v17.1H0z"/>
      </svg>
    );
    case '+48': return ( // Polonia
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M0 0h513v171H0z"/>
        <path fill="#DC143C" d="M0 171h513v171H0z"/>
      </svg>
    );
    case '+591': return ( // Bolivia
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#D52B1E" d="M0 0h513v114H0z"/>
        <path fill="#FFDA44" d="M0 114h513v114H0z"/>
        <path fill="#007934" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+506': return ( // Costa Rica
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#0052B4" d="M0 0h513v68.4H0z"/>
        <path fill="#FFFFFF" d="M0 68.4h513v68.4H0z"/>
        <path fill="#D80027" d="M0 136.8h513v68.4H0z"/>
        <path fill="#FFFFFF" d="M0 205.2h513v68.4H0z"/>
        <path fill="#0052B4" d="M0 273.6h513v68.4H0z"/>
      </svg>
    );
    case '+593': return ( // Ecuador
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFDA44" d="M0 0h513v171H0z"/>
        <path fill="#0052B4" d="M0 171h513v85.5H0z"/>
        <path fill="#D80027" d="M0 256.5h513v85.5H0z"/>
      </svg>
    );
    case '+503': return ( // El Salvador
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#0052B4" d="M0 0h513v114H0z"/>
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#0052B4" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+502': return ( // Guatemala
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#4997D0" d="M0 0h171v342H0z"/>
        <path fill="#FFFFFF" d="M171 0h171v342H171z"/>
        <path fill="#4997D0" d="M342 0h171v342H342z"/>
      </svg>
    );
    case '+592': return ( // Guyana
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#009E49" d="M0 0h513v342H0z"/>
        <path fill="#FFFFFF" d="M0 0L513 171L0 342V0z"/>
        <path fill="#FCD116" d="M0 0L513 171L0 342V0z"/>
      </svg>
    );
    case '+504': return ( // Honduras
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#0073CE" d="M0 0h513v114H0z"/>
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#0073CE" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+505': return ( // Nicaragua
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#0067CE" d="M0 0h513v114H0z"/>
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#0067CE" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+507': return ( // Panamá
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M0 0h256.5v171H0z"/>
        <path fill="#D80027" d="M256.5 0h256.5v171H256.5z"/>
        <path fill="#0052B4" d="M0 171h256.5v171H0z"/>
        <path fill="#FFFFFF" d="M256.5 171h256.5v171H256.5z"/>
      </svg>
    );
    case '+595': return ( // Paraguay
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#D52B1E" d="M0 0h513v114H0z"/>
        <path fill="#FFFFFF" d="M0 114h513v114H0z"/>
        <path fill="#0038A8" d="M0 228h513v114H0z"/>
      </svg>
    );
    case '+51': return ( // Perú
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#D91023" d="M0 0h171v342H0z"/>
        <path fill="#FFFFFF" d="M171 0h171v342H171z"/>
        <path fill="#D91023" d="M342 0h171v342H342z"/>
      </svg>
    );
    case '+597': return ( // Surinam
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#377E3F" d="M0 0h513v68.4H0z"/>
        <path fill="#FFFFFF" d="M0 68.4h513v34.2H0z"/>
        <path fill="#B40A2E" d="M0 102.6h513v136.8H0z"/>
        <path fill="#FFFFFF" d="M0 239.4h513v34.2H0z"/>
        <path fill="#377E3F" d="M0 273.6h513v68.4H0z"/>
      </svg>
    );
    case '+598': return ( // Uruguay
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#FFFFFF" d="M0 0h513v342H0z"/>
        <path fill="#0038A8" d="M0 38h513v38H0z"/>
        <path fill="#0038A8" d="M0 114h513v38H0z"/>
        <path fill="#0038A8" d="M0 190h513v38H0z"/>
        <path fill="#0038A8" d="M0 266h513v38H0z"/>
        <path fill="#FFFFFF" d="M0 0h171v171H0z"/>
      </svg>
    );
    default: return ( // Bandera genérica
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342">
        <path fill="#CCCCCC" d="M0 0h513v342H0z"/>
        <path fill="#999999" d="M0 114h513v114H0z"/>
      </svg>
    );
  }
};

// Lista de países
const COUNTRIES = [
  { code: '+57', country: 'Colombia' },
  { code: '+49', country: 'Alemania' },
  { code: '+54', country: 'Argentina' },
  { code: '+43', country: 'Austria' },
  { code: '+32', country: 'Bélgica' },
  { code: '+591', country: 'Bolivia' },
  { code: '+55', country: 'Brasil' },
  { code: '+1', country: 'Canadá' },
  { code: '+56', country: 'Chile' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+593', country: 'Ecuador' },
  { code: '+503', country: 'El Salvador' },
  { code: '+45', country: 'Dinamarca' },
  { code: '+34', country: 'España' },
  { code: '+1', country: 'Estados Unidos' },
  { code: '+33', country: 'Francia' },
  { code: '+502', country: 'Guatemala' },
  { code: '+592', country: 'Guyana' },
  { code: '+504', country: 'Honduras' },
  { code: '+39', country: 'Italia' },
  { code: '+52', country: 'México' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+47', country: 'Noruega' },
  { code: '+31', country: 'Países Bajos' },
  { code: '+507', country: 'Panamá' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Perú' },
  { code: '+48', country: 'Polonia' },
  { code: '+351', country: 'Portugal' },
  { code: '+1', country: 'Puerto Rico' },
  { code: '+44', country: 'Reino Unido' },
  { code: '+1', country: 'República Dominicana' },
  { code: '+46', country: 'Suecia' },
  { code: '+41', country: 'Suiza' },
  { code: '+597', country: 'Surinam' },
  { code: '+598', country: 'Uruguay' },
  { code: '+58', country: 'Venezuela' }
];

interface MobileCartBarProps {
  selectedBox: {
    id: string;
    name: string;
    price: number;
    capacity: number;
    description: string;
    sectionTitle?: string;
    sectionColor?: string;
  } | null;
  onContinue: () => void;
  onClear: () => void;
  eventId: string;
  sellerUid: string;
}

const MobileCartBar = ({ selectedBox, onContinue, onClear, eventId, sellerUid }: MobileCartBarProps) => {
  
  const { user } = useUser();
  const { profile, updateUserProfile } = useProfiles();
  const { signInWithEmail, verifyOTP, resendOTP, loading: authLoading, error: authError } = useEmailAuth();
  const { fee, loading: feeLoading } = useVariableFee(eventId);
  const { createTransaction } = useCreateTransaction();
  
  const [state, setState] = useState<CartState>('initial');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPalcoDescription, setShowPalcoDescription] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estados para el formulario de perfil
  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    document_id: '',
    document_type_id: '1', // CC por defecto
    phone: '',
    phonePrefix: '+57', // Colombia por defecto
    birthdate: ''
  });
  
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [showDaySelect, setShowDaySelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showDocumentTypeSelect, setShowDocumentTypeSelect] = useState(false);
  
  // Refs para auto-focus
  const emailInputRef = useRef<HTMLInputElement>(null);
  const firstOTPInputRef = useRef<HTMLInputElement>(null);
  const countryButtonRef = useRef<HTMLButtonElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Función para transiciones suaves con Framer Motion
  const transitionToState = (newState: CartState) => {
    setState(newState);
  };

  // Cálculos de precio memoizados
  const priceCalculations = useMemo(() => {
    const basePrice = selectedBox ? selectedBox.price : 0;
    const discountAmount = appliedCoupon ? basePrice * (appliedCoupon.discount / 100) : 0;
    const priceAfterDiscount = basePrice - discountAmount;
    const serviceFee = priceAfterDiscount * (fee ?? 0.16);
    const iva = serviceFee * 0.19;
    const finalTotal = selectedBox ? Math.ceil(priceAfterDiscount + serviceFee + iva) : 0;
    
    return { basePrice, discountAmount, priceAfterDiscount, serviceFee, iva, finalTotal };
  }, [selectedBox?.price, appliedCoupon, fee]);

  const { basePrice, discountAmount, priceAfterDiscount, serviceFee, iva, finalTotal } = priceCalculations;

  // Funciones para manejar cupones
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Simulación de validación de cupón (sin backend por ahora)
    const mockCoupons = {
      'DESCUENTO10': 10,
      'PROMO20': 20,
      'VIP15': 15,
    };
    
    const discount = mockCoupons[couponCode.toUpperCase() as keyof typeof mockCoupons];
    
    if (discount) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), discount });
      setCouponCode('');
      setShowCouponInput(false);
    } else {
      // Aquí podrías mostrar un error de cupón inválido
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Función para validar si el perfil está incompleto
  const isProfileIncomplete = (profile: any) => {
    if (!profile) return true;
    const requiredFields = [
      "name",
      "lastName", 
      "phone",
      "birthdate",
      "document_type_id",
      "document_id",
    ];
    return requiredFields.some((field) => !profile[field]);
  };

  // Constantes para tipos de documento
  const DOCUMENT_TYPES = {
    "6e4f3991-6485-4c18-8984-68524176b6c9": "CC",
    "20d5a746-8eca-46a4-8f78-80f73f7b216e": "PP", 
    "6e016b3b-5696-4480-b554-0a8519e4293b": "CE",
    "84b5bc42-7642-4bf7-8855-65270048c189": "NIT",
    "c51c1ce0-aa61-4400-b31a-ffd127339d4f": "TI",
  } as const;

  // Obtener tipo de documento
  const getDocumentType = (id: string): string => DOCUMENT_TYPES[id as keyof typeof DOCUMENT_TYPES] || "CC";

  // Preparar datos para Bold
  const orderId = `ORDER-${user?.id || 'guest'}-${Date.now()}`;
  const dialCode = profile?.phone?.startsWith("57") ? "+57" : "";
  const phone = profile?.phone?.replace(/^57/, "") || "0000000000";
  const documentType = profile ? getDocumentType(profile.document_type_id) : "CC";

  
  const { open: openBoldCheckout } = useBoldCheckout({
    amount: finalTotal,
    description: selectedBox ? `Palco ${selectedBox.name} - ${selectedBox.description}` : '',
    customerData: {
      email: user?.email || email,
      fullName: profile ? `${profile.name} ${profile.lastName}` : 'Cliente',
      phone,
      dialCode,
      documentNumber: profile?.document_id || "12345678",
      documentType,
    },
    orderId,
  });


  // Reset state when user changes - ONLY if we're in the email/otp flow
  useEffect(() => {
    if (user && (state === 'email' || state === 'otp')) {
      // User just logged in via OTP, transition to summary
      setState('summary');
      setTermsAccepted(false);
    }
  }, [user, state]);

  // Reset expansion when changing states
  useEffect(() => {
    if (state !== 'initial') {
      setIsExpanded(false);
    }
  }, [state]);

  // Notify parent about expansion changes

  // Countdown for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);


  // Verificar perfil incompleto cuando user o profile cambian
  useEffect(() => {
    // Solo verificar si estamos en estado inicial y el usuario está autenticado
    if (state === 'initial' && user && profile !== undefined) {
      // Si el perfil está incompleto, cambiar automáticamente al estado profile
      if (isProfileIncomplete(profile)) {
        // Pequeño delay para evitar transiciones abruptas
        setTimeout(() => {
          if (state === 'initial') { // Verificar que aún estemos en initial
            transitionToState('profile');
          }
        }, 500);
      }
    }
  }, [user, profile, state]);

  // Pre-cargar datos del perfil si existen
  useEffect(() => {
    if (profile && state === 'profile') {
      setProfileData(prev => ({
        name: profile.name || prev.name,
        lastName: profile.lastName || prev.lastName,
        document_id: profile.document_id || prev.document_id,
        document_type_id: profile.document_type_id || prev.document_type_id,
        phone: profile.phone ? profile.phone.replace(/^\+\d{1,4}/, '') : prev.phone, // Remover prefijo
        phonePrefix: profile.phone ? (profile.phone.match(/^\+\d{1,4}/) || ['+57'])[0] : prev.phonePrefix,
        birthdate: profile.birthdate || prev.birthdate
      }));
    }
  }, [profile, state]);

  // Cerrar dropdown de países cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        showCountrySelect && 
        countryDropdownRef.current && 
        !countryDropdownRef.current.contains(target) &&
        countryButtonRef.current &&
        !countryButtonRef.current.contains(target)
      ) {
        setShowCountrySelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCountrySelect]);

  // Debug log para ver el estado del birthdate
  useEffect(() => {
    console.log('🗓️ Birthdate changed:', profileData.birthdate);
    if (profileData.birthdate) {
      const parts = profileData.birthdate.split('-');
      console.log('🗓️ Parts:', { year: parts[0], month: parts[1], day: parts[2] });
    }
  }, [profileData.birthdate]);

  if (!selectedBox) return null;

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const sectionColor = selectedBox.sectionColor || "#FFD700";

  // Handlers
  const handleInitialContinue = () => {
    if (user) {
      // Usuario ya autenticado, verificar si el perfil está completo
      if (isProfileIncomplete(profile)) {
        transitionToState('profile');
      } else {
        transitionToState('summary');
      }
    } else {
      // Usuario no autenticado, iniciar flujo de login
      transitionToState('email');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!email || email.trim().length === 0) {
      setLocalError('Por favor ingresa tu dirección de email');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('El formato del email no es válido. Ejemplo: usuario@dominio.com');
      return;
    }

    if (email.trim().length > 100) {
      setLocalError('El email es demasiado largo');
      return;
    }

    const result = await signInWithEmail(email);
    if (result.success) {
      transitionToState('otp');
      setCountdown(60);
    } else {
      setLocalError(result.error || 'Error al enviar el código');
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      if (index === 5 && value) {
        handleOTPSubmit(newOTP.join(''));
      }
    }
  };

  const handleOTPSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length === 0) {
      setLocalError('Por favor ingresa el código de verificación');
      return;
    }
    
    if (code.length !== 6) {
      setLocalError('El código debe tener exactamente 6 dígitos');
      return;
    }
    
    if (!/^\d{6}$/.test(code)) {
      setLocalError('El código solo debe contener números');
      return;
    }

    setLocalError(null);
    const result = await verifyOTP(email, code);
    if (result.success) {
      // Esperar un momento para que el contexto se actualice
      setTimeout(() => {
        if (isProfileIncomplete(profile)) {
          transitionToState('profile');
        } else {
          transitionToState('summary');
        }
      }, 500);
    } else {
      setLocalError('El código ingresado es incorrecto. Verifica que sea el código más reciente enviado a tu email.');
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    const result = await resendOTP(email);
    if (result.success) {
      setCountdown(60);
      setOTP(['', '', '', '', '', '']);
      setLocalError(null);
    }
  };

  // Función de validación detallada
  const validateProfileData = () => {
    const errors = [];

    // Validar nombre
    if (!profileData.name || profileData.name.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    // Validar apellido
    if (!profileData.lastName || profileData.lastName.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    // Validar documento
    if (!profileData.document_id || profileData.document_id.trim().length === 0) {
      errors.push('Por favor ingresa tu número de documento');
    } else if (!/^[A-Za-z0-9]+$/.test(profileData.document_id.trim())) {
      errors.push('El documento solo debe contener letras y números, sin espacios ni caracteres especiales');
    } else {
      const docLength = profileData.document_id.trim().length;
      if (profileData.document_type_id === '1' && (docLength < 6 || docLength > 10)) { // CC
        errors.push('La cédula de ciudadanía debe tener entre 6 y 10 dígitos');
      } else if (profileData.document_type_id === '2' && (docLength < 6 || docLength > 12)) { // CE
        errors.push('La cédula de extranjería debe tener entre 6 y 12 caracteres');
      } else if (profileData.document_type_id === '3' && (docLength < 6 || docLength > 15)) { // PP
        errors.push('El pasaporte debe tener entre 6 y 15 caracteres');
      } else if (docLength < 6) {
        errors.push('El número de documento debe tener al menos 6 caracteres');
      }
    }

    // Validar teléfono
    if (!profileData.phone || profileData.phone.trim().length === 0) {
      errors.push('Por favor ingresa tu número de teléfono');
    } else if (!/^\d+$/.test(profileData.phone.trim())) {
      errors.push('El teléfono solo debe contener números, sin espacios ni guiones');
    } else if (profileData.phone.trim().length < 7) {
      errors.push('El número de teléfono debe tener al menos 7 dígitos');
    } else if (profileData.phone.trim().length > 15) {
      errors.push('El número de teléfono es demasiado largo');
    } else if (profileData.phonePrefix === '+57' && profileData.phone.trim().length !== 10) {
      errors.push('Los números colombianos deben tener exactamente 10 dígitos');
    }

    // Validar fecha de nacimiento
    if (!profileData.birthdate) {
      errors.push('Debes seleccionar tu fecha de nacimiento');
    } else {
      const birthDate = new Date(profileData.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 12) {
        errors.push('Debes tener al menos 12 años para registrarte');
      } else if (age > 120) {
        errors.push('Por favor verifica tu fecha de nacimiento');
      }
    }

    return errors;
  };

  // Manejar envío del formulario de perfil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsCreatingProfile(true);

    // Validar todos los campos
    const validationErrors = validateProfileData();
    
    if (validationErrors.length > 0) {
      setLocalError(validationErrors[0]); // Mostrar el primer error
      setIsCreatingProfile(false);
      return;
    }

    try {
      // Combinar teléfono con prefijo
      const fullPhoneNumber = `${profileData.phonePrefix}${profileData.phone}`;
      const profileDataWithFullPhone = {
        ...profileData,
        phone: fullPhoneNumber
      };
      
      // Usar el hook de perfiles para crear/actualizar
      const result = await updateUserProfile(profileDataWithFullPhone);
      
      if (result) {
        transitionToState('summary');
      } else {
        setLocalError('No se pudo guardar tu información. Verifica tu conexión a internet e intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      if (error instanceof Error && error.message.includes('network')) {
        setLocalError('Sin conexión a internet. Verifica tu conexión e intenta nuevamente.');
      } else if (error instanceof Error && error.message.includes('duplicate')) {
        setLocalError('Ya existe una cuenta con este documento. Intenta con otro número.');
      } else {
        setLocalError('Error al procesar tu información. Por favor intenta nuevamente en unos momentos.');
      }
    } finally {
      setIsCreatingProfile(false);
    }
  };

  // FLUJO DE PAGO CORREGIDO con validación de transacción
  const handlePayment = async () => {
    if (!profile || !user?.id || !selectedBox || !termsAccepted) return;
    
    setIsProcessingPayment(true);
    setLocalError(null);
    
    try {
      const transactionData = {
        p_order: orderId,
        p_user_id: user.id,
        p_seller_uid: sellerUid || null, // Manejar caso cuando no hay sellerUid
        p_ticket_id: selectedBox.id, // El ID del box ES el ticket_id
        p_price: selectedBox.price,
        p_variable_fee: fee ? selectedBox.price * fee : selectedBox.price * 0.16,
        p_tax: (fee ? selectedBox.price * fee : selectedBox.price * 0.16) * 0.19,
        p_quantity: 1,
        p_total: finalTotal,
      };

      console.log('🔍 [MobileCartBar] Datos de transacción para palco:', {
        selectedBox: {
          id: selectedBox.id,
          name: selectedBox.name,
          price: selectedBox.price,
          capacity: selectedBox.capacity
        },
        transactionData,
        user: { id: user.id, email: user.email },
        sellerUid: {
          original: sellerUid,
          processed: sellerUid || null,
          isUndefined: sellerUid === undefined,
          isEmpty: !sellerUid
        },
        fee
      });

      // Crear la transacción - Si no hay error, la transacción fue exitosa
      const response = await createTransaction(transactionData);
      
      // Verificar si la transacción falló (null) o tiene error explícito
      if (!response || response === null || (typeof response === 'object' && 'error' in response)) {
        throw new Error(response?.error || 'La transacción no se pudo crear correctamente');
      }

      // Si llegamos aquí, la transacción fue exitosa (createTransaction no lanzó excepción)
      console.log('✅ Transacción creada exitosamente:', response);
      
      // Proceder con Bold SOLO si la transacción fue exitosa
      setIsProcessingPayment(false); // Desbloquear el botón primero
      
      // Crear y hacer clic en un botón temporal para abrir Bold
      const tempButton = document.createElement('button');
      tempButton.setAttribute('data-bold-payment-button', 'true');
      tempButton.style.display = 'none';
      document.body.appendChild(tempButton);
      
      // Dar tiempo para que el listener se registre
      setTimeout(() => {
        tempButton.click();
        
        // Limpiar el botón temporal
        setTimeout(() => {
          document.body.removeChild(tempButton);
        }, 100);
      }, 100);
      
      // Limpiar la UI después de que Bold haya tenido tiempo de inicializar
      setTimeout(() => {
        onContinue();
      }, 500);
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      // Mensaje de error más específico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setLocalError(`No se pudo procesar tu solicitud: ${errorMessage}. Por favor intenta nuevamente.`);
      
      // Asegurarse de que NO se abra el checkout en caso de error
      setIsProcessingPayment(false);
      // NO llamar a onContinue() ni openBoldCheckout() aquí
      return; // Salir explícitamente de la función
    }
  };

  const handleBack = () => {
    switch (state) {
      case 'email':
        transitionToState('initial');
        break;
      case 'otp':
        transitionToState('email');
        setOTP(['', '', '', '', '', '']);
        break;
      case 'profile':
        // Si el usuario ya estaba logueado, volver al estado inicial
        // Si no, volver al estado de OTP
        transitionToState(user ? 'initial' : 'otp');
        break;
      case 'summary':
        // Si el usuario ya estaba logueado, volver al estado inicial
        // Si no, volver al estado de email para poder cambiar el correo
        transitionToState(user ? 'initial' : 'email');
        break;
    }
  };

  const shouldBlurBackground = state !== 'initial';



  return (
    <>
      {/* Backdrop blur overlay */}
      <AnimatePresence>
        {shouldBlurBackground && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ 
              opacity: 1, 
              backdropFilter: 'blur(8px)',
              transition: {
                duration: 0.4,
                ease: CUSTOM_EASING.gentle,
                backdropFilter: { duration: 0.5 }
              }
            }}
            exit={{ 
              opacity: 0, 
              backdropFilter: 'blur(0px)',
              transition: {
                duration: 0.3,
                ease: CUSTOM_EASING.gentle
              }
            }}
            className="lg:hidden fixed inset-0 z-40"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ y: 120, opacity: 0, scale: 0.95 }}
        animate={{ 
          y: 0, 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.6,
            ease: CUSTOM_EASING.smooth,
            y: { duration: 0.5, ease: CUSTOM_EASING.anticipate },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4, ease: CUSTOM_EASING.gentle }
          }
        }}
        className="lg:hidden fixed bottom-5 left-5 right-5 z-50"
      >
        <div 
          className="relative rounded-[20px] p-6 backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(20, 20, 20, 0.85)',
            backdropFilter: "blur(20px) saturate(120%)",
            WebkitBackdropFilter: "blur(20px) saturate(120%)",
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {state !== 'initial' && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        mass: 0.8
                      }
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0, 
                      rotate: 90,
                      transition: {
                        duration: 0.2,
                        ease: CUSTOM_EASING.gentle
                      }
                    }}
                    whileHover={{ 
                      scale: 1.08,
                      transition: { 
                        type: "spring", 
                        stiffness: 600, 
                        damping: 30 
                      }
                    }}
                    whileTap={{ 
                      scale: 0.95,
                      transition: { 
                        type: "spring", 
                        stiffness: 800, 
                        damping: 40 
                      }
                    }}
                    onClick={handleBack}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors duration-200"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            {/* Sección central: Box info + Capacity info */}
            <div className="flex items-center gap-3 relative">
              <motion.div 
                className="flex items-center gap-2.5 px-4 h-9 rounded-full"
                style={{
                  backgroundColor: hexToRgba(sectionColor, 0.15),
                  border: `1px solid ${hexToRgba(sectionColor, 0.3)}`,
                }}
                initial={{ opacity: 0, scale: 0.9, x: -10 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.4,
                    ease: CUSTOM_EASING.anticipate
                  }
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: hexToRgba(sectionColor, 0.2),
                  borderColor: hexToRgba(sectionColor, 0.4),
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }
                }}
              >
                <motion.div 
                  className="w-4 h-4 rounded-full"
                  style={{ 
                    backgroundColor: sectionColor,
                    boxShadow: `0 0 12px ${hexToRgba(sectionColor, 0.6)}`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    transition: {
                      delay: 0.4,
                      type: "spring",
                      stiffness: 500,
                      damping: 25
                    }
                  }}
                  whileHover={{
                    scale: 1.2,
                    boxShadow: `0 0 20px ${hexToRgba(sectionColor, 0.8)}`,
                    transition: {
                      type: "spring",
                      stiffness: 600,
                      damping: 30
                    }
                  }}
                />
                <motion.span 
                  className="text-sm font-semibold"
                  style={{ color: sectionColor }}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: {
                      delay: 0.5,
                      duration: 0.3,
                      ease: CUSTOM_EASING.gentle
                    }
                  }}
                >
                  {selectedBox.name}
                </motion.span>
              </motion.div>
              
              {/* Indicador de capacidad */}
              <div className="flex items-center gap-1.5 px-3 h-9 rounded-full" style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span className="text-xs font-medium text-neutral-500">
                  {selectedBox.capacity}
                </span>
              </div>
            </div>
            
            {/* Botón cerrar */}
            <motion.button
              onClick={onClear}
              whileHover={{ 
                scale: 1.1,
                rotate: 90,
                transition: { 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 25 
                }
              }}
              whileTap={{ 
                scale: 0.92,
                transition: { 
                  type: "spring", 
                  stiffness: 700, 
                  damping: 35 
                }
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-white transition-colors duration-200"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          </div>

          {/* Contenido con animaciones */}
          <AnimatePresence mode="wait">
            {/* Estado: Initial - Solo precio y botón */}
            {state === 'initial' && (
              <motion.div
                key="initial"
                variants={CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4"
              >
                {/* Sección expandible de descripción */}
                <AnimatePresence>
                  {isExpanded && selectedBox.description && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: {
                          height: { duration: 0.3, ease: CUSTOM_EASING.gentle },
                          opacity: { duration: 0.2, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: {
                          height: { duration: 0.2, ease: CUSTOM_EASING.gentle },
                          opacity: { duration: 0.1 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div 
                        className="rounded-xl p-4 mb-2 max-h-32 overflow-y-auto custom-scrollbar"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(255,255,255,0.3) transparent',
                        }}
                      >
                        <p 
                          className="text-sm text-white/90 leading-relaxed whitespace-pre-line"
                          style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {selectedBox.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="text-[28px] font-bold text-white tracking-tight">
                      ${selectedBox.price.toLocaleString("es-CO")}
                    </div>
                    {/* Botón Ver detalles */}
                    {selectedBox.description && (
                      <motion.button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1.5 text-sm text-neutral-400 transition-colors mt-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{isExpanded ? 'Ocultar' : 'Ver'} detalles</span>
                        <motion.svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </motion.svg>
                      </motion.button>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleInitialContinue}
                      className="px-8 py-4 h-auto min-h-[52px] rounded-xl font-semibold bg-white text-black hover:bg-neutral-100 transition-all duration-200"
                      style={{ boxShadow: '0 4px 20px rgba(255,255,255,0.2)', border: 'none' }}
                    >
                      Continuar
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Estado: Email */}
            {state === 'email' && (
              <motion.form
                key="email"
                variants={CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleEmailSubmit} 
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm text-neutral-400 mb-3">
                    Ingresa tu email para continuar
                  </label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-4 rounded-lg bg-white/10 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-all duration-200"
                    style={{ fontSize: '16px' }}
                  />
                </div>
                {(localError || authError) && (
                  <p className="text-red-400 text-sm">{localError || authError}</p>
                )}
                <motion.div
                  whileHover={{ scale: authLoading || !email ? 1 : 1.02 }}
                  whileTap={{ scale: authLoading || !email ? 1 : 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={authLoading || !email}
                    className="w-full py-4 h-auto min-h-[52px] rounded-xl font-semibold bg-white text-black hover:bg-neutral-100 disabled:opacity-50 transition-all duration-200"
                    style={{ border: 'none' }}
                  >
                    {authLoading ? 'Enviando...' : 'Continuar'}
                  </Button>
                </motion.div>
              </motion.form>
            )}

            {/* Estado: OTP - Diseño simplificado */}
            {state === 'otp' && (
              <motion.div
                key="otp"
                variants={CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <p className="text-sm text-neutral-400 mb-2">Código enviado a:</p>
                  <p className="text-white font-medium">{email}</p>
                </div>
                
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={index === 0 ? firstOTPInputRef : undefined}
                      id={`otp-${index}`}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`otp-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      onFocus={(e) => {
                        // Seleccionar todo el contenido al hacer focus
                        e.target.select();
                      }}
                      onPaste={(e) => {
                        // Manejar pegado de códigos completos
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
                        if (pastedData.length === 6) {
                          const newOTP = pastedData.split('');
                          setOTP(newOTP);
                          handleOTPSubmit(pastedData);
                        }
                      }}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: {
                          delay: index * 0.05,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }
                      }}
                      whileFocus={{
                        scale: 1.05,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                      className="w-12 h-14 text-center rounded-lg bg-white/5 border text-white text-lg font-semibold focus:outline-none transition-all duration-200 touch-manipulation"
                      style={{
                        borderColor: digit ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield',
                        fontSize: '18px', // Prevenir zoom en iOS
                      }}
                      maxLength={1}
                      autoComplete="one-time-code"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  ))}
                </div>

                {localError && (
                  <p className="text-red-400 text-sm text-center">{localError}</p>
                )}

                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-sm text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
                >
                  {countdown > 0 ? `Reenviar código en ${countdown}s` : 'Reenviar código'}
                </button>
              </motion.div>
            )}

            {/* Estado: Profile - Formulario de registro */}
            {state === 'profile' && (
              <motion.form
                key="profile"
                variants={CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onSubmit={handleProfileSubmit}
                className="space-y-4"
              >

                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full h-12 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Apellido</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full h-12 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                {/* Tipo de documento y número */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Tipo de documento</label>
                    <button
                      type="button"
                      onClick={() => setShowDocumentTypeSelect(true)}
                      className="w-full h-12 flex items-center justify-between px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
                    >
                      <span className="text-sm text-white">
                        {profileData.document_type_id === '1' ? 'CC' : 
                         profileData.document_type_id === '2' ? 'CE' : 
                         profileData.document_type_id === '3' ? 'PP' : 'Seleccionar'}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Número</label>
                    <input
                      type="text"
                      value={profileData.document_id}
                      onChange={(e) => setProfileData(prev => ({ ...prev, document_id: e.target.value }))}
                      className="w-full h-12 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Número"
                    />
                  </div>
                </div>

                {/* Teléfono con prefijo */}
                <div className="relative country-selector">
                  <label className="block text-sm font-medium text-white/80 mb-2">Teléfono</label>
                  <div className="flex">
                    <button
                      ref={countryButtonRef}
                      type="button"
                      className="flex items-center gap-2 h-12 px-3 py-2 bg-white/10 border border-white/20 rounded-l-lg border-r-0 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:z-10 min-w-[80px] transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCountrySelect(true);
                      }}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
                    >
                      <span className="flex h-4 w-6 overflow-hidden rounded-sm">
{getFlagSvg(profileData.phonePrefix)}
                      </span>
                      <span className="text-sm">{profileData.phonePrefix}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="flex-1 h-12 px-3 py-2 bg-white/10 border border-white/20 rounded-r-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="3001234567"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                      }}
                    />
                  </div>
                  
                  {/* Dropdown de países */}
                  {showCountrySelect && (
                    <div 
                      ref={countryDropdownRef}
                      className="absolute z-50 mt-1 left-0 right-0 border border-white/20 rounded-lg shadow-2xl max-h-64 overflow-hidden" 
                      style={{ 
                        backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                        backdropFilter: 'blur(20px) saturate(120%)', 
                        WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                      }}
                    >
                      {/* Buscador */}
                      <div className="p-3 border-b border-white/20">
                        <input
                          type="text"
                          value={countrySearchTerm}
                          onChange={(e) => setCountrySearchTerm(e.target.value)}
                          placeholder="Buscar país..."
                          className="w-full h-10 px-3 py-2 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                          }}
                          autoFocus
                        />
                      </div>
                      <div className="overflow-y-auto max-h-48">
                      {(() => {
                        // Filtrar países según el término de búsqueda
                        const filteredCountries = COUNTRIES.filter(country =>
                          country.country.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
                          country.code.includes(countrySearchTerm)
                        );

                        return filteredCountries.map((country) => (
                          <button
                            key={`${country.code}-${country.country}`}
                            type="button"
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none text-left border-b border-white/10 last:border-b-0 transition-colors"
                            onClick={() => {
                              console.log('Selecting country:', country.country, country.code);
                              setProfileData(prev => ({ ...prev, phonePrefix: country.code }));
                              setShowCountrySelect(false);
                              setCountrySearchTerm(''); // Limpiar búsqueda al seleccionar
                            }}
                          >
                            <span className="flex h-4 w-6 overflow-hidden rounded-sm flex-shrink-0">
                              {getFlagSvg(country.code)}
                            </span>
                            <span className="text-white text-sm font-medium flex-grow">{country.country}</span>
                            <span className="text-white/70 text-sm">{country.code}</span>
                          </button>
                        ));
                      })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fecha de nacimiento */}
                <div className="relative">
                  <label className="block text-sm font-medium text-white/80 mb-2">Fecha de nacimiento</label>
                  
                  {/* Botones de fecha */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Botón DÍA */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDaySelect(true)}
                        className="w-full h-12 flex items-center justify-between px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                      >
                        <span className={`text-sm ${profileData.birthdate && profileData.birthdate.split('-')[2] ? 'text-white' : 'text-white/60'}`}>
                          {profileData.birthdate && profileData.birthdate.split('-')[2] ? profileData.birthdate.split('-')[2] : 'Día'}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                      
                      {/* Dropdown de días */}
                      {showDaySelect && (
                        <div 
                          className="absolute z-50 mt-1 left-0 right-0 border border-white/20 rounded-lg shadow-2xl max-h-48 overflow-y-auto"
                          style={{ 
                            backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                            backdropFilter: 'blur(20px) saturate(120%)', 
                            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                          }}
                        >
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                            const dayPadded = day.toString().padStart(2, '0');
                            const birthdateParts = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
                            const currentDay = birthdateParts[2] || '';
                            const isSelected = currentDay === dayPadded && currentDay !== '';
                            
                            // Debug log solo para los primeros 3 días
                            if (day <= 3) {
                              console.log(`🔍 Day ${day}: currentDay="${currentDay}", dayPadded="${dayPadded}", isSelected=${isSelected}, fullBirthdate="${profileData.birthdate}"`);
                            }
                            
                            return (
                            <button
                              key={day}
                              type="button"
                              className={`w-full flex flex-col items-start px-3 py-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none text-left border-b border-white/10 last:border-b-0 transition-colors ${
                                isSelected ? 'bg-white/25 border-white/50 ring-1 ring-white/30' : ''
                              }`}
                              onClick={() => {
                                const [year, month] = profileData.birthdate ? profileData.birthdate.split('-') : ['', ''];
                                setProfileData(prev => ({ ...prev, birthdate: `${year || ''}-${month || ''}-${day.toString().padStart(2, '0')}` }));
                                setShowDaySelect(false);
                              }}
                            >
                              <span className="text-white text-sm font-medium">{day.toString().padStart(2, '0')}</span>
                              <span className="text-white/60 text-xs">{(() => {
                                const dayText = numberToSpanish(day);
                                return dayText.charAt(0).toUpperCase() + dayText.slice(1);
                              })()}</span>
                            </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Botón MES */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowMonthSelect(true)}
                        className="w-full h-12 flex items-center justify-between px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                      >
                        <span className={`text-sm ${profileData.birthdate && profileData.birthdate.split('-')[1] ? 'text-white' : 'text-white/60'}`}>
                          {profileData.birthdate && profileData.birthdate.split('-')[1] ? 
                            ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][parseInt(profileData.birthdate.split('-')[1]) - 1]
                            : 'Mes'
                          }
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                      
                      {/* Dropdown de meses */}
                      {showMonthSelect && (
                        <div 
                          className="absolute z-50 mt-1 left-0 right-0 border border-white/20 rounded-lg shadow-2xl max-h-48 overflow-y-auto"
                          style={{ 
                            backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                            backdropFilter: 'blur(20px) saturate(120%)', 
                            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                          }}
                        >
                          {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, index) => {
                              const monthPadded = (index + 1).toString().padStart(2, '0');
                              const birthdateParts = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
                              const currentMonth = birthdateParts[1] || '';
                              const isSelected = currentMonth === monthPadded && currentMonth !== '';
                              
                              return (
                            <button
                              key={month}
                              type="button"
                              className={`w-full flex items-center px-3 py-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none text-left border-b border-white/10 last:border-b-0 transition-colors ${
                                isSelected ? 'bg-white/25 border-white/50 ring-1 ring-white/30' : ''
                              }`}
                              onClick={() => {
                                const [year, , day] = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
                                setProfileData(prev => ({ ...prev, birthdate: `${year || ''}-${(index + 1).toString().padStart(2, '0')}-${day || ''}` }));
                                setShowMonthSelect(false);
                              }}
                            >
                              <span className="text-white text-sm">{month}</span>
                            </button>
                              );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Botón AÑO */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowYearSelect(true)}
                        className="w-full h-12 flex items-center justify-between px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                        }}
                      >
                        <span className={`text-sm ${profileData.birthdate && profileData.birthdate.split('-')[0] ? 'text-white' : 'text-white/60'}`}>
                          {profileData.birthdate && profileData.birthdate.split('-')[0] ? profileData.birthdate.split('-')[0] : 'Año'}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </button>
                      
                      {/* Dropdown de años */}
                      {showYearSelect && (
                        <div 
                          className="absolute z-50 mt-1 left-0 right-0 border border-white/20 rounded-lg shadow-2xl max-h-48 overflow-y-auto"
                          style={{ 
                            backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                            backdropFilter: 'blur(20px) saturate(120%)', 
                            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                          }}
                        >
                          {Array.from({ length: 80 }, (_, i) => {
                            const year = new Date().getFullYear() - 18 - i;
                            const birthdateParts = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
                            const currentYear = birthdateParts[0] || '';
                            const isSelected = currentYear === year.toString() && currentYear !== '';
                            
                            return (
                              <button
                                key={year}
                                type="button"
                                className={`w-full flex items-center px-3 py-2 hover:bg-white/10 focus:bg-white/10 focus:outline-none text-left border-b border-white/10 last:border-b-0 transition-colors ${
                                  isSelected ? 'bg-white/25 border-white/50 ring-1 ring-white/30' : ''
                                }`}
                                onClick={() => {
                                  const [, month, day] = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
                                  setProfileData(prev => ({ ...prev, birthdate: `${year}-${month || ''}-${day || ''}` }));
                                  setShowYearSelect(false);
                                }}
                              >
                                <span className="text-white text-sm">{year}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                {/* Error message */}
                {localError && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-200 text-sm">{localError}</p>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isCreatingProfile}
                    className="w-full py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingProfile ? 'Guardando...' : 'Continuar'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Estado: Summary - Diseño mejorado */}
            {state === 'summary' && (
              <motion.div
                key="summary"
                variants={CONTENT_VARIANTS}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <motion.div 
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        delay: 0.1,
                        duration: 0.3,
                        ease: CUSTOM_EASING.gentle
                      }
                    }}
                  >
                    <span className="text-sm text-neutral-400">Subtotal</span>
                    <motion.span 
                      className="text-base text-white font-medium"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          delay: 0.2,
                          duration: 0.3
                        }
                      }}
                    >
                      ${basePrice.toLocaleString("es-CO")}
                    </motion.span>
                  </motion.div>

                  {/* Descuento aplicado */}
                  {appliedCoupon && (
                    <motion.div 
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        transition: {
                          delay: 0.15,
                          duration: 0.3,
                          ease: CUSTOM_EASING.gentle
                        }
                      }}
                    >
                      <span className="text-sm" style={{ color: sectionColor }}>
                        Descuento {appliedCoupon.code} (-{appliedCoupon.discount}%)
                      </span>
                      <motion.span 
                        className="text-base font-medium"
                        style={{ color: sectionColor }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          transition: {
                            delay: 0.25,
                            duration: 0.3
                          }
                        }}
                      >
                        -${Math.ceil(discountAmount).toLocaleString("es-CO")}
                      </motion.span>
                    </motion.div>
                  )}
                  <motion.div 
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        delay: appliedCoupon ? 0.3 : 0.2,
                        duration: 0.3,
                        ease: CUSTOM_EASING.gentle
                      }
                    }}
                  >
                    <span className="text-sm text-neutral-400">Tarifa de servicio</span>
                    <motion.span 
                      className="text-base text-white font-medium"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          delay: appliedCoupon ? 0.4 : 0.3,
                          duration: 0.3
                        }
                      }}
                    >
                      ${Math.ceil(serviceFee).toLocaleString("es-CO")}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        delay: appliedCoupon ? 0.4 : 0.3,
                        duration: 0.3,
                        ease: CUSTOM_EASING.gentle
                      }
                    }}
                  >
                    <span className="text-sm text-neutral-400">IVA (19%)</span>
                    <motion.span 
                      className="text-base text-white font-medium"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          delay: appliedCoupon ? 0.5 : 0.4,
                          duration: 0.3
                        }
                      }}
                    >
                      ${Math.ceil(iva).toLocaleString("es-CO")}
                    </motion.span>
                  </motion.div>
                  <motion.div 
                    className="border-t pt-4 flex justify-between items-center"
                    style={{ borderColor: 'rgb(64, 64, 64)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: 0.5,
                        duration: 0.4,
                        ease: CUSTOM_EASING.anticipate
                      }
                    }}
                  >
                    <motion.span 
                      className="text-base text-white font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        transition: {
                          delay: 0.6,
                          duration: 0.3
                        }
                      }}
                    >
                      TOTAL
                    </motion.span>
                    <motion.span 
                      className="text-2xl text-white font-bold"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: {
                          delay: 0.7,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }
                      }}
                    >
                      ${finalTotal.toLocaleString("es-CO")}
                    </motion.span>
                  </motion.div>
                </div>

                {/* Sección de cupón */}
                <motion.div 
                  className="space-y-3 mb-4"
                  variants={CONTENT_VARIANTS}
                >
                  {/* Cupón aplicado */}
                  {appliedCoupon && (
                    <motion.div 
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{
                        backgroundColor: hexToRgba(sectionColor, 0.1),
                        border: `1px solid ${hexToRgba(sectionColor, 0.2)}`,
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: sectionColor }}>
                          <path d="M9 12l2 2 4-4"/>
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                        <span className="text-sm font-medium" style={{ color: sectionColor }}>
                          {appliedCoupon.code} (-{appliedCoupon.discount}%)
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Input de cupón */}
                  {showCouponInput ? (
                    <motion.div 
                      className="flex gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <button
                        onClick={() => {
                          setShowCouponInput(false);
                          setCouponCode('');
                        }}
                        className="px-3 py-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Código de cupón"
                        className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-neutral-400 focus:outline-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
                          backdropFilter: 'blur(12px) saturate(110%)',
                          WebkitBackdropFilter: 'blur(12px) saturate(110%)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && couponCode.trim() && handleApplyCoupon()}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        style={
                          couponCode.trim() 
                            ? {
                                backgroundColor: hexToRgba(sectionColor, 0.15),
                                border: `1px solid ${hexToRgba(sectionColor, 0.3)}`,
                                color: sectionColor,
                                boxShadow: `0 0 12px ${hexToRgba(sectionColor, 0.2)}`,
                              }
                            : {
                                backgroundColor: 'rgba(64, 64, 64, 0.5)',
                                border: '1px solid rgba(64, 64, 64, 0.8)',
                                color: 'rgba(156, 163, 175, 0.7)',
                                cursor: 'not-allowed',
                              }
                        }
                        onMouseEnter={(e) => {
                          if (couponCode.trim()) {
                            e.currentTarget.style.backgroundColor = hexToRgba(sectionColor, 0.25);
                            e.currentTarget.style.borderColor = hexToRgba(sectionColor, 0.5);
                            e.currentTarget.style.boxShadow = `0 0 20px ${hexToRgba(sectionColor, 0.4)}`;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (couponCode.trim()) {
                            e.currentTarget.style.backgroundColor = hexToRgba(sectionColor, 0.15);
                            e.currentTarget.style.borderColor = hexToRgba(sectionColor, 0.3);
                            e.currentTarget.style.boxShadow = `0 0 12px ${hexToRgba(sectionColor, 0.2)}`;
                          }
                        }}
                      >
                        Aplicar
                      </button>
                    </motion.div>
                  ) : !appliedCoupon && (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        <path d="M9 12l2 2 4-4"/>
                      </svg>
                      ¿Tienes un cupón de descuento?
                    </button>
                  )}
                </motion.div>

                {/* Términos y condiciones */}
                <TermsCheckbox 
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  className="mb-2"
                />

                {localError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  >
                    <p className="text-red-400 text-sm text-center">{localError}</p>
                  </motion.div>
                )}
                
                <motion.div
                  whileHover={{ 
                    scale: (isProcessingPayment || feeLoading || !user?.id || !termsAccepted) ? 1 : 1.02,
                    boxShadow: (isProcessingPayment || feeLoading || !user?.id || !termsAccepted) ? undefined : '0 8px 30px rgba(255,255,255,0.3)'
                  }}
                  whileTap={{ 
                    scale: (isProcessingPayment || feeLoading || !user?.id || !termsAccepted) ? 1 : 0.98
                  }}
                >
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessingPayment || feeLoading || !user?.id || !termsAccepted}
                    className="w-full py-4 h-auto min-h-[52px] rounded-xl font-semibold bg-white text-black hover:bg-neutral-100 disabled:opacity-50 transition-all duration-200"
                    style={{ border: 'none' }}
                  >
                    {isProcessingPayment ? 'Procesando...' : 'Comprar Entrada'}
                  </Button>
                </motion.div>

                <p className="text-xs text-neutral-500 text-center">
                  Al presionar comprar se generará un enlace de pago válido por 10 minutos
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Estilos CSS para el scrollbar personalizado */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          transition: background 0.2s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Para Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* Modal selector de tipo de documento */}
      <FullscreenSelector
        isOpen={showDocumentTypeSelect}
        onClose={() => setShowDocumentTypeSelect(false)}
        onSelect={(option) => {
          setProfileData(prev => ({ ...prev, document_type_id: option.id }));
        }}
        options={[
          { 
            id: '1', 
            label: 'Cédula de Ciudadanía',
            description: 'Documento de identidad para ciudadanos colombianos'
          },
          { 
            id: '2', 
            label: 'Cédula de Extranjería',
            description: 'Documento para extranjeros residentes en Colombia'
          },
          { 
            id: '3', 
            label: 'Pasaporte',
            description: 'Documento de viaje internacional válido'
          }
        ]}
        title="Tipo de documento"
        searchPlaceholder="Buscar tipo de documento..."
        selectedId={profileData.document_type_id}
      />

      {/* Modal selector de país */}
      <FullscreenSelector
        title="Seleccionar país"
        isOpen={showCountrySelect}
        onClose={() => setShowCountrySelect(false)}
        onSelect={(option) => {
          // Extraer solo el prefijo (antes del guión, si existe)
          const prefix = option.id.includes('-') ? option.id.split('-')[0] : option.id;
          setProfileData(prev => ({ ...prev, phonePrefix: prefix }));
        }}
        options={[
          { 
            id: '+57', 
            label: 'Colombia', 
            description: '+57',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFDA44" d="M0 0h513v171H0z"/><path fill="#0052B4" d="M0 171h513v85.5H0z"/><path fill="#D80027" d="M0 256.5h513v85.5H0z"/></svg>
          },
          { 
            id: '+1-us', 
            label: 'Estados Unidos', 
            description: '+1',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#B22234" d="M0 0h513v342H0z"/><path fill="#FFFFFF" d="M0 26.3h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0z"/><path fill="#3C3B6E" d="M0 0h256.5v184.2H0z"/></svg>
          },
          { 
            id: '+1-ca', 
            label: 'Canadá', 
            description: '+1',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFFFFF" d="M171 0h171v342H171z"/><path fill="#FF0000" d="M0 0h171v342H0z"/><path fill="#FF0000" d="M342 0h171v342H342z"/></svg>
          },
          { 
            id: '+34', 
            label: 'España', 
            description: '+34',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#AA151B" d="M0 0h513v85.5H0z"/><path fill="#F1BF00" d="M0 85.5h513v171H0z"/><path fill="#AA151B" d="M0 256.5h513v85.5H0z"/></svg>
          },
          { 
            id: '+52', 
            label: 'México', 
            description: '+52',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFFFFF" d="M171 0h171v342H171z"/><path fill="#006847" d="M0 0h171v342H0z"/><path fill="#CE1126" d="M342 0h171v342H342z"/></svg>
          },
          { 
            id: '+33', 
            label: 'Francia', 
            description: '+33',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFFFFF" d="M171 0h171v342H171z"/><path fill="#002654" d="M0 0h171v342H0z"/><path fill="#CE1126" d="M342 0h171v342H342z"/></svg>
          },
          { 
            id: '+49', 
            label: 'Alemania', 
            description: '+49',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#000000" d="M0 0h513v114H0z"/><path fill="#DD0000" d="M0 114h513v114H0z"/><path fill="#FFCE00" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+44', 
            label: 'Reino Unido', 
            description: '+44',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#012169" d="M0 0h513v342H0z"/><path fill="#FFFFFF" d="m0 0 513 342M513 0 0 342"/><path fill="#C8102E" d="m0 0 513 342M513 0 0 342"/><path fill="#FFFFFF" d="M213.3 0v342h86.4V0z"/><path fill="#FFFFFF" d="M0 113.4v115.2h513V113.4z"/><path fill="#C8102E" d="M0 137.8v66.4h513V137.8z"/><path fill="#C8102E" d="M233.4 0v342h46.2V0z"/></svg>
          },
          { 
            id: '+54', 
            label: 'Argentina', 
            description: '+54',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#74ACDF" d="M0 0h513v114H0z"/><path fill="#FFFFFF" d="M0 114h513v114H0z"/><path fill="#74ACDF" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+55', 
            label: 'Brasil', 
            description: '+55',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#009739" d="M0 0h513v342H0z"/><path fill="#FEDF00" d="M256.5 171 467.8 89.5l0 163L256.5 171z"/><path fill="#FEDF00" d="M256.5 171 45.2 89.5l0 163L256.5 171z"/><path fill="#FEDF00" d="M256.5 171 467.8 252.5l0-163L256.5 171z"/><path fill="#FEDF00" d="M256.5 171 45.2 252.5l0-163L256.5 171z"/></svg>
          },
          { 
            id: '+56', 
            label: 'Chile', 
            description: '+56',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFFFFF" d="M0 0h513v171H0z"/><path fill="#D52B1E" d="M0 171h513v171H0z"/><path fill="#0039A6" d="M0 0h171v171H0z"/></svg>
          },
          { 
            id: '+58', 
            label: 'Venezuela', 
            description: '+58',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFDA44" d="M0 0h513v114H0z"/><path fill="#0052B4" d="M0 114h513v114H0z"/><path fill="#D80027" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+51', 
            label: 'Perú', 
            description: '+51',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#D91023" d="M0 0h171v342H0z"/><path fill="#FFFFFF" d="M171 0h171v342H171z"/><path fill="#D91023" d="M342 0h171v342H342z"/></svg>
          },
          { 
            id: '+593', 
            label: 'Ecuador', 
            description: '+593',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFDA44" d="M0 0h513v171H0z"/><path fill="#0052B4" d="M0 171h513v85.5H0z"/><path fill="#D80027" d="M0 256.5h513v85.5H0z"/></svg>
          },
          { 
            id: '+591', 
            label: 'Bolivia', 
            description: '+591',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#D52B1E" d="M0 0h513v114H0z"/><path fill="#FFDA44" d="M0 114h513v114H0z"/><path fill="#007934" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+595', 
            label: 'Paraguay', 
            description: '+595',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#D52B1E" d="M0 0h513v114H0z"/><path fill="#FFFFFF" d="M0 114h513v114H0z"/><path fill="#0038A8" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+598', 
            label: 'Uruguay', 
            description: '+598',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFFFFF" d="M0 0h513v342H0z"/><path fill="#0038A8" d="M0 38h513v38H0z"/><path fill="#0038A8" d="M0 114h513v38H0z"/><path fill="#0038A8" d="M0 190h513v38H0z"/><path fill="#0038A8" d="M0 266h513v38H0z"/><path fill="#FFFFFF" d="M0 0h171v171H0z"/></svg>
          },
          { 
            id: '+506', 
            label: 'Costa Rica', 
            description: '+506',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#0052B4" d="M0 0h513v68.4H0z"/><path fill="#FFFFFF" d="M0 68.4h513v68.4H0z"/><path fill="#D80027" d="M0 136.8h513v68.4H0z"/><path fill="#FFFFFF" d="M0 205.2h513v68.4H0z"/><path fill="#0052B4" d="M0 273.6h513v68.4H0z"/></svg>
          },
          { 
            id: '+507', 
            label: 'Panamá', 
            description: '+507',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#FFFFFF" d="M0 0h256.5v171H0z"/><path fill="#D80027" d="M256.5 0h256.5v171H256.5z"/><path fill="#0052B4" d="M0 171h256.5v171H0z"/><path fill="#FFFFFF" d="M256.5 171h256.5v171H256.5z"/></svg>
          },
          { 
            id: '+505', 
            label: 'Nicaragua', 
            description: '+505',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#0067CE" d="M0 0h513v114H0z"/><path fill="#FFFFFF" d="M0 114h513v114H0z"/><path fill="#0067CE" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+504', 
            label: 'Honduras', 
            description: '+504',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#0073CE" d="M0 0h513v114H0z"/><path fill="#FFFFFF" d="M0 114h513v114H0z"/><path fill="#0073CE" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+503', 
            label: 'El Salvador', 
            description: '+503',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#0052B4" d="M0 0h513v114H0z"/><path fill="#FFFFFF" d="M0 114h513v114H0z"/><path fill="#0052B4" d="M0 228h513v114H0z"/></svg>
          },
          { 
            id: '+502', 
            label: 'Guatemala', 
            description: '+502',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#4997D0" d="M0 0h171v342H0z"/><path fill="#FFFFFF" d="M171 0h171v342H171z"/><path fill="#4997D0" d="M342 0h171v342H342z"/></svg>
          },
          { 
            id: '+592', 
            label: 'Guyana', 
            description: '+592',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#009E49" d="M0 0h513v342H0z"/><path fill="#FFFFFF" d="M0 0L513 171L0 342V0z"/><path fill="#FCD116" d="M0 0L513 171L0 342V0z"/></svg>
          },
          { 
            id: '+597', 
            label: 'Surinam', 
            description: '+597',
            icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 513 342" className="w-6 h-4 rounded-sm"><path fill="#377E3F" d="M0 0h513v68.4H0z"/><path fill="#FFFFFF" d="M0 68.4h513v34.2H0z"/><path fill="#B40A2E" d="M0 102.6h513v136.8H0z"/><path fill="#FFFFFF" d="M0 239.4h513v34.2H0z"/><path fill="#377E3F" d="M0 273.6h513v68.4H0z"/></svg>
          }
        ]}
        searchPlaceholder="Buscar país..."
        selectedId={(() => {
          // Si el prefijo es +1, necesitamos decidir cuál mostrar como seleccionado
          // Por defecto mostramos Estados Unidos (+1-us)
          if (profileData.phonePrefix === '+1') return '+1-us';
          return profileData.phonePrefix;
        })()}
      />

      {/* Modal selector de día */}
      <FullscreenSelector
        title="Seleccionar día"
        isOpen={showDaySelect}
        onClose={() => setShowDaySelect(false)}
        onSelect={(option) => {
          const [year, month] = profileData.birthdate ? profileData.birthdate.split('-') : ['', ''];
          setProfileData(prev => ({ ...prev, birthdate: `${year || ''}-${month || ''}-${option.id.padStart(2, '0')}` }));
        }}
        options={Array.from({ length: 31 }, (_, i) => ({
          id: (i + 1).toString(),
          label: (i + 1).toString().padStart(2, '0'),
          description: numberToSpanish(i + 1)
        }))}
        searchPlaceholder="Buscar día..."
        selectedId={profileData.birthdate ? profileData.birthdate.split('-')[2] : ''}
      />

      {/* Modal selector de mes */}
      <FullscreenSelector
        title="Seleccionar mes"
        isOpen={showMonthSelect}
        onClose={() => setShowMonthSelect(false)}
        onSelect={(option) => {
          const [year, , day] = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
          setProfileData(prev => ({ ...prev, birthdate: `${year || ''}-${option.id.padStart(2, '0')}-${day || ''}` }));
        }}
        options={[
          { id: '1', label: 'Enero', description: 'Mes 1' },
          { id: '2', label: 'Febrero', description: 'Mes 2' },
          { id: '3', label: 'Marzo', description: 'Mes 3' },
          { id: '4', label: 'Abril', description: 'Mes 4' },
          { id: '5', label: 'Mayo', description: 'Mes 5' },
          { id: '6', label: 'Junio', description: 'Mes 6' },
          { id: '7', label: 'Julio', description: 'Mes 7' },
          { id: '8', label: 'Agosto', description: 'Mes 8' },
          { id: '9', label: 'Septiembre', description: 'Mes 9' },
          { id: '10', label: 'Octubre', description: 'Mes 10' },
          { id: '11', label: 'Noviembre', description: 'Mes 11' },
          { id: '12', label: 'Diciembre', description: 'Mes 12' }
        ]}
        searchPlaceholder="Buscar mes..."
        selectedId={profileData.birthdate ? profileData.birthdate.split('-')[1] : ''}
      />

      {/* Modal selector de año */}
      <FullscreenSelector
        title="Seleccionar año"
        isOpen={showYearSelect}
        onClose={() => setShowYearSelect(false)}
        onSelect={(option) => {
          const [, month, day] = profileData.birthdate ? profileData.birthdate.split('-') : ['', '', ''];
          setProfileData(prev => ({ ...prev, birthdate: `${option.id}-${month || ''}-${day || ''}` }));
        }}
        options={Array.from({ length: 80 }, (_, i) => {
          const year = new Date().getFullYear() - 18 - i;
          return {
            id: year.toString(),
            label: year.toString(),
            description: `Año ${year}`
          };
        })}
        searchPlaceholder="Buscar año..."
        selectedId={profileData.birthdate ? profileData.birthdate.split('-')[0] : ''}
      />
    </>
  );
};

export default MobileCartBar;