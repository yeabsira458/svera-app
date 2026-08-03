// actions/admin-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import type { Database } from "@/types/database";
import { v4 as uuidv4 } from "uuid";

/**
 * Fetch all submissions, optionally filtered by status.
 */
export async function getAdminSubmissions(statusFilter?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("submissions")
    .select(`
      id,
      title,
      description,
      file_url,
      status,
      admin_notes,
      created_at,
      citizen_id
    `)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching admin submissions:", error);
    throw new Error(error.message);
  }

  // Fetch citizen details for each submission manually since we are using plain JS client joins
  // or do a join query. Since supabase supports joins, let's join:
  // Note: we can fetch profiles in a separate query or join if schemas are correct.
  // Let's do a join query for citizen profiles:
  const { data: joinedData, error: joinError } = await supabase
    .from("submissions")
    .select(`
      *,
      citizen:profiles!submissions_citizen_id_fkey(id, full_name, phone_number)
    `)
    .order("created_at", { ascending: false });

  if (joinError) {
    console.error("Error fetching joined submissions:", joinError);
    // Fallback to data without citizen profiles if join fails
    return (data || []).map(item => ({ ...item, citizen: null }));
  }

  if (statusFilter && statusFilter !== "all") {
    return (joinedData || []).filter(item => item.status === statusFilter);
  }

  return joinedData || [];
}

/**
 * Update the status of a submission (e.g. Under Review, Rejected).
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: Database["public"]["Tables"]["submissions"]["Update"]["status"],
  adminNotes?: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("submissions")
    .update({
      status,
      admin_notes: adminNotes ?? null,
    })
    .eq("id", submissionId);

  if (error) {
    console.error("Error updating submission status:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin/inbox");
}

/**
 * Create a public announcement post and associate it with a submission (if any).
 * Accepts FormData — works from both admin/post-news page and admin/inbox modal.
 */
export async function publishPost(formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("publishPost auth error:", authError);
    throw new Error("Admin not authenticated — please sign in again.");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as Database["public"]["Tables"]["posts"]["Insert"]["category"];
  const submissionId = (formData.get("submissionId") as string) || undefined;
  const imageUrlParam = formData.get("imageUrl") as string | null;
  const imageFile = formData.get("imageFile") as File | null;

  if (!title || !content || !category) {
    throw new Error("Missing required fields: title, content or category.");
  }

  let imageUrl = imageUrlParam || null;

  // Handle uploaded post image — only if a real file was provided
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `post-images/${uuidv4()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("citizen-documents")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Post image upload error:", uploadError);
      throw new Error(`Image upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from("citizen-documents")
      .getPublicUrl(filePath);

    imageUrl = publicUrlData?.publicUrl ?? null;
  }

  // 1. Insert post
  const { error: postError } = await supabase
    .from("posts")
    .insert([{
      author_id: user.id,
      title,
      content,
      category,
      image_url: imageUrl,
    }]);

  if (postError) {
    console.error("Error publishing post:", postError);
    throw new Error(`Could not publish post: ${postError.message}`);
  }

  // 2. If submissionId is provided, mark it as approved_and_posted
  if (submissionId) {
    const { error: subError } = await supabase
      .from("submissions")
      .update({
        status: "approved_and_posted",
        admin_notes: "Approved and published to feed.",
      })
      .eq("id", submissionId);

    if (subError) {
      console.error("Error updating submission on publish:", subError);
      throw new Error(`Could not approve submission: ${subError.message}`);
    }
  }

  revalidatePath("/admin/inbox");
  revalidatePath("/");
}
