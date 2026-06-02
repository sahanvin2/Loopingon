"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { post } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    pasted.split("").forEach((char, i) => { if (i < 6) newCode[i] = char; });
    setCode(newCode);
    const nextEmpty = newCode.findIndex((c) => !c);
    if (nextEmpty >= 0 && nextEmpty < 6) inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = useCallback(async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) { setError("Please enter the full 6-digit code"); return; }
    setIsLoading(true); setError("");
    try {
      await post("/auth/verify-2fa", { code: fullCode });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally { setIsLoading(false); }
  }, [code, router]);

  useEffect(() => {
    if (code.every((c) => c.length === 1)) handleVerify();
  }, [code, handleVerify]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-soft-sm md:p-10">
          <div className="mb-6 text-center"><Link href="/" className="font-serif text-2xl font-bold text-rose-600">Loopingon</Link></div>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-50">
            <Lock className="h-8 w-8 text-rose-600" />
          </div>

          <h1 className="text-center font-serif text-3xl font-bold text-charcoal-900">Two-Factor Authentication</h1>
          <p className="mt-2 text-center text-sm text-muted-500">Enter the 6-digit code from your authenticator app.</p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="mt-6 flex justify-center gap-2">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={cn("h-14 w-12 rounded-lg border text-center font-serif text-xl font-bold text-charcoal-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none", digit ? "border-rose-400" : "border-charcoal-200")}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading || code.some((c) => !c)}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-rose-600 text-sm font-semibold text-white shadow-soft transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Verify"}
          </button>

          <div className="mt-6 text-center space-y-2">
            <p><button className="text-sm font-medium text-charcoal-600 hover:text-charcoal-800">Use backup code instead</button></p>
            <p><Link href="/sign-in" className="inline-flex items-center gap-1 text-sm text-muted-500 hover:text-charcoal-600"><ArrowLeft className="h-3 w-3" /> Back to Sign In</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
