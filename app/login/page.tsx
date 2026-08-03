// app/login/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInUser } from "@/actions/auth-actions";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await signInUser(formData);
      // Only reach here on error — redirect() never returns
      if (res?.error) {
        setErrorMsg(res.error);
        setLoading(false);
      }
    } catch (err: any) {
      // Re-throw Next.js redirect so navigation actually happens
      if (err?.digest?.startsWith("NEXT_REDIRECT")) throw err;
      setErrorMsg("Sign in failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow">
            SV
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to SVERA</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/register" className="font-semibold text-emerald-600 hover:text-emerald-700 underline">
              create a new citizen account
            </Link>
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
