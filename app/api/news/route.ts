import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, category, image_url, created_at, author_id")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
