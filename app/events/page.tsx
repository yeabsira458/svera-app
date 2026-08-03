// app/events/page.tsx
import Link from "next/link";
import { getEvents } from "@/actions/event-actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Events — SVERA | Sidama Vital Events Registration Agency",
  description:
    "Browse upcoming SVERA events, community outreach programs, registration drives, and office announcements.",
};

function formatEventDate(dateString: string) {
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: date.getFullYear(),
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    isPast: date < new Date(),
  };
}

export default async function EventsPage() {
  const events = await getEvents();

  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= new Date());
  const pastEvents = events.filter((e) => new Date(e.event_date) < new Date());

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
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-amber-500 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              SV
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-slate-900 leading-none">
                SVERA
              </h1>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Sidama Vital Events</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-950 transition">
              Home
            </Link>
            <Link href="/about" className="text-sm font-bold text-slate-500 hover:text-slate-950 transition">
              About Us
            </Link>
            <Link href="/events" className="text-sm font-bold text-slate-900 hover:text-red-600 transition">
              Upcoming Events
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-indigo-900 text-white py-16 px-6 text-center space-y-4">
        <span className="inline-block bg-red-600/30 border border-red-500/40 text-red-300 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider">
          Official Calendar
        </span>
        <h1 className="text-4xl md:text-5xl font-black">Upcoming Events</h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Stay informed about SVERA registration drives, community outreach sessions, and official announcements.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        {/* Upcoming Events */}
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block"></span>
            Upcoming Drives & Events
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              {upcomingEvents.length}
            </span>
          </h2>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-gray-400">
              <div className="text-5xl mb-4">📅</div>
              <p className="font-bold text-slate-800 text-base">No upcoming events scheduled</p>
              <p className="text-xs text-gray-400 mt-1">Check back soon for new registration calendars.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {upcomingEvents.map((event) => {
                const d = formatEventDate(event.event_date);
                return (
                  <article
                    key={event.id}
                    className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex"
                  >
                    {/* Date Block */}
                    <div className="bg-red-700 text-white flex flex-col items-center justify-center p-5 min-w-[90px] text-center border-r border-red-800">
                      <span className="text-3xl font-black leading-none">{d.day}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-red-200">{d.month}</span>
                      <span className="text-[10px] text-red-300 mt-0.5">{d.year}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 space-y-2">
                      {event.image_url && (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-xl mb-1 border border-slate-100"
                          loading="lazy"
                        />
                      )}
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{event.title}</h3>
                      {event.description && (
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-400 font-semibold">
                        <span className="flex items-center gap-1">
                          🕐 {d.time}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            📍 {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section className="mt-14">
            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-slate-300 rounded-full inline-block"></span>
              Past Events Archive
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-gray-500 text-xs font-bold">
                {pastEvents.length}
              </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {pastEvents.map((event) => {
                const d = formatEventDate(event.event_date);
                return (
                  <article
                    key={event.id}
                    className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden flex opacity-65"
                  >
                    <div className="bg-slate-200 text-slate-600 flex flex-col items-center justify-center p-5 min-w-[90px] text-center border-r border-slate-300">
                      <span className="text-3xl font-black leading-none">{d.day}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1 text-slate-400">{d.month}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{d.year}</span>
                    </div>
                    <div className="flex-1 p-5 space-y-1">
                      <div className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">
                        Completed
                      </div>
                      <h3 className="font-extrabold text-slate-700 text-base leading-snug">{event.title}</h3>
                      {event.location && (
                        <span className="text-xs text-gray-400 font-semibold block">📍 {event.location}</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* CTA */}
      <div className="border-t mt-6 bg-white border-slate-200/60">
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
            <Link href="/" className="hover:text-white transition">News</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
