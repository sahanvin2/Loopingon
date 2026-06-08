"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ReferralLinkHandler() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const code = params.code as string;
      if (code) {
        localStorage.setItem("kandyam:ref_code", code);
      }
      
      const timer = setTimeout(() => {
        router.push("/sign-up/customer?ref=" + code);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [params.code, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-accent-100 max-w-md">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-navy-900 mb-2">You&apos;ve been referred!</h1>
        <p className="text-muted-600 mb-6">Taking you to Kandyam to claim your welcome offer...</p>
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
