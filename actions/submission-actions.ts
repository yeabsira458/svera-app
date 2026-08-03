// actions/submission-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import type { Database } from "@/types/database";

/**
 * Insert a new citizen submission.
 * Returns the newly created row's ID on success.
 */
export async function createSubmission(formData: FormData) {
  const supabase = await createClient();

  // Extract fields from FormData
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const file = formData.get("file") as File | null;

  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const citizenId = user.id;

  // Upload file to Supabase Storage if provided
  let fileUrl: string | null = null;
  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop();
    const filePath = `${uuidv4()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("citizen-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadError) {
      console.error("File upload error:", uploadError);
      throw new Error("Failed to upload file");
    }
    // Build public URL (assuming public bucket)
    const { data: publicUrlData } = supabase.storage
      .from("citizen-documents")
      .getPublicUrl(filePath);
    fileUrl = publicUrlData?.publicUrl ?? null;
  }

  // Insert into submissions table
  const { data, error } = await supabase
    .from("submissions")
    .insert([
      {
        citizen_id: citizenId,
        title,
        description,
        file_url: fileUrl,
      } as Database["public"]["Tables"]["submissions"]["Insert"],
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Insert error:", error);
    throw new Error(error.message);
  }

  return data.id;
}

/**
 * Retrieve submissions for the currently authenticated citizen.
 */
export async function getUserSubmissions() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data, error } = await supabase
    .from("submissions")
    .select("id, title, status, created_at, file_url")
    .eq("citizen_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Fetch submissions error:", error);
    throw new Error(error.message);
  }
  return data;
}
