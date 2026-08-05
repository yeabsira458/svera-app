// app/about/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import AboutStats from "@/components/AboutStats";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "About Us — SVERA | Sidama Vital Events Registration Agency",
  description:
    "Learn about SVERA, the Sidama Vital Events Registration Agency. Our mission, services, and commitment to accurate civil registration.",
};

const services = [
  {
    icon: "👶",
    title: "Birth Registration",
    desc: "Official registration of newborns with digital certificates issued within days.",
  },
  {
    icon: "💍",
    title: "Marriage Registration",
    desc: "Legal recognition of marriages with certified documentation for both spouses.",
  },
  {
    icon: "🪦",
    title: "Death Registration",
    desc: "Compassionate and accurate recording of deaths with formal death certificates.",
  },
  {
    icon: "📋",
    title: "Civil Record Updates",
    desc: "Amendments and corrections to existing civil records through a formal review process.",
  },
];

const team = [
  {
    name: "Director General",
    title: "Head of Agency",
    initial: "D",
    color: "bg-red-600",
  },
  {
    name: "Registration Division",
    title: "Civil Records & Issuance",
    initial: "R",
    color: "bg-amber-600",
  },
  {
    name: "IT & Digital Services",
    title: "Systems & Innovation",
    initial: "I",
    color: "bg-indigo-900",
  },
  {
    name: "Public Relations",
    title: "Community & Outreach",
    initial: "P",
    color: "bg-slate-800",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-red-700 text-white py-2.5 px-4 text-xs font-semibold tracking-wider text-center flex flex-wrap justify-center gap-2 items-center border-b border-red-800 shadow-inner">
        <span>SIDAMA REGIONAL STATE GOVERNMENT</span>
        <span className="hidden sm:inline">•</span>
        <span>VITAL EVENTS REGISTRATION AGENCY (SVERA)</span>
        <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Official Portal</span>
      </div>

      {/* Header */}
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_40%,_#ef4444_0%,_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest text-red-200">
            Established Under Sidama Regional Government
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Sidama Vital Events
            <span className="block text-red-400">Registration Agency</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We are the official body responsible for the registration of births, marriages, and
            deaths in the Sidama Region. Every life event matters — and we record them with
            accuracy, dignity, and care.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link
              href="/events"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition shadow-lg shadow-red-900/40"
            >
              Upcoming Schedules
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-sm transition"
            >
              News Feed
            </Link>
          </div>
        </div>
      </section>

      {/* Stats - Replaced with Animated Client Component */}
      <AboutStats />

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-600">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-950 mt-3 mb-5 leading-tight">
              Registering every vital event with precision and purpose
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              SVERA was established to ensure that every citizen in the Sidama Region has access
              to accurate, legally recognized civil records. We believe that proper registration
              is not just bureaucracy — it is the foundation of identity, rights, and social
              protection.
            </p>
            <p className="text-gray-600 leading-relaxed font-medium">
              Our digitized platform enables faster processing, transparent tracking, and secure
              storage of all vital event registrations, making government services more accessible
              to every community.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Transparency", "Accuracy", "Accessibility", "Security"].map((v, i) => (
              <div
                key={v}
                className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mb-3">
                  {["🔍", "✅", "🌍", "🔒"][i]}
                </div>
                <p className="font-extrabold text-slate-800 text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-slate-100 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-red-600">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 mt-3">Our Core Services</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex gap-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl flex-shrink-0">{s.icon}</div>
                <div>
                  <h3 className="font-extrabold text-slate-900 mb-1 text-base">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-red-600">Leadership</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-950 mt-3">Our Divisions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((t) => (
            <div key={t.name} className="text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition">
              <div
                className={`w-14 h-14 rounded-full ${t.color} text-white font-black text-xl flex items-center justify-center mx-auto mb-4 shadow`}
              >
                {t.initial}
              </div>
              <p className="font-extrabold text-slate-900 text-sm">{t.name}</p>
              <p className="text-xs text-gray-500 mt-1">{t.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-red-700 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black">Dedicated to Public Service</h2>
          <p className="text-red-200 max-w-xl mx-auto text-sm leading-relaxed">
            SVERA continues to innovate and streamline vital events registration services throughout the Sidama Region.
          </p>
          <Link
            href="/events"
            className="inline-block px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition shadow-lg"
          >
            Browse Upcoming Events
          </Link>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-red-600">Our Location</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-950 mt-3">Find Us in Hawassa</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Visit our headquarters or one of our district offices in the Sidama Region for in-person support and civil document issuance.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[400px] w-full bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1461.8206682450686!2d38.48254458183362!3d7.044855826086911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b145007949f727%3A0xb53de97b7d499c77!2zU2lkYW1hIFB1YmxpYyBBZmZhaXJzIC0g4YiQ4YuL4YizIOGLiOGIs-GKnSDhirnhipDhibU!5e0!3m2!1sen!2set!4v1785893398694!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} SVERA — Sidama Vital Events Registration Agency. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <Link href="/events" className="hover:text-white transition">Events</Link>
            <Link href="/news" className="hover:text-white transition">News</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
