"use client";

import HeaderLogin from "@/components/site/HeaderLogin";
import LegalDisclaimer from "@/components/site/LegalDisclaimer";
import { useUser } from "@/lib/UserContext";
import { getProfiles, updateProfile } from "@/supabase/profilesService";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoadingProfile(true);
      const profiles = await getProfiles();
      const userProfile = profiles.find((p: any) => p.id === user.id);
      setProfile(userProfile || {});
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (formData: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthdate: string;
    gender: string;
  }) => {
    if (!user?.id) return;

    setLoadingUpdate(true);

    const updates = {
      name: formData.name,
      fullName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      birthdate: formData.birthdate,
      gender: formData.gender,
      updated_at: new Date().toISOString(),
    };

    const { success, error } = await updateProfile(user?.id, updates);

    if (error) {
      setMessage(error || "");
    } else {
      setMessage(success || "");
    }

    setLoadingUpdate(false);
  };

  if (userLoading || loadingProfile) {
    return <p className="text-center text-lg">Cargando...</p>;
  }

  return (
    <div className="flex grow shrink-0 basis-0 flex-col items-center justify-center gap-6 self-stretch px-12 py-12">
      <div className="w-full max-w-md">
        <HeaderLogin title="Dashboard" />
        <div className="h-10" />
        <LegalDisclaimer />
      </div>
    </div>
  );
}
