// app/admin/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navLinks = [
    { href: "/admin/post-news", label: "Post News", icon: "📰" },
    { href: "/admin/events", label: "Manage Events", icon: "📅" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      {/* Admin Top Bar: Using SVERA Theme (Dark Indigo & Red) */}
      <header className="sticky top-0 z-50 bg-indigo-950 text-white shadow-md border-b border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 mr-4">
              <div className="w-8 h-8 bg-red-600 text-white rounded-lg flex items-center justify-center font-black text-sm shadow">
                SV
              </div>
              <span className="font-extrabold tracking-tight text-base">SVERA</span>
            </Link>
            <span className="h-5 w-px bg-white/20" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest ml-3">
              Admin Portal
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <Link
            href="/"
            className="text-xs font-bold text-slate-300 hover:text-white hover:underline transition flex items-center gap-1"
          >
            ← Public Site
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-white/10 px-4 pb-2 pt-1 flex gap-1 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition whitespace-nowrap"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">{children}</main>
    </div>
  );
}
