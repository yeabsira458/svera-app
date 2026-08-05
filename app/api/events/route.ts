import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, event_date, location, image_url")
    .order("event_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
