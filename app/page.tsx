// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPosts } from "@/actions/post-actions";
import { getEvents } from "@/actions/event-actions";
import { getFamilyRegistrations } from "@/actions/family-actions";
import Header from "@/components/Header";
import ScrollReveal from "@/components/ScrollReveal";



export default function LandingPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [familyRegs, setFamilyRegs] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Load feed and events on mount
  useEffect(() => {
    loadFeed();
    loadEvents();
    loadFamilyRegs();
  }, [categoryFilter]);

  const loadFamilyRegs = async () => {
    try {
      const data = await getFamilyRegistrations();
      setFamilyRegs(data);
    } catch (err) {
      console.error("Failed to load family registrations", err);
    }
  };

  const loadFeed = async () => {
    try {
      const data = await getPosts(categoryFilter);
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "birth_info":
        return "👶 Births";
      case "marriage_info":
        return "💍 Marriages";
      case "divorce_info":
        return "💔 Divorces";
      case "adoption_info":
        return "👪 Adoptions";
      case "death_info":
        return "🪦 Deaths";
      case "general_news":
      default:
        return "📢 News";
    }
  };

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

  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  // Mock list of Sidama offices & desk items matching layout style
  const deskServices = [
    { label: "Birth Registry", icon: "👶", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { label: "Marriage Records", icon: "💍", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { label: "Death Registry", icon: "🪦", color: "bg-green-50 text-green-600 border-green-100" },
    { label: "Record Corrections", icon: "📋", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { label: "Statistics Division", icon: "📊", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { label: "Woreda Offices", icon: "🏛️", color: "bg-amber-50 text-amber-600 border-amber-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-red-700 text-white py-2.5 px-4 text-xs font-semibold tracking-wider text-center flex flex-wrap justify-center gap-2 items-center border-b border-red-800 shadow-inner">
        <span>SIDAMA REGIONAL STATE GOVERNMENT</span>
        <span className="hidden sm:inline">•</span>
        <span>VITAL EVENTS REGISTRATION AGENCY (SVERA)</span>
        <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold animate-pulse">Official Portal</span>
      </div>

      {/* 2. Main Header */}
      <Header />

      {/* 3. Hero Section (Gradient background, big typography, and welcome portrait card) */}
      <section className="relative bg-gradient-to-b from-slate-900 via-indigo-950 to-indigo-900 text-white overflow-hidden py-16 md:py-24 px-4 md:px-6">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_70%_30%,_#ef4444_0%,_transparent_50%)]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
            <span className="inline-block bg-red-600/30 border border-red-500/40 text-red-300 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
              Legal Identity & Civil Protection
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Support Us to Build a <span className="text-red-400">Strong & Verified</span> Digital Civil System
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-xl">
              SVERA coordinates accurate documentation of all births, marriages, and deaths across the Sidama region, laying the foundation for development, policy planning, and civil rights protection.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/about"
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-red-900/30"
              >
                Learn Civil Processes
              </Link>
              <Link
                href="/events"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-xl transition"
              >
                Registration Drives
              </Link>
            </div>
          </div>

          {/* Hero Right: Mayor-styled Welcome Card */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5 animate-scale-up">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 border border-white/10 group">
              <video
                src="https://ngnyeqgenynugnatqxqs.supabase.co/storage/v1/object/public/videos/welcome.mp4"
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover rounded-2xl"
                poster=""
              >
                Your browser does not support the video tag.
              </video>
              <span className="absolute bottom-4 left-4 z-20 text-xs font-bold text-red-400 uppercase tracking-widest bg-slate-900/60 px-2.5 py-1 rounded pointer-events-none">
                Introductory Video
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white leading-tight">Welcome to Sidama Civil Registry</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                &ldquo;Every Sidama citizen deserves a legally recognized status. SVERA works day and night to digitize and expand access to birth, marriage, and death registrations across all woredas.&rdquo;
              </p>
              <div className="pt-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">
                  DG
                </div>
                <div>
                  <h4 className="text-xs font-extrabold">Director General of SVERA</h4>
                  <p className="text-[10px] text-slate-400">Head of Sidama Vital Events Agency</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Be Updated with Agency News Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <ScrollReveal variant="up">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">Civil Announcements</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">Be Updated with SVERA News</h2>
              <p className="text-slate-500 text-sm mt-1">Stay updated with official news, registry updates, and public safety announcements.</p>
            </div>
            
            {/* Feed Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All News" },
                { id: "birth_info", label: "👶 Births" },
                { id: "marriage_info", label: "💍 Marriages" },
                { id: "divorce_info", label: "💔 Divorces" },
                { id: "adoption_info", label: "👪 Adoptions" },
                { id: "death_info", label: "🪦 Deaths" },
                { id: "general_news", label: "📢 Announcements" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat.id
                      ? "bg-red-600 text-white shadow-sm"
                      : "bg-white border text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 text-slate-400">
            No news articles posted yet in this category.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {posts.slice(0, 4).map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 80} variant="up">
                <Link href="/news" className="block h-full">
                  <article
                    className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between h-full"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden border-b">
                        <img
                          src={post.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=400&auto=format&fit=crop"}
                          alt={post.title}
                          className="object-cover w-full h-full"
                        />
                        <span className="absolute top-3 right-3 bg-red-600 text-white font-bold text-[9px] uppercase px-2.5 py-1 rounded-full tracking-wider shadow">
                          {getCategoryLabel(post.category)}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          {getRelativeTime(post.created_at)}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug hover:text-red-600 transition cursor-pointer">
                          {post.title}
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                          {post.content}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Family Registration Section */}
      <section className="bg-gradient-to-r from-indigo-950 to-slate-900 text-white py-16 px-4 md:px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto space-y-10">
          <ScrollReveal variant="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-block bg-red-600/30 border border-red-500/40 text-red-300 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
                👨‍👩‍👧‍👦 Vital Family Records
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Family Registration</h2>
              <p className="text-slate-300 text-sm max-w-lg mx-auto">
                Access official guidelines, document checklists, and application files for Resident IDs and Marriage Certificates in the Sidama region.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resident ID Cards */}
            <ScrollReveal variant="left" className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl">
                    🪪
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Resident ID Services</h3>
                    <p className="text-xs text-slate-400">Kebele & Woreda Residency Cards</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {familyRegs.filter(r => r.type === "resident_id").length === 0 ? (
                    // Default Guide
                    <div className="space-y-4 text-sm text-slate-300">
                      <p className="font-semibold text-white">General Requirements for Resident ID:</p>
                      <ul className="space-y-2 list-disc list-inside text-xs text-slate-300">
                        <li>Official application letter from your local Kebele</li>
                        <li>Three recent passport-sized photographs</li>
                        <li>Birth certificate or age validation record</li>
                        <li>Residency verification letter from landlord/family head</li>
                      </ul>
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                          📌 Visit your nearest Woreda office to submit documents
                        </span>
                      </div>
                    </div>
                  ) : (
                    familyRegs.filter(r => r.type === "resident_id").map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <p className="text-xs text-slate-300">{item.description}</p>
                        {item.requirements && item.requirements.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requirements:</span>
                            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                              {item.requirements.map((req: string, idx: number) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.document_url && (
                          <a
                            href={item.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs font-bold text-orange-400 hover:underline"
                          >
                            📥 Download Application Form
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Marriage Certificate Cards */}
            <ScrollReveal variant="right" className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-2xl">
                    💍
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Marriage Certificate Services</h3>
                    <p className="text-xs text-slate-400">Official Legal Marriage Registry</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {familyRegs.filter(r => r.type === "marriage_cert").length === 0 ? (
                    // Default Guide
                    <div className="space-y-4 text-sm text-slate-300">
                      <p className="font-semibold text-white">General Requirements for Marriage Certificate:</p>
                      <ul className="space-y-2 list-disc list-inside text-xs text-slate-300">
                        <li>Completed joint application form by both spouses</li>
                        <li>Valid Resident IDs of both spouses</li>
                        <li>Official presence and signatures of 3 legal witnesses</li>
                        <li>Two passport-sized photographs of each spouse</li>
                      </ul>
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">
                          📌 Certificates are issued within 5-7 working days after registration
                        </span>
                      </div>
                    </div>
                  ) : (
                    familyRegs.filter(r => r.type === "marriage_cert").map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <h4 className="font-bold text-sm text-white">{item.title}</h4>
                        <p className="text-xs text-slate-300">{item.description}</p>
                        {item.requirements && item.requirements.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requirements:</span>
                            <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                              {item.requirements.map((req: string, idx: number) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {item.document_url && (
                          <a
                            href={item.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs font-bold text-red-400 hover:underline"
                          >
                            📥 Download Form/Template
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. Departments & Information Desk (Grid and Hotlines Sidebar) */}
      <section className="bg-slate-100/80 border-y border-slate-200/50 py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Desk List Grid */}
          <div className="lg:col-span-8 space-y-6">
            <ScrollReveal variant="left">
              <div>
                <span className="text-xs font-black text-red-600 uppercase tracking-wider">Departments & Services</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">Registration Desks & Information</h2>
                <p className="text-slate-500 text-sm mt-1">Find the direct service counters for civil processes and certificates.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {deskServices.map((desk, i) => (
                <ScrollReveal key={desk.label} delay={i * 70} variant="scale">
                  <div
                    className={`bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-1 transition duration-300`}
                  >
                    <div className="text-3xl">{desk.icon}</div>
                    <h3 className="font-extrabold text-slate-800 text-sm">{desk.label}</h3>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Public Service</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Sidebar / Helplines Card */}
          <ScrollReveal variant="right" className="lg:col-span-4">
          <div className="space-y-6">
            <div className="bg-indigo-950 text-white rounded-3xl p-6 shadow-lg border border-indigo-900">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2">
                📞 Helplines & Vital Services
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex justify-between items-center py-2 border-b border-indigo-900/60 hover:text-red-400 transition cursor-pointer">
                  <span>Director General&apos;s Desk</span>
                  <span>dg@svera.gov.et</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-indigo-900/60 hover:text-red-400 transition cursor-pointer">
                  <span>Birth & Certificates Desk</span>
                  <span>+251 46 220 1234</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-indigo-900/60 hover:text-red-400 transition cursor-pointer">
                  <span>Marriage Registration Desk</span>
                  <span>+251 46 220 5678</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-indigo-900/60 hover:text-red-400 transition cursor-pointer">
                  <span>Death & Civil Amendments</span>
                  <span>+251 46 220 9012</span>
                </li>
                <li className="flex justify-between items-center py-2 hover:text-red-400 transition cursor-pointer">
                  <span>Regional IT Support Desk</span>
                  <span>support@svera.gov.et</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider mb-3">Civil Resources</h3>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
                <li className="hover:text-red-600 transition cursor-pointer">📄 SVERA Annual Registry Report (2025)</li>
                <li className="hover:text-red-600 transition cursor-pointer">📄 Birth Registration Requirements Document</li>
                <li className="hover:text-red-600 transition cursor-pointer">📄 Regional Vital Events Code Booklet</li>
              </ul>
            </div>
          </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 6. Recent Events & Upcoming schedules list */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Featured Highlight card (Recent Events block style) */}
          <ScrollReveal variant="left" className="lg:col-span-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">Registry Operations</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">Featured Initiative</h2>
            </div>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-900 border shadow-lg group">
              <img
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800&auto=format&fit=crop"
                alt="Digital Training"
                className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="bg-red-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">
                  Technology Drive
                </span>
                <h3 className="font-extrabold text-lg md:text-xl leading-tight">
                  Implementing Digital Registry at Woreda Levels
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                  SVERA is currently deploying modern desktop registration terminals to 12 district offices to phase out paper-based processes.
                </p>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Upcoming Schedules listing */}
          <ScrollReveal variant="right" className="lg:col-span-6">
          <div className="space-y-5">
            <div>
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">Calendar Dates</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">Upcoming Schedules</h2>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/60 text-slate-400 space-y-3">
                <p className="text-3xl">📅</p>
                <p className="text-sm font-medium">No upcoming schedules at the moment.</p>
                <Link href="/events" className="inline-block text-xs font-bold text-red-600 hover:underline">
                  Browse all events →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const evDate = formatEventDate(event.event_date);
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-4 flex gap-4 items-center hover:shadow-md transition duration-300"
                    >
                      {/* Event Date Badge */}
                      <div className="w-16 h-16 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center text-center flex-shrink-0">
                        <span className="text-red-600 text-2xl font-black leading-none">{evDate.day}</span>
                        <span className="text-red-700 text-[10px] font-bold uppercase tracking-wider mt-1">{evDate.month}</span>
                      </div>
                      
                      {/* Event Text */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight truncate">
                          {event.title}
                        </h4>
                        <div className="flex flex-wrap gap-x-3 text-xs text-gray-500">
                          <span>🕐 {evDate.time}</span>
                          {event.location && (
                            <span className="truncate">📍 {event.location}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Link
                        href="/events"
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg transition flex-shrink-0"
                      >
                        Details
                      </Link>
                    </div>
                  );
                })}

                {/* See All Events link */}
                <div className="pt-2">
                  <Link
                    href="/events"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-50 transition duration-200"
                  >
                    See All Events →
                  </Link>
                </div>
              </div>
            )}
          </div>
          </ScrollReveal>


        </div>
      </section>

      {/* 7. Explore Community & Meet Officials */}
      <section className="bg-slate-100/80 border-t py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Explore directory */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl font-black text-slate-900">Explore SVERA</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { title: "Public Sensitization Drives", desc: "Local campaigns on children rights" },
                { title: "Woreda Record Desks", desc: "Addresses and contacts of district desks" },
                { title: "Marriage Regulations", desc: "Required documents for civil spouse registration" },
                { title: "Death Certificate Guides", desc: "Legal processes and guidelines" },
                { title: "Annual Vital Statistics", desc: "Explore regional population metrics" },
                { title: "SVERA Civil Guidelines", desc: "Detailed records code brochure" },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/50 flex gap-3 hover:-translate-y-0.5 transition duration-200 cursor-pointer">
                  <span className="text-red-500 font-extrabold">▶</span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-xs">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SVERA leadership grid */}
          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-2xl font-black text-slate-900">Meet SVERA Officials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: "Director General",
                  role: "Head of Agency",
                  img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop",
                },
                {
                  name: "Divisional Director",
                  role: "Civil Records & Statistics",
                  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
                },
              ].map((person, idx) => (
                <div key={idx} className="bg-white rounded-2xl border shadow-sm overflow-hidden flex items-center gap-4 p-4 hover:shadow-md transition">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={person.img} alt={person.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{person.name}</h4>
                    <p className="text-xs text-red-600 font-semibold">{person.role}</p>
                    <span className="text-[10px] text-gray-400">SVERA Sidama</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8. Newsletter & emergency contacts widgets */}
      <section className="bg-red-700 text-white py-14 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <h3 className="text-xl font-black">Stay Updated with SVERA Notice Bulletins</h3>
            <p className="text-red-100 text-xs leading-relaxed max-w-sm">
              Subscribe to receive legal notifications, registration deadlines, and regional vital event metrics updates.
            </p>
            <div className="flex gap-2 pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-2.5 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none flex-1 max-w-xs"
              />
              <button className="bg-slate-950 hover:bg-slate-900 px-5 py-2.5 rounded-lg text-xs font-bold transition">
                Subscribe
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-3 gap-4 text-center">
            {[
              { num: "911", label: "Public Help Desk" },
              { num: "177", label: "Statistics Inquiry" },
              { num: "103", label: "Woreda Coordinator" },
            ].map((widget, idx) => (
              <div key={idx} className="bg-white/10 p-4 rounded-2xl border border-white/15">
                <span className="text-yellow-300 text-2xl font-black block">{widget.num}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider block mt-1.5 text-red-100">{widget.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Footer Details */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 md:px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center font-black text-sm">
                SV
              </div>
              <span className="font-extrabold text-white text-base">SVERA</span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              Sidama Regional Vital Events Registration Agency coordinates secure civil registration services to secure legal rights for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-extrabold uppercase tracking-wider mb-4">SVERA Offices</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition">Hawassa Head Office</li>
              <li className="hover:text-white transition">Yirgalem District Desk</li>
              <li className="hover:text-white transition">Bona Woreda Desk</li>
              <li className="hover:text-white transition">Aleta Wondo Office</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-extrabold uppercase tracking-wider mb-4">Gov. Links</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition">Sidama Regional Portal</li>
              <li className="hover:text-white transition">Ethiopian Civil Registry Agency</li>
              <li className="hover:text-white transition">Ministry of Justice Ethiopia</li>
            </ul>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-900 p-5 rounded-2xl space-y-2">
            <h4 className="text-white text-xs font-extrabold uppercase tracking-wider">Civil Desk Support</h4>
            <p className="text-[11px] leading-relaxed">
              If you require a birth or marriage document lookup, please make an appointment at your local woreda desk. SVERA offices are open Mon-Fri 8:00 AM - 5:00 PM.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} SVERA — Sidama Vital Events Registration Agency. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/events" className="hover:underline">Events</Link>
            <Link href="/news" className="hover:underline">News</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
