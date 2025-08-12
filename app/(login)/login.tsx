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
    <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6 self-stretch px-12 py-12">
      <div
        className={`${
          mode === "signphone" ? "w-full  max-w-md" : "w-full max-w-lg"
        }`}
      >
        <HeaderLogin
          title={
            mode === "signphone"
              ? "Registro y Login con Celular"
              : "Registro y Login con Email"
          }
        />
        {message && (
          <div className="mt-10 w-[70%] mx-auto">
            <p className="text-center text-sm">{message}</p>
          </div>
        )}
        <div className="mt-10">
          <div className="space-y-6">
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
          <LegalDisclaimer />
        </div>
      </div>
    </div>
  );
}
