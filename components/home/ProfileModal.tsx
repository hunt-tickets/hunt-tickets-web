"use client";

import ProfileForm from "@/components/form/ProfileForm";
import { useProfiles } from "@/hook/useProfiles";
import { useUser } from "@/lib/UserContext";
import { useState } from "react";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [message, setMessage] = useState<string>("");
  const { user } = useUser();
  const { profile, loading: profileLoading, updateUserProfile } = useProfiles();


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

  return (
    <div className="w-full max-w-md">
      <ProfileForm
        message={message}
        phone={profile?.phone || user?.phone || null}
        prefix={profile?.prefix || null}
        email={profile?.email || user?.email || null}
        isNew={profile?.new ?? true}
        onSubmit={handleSubmit}
        initialData={profile}
      />
    </div>
  );
};

export default LoginModal;
