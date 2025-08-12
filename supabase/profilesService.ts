import { supabase } from "@/lib/supabaseBrowser";
import { Profile } from "@/types/site";

export const getProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.log("Error fetching profiles:", error.message);
    return [];
  }

  return data;
};
/*
  getProfileById
  userId: string
  return: Profile | null
*/
export const getProfileById = async (
  userId: string
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.log("Error fetching profile:", error.message);
    return null;
  }

  return data as Profile;
};

export const updateProfile = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.log("Error updating profile:", error.message);
    return { error: "Failed to update profile. Please try again." };
  }

  return { data, success: "Profile updated successfully!" };
};
