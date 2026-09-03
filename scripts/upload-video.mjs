import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// We need a way to bypass RLS. Let's try using the Supabase Management API
// or we can ask the user for the service role key.

// For now, let's try uploading via the REST API directly with the anon key
// after the user sets up the storage policy.

const SUPABASE_URL = "https://ngnyeqgenynugnatqxqs.supabase.co";

// Check if service role key is available
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = "sb_publishable_8Vcl360eQMYcmlMlbo6Bng_gRNRZ5gv";

const key = SERVICE_ROLE_KEY || ANON_KEY;
console.log("Using key type:", SERVICE_ROLE_KEY ? "SERVICE_ROLE" : "ANON");

const supabase = createClient(SUPABASE_URL, key);

// Find the video file
const downloadsDir = "C:\\Users\\Yabew\\Downloads";
const files = fs.readdirSync(downloadsDir);
const videoFile = files.find((f) => f.startsWith("Firefly") && f.endsWith(".mp4"));

if (!videoFile) {
  console.error("Video file not found!");
  process.exit(1);
}

console.log("Found video:", videoFile);
const filePath = path.join(downloadsDir, videoFile);
const fileBuffer = fs.readFileSync(filePath);
console.log("File size:", (fileBuffer.length / 1024).toFixed(1), "KB");

const storagePath = "intro/svera-introductory-video.mp4";

async function upload() {
  const { data, error } = await supabase.storage
    .from("videos")
    .upload(storagePath, fileBuffer, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (error) {
    console.error("Upload error:", error.message);
    if (error.message.includes("row-level security")) {
      console.log("\n⚠️  RLS is blocking the upload. You need to either:");
      console.log("  1. Add a storage policy in Supabase Dashboard:");
      console.log("     → Storage → Policies → videos bucket → New Policy");
      console.log("     → Allow INSERT for all users (or authenticated)");
      console.log("  OR");
      console.log("  2. Provide SUPABASE_SERVICE_ROLE_KEY in .env.local");
    }
    process.exit(1);
  }

  console.log("✅ Upload successful!", data);

  const { data: urlData } = supabase.storage
    .from("videos")
    .getPublicUrl(storagePath);

  console.log("\n🎬 Public Video URL:");
  console.log(urlData.publicUrl);
}

upload();
