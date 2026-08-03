// actions/event-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

/**
 * Fetch all upcoming events, ordered by event_date ascending.
 * Public — no auth required.
 */
export async function getEvents() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      author:profiles!events_author_id_fkey(id, full_name, avatar_url)
    `)
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }
  return data || [];
}

/**
 * Create a new upcoming event (admin only).
 * Accepts FormData — title, description, event_date, location, imageFile (optional).
 */
export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Admin not authenticated — please sign in again.");
  }

  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || null;
  const eventDate = formData.get("event_date") as string;
  const location = (formData.get("location") as string) || null;
  const imageFile = formData.get("imageFile") as File | null;

  if (!title || !eventDate) {
    throw new Error("Missing required fields: title and event_date.");
  }

  let imageUrl: string | null = null;

  // Upload image if provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `event-images/${uuidv4()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("citizen-documents")
      .upload(filePath, imageFile, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("citizen-documents")
      .getPublicUrl(filePath);
    imageUrl = publicUrlData?.publicUrl ?? null;
  }

  const { error } = await supabase.from("events").insert([{
    author_id: user.id,
    title,
    description,
    event_date: eventDate,
    location,
    image_url: imageUrl,
  }]);

  if (error) {
    throw new Error(`Could not create event: ${error.message}`);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
}

/**
 * Delete an event by ID (admin only).
 */
export async function deleteEvent(id: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Admin not authenticated.");
  }

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    throw new Error(`Could not delete event: ${error.message}`);
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
}
