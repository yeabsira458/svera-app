// app/admin/inbox/page.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getAdminSubmissions,
  updateSubmissionStatus,
  publishPost,
} from "@/actions/admin-actions";
import type { PostCategory } from "@/types/database";

export default function AdminInboxPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  // Create post modal state (pre-filled from submission)
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState<PostCategory>("general_news");
  const [postImageUrl, setPostImageUrl] = useState("");

  // Rejection/notes state
  const [adminNotes, setAdminNotes] = useState("");
  const [showRejectNotesInput, setShowRejectNotesInput] = useState(false);

  // Load submissions on mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    startTransition(async () => {
      try {
        const data = await getAdminSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error("Failed to load submissions", err);
      }
    });
  };

  const handleUpdateStatus = async (
    id: string,
    status: "under_review" | "rejected"
  ) => {
    try {
      await updateSubmissionStatus(id, status, adminNotes);
      loadSubmissions();
      setSelectedSub(null);
      setAdminNotes("");
      setShowRejectNotesInput(false);
    } catch (err) {
      alert("Error updating status: " + err);
    }
  };

  const handleOpenPublish = (sub: any) => {
    setSelectedSub(sub);
    setPostTitle(`Official Notice: ${sub.title}`);
    setPostContent(sub.description || "");
    setPostImageUrl(sub.file_url || "");
    // Pre-select category based on keywords
    const lowerTitle = sub.title.toLowerCase();
    if (lowerTitle.includes("birth")) setPostCategory("birth_info");
    else if (lowerTitle.includes("marry") || lowerTitle.includes("marriage")) setPostCategory("marriage_info");
    else if (lowerTitle.includes("death") || lowerTitle.includes("die")) setPostCategory("death_info");
    else setPostCategory("general_news");

    setShowPublishForm(true);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      // Build FormData to match publishPost(formData: FormData) signature
      const formData = new FormData();
      formData.set("title", postTitle);
      formData.set("content", postContent);
      formData.set("category", postCategory);
      if (postImageUrl) formData.set("imageUrl", postImageUrl);
      if (selectedSub.id) formData.set("submissionId", selectedSub.id);

      await publishPost(formData);
      loadSubmissions();
      setShowPublishForm(false);
      setSelectedSub(null);
      alert("Post successfully published and submission approved!");
    } catch (err) {
      alert("Error publishing post: " + err);
    }
  };

  // Filter local state
  const filteredSubmissions = submissions.filter((sub) => {
    if (statusFilter === "all") return true;
    return sub.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SVERA Admin Review Portal</h1>
          <p className="text-gray-600">Review, manage, and publish vital event registrations</p>
        </div>
        <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
          Admin Portal
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Filters */}
        <div className="flex gap-2 mb-6 border-b pb-4">
          {["all", "pending", "under_review", "approved_and_posted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border hover:bg-gray-100"
              }`}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {isPending ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading submissions...</div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-500">
            No submissions found matching this status.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        sub.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : sub.status === "under_review"
                          ? "bg-blue-100 text-blue-800"
                          : sub.status === "approved_and_posted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sub.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-1">
                    {sub.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {sub.description || "No description provided."}
                  </p>
                </div>
                <div className="border-t pt-3 mt-auto flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {sub.citizen?.full_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      {sub.citizen?.full_name || "Unknown Citizen"}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {sub.citizen?.phone_number || "No Phone"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedSub && !showPublishForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setSelectedSub(null);
                setShowRejectNotesInput(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>

            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedSub.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : selectedSub.status === "under_review"
                    ? "bg-blue-100 text-blue-800"
                    : selectedSub.status === "approved_and_posted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedSub.status.replace(/_/g, " ")}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedSub.title}</h2>
            <p className="text-gray-700 text-sm mb-4 bg-gray-50 p-3 rounded-lg border">
              {selectedSub.description || "No description provided."}
            </p>

            <div className="border-t border-b py-3 mb-4 flex justify-between text-xs text-gray-600">
              <div>
                <strong>Citizen:</strong> {selectedSub.citizen?.full_name || "Unknown"}
              </div>
              <div>
                <strong>Phone:</strong> {selectedSub.citizen?.phone_number || "N/A"}
              </div>
            </div>

            {selectedSub.file_url && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 mb-1">Attached Document:</p>
                <a
                  href={selectedSub.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm font-medium"
                >
                  📄 View Attached File / Document
                </a>
              </div>
            )}

            {/* Rejection / Note Input */}
            {showRejectNotesInput && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <label className="block text-xs font-semibold text-red-800 mb-1">
                  Rejection Reason / Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Enter why this was rejected or needs correction..."
                  rows={3}
                  className="w-full text-sm p-2 border rounded focus:outline-red-500"
                />
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-2 justify-end">
              {selectedSub.status === "pending" && (
                <button
                  onClick={() => handleUpdateStatus(selectedSub.id, "under_review")}
                  className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Mark Under Review
                </button>
              )}

              {showRejectNotesInput ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowRejectNotesInput(false);
                      setAdminNotes("");
                    }}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSub.id, "rejected")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 font-medium"
                  >
                    Confirm Reject
                  </button>
                </div>
              ) : (
                selectedSub.status !== "rejected" &&
                selectedSub.status !== "approved_and_posted" && (
                  <button
                    onClick={() => setShowRejectNotesInput(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition"
                  >
                    Reject
                  </button>
                )
              )}

              {selectedSub.status !== "approved_and_posted" && (
                <button
                  onClick={() => handleOpenPublish(selectedSub)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow transition"
                >
                  Approve & Post to Feed
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pre-filled Publish Form Modal */}
      {showPublishForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowPublishForm(false);
                setSelectedSub(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Create Public Post</h2>
            <p className="text-gray-500 text-xs mb-4">
              Review and finalize the announcement generated from the citizen request.
            </p>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                  className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Category
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as PostCategory)}
                    className="w-full text-sm p-2 border rounded bg-white"
                  >
                    <option value="birth_info">Birth Announcement</option>
                    <option value="marriage_info">Marriage Announcement</option>
                    <option value="death_info">Death Announcement</option>
                    <option value="general_news">General News / Public Info</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Associated Image URL
                  </label>
                  <input
                    type="text"
                    value={postImageUrl}
                    onChange={(e) => setPostImageUrl(e.target.value)}
                    placeholder="Auto-populated or input image link..."
                    className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Post Content
                </label>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required
                  rows={6}
                  className="w-full text-sm p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishForm(false)}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Back to Details
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow"
                >
                  Publish Officially
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
