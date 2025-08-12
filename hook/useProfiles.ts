import { useUser } from "@/lib/UserContext";
import { getProfileById, updateProfile } from "@/supabase/profilesService";
import { useCallback, useEffect, useState } from "react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  updated_at?: string;
  [key: string]: any;
}

export const useProfiles = () => {
  const { user, loading: userLoading } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const userProfile = await getProfileById(user.id);
      setProfile(userProfile || null);
    } catch (err) {
      setError("Error fetching profile");
      console.log("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userLoading && user?.id) {
      fetchProfile();
    }
  }, [user?.id, userLoading]);

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return { error: "User ID not found" };

    setLoading(true);
    setError(null);
    try {
      const response = await updateProfile(user.id, updates);
      if (response.error) {
        setError(response.error);
        return false;
      }
      setProfile((prev) => ({
        ...prev!,
        ...updates,
        id: prev?.id ?? user.id ?? "",
      }));
      return true;
    } catch (err) {
      setError("Error updating profile");
      console.log("Error updating profile:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, fetchProfile, updateUserProfile };
};
