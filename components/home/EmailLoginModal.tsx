"use client";

import EmailLoginForm from "@/components/site/EmailLoginForm";
import VerificationCode from "@/components/site/VerificationCode";
import { signInWithEmailOTP, verifyEmailOTP } from "@/lib/login/actions";
import { useUser } from "@/lib/UserContext";
import { useEffect, useState } from "react";

interface EmailLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function EmailLoginModal({ onSuccess, onClose }: EmailLoginModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (user?.id) {
      onSuccess();
      onClose();
    }
  }, [user]);

  const handleLoginEmail = async (values: { email: string }) => {
    setLoading(true);
    const { error } = await signInWithEmailOTP(values.email);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setMessage(
        `📩 Código enviado a **${values.email}**. Revisa tu correo o bandeja de spam.`
      );
      setEmail(values.email);
      setOtpSent(true);
    }
    setLoading(false);
  };

  const handleVerifyOTPEmail = async () => {
    setLoading(true);
    const { error } = await verifyEmailOTP(email, verificationCode);
    if (error) {
      setMessage(`❌ Código incorrecto. Intenta de nuevo.`);
    } else {
      setMessage(`✅ Código verificado correctamente.`);
    }
    setLoading(false);
  };

  const handleResendOTPEmail = async () => {
    setLoading(true);
    const { error } = await signInWithEmailOTP(email);
    if (error) {
      setMessage(`⚠️ Error al reenviar: ${error}`);
    } else {
      setMessage(`📩 Se ha reenviado un nuevo código a **${email}**.`);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      {message && <p className="text-center text-sm mb-4">{message}</p>}
      {otpSent ? (
        <VerificationCode
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onSubmit={handleVerifyOTPEmail}
          onResend={handleResendOTPEmail}
        />
      ) : (
        <EmailLoginForm
          onSubmit={handleLoginEmail}
          initialEmail={email}
          loading={loading}
        />
      )}
    </div>
  );
}
