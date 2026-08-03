// app/admin/events/page.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { getEvents, createEvent, deleteEvent } from "@/actions/event-actions";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    startTransition(async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      }
    });
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData(e.currentTarget);

    try {
      await createEvent(formData);
      setSuccessMsg("Event created successfully!");
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
      loadEvents();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete event "${title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (err: any) {
      alert("Error deleting event: " + err.message);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= new Date());
  const pastEvents = events.filter((e) => new Date(e.event_date) < new Date());

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manage Events</h1>
          <p className="text-slate-500 mt-1">Create and manage upcoming SVERA events visible to the public.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setErrorMsg(""); setSuccessMsg(""); }}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition shadow shadow-red-900/10"
        >
          {showForm ? "Cancel" : "+ New Event"}
        </button>
      </div>

      {/* Success / Error banner */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium flex items-center gap-2">
          ✅ {successMsg}
        </div>
      )}

      {/* Create Event Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h2 className="font-extrabold text-lg text-slate-900 mb-5">Create New Event</h2>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4" encType="multipart/form-data">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g. Birth Registration Drive – Bona Woreda"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_date" className="block text-sm font-semibold text-slate-700 mb-1">
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="event_date"
                  name="event_date"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="e.g. Hawassa Town Hall, Block A"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Describe the event purpose, who should attend, what to bring..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition resize-none"
              />
            </div>

            <div>
              <label htmlFor="imageFile" className="block text-sm font-semibold text-slate-700 mb-1">
                Event Image (Optional)
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold rounded-xl text-sm transition shadow"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Events */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-5 bg-red-600 rounded-full inline-block" />
          Upcoming Schedules
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold ml-1">
            {upcomingEvents.length}
          </span>
        </h2>

        {isPending ? (
          <div className="text-center py-10 text-gray-400 font-medium">Loading events...</div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-gray-400">
            No upcoming events. Create one above.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex gap-4">
                <div className="bg-red-700 text-white flex flex-col items-center justify-center rounded-xl px-4 py-3 min-w-[64px] text-center border border-red-800">
                  <span className="text-2xl font-black">
                    {new Date(event.event_date).getDate().toString().padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-red-200">
                    {new Date(event.event_date).toLocaleString("en-US", { month: "short" })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-base leading-snug truncate">{event.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(event.event_date)}</p>
                  {event.location && (
                    <p className="text-xs text-gray-400 mt-0.5">📍 {event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">{event.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(event.id, event.title)}
                  className="text-gray-300 hover:text-red-600 transition text-xl font-bold self-start flex-shrink-0"
                  title="Delete event"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-slate-300 rounded-full inline-block" />
            Past Events
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-xs font-bold ml-1">
              {pastEvents.length}
            </span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-slate-200/60 opacity-60 p-5 flex gap-4">
                <div className="bg-slate-200 text-slate-600 flex flex-col items-center justify-center rounded-xl px-4 py-3 min-w-[64px] text-center border">
                  <span className="text-2xl font-black">
                    {new Date(event.event_date).getDate().toString().padStart(2, "0")}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {new Date(event.event_date).toLocaleString("en-US", { month: "short" })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-1">
                    Past
                  </div>
                  <h3 className="font-bold text-slate-700 text-base leading-snug truncate">{event.title}</h3>
                  {event.location && (
                    <p className="text-xs text-gray-400 mt-0.5">📍 {event.location}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(event.id, event.title)}
                  className="text-gray-300 hover:text-red-600 transition text-xl font-bold self-start flex-shrink-0"
                  title="Delete event"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
