"use client";

import ProfileForm from "@/components/form/ProfileForm";
import HeaderLogin from "@/components/site/HeaderLogin";
import LegalDisclaimer from "@/components/site/LegalDisclaimer";
import LoaderAudio from "@/components/site/LoaderAudio";
import { Button } from "@/components/sub/button";
import { useProfiles } from "@/hook/useProfiles";
import { useUser } from "@/lib/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, updateUserProfile } = useProfiles();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (formData: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    prefix: string;
    birthdate: string;
    gender: string;
    new: boolean;
    documentTypeId: string;
    numberDocument: string;
  }) => {
    if (!user?.id) return;

    setLoadingUpdate(true);

    const capturePrefix = formData.phone.startsWith("+")
      ? formData.phone.slice(0, 3)
      : formData.phone.slice(0, 2);

    const sanitizedPhone = formData.phone.startsWith("+")
      ? formData.phone.slice(3)
      : formData.phone;


    const updates = {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      phone: sanitizedPhone,
      birthdate: formData.birthdate,
      gender: formData.gender,
      prefix: capturePrefix,
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
        if (profile?.admin) {
          router.push("/dashboard");
        } else {
          router.push("/events");
        }
      }, 2000);
    } else {
      setMessage("⚠️ Algo salió mal. Intente más tarde.");
    }

    setLoadingUpdate(false);
  };

  if (userLoading || profileLoading || loadingUpdate) {
    return <LoaderAudio />;
  }

  if (!profile) {
    return <p className="text-center text-lg">No se encontró el perfil</p>;
  }

  console.log("🔍 Profile:", profile);

  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6 self-stretch px-12 py-12">
      <div className="w-full max-w-md">
        <HeaderLogin
          title={profile?.new ? "Crea tu cuenta" : "Actualiza tus datos"}
        />
        <div className="h-10" />
        <ProfileForm
          message={message}
          phone={profile?.phone || user?.phone || null}
          email={profile?.email || user?.email || null}
          isNew={profile?.new ?? true}
          onSubmit={handleSubmit}
          initialData={profile}
          prefix={profile?.prefix || null}
        />
        <div className="w-full h-5" />
        <Link href={`${profile?.admin ? "/dashboard" : "/events"}`}>
          <Button
            className="h-10 w-full flex-none"
            variant="brand-primary"
            size="large"
            icon="FeatherArrowRight"
            disabled={!profile?.phone || !profile?.email}
          />
        </Link>
        <div className="h-10" />
        <LegalDisclaimer />
      </div>
    </div>
  );
}
