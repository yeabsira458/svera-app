// actions/admin-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a public announcement post.
 * Accepts FormData — works from admin/post-news page.
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
  const category = formData.get("category") as any;
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

  revalidatePath("/");
}
