// actions/auth-actions.ts
"use server";

import { createClient } from "@/utils/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUpUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phoneNumber = formData.get("phoneNumber") as string;

  const supabase = await createClient();

  // Sign up using Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone_number: phoneNumber,
      },
    },
  });

  if (error) {
    console.error("Sign up error:", error);
    return { error: error.message };
  }

  // Explicitly update the phone number in profiles
  if (data?.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ phone_number: phoneNumber })
      .eq("id", data.user.id);

    if (profileError) {
      console.error("Error updating phone number in profile:", profileError);
    }
  }

  revalidatePath("/");
  // Server-side redirect — ensures session cookie is flushed before browser navigates
  redirect("/");
}

export async function signInUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign in error:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  // Server-side redirect — ensures session cookie is flushed before browser navigates
  redirect("/");
}
