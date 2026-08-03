// actions/chat-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

/**
 * Fetch all chat messages exchanged between the logged-in user and another user.
 */
export async function getChatMessages(otherUserId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      sender_id,
      recipient_id,
      content,
      file_url,
      created_at
    `)
    .or(`and(sender_id.eq.${user.id},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${user.id})`)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chat messages:", error);
    return [];
  }

  return data || [];
}

/**
 * Send a chat message, optionally attaching an image photo.
 */
export async function sendChatMessage(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const recipientId = formData.get("recipientId") as string;
  const content = formData.get("content") as string | null;
  const file = formData.get("imageFile") as File | null;

  if (!recipientId) throw new Error("Missing recipient ID");

  let fileUrl: string | null = null;

  // Handle image upload if a file was selected
  if (file && file.size > 0) {
    const fileExt = file.name.split(".").pop();
    const filePath = `chat-attachments/${uuidv4()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("citizen-documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Chat image upload error:", uploadError);
      throw new Error(`Failed to upload photo: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("citizen-documents")
      .getPublicUrl(filePath);

    fileUrl = publicUrlData?.publicUrl ?? null;
  }

  const { error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: user.id,
        recipient_id: recipientId,
        content: content || "",
        file_url: fileUrl,
      },
    ]);

  if (error) {
    console.error("Error sending message:", error);
    throw new Error(error.message);
  }

  revalidatePath("/chat");
  return { success: true };
}

/**
 * Fetch available chat contacts.
 * For Citizens: Retrieves all SVERA Admins.
 * For Admins: Retrieves all citizens who have ever sent a message.
 */
export async function getChatContacts() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get current user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) return [];

  if (profile.role === "admin") {
    // Admins need to find all unique citizen IDs who messaged them, then return their profiles.
    const { data: inboundMessages, error: msgError } = await supabase
      .from("messages")
      .select("sender_id")
      .eq("recipient_id", user.id);

    if (msgError) {
      console.error("Error fetching admin chat list:", msgError);
      return [];
    }

    const senderIds = Array.from(new Set((inboundMessages || []).map((m) => m.sender_id)));

    if (senderIds.length === 0) return [];

    const { data: profiles, error: profError } = await supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url")
      .in("id", senderIds);

    if (profError) {
      console.error("Error fetching profiles for admin chats:", profError);
      return [];
    }

    return profiles || [];
  } else {
    // Citizens can see all SVERA admins to start a conversation.
    const { data: admins, error: adminError } = await supabase
      .from("profiles")
      .select("id, full_name, role, avatar_url")
      .eq("role", "admin");

    if (adminError) {
      console.error("Error fetching SVERA admins for citizen:", adminError);
      return [];
    }

    return admins || [];
  }
}
