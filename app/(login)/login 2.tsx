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
      <div className="absolute inset-0">
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
            `
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
          {/* Left column specific background - Cool grayscale */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-80"
              style={{
                background: `
                  radial-gradient(ellipse 600px 800px at 30% 20%, rgba(255, 255, 255, 0.12) 0%, transparent 40%),
                  radial-gradient(ellipse 400px 500px at 80% 70%, rgba(200, 200, 200, 0.15) 0%, transparent 45%),
                  radial-gradient(ellipse 500px 600px at 10% 80%, rgba(150, 150, 150, 0.18) 0%, transparent 50%),
                  radial-gradient(ellipse 300px 400px at 90% 10%, rgba(100, 100, 100, 0.20) 0%, transparent 35%),
                  radial-gradient(ellipse 700px 300px at 50% 90%, rgba(180, 180, 180, 0.10) 0%, transparent 60%),
                  linear-gradient(135deg, rgba(80, 80, 80, 0.08) 0%, rgba(160, 160, 160, 0.05) 50%, rgba(50, 50, 50, 0.12) 100%)
                `
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-black/20 to-gray-800/50 backdrop-blur-lg"></div>
          </div>
          <div className="w-full max-w-lg relative z-10">            
            {/* Vision Pro style card */}
            <div className="relative group w-full">
              {/* Depth layers for Apple Vision Pro effect */}
              <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl rounded-[2rem] scale-[1.02] opacity-40 group-hover:scale-[1.03] transition-all duration-700"></div>
              <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] scale-[1.01] opacity-60 group-hover:scale-[1.02] transition-all duration-500"></div>
              
              <div 
                className="relative bg-white/[0.05] backdrop-blur-xl rounded-[2rem] p-8 border border-white/[0.08] group-hover:border-white/[0.12] transition-all duration-500"
                style={{
                  boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    0 16px 32px rgba(0, 0, 0, 0.4),
                    0 8px 16px rgba(0, 0, 0, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                  `
                }}
              >
                {/* Subtle internal glow */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.08] via-transparent to-transparent opacity-60 pointer-events-none"></div>
                
                <div className="relative z-10">
                  {/* Header inside the box */}
                  <HeaderLogin
                    title="Inicio/Registro"
                  />
                  
                  {message && (
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-2xl rounded-3xl"></div>
                        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20">
                          <p className="text-center text-base font-light text-blue-100 leading-relaxed">{message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-5">
                    {otpSent ? (
                      <>
                        {mode === "signphone" ? (
                          <VerificationCode
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                            onSubmit={handleVerifyOTP}
                            onResend={handleResendOTP}
                          />
                        ) : (
                          <VerificationCode
                            verificationCode={verificationCode}
                            setVerificationCode={setVerificationCode}
                            onSubmit={handleVerifyOTPEmail}
                            onResend={handleResendOTPEmail}
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
        
        {/* Right column - Image placeholder */}
        <div className="hidden lg:flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Right column specific background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-gray-900/30 to-black/40"></div>
          <div className="relative w-full h-full flex items-center justify-center z-10">
            {/* Image placeholder */}
            <div className="relative w-full h-96 rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-pink-500/20 backdrop-blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/40">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                  </div>
                  <p className="text-sm font-light">Image Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}