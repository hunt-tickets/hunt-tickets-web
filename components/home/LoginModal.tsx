"use client";

import ProfileForm from "@/components/form/ProfileForm";
import EmailLoginForm from "@/components/site/EmailLoginForm";
import VerificationCode from "@/components/site/VerificationCode";
import { useProfiles } from "@/hook/useProfiles";
import { signInWithEmailOTP, verifyEmailOTP } from "@/lib/login/actions";
import { useUser } from "@/lib/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify" | "profile">("email");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const { profile, loading: profileLoading, updateUserProfile } = useProfiles();


  useEffect(() => {
    if (user && profile && !profile.new) {
      onClose();
    }
    if (user && profile?.new && !profile) {
      setStep("profile");
    }
  }, [user, profile, router]);

  const handleSubmit = async (formData: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthdate: string;
    gender: string;
    new: boolean;
    documentTypeId: string;
    numberDocument: string;
  }) => {
    if (!user?.id) return;

    const sanitizedPhone = formData.phone.startsWith("+")
      ? formData.phone.slice(1)
      : formData.phone;

    const updates = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      phone: sanitizedPhone,
      birthdate: formData.birthdate,
      gender: formData.gender,
      new: false,
      document_type_id: formData.documentTypeId,
      document_id: formData.numberDocument,
      updated_at: new Date().toISOString(),
    };

    const result = await updateUserProfile(updates);

    if (typeof result === "object" && "error" in result) {
      setMessage(
        "Hubo un error al actualizar sus datos. Inténtelo nuevamente."
      );
    } else if (typeof result === "boolean" && result === true) {
      setMessage("✅ Usted acaba de actualizar sus datos. ¡Gracias!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setMessage("⚠️ Algo salió mal. Intente más tarde.");
    }
  };

  const handleLoginEmail = async (values: { email: string }) => {
    setLoading(true);
    const { error } = await signInWithEmailOTP(values.email);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setEmail(values.email);
      setMessage(`📩 Código enviado a ${values.email}`);
      setStep("verify");
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
    onClose();
  };

  const handleResendOTPEmail = async () => {
    setLoading(true);
    const { error } = await signInWithEmailOTP(email);
    if (error) {
      setMessage(`⚠️ Error: ${error}`);
    } else {
      setMessage(`📩 Nuevo código enviado a ${email}`);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md">
      {step === "email" && (
        <EmailLoginForm
          onSubmit={handleLoginEmail}
          initialEmail={email}
          loading={loading}
        />
      )}

      {step === "verify" && (
        <VerificationCode
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onSubmit={handleVerifyOTPEmail}
          onResend={handleResendOTPEmail}
        />
      )}

      {step === "profile" && profile && (
        <ProfileForm
          message={message}
          phone={profile?.phone || user?.phone || null}
          prefix={profile?.prefix || null}
          email={profile?.email || user?.email || null}
          isNew={profile?.new ?? true}
          onSubmit={handleSubmit}
          initialData={profile}
        />
      )}

      {message && step === "verify" && (
        <p className="text-sm text-center mt-4"> {message} </p>
      )}
    </div>
  );
};

export default LoginModal;
