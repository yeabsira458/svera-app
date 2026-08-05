"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import type { EventWithAuthor } from "@/types/database";
import Header from "@/components/Header";

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date());
  const past = events.filter((e) => new Date(e.event_date) < new Date());

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
            SVERA Calendar
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Upcoming Events</h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto px-4">
            Stay informed about registration drives, public awareness programs, and official ceremonies
            organized by the Sidama Vital Events Registration Agency.
          </p>
        </ScrollReveal>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Upcoming */}
        <ScrollReveal>
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#0d2137" }}>
            📅 Upcoming Events
          </h2>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="text-center py-16 text-gray-400 rounded-2xl" style={{ border: "1px dashed #dce6f0" }}>
            <p className="text-5xl mb-3">📭</p>
            <p className="font-medium">No upcoming events at the moment.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {upcoming.map((ev, i) => (
              <ScrollReveal key={ev.id} variant="right" delay={i * 100}>
                <div
                  className="flex flex-col sm:flex-row gap-5 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  style={{ border: "1px solid #dce6f0", background: "#fff" }}
                >
                  {ev.image_url && (
                    <div className="relative sm:w-52 h-44 sm:h-auto shrink-0 overflow-hidden">
                      <Image src={ev.image_url} alt={ev.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col justify-center flex-1">
                    <div className="flex items-start gap-4">
                      <div
                        className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shadow"
                        style={{ background: "linear-gradient(135deg, #1a5276, #1f618d)" }}
                      >
                        <span className="text-xl font-extrabold leading-none">
                          {new Date(ev.event_date).getDate()}
                        </span>
                        <span className="text-[10px] uppercase">
                          {new Date(ev.event_date).toLocaleString("default", { month: "short" })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg leading-snug mb-1" style={{ color: "#0d2137" }}>
                          {ev.title}
                        </h3>
                        {ev.description && (
                          <p className="text-sm text-gray-500 mb-2">{ev.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-xs font-medium">
                          <span className="flex items-center gap-1" style={{ color: "#1a5276" }}>
                            🕐 {formatTime(ev.event_date)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            📆 {formatDate(ev.event_date)}
                          </span>
                          {ev.location && (
                            <span className="flex items-center gap-1" style={{ color: "#c0392b" }}>
                              📍 {ev.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <div className="mt-16">
            <ScrollReveal>
              <h2 className="text-xl font-bold mb-6 text-gray-400">Past Events</h2>
            </ScrollReveal>
            <div className="space-y-3">
              {past.map((ev, i) => (
                <ScrollReveal key={ev.id} delay={i * 80}>
                  <div
                    className="flex items-center gap-4 rounded-xl p-4 opacity-60"
                    style={{ border: "1px solid #dce6f0", background: "#f8f9fc" }}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gray-200 flex flex-col items-center justify-center text-gray-500">
                      <span className="text-sm font-bold leading-none">{new Date(ev.event_date).getDate()}</span>
                      <span className="text-[9px] uppercase">{new Date(ev.event_date).toLocaleString("default", { month: "short" })}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-600">{ev.title}</p>
                      {ev.location && <p className="text-xs text-gray-400">📍 {ev.location}</p>}
                    </div>
                    <span className="ml-auto text-xs font-medium text-gray-400">Past</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t bg-white border-slate-200/60">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-black text-slate-900 text-lg">Official Civil Records and Services</p>
            <p className="text-slate-500 text-xs mt-1">SVERA supports the registration of all vital life events in Sidama.</p>
          </div>
          <Link
            href="/about"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow shadow-red-900/10"
          >
            Learn More About Us
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900">
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
