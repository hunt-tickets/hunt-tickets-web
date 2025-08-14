"use client";

import EmailLoginForm from "@/components/site/EmailLoginForm";
import HeaderLogin from "@/components/site/HeaderLogin";
import LegalDisclaimer from "@/components/site/LegalDisclaimer";
import PhoneLoginForm from "@/components/site/PhoneLoginForm";
import VerificationCode from "@/components/site/VerificationCode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signInWithEmailOTP, signInWithPhone, verifyEmailOTP, verifyPhoneOTP } from "./actions";

export function Login({
  mode = "signphone",
}: {
  mode?: "signphone" | "signmail";
}) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (message.includes("código verificado correctamente")) {
      const timer = setTimeout(() => {
        router.push("/register");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  const handleLogin = async (values: { phoneNumber: string }) => {
    setLoading(true);
    const { error, success = "" } = await signInWithPhone(values.phoneNumber);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setMessage(
        `📩 Su código fue enviado al número **${values.phoneNumber}**. Si no lo recibe, espere unos segundos y solicite un nuevo código.`
      );
      setPhoneNumber(values.phoneNumber);
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleLoginEmail = async (values: { email: string }) => {
    setLoading(true);
    const { error, success = "" } = await signInWithEmailOTP(values.email);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setMessage(
        `📩 Su código fue enviado al correo **${values.email}**. Revise su bandeja de spam si no lo encuentra.`
      );
      setEmail(values.email);
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const { error, success = "" } = await verifyPhoneOTP(
      phoneNumber,
      verificationCode
    );
    if (error) {
      setMessage(`❌ Código incorrecto. Inténtelo de nuevo.`);
    } else {
      setMessage(`✅ Código verificado correctamente. Redirigiendo...`);
      router.refresh();
      setTimeout(() => {
        router.push("/register");
      }, 3000);
    }
    setLoading(false);
  };

  const handleVerifyOTPEmail = async () => {
    setLoading(true);
    const { error, success } = await verifyEmailOTP(email, verificationCode);
    if (error) {
      setMessage(`❌ Código incorrecto. Inténtelo de nuevo.`);
    } else {
      setMessage(`✅ Código verificado correctamente. Redirigiendo...`);
      router.refresh();
      setTimeout(() => {
        router.push("/register");
      }, 3000);
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setMessage("🔄 Enviando un nuevo código...");
    setLoading(true);
    const { error, success = "" } = await signInWithPhone(phoneNumber);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setMessage(`📩 Se ha reenviado un nuevo código a **${phoneNumber}**.`);
    }
    setLoading(false);
  };

  const handleResendOTPEmail = async () => {
    setMessage("🔄 Enviando un nuevo código...");
    setLoading(true);
    const { error, success = "" } = await signInWithEmailOTP(email);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setMessage(`📩 Se ha reenviado un nuevo código a **${email}**.`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Dynamic gradient background with Apple Vision Pro style */}
      <div className="absolute inset-0 backdrop-blur-sm">
        {/* Animated mesh gradient */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(200, 200, 200, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(180, 180, 180, 0.18) 0%, transparent 50%),
              radial-gradient(circle at 0% 0%, rgba(220, 220, 220, 0.10) 0%, transparent 50%),
              radial-gradient(circle at 80% 100%, rgba(160, 160, 160, 0.14) 0%, transparent 50%)
            `,
            filter: 'blur(8px)'
          }}
        ></div>
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '6s' }}></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute top-1/6 right-1/4 w-1 h-1 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '7s' }}></div>
        </div>
        
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>
      
      {/* Main content - Two column layout */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left column - Complete login section */}
        <div className="flex items-center justify-center p-6 lg:p-12 relative">
          <div className="w-full max-w-lg relative z-10">            
            {/* Glassmorphism card with hover effects */}
            <div className="relative w-full">
              <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 transition-all duration-300 shadow-lg">
                {/* Subtle internal glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                
                <div className="relative z-10">
                  {/* Header inside the box */}
                  <HeaderLogin />
                  
                  <div className="space-y-5">
                    {otpSent ? (
                      <>
                        {mode === "signphone" ? (
                          <VerificationCode
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                            onSubmit={handleVerifyOTP}
                            onResend={handleResendOTP}
                            contactInfo={phoneNumber}
                            isEmail={false}
                          />
                        ) : (
                          <VerificationCode
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                            onSubmit={handleVerifyOTPEmail}
                            onResend={handleResendOTPEmail}
                            contactInfo={email}
                            isEmail={true}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {mode === "signphone" ? (
                          <PhoneLoginForm
                            onSubmit={handleLogin}
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                          />
                        ) : (
                          <EmailLoginForm
                            onSubmit={handleLoginEmail}
                            initialEmail={email}
                            loading={loading}
                          />
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Legal disclaimer - Vision Pro style */}
                  <div className="mt-8 pt-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>
                    <div className="opacity-60 hover:opacity-80 transition-opacity duration-300">
                      <LegalDisclaimer />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Hero image + testimonials */}
        <div className="hidden lg:block relative p-4">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" 
               style={{ backgroundImage: `url(https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80)` }}>
          </div>
          
          {/* Testimonials */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
            <div className="animate-testimonial animate-delay-1000 flex items-start gap-3 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 p-5 w-64">
              <img src="https://randomuser.me/api/portraits/women/57.jpg" className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
              <div className="text-sm leading-snug">
                <p className="flex items-center gap-1 font-medium text-white">Sarah Chen</p>
                <p className="text-gray-400">@sarahdigital</p>
                <p className="mt-1 text-white/80">Amazing platform! The user experience is seamless and the features are exactly what I needed.</p>
              </div>
            </div>
            
            <div className="hidden xl:flex animate-testimonial animate-delay-1200 items-start gap-3 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 p-5 w-64">
              <img src="https://randomuser.me/api/portraits/men/64.jpg" className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
              <div className="text-sm leading-snug">
                <p className="flex items-center gap-1 font-medium text-white">Marcus Johnson</p>
                <p className="text-gray-400">@marcustech</p>
                <p className="mt-1 text-white/80">This service has transformed how I work. Clean design, powerful features, and excellent support.</p>
              </div>
            </div>
            
            <div className="hidden 2xl:flex animate-testimonial animate-delay-1400 items-start gap-3 rounded-3xl bg-card/40 backdrop-blur-xl border border-white/10 p-5 w-64">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
              <div className="text-sm leading-snug">
                <p className="flex items-center gap-1 font-medium text-white">David Martinez</p>
                <p className="text-gray-400">@davidcreates</p>
                <p className="mt-1 text-white/80">I've tried many platforms, but this one stands out. Intuitive, reliable, and genuinely helpful for productivity.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}