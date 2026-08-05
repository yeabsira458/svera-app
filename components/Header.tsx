"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/news", label: "News" },
  ];

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        {/* Logo & Agency Name */}
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition ${
                  active ? "text-red-600" : "text-slate-500 hover:text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <span className="text-xs text-gray-400 italic">Civil Registration Service</span>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-600 focus:outline-none p-1.5 hover:bg-slate-100 rounded-lg transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t bg-white shadow-lg animate-scale-up">
          <nav className="flex flex-col p-4 space-y-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-bold p-2.5 rounded-lg transition ${
                    active ? "bg-red-50 text-red-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
