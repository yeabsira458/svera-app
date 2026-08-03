// app/admin/post-news/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { publishPost } from "@/actions/admin-actions";
import type { PostCategory } from "@/types/database";

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
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-900">Post Official News Update</h1>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
        {/* Post Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Post Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="Official Notice: Birth Certificate Issuance..."
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            className="w-full rounded-md border border-gray-300 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            <option value="general_news">Vital News / Updates</option>
            <option value="birth_info">Birth Announcement</option>
            <option value="marriage_info">Marriage Announcement</option>
            <option value="death_info">Death Announcement</option>
          </select>
        </div>

        {/* Post Image Upload */}
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Announcement Photo (Optional)
          </label>
          <input
            type="file"
            name="imageFile"
            id="imageFile"
            accept="image/*"
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Post Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Post Content
          </label>
          <textarea
            name="content"
            id="content"
            rows={6}
            required
            placeholder="Write official description and news content..."
            className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          ></textarea>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </section>
  );
}
