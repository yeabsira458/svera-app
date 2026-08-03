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

// Icons
const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

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
      const comments = await getPostComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
    } catch (err) {
      alert("Error adding comment: " + err);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "birth_info":
        return "👶 Births";
      case "marriage_info":
        return "💍 Marriages";
      case "death_info":
        return "🪦 Deaths";
      case "general_news":
      default:
        return "📢 News";
    }
  };

  // Calculate rough relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 bg-white border-b z-40 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex justify-between items-center w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow">
                SV
              </div>
              <div>
                <h1 className="font-extrabold text-lg md:text-xl tracking-tight text-gray-900 leading-none">
                  SVERA
                </h1>
              </div>
            </div>

            {/* Mobile Auth Status (Right side of header) */}
            <div className="flex md:hidden items-center gap-2">
               {currentUser ? (
                 <button
                   onClick={handleSignOut}
                   disabled={isPending}
                   className="text-xs font-semibold px-3 py-1.5 bg-gray-100 rounded-full text-gray-700"
                 >
                   Log Out
                 </button>
               ) : (
                 <Link href="/login" className="text-xs font-semibold px-3 py-1.5 bg-black text-white rounded-full">
                   Log In
                 </Link>
               )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-4 flex-wrap">
            {currentUser?.role === "admin" ? (
              <>
                <Link
                  href="/admin/post-news"
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-full shadow-sm transition"
                >
                  Post News
                </Link>
                <Link
                  href="/admin/inbox"
                  className="text-sm font-semibold text-gray-600 hover:text-black transition"
                >
                  Review Inbox
                </Link>
                <Link
                  href="/chat"
                  className="text-sm font-semibold text-gray-600 hover:text-black transition"
                >
                  Chat Portal
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/submit-request"
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold rounded-full shadow-sm transition"
                >
                  Submit Request
                </Link>
                <Link
                  href="/my-requests"
                  className="text-sm font-medium text-gray-600 hover:text-black transition"
                >
                  My Requests
                </Link>
                {currentUser && (
                  <Link
                    href="/chat"
                    className="text-sm font-medium text-gray-600 hover:text-black transition"
                  >
                    Chat
                  </Link>
                )}
              </>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 border-l pl-4 ml-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {currentUser.full_name || "Citizen"}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="text-xs font-semibold text-gray-500 hover:text-red-600 transition ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-l pl-4 ml-2">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-black border border-gray-200 hover:bg-gray-50 px-5 py-2 rounded-full transition"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Container - Desktop: 3 Col, Mobile/Tablet: 1 Col */}
      <div className="max-w-6xl mx-auto w-full md:px-6 md:py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Column (Desktop Sidebar / Mobile Horizontal Scroll) */}
        <aside className="lg:col-span-1 border-b md:border-b-0 bg-white md:bg-transparent">
          <div className="sticky top-20 p-2 md:p-0 overflow-x-auto no-scrollbar md:bg-white md:p-4 md:rounded-2xl md:border md:shadow-sm">
            <h3 className="hidden md:block font-bold text-sm text-gray-400 uppercase tracking-wider mb-3 px-2">Feed Filters</h3>
            <div className="flex flex-row lg:flex-col gap-2 min-w-max px-2 md:px-0">
              {[
                { id: "all", label: "For You" },
                { id: "birth_info", label: "👶 Births" },
                { id: "marriage_info", label: "💍 Marriages" },
                { id: "death_info", label: "🪦 Deaths" },
                { id: "general_news", label: "📢 Announcements" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 md:w-full md:text-left rounded-full md:rounded-xl text-sm font-bold transition-all ${
                    categoryFilter === cat.id
                      ? "bg-black text-white md:bg-gray-100 md:text-black"
                      : "bg-gray-100 text-gray-600 md:bg-transparent hover:bg-gray-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Central Feed Column (Threads-style constrained width) */}
        <main className="lg:col-span-2 w-full max-w-2xl mx-auto md:bg-white md:rounded-3xl md:border md:shadow-sm overflow-hidden mb-20 md:mb-0">
          
          <div className="p-4 md:p-6 border-b bg-white/50 backdrop-blur-sm sticky top-0 md:static z-10">
            <h2 className="font-bold text-xl text-gray-900">Feed</h2>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-medium">
              No posts found for this category.
            </div>
          ) : (
            <div className="flex flex-col">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border-b last:border-b-0 hover:bg-gray-50/50 transition duration-200 px-4 md:px-6 py-4 md:py-5"
                >
                  <div className="flex gap-3 md:gap-4">
                    {/* Avatar Column */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border flex items-center justify-center font-bold text-gray-700 shadow-sm flex-shrink-0 z-10">
                        {post.author?.full_name?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                      {/* Thread connecting line */}
                      <div className="w-0.5 bg-gray-200 flex-1 mt-2 mb-1 rounded-full"></div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 pb-2 min-w-0">
                      {/* Header row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-[15px] text-gray-900 truncate">
                            {post.author?.full_name || "SVERA Admin"}
                          </span>
                          {post.author?.role === 'admin' && (
                             <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                               <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                             </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                           <span className="text-[14px] text-gray-400">
                             {getRelativeTime(post.created_at)}
                           </span>
                           <button className="text-gray-400 hover:text-gray-900 transition p-1">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                           </button>
                        </div>
                      </div>

                      {/* Post Tag/Category */}
                      <div className="mt-1">
                        <span className="text-[12px] font-semibold text-gray-500">
                          {getCategoryLabel(post.category)}
                        </span>
                      </div>

                      {/* Body */}
                      <h3 className="font-bold text-gray-900 mt-2 text-[15px] leading-snug">{post.title}</h3>
                      <p className="text-gray-800 text-[15px] leading-relaxed mt-1 whitespace-pre-line break-words">
                        {post.content}
                      </p>

                      {/* Media */}
                      {post.image_url && (
                        <div className="mt-3.5 rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200/75 bg-gray-100 flex items-center justify-center">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="object-cover max-h-[500px] w-full"
                            loading="lazy"
                          />
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-4 flex items-center gap-4 text-gray-500">
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-2 group p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition"
                        >
                          <span className="group-hover:text-blue-600 transition-colors">
                            <ChatIcon />
                          </span>
                          {/* Could show comment count here if backend returns it */}
                          {(expandedComments[post.id] || (commentsMap[post.id] && commentsMap[post.id].length > 0)) && (
                            <span className="text-xs font-semibold mt-0.5 group-hover:text-blue-600">
                               {commentsMap[post.id]?.length || "..."}
                            </span>
                          )}
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Comments Section (Thread style nested) */}
                  {expandedComments[post.id] && (
                    <div className="ml-10 md:ml-12 mt-1">
                      
                      {/* Comments List */}
                      {commentsMap[post.id] && commentsMap[post.id].length > 0 && (
                        <div className="space-y-4 mb-4 mt-2">
                          {commentsMap[post.id].map((comment) => (
                             <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 border flex items-center justify-center font-bold text-gray-600 text-xs flex-shrink-0">
                                   {comment.author?.full_name?.charAt(0)?.toUpperCase() || "C"}
                                </div>
                                <div className="flex-1 pb-3 border-b border-gray-100 last:border-b-0">
                                   <div className="flex justify-between items-center">
                                      <span className="font-bold text-[14px] text-gray-900">
                                        {comment.author?.full_name || "Citizen"}
                                      </span>
                                      <span className="text-[12px] text-gray-400">
                                        {getRelativeTime(comment.created_at)}
                                      </span>
                                   </div>
                                   <p className="text-[14px] text-gray-800 mt-0.5 leading-snug">
                                      {comment.content}
                                   </p>
                                </div>
                             </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Form */}
                      <div className="flex gap-3 mt-4 items-center">
                         <div className="w-8 h-8 rounded-full bg-black flex-shrink-0 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {currentUser?.full_name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                         </div>
                         {currentUser ? (
                           <form
                             onSubmit={(e) => handleSubmitComment(e, post.id)}
                             className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-1 py-1 border border-transparent focus-within:border-gray-300 focus-within:bg-white transition-all"
                           >
                             <input
                               type="text"
                               placeholder={`Reply to ${post.author?.full_name?.split(' ')[0] || "admin"}...`}
                               value={commentInput[post.id] || ""}
                               onChange={(e) =>
                                 setCommentInput((prev) => ({
                                   ...prev,
                                   [post.id]: e.target.value,
                                 }))
                               }
                               required
                               className="flex-1 text-[14px] bg-transparent focus:outline-none py-1.5"
                             />
                             <button
                               type="submit"
                               disabled={!commentInput[post.id]?.trim()}
                               className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                                 commentInput[post.id]?.trim() ? "bg-black text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                               }`}
                             >
                               <SendIcon />
                             </button>
                           </form>
                         ) : (
                           <div className="flex-1 bg-gray-50 rounded-full px-4 py-2 border text-[13px] text-gray-500 flex items-center justify-between">
                              <span>Log in to reply</span>
                              <Link href="/login" className="font-bold text-black hover:underline">Log in</Link>
                           </div>
                         )}
                      </div>
                    </div>
                  )}

                </article>
              ))}
            </div>
          )}
        </main>

        {/* Right Side Nav (Desktop only) */}
        <aside className="hidden lg:block lg:col-span-1">
           <div className="sticky top-20 text-xs text-gray-400 space-y-4">
              <p>© {new Date().getFullYear()} SVERA</p>
              <div className="flex gap-3 flex-wrap">
                <Link href="#" className="hover:underline">About</Link>
                <Link href="#" className="hover:underline">Privacy</Link>
                <Link href="#" className="hover:underline">Terms</Link>
              </div>
           </div>
        </aside>
      </div>
      
      {/* Mobile Bottom Navigation Bar (Appears only on small screens) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t flex justify-around items-center py-3 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
         <Link href="/" className="flex flex-col items-center text-black">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </Link>
         
         <Link href="/submit-request" className="flex flex-col items-center text-gray-400 hover:text-black transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
         </Link>

         {currentUser && (
           <Link href="/chat" className="flex flex-col items-center text-gray-400 hover:text-black transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
           </Link>
         )}

         {currentUser?.role === 'admin' && (
           <Link href="/admin/inbox" className="flex flex-col items-center text-gray-400 hover:text-black transition">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
           </Link>
         )}
      </nav>

    </div>
  );
}
