// actions/post-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";

/**
 * Fetch all posts, optionally filtered by category.
 */
export async function getPosts(categoryFilter?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_id_fkey(id, full_name, avatar_url, role)
    `)
    .order("created_at", { ascending: false });

  if (categoryFilter && categoryFilter !== "all") {
    query = query.eq("category", categoryFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
  return data || [];
}

/**
 * Fetch comments for a specific post.
 */
export async function getPostComments(postId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles!comments_author_id_fkey(id, full_name, avatar_url)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
  return data || [];
}

/**
 * Add a comment to a post.
 */
export async function addComment(postId: string, content: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to comment.");
  }

  const { error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: postId,
        author_id: user.id,
        content,
      },
    ]);

  if (error) {
    console.error("Error adding comment:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
}

/**
 * Fetch current user profile if logged in.
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile || null;
}

/**
 * Sign out action.
 */
export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
}
