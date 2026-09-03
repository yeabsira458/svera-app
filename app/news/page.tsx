"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import type { PostWithAuthor } from "@/types/database";
import Header from "@/components/Header";

const CATEGORY_LABELS: Record<string, string> = {
  birth_info: "Birth Registration",
  marriage_info: "Marriage Registration",
  divorce_info: "Divorce Registration",
  adoption_info: "Adoption Registration",
  death_info: "Death Registration",
  general_news: "General News",
};
const CATEGORY_COLORS: Record<string, string> = {
  birth_info: "#27ae60",
  marriage_info: "#8e44ad",
  divorce_info: "#e74c3c",
  adoption_info: "#e67e22",
  death_info: "#7f8c8d",
  general_news: "#1a5276",
};
const CATEGORIES = ["all", "birth_info", "marriage_info", "divorce_info", "adoption_info", "death_info", "general_news"];

export default function NewsPage() {
  const [news, setNews] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const filtered = news.filter((p) => {
    const matchCat = filter === "all" || p.category === filter;
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      {/* Top Announcement Bar */}
      <div className="bg-red-700 text-white py-2.5 px-4 text-xs font-semibold tracking-wider text-center flex flex-wrap justify-center gap-2 items-center border-b border-red-800 shadow-inner">
        <span>SIDAMA REGIONAL STATE GOVERNMENT</span>
        <span className="hidden sm:inline">•</span>
        <span>VITAL EVENTS REGISTRATION AGENCY (SVERA)</span>
        <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold animate-pulse">Official Portal</span>
      </div>

      {/* Header */}
      <Header />

      {/* Hero */}
      <section
        className="py-20 text-white text-center"
        style={{ background: "linear-gradient(135deg, #0d2137, #1a5276)" }}
      >
        <ScrollReveal>
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#d4ac0d" }}>
            SVERA News
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">News &amp; Announcements</h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto px-4">
            Official announcements, policy updates, and news from the Sidama Vital Events Registration Agency.
          </p>
        </ScrollReveal>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={
                    filter === cat
                      ? { background: "#1a5276", color: "#fff" }
                      : { background: "#eaf0fb", color: "#1a5276", border: "1px solid #dce6f0" }
                  }
                >
                  {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-sm" style={{ border: "1px solid #dce6f0" }}>
                <div className="skeleton h-48 w-full" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-6 w-full" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-medium">No news found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 60}>
                <article
                  className="rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                  style={{ border: "1px solid #dce6f0" }}
                >
                  {post.image_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image src={post.image_url} alt={post.title} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-5xl" style={{ background: "linear-gradient(135deg, #eaf0fb, #dce6f0)" }}>
                      📰
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span
                      className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white mb-3 self-start"
                      style={{ background: CATEGORY_COLORS[post.category] ?? "#1a5276" }}
                    >
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2" style={{ color: "#0d2137" }}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-4 flex-1 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} SVERA — Sidama Vital Events Registration Agency. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
            <Link href="/events" className="hover:text-white transition">Events</Link>
            <Link href="/news" className="hover:text-white transition">News</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
