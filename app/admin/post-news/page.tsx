// app/admin/post-news/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { publishPost } from "@/actions/admin-actions";

export default function PostNewsPage() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);

    try {
      await publishPost(formData);
      router.push("/");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish post.");
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 shadow-sm mt-8">
      <h1 className="text-2xl font-black mb-4 text-slate-900">Post Official News Update</h1>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
        {/* Post Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">
            Post Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="Official Notice: Birth Certificate Issuance..."
            className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            className="w-full rounded-xl border border-slate-200 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition"
          >
            <option value="general_news">Vital News / Updates</option>
            <option value="birth_info">Birth Announcement</option>
            <option value="marriage_info">Marriage Announcement</option>
            <option value="death_info">Death Announcement</option>
          </select>
        </div>

        {/* Post Image Upload */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-semibold text-slate-700 mb-1">
            Upload Announcement Photo (Optional)
          </label>
          <input
            type="file"
            name="imageFile"
            id="imageFile"
            accept="image/*"
            className="w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition cursor-pointer"
          />
        </div>

        {/* Post Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-1">
            Post Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={6}
            required
            placeholder="Write official description and news content..."
            className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm transition resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition shadow shadow-red-950/10 disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </section>
  );
}
