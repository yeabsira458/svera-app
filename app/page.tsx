// app/page.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  getPosts,
  getPostComments,
  addComment,
  getCurrentUser,
  signOutUser,
} from "@/actions/post-actions";
import type { PostCategory } from "@/types/database";

export default function LandingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [commentsMap, setCommentsMap] = useState<{ [postId: string]: any[] }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [isPending, startTransition] = useTransition();

  // Load feed and auth state on mount
  useEffect(() => {
    loadFeed();
    checkAuth();
  }, [categoryFilter]);

  const loadFeed = async () => {
    try {
      const data = await getPosts(categoryFilter);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Auth check failed", err);
    }
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutUser();
      setCurrentUser(null);
    });
  };

  const toggleComments = async (postId: string) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));

    // Load comments if expanding and not already loaded
    if (!isExpanded) {
      try {
        const comments = await getPostComments(postId);
        setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
      } catch (err) {
        console.error("Error loading comments", err);
      }
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const content = commentInput[postId];
    if (!content || !content.trim()) return;

    try {
      await addComment(postId, content);
      setCommentInput((prev) => ({ ...prev, [postId]: "" }));
      // Reload comments
      const comments = await getPostComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
    } catch (err) {
      alert("Error adding comment: " + err);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "birth_info":
        return "👶 Birth Registration";
      case "marriage_info":
        return "💍 Marriage Announcement";
      case "death_info":
        return "🪦 Death Notice";
      case "general_news":
      default:
        return "📢 Agency News";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 bg-white border-b z-40 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow">
              SV
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-gray-900 leading-none">
                SVERA
              </h1>
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 mt-0.5">
                Sidama Vital Events Registration Agency
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-4 flex-wrap">
            {currentUser?.role === "admin" ? (
              <>
                <Link
                  href="/admin/post-news"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  Post News
                </Link>
                <Link
                  href="/admin/inbox"
                  className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition"
                >
                  Review Inbox
                </Link>
                <Link
                  href="/chat"
                  className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition"
                >
                  Chat Portal
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/submit-request"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                >
                  Submit Request / File
                </Link>
                <Link
                  href="/my-requests"
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition"
                >
                  Track My Requests
                </Link>
                {currentUser && (
                  <Link
                    href="/chat"
                    className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition"
                  >
                    Chat with SVERA
                  </Link>
                )}
              </>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 border-l pl-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-800">
                    {currentUser.full_name || "Citizen"}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-2.5 py-1.5 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:bg-emerald-50 px-4 py-2 rounded-lg transition"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Filter Column */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 bg-white p-4 rounded-xl border shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-gray-900 mb-3 px-1">Categories</h3>
            {[
              { id: "all", label: "All News" },
              { id: "birth_info", label: "Birth Announcements" },
              { id: "marriage_info", label: "Marriage Records" },
              { id: "death_info", label: "Death Notices" },
              { id: "general_news", label: "Vital Updates" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === cat.id
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Central Feed Column */}
        <main className="md:col-span-3 space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed text-gray-500">
              No updates posted yet in this category.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Image Header if applicable */}
                {post.image_url && (
                  <div className="relative h-48 w-full bg-gray-100 border-b">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {getCategoryLabel(post.category)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {post.content}
                  </p>

                  <div className="border-t pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                        {post.author?.full_name?.charAt(0) || "A"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {post.author?.full_name || "SVERA Registrar"}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                          {post.author?.role || "Admin"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
                    >
                      {expandedComments[post.id] ? "Hide Comments" : "Show Comments"}
                    </button>
                  </div>
                </div>

                {/* Comments Drawer */}
                {expandedComments[post.id] && (
                  <div className="bg-gray-50 border-t p-6 space-y-4">
                    <h3 className="font-bold text-sm text-gray-900">Comments & Q&A</h3>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {!commentsMap[post.id] || commentsMap[post.id].length === 0 ? (
                        <p className="text-xs text-gray-500">No questions or comments yet.</p>
                      ) : (
                        commentsMap[post.id].map((comment) => (
                          <div key={comment.id} className="bg-white p-3 rounded-lg border text-xs">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="font-bold text-gray-800">
                                {comment.author?.full_name || "Citizen"}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Comment Form */}
                    {currentUser ? (
                      <form
                        onSubmit={(e) => handleSubmitComment(e, post.id)}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          placeholder="Ask a question or leave feedback..."
                          value={commentInput[post.id] || ""}
                          onChange={(e) =>
                            setCommentInput((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          required
                          className="flex-1 text-xs p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                        >
                          Submit
                        </button>
                      </form>
                    ) : (
                      <div className="text-center p-3 bg-white border rounded-lg text-xs text-gray-500">
                        Please{" "}
                        <Link href="/login" className="text-emerald-600 font-semibold underline">
                          Sign In
                        </Link>{" "}
                        to post a comment or ask a question.
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 text-xs py-8 border-t border-gray-900 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
          <p>© {new Date().getFullYear()} Sidama Vital Events Registration Agency (SVERA).</p>
          <p>
            Ensuring lawful registration of births, marriages, and events across the Sidama Region.
          </p>
        </div>
      </footer>
    </div>
  );
}
