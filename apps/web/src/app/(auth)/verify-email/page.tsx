"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { post } from "@/lib/api-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setError("No verification token provided"); return; }
    let cancelled = false;
    post("/auth/verify-email", { token })
      .then(() => {
        if (!cancelled) {
          setStatus("success");
          setTimeout(() => router.push("/sign-in"), 3000);
        }
      })
      .catch((err) => {
        if (!cancelled) { setStatus("error"); setError(err instanceof Error ? err.message : "Verification failed"); }
      });
    return () => { cancelled = true; };
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-soft-sm text-center">
          <div className="mb-6"><Link href="/" className="font-serif text-2xl font-bold text-primary-600">Loopingon</Link></div>

          {status === "loading" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-text-900">Verifying Your Email</h1>
              <p className="mt-2 text-sm text-muted-500">Please wait while we verify your email address...</p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted-100">
                <CheckCircle className="h-8 w-8 text-muted-600" />
              </motion.div>
              <h1 className="font-serif text-2xl font-bold text-text-900">Email Verified!</h1>
              <p className="mt-2 text-sm text-muted-500">Your email has been verified. Redirecting you to sign in...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-text-900">Verification Failed</h1>
              <p className="mt-2 text-sm text-muted-600">{error || "Invalid or expired verification link."}</p>
              <p className="mt-4">
                <Link href="/sign-in" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                  <Mail className="h-4 w-4" /> Return to Sign In
                </Link>
              </p>
            </>
          )}

          <div className="mt-8 border-t border-text-200 pt-6">
            <Link href="/sign-in" className="text-sm font-medium text-text-600 hover:text-text-800">Go to Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
