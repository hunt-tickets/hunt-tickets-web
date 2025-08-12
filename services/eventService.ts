import { createClient } from "@/supabase/server";

export async function getEventById(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}

export async function getPopularEvents() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error fetching popular events:", error);
    return [];
  }

  return data;
}
