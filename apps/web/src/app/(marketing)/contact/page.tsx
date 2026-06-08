"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, CheckCircle } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { post } from "@/lib/api-client";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.enum(["general", "order", "vendor", "press", "partnership"], {
    errorMap: () => ({ message: "Please select a subject" }),
  }),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Issue" },
  { value: "vendor", label: "Vendor Support" },
  { value: "press", label: "Press / Media" },
  { value: "partnership", label: "Partnership" },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({ name: "", email: "", subject: "general", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await post("/contact", result.data);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <>
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-center font-serif text-4xl font-bold text-text-900 md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-center text-lg text-muted-600">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl bg-muted-50 px-8 py-16 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted-100">
                    <CheckCircle className="h-10 w-10 text-muted-600" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-text-900">Message Sent!</h2>
                  <p className="mt-2 text-muted-600">
                    Thank you for reaching out. We typically respond within 24 hours.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "general", message: "" }); }}
                    className="mt-6 rounded-lg border border-muted-300 px-6 py-2.5 text-sm font-medium text-muted-700 transition-colors hover:bg-muted-50"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-700">Name</label>
                      <input
                        id="name" name="name" value={form.name} onChange={handleChange}
                        placeholder="Your full name"
                        className={cn("w-full rounded-lg border px-4 py-3 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.name ? "border-red-400" : "border-text-200")}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-700">Email</label>
                      <input
                        id="email" name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className={cn("w-full rounded-lg border px-4 py-3 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.email ? "border-red-400" : "border-text-200")}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-text-700">Subject</label>
                    <select
                      id="subject" name="subject" value={form.subject} onChange={handleChange}
                      className={cn("w-full rounded-lg border px-4 py-3 text-sm text-text-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.subject ? "border-red-400" : "border-text-200")}
                    >
                      {subjects.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-700">Message</label>
                    <textarea
                      id="message" name="message" value={form.message} onChange={handleChange}
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className={cn("w-full rounded-lg border px-4 py-3 text-sm text-text-900 placeholder:text-muted-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-y", errors.message ? "border-red-400" : "border-text-200")}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                  </div>
                  {status === "error" && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <aside className="space-y-8">
              <div className="rounded-2xl bg-surface-50 p-8">
                <h3 className="font-serif text-xl font-bold text-text-900">Contact Info</h3>
                <div className="mt-6 space-y-5">
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-text-800">Email</p>
                      <a href="mailto:hello@kandyam.com" className="text-sm text-muted-600 hover:text-primary-600">hello@kandyam.com</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-text-800">WhatsApp</p>
                      <a href="https://wa.me/94771234567" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-600 hover:text-primary-600">+94 77 123 4567</a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-text-800">Office</p>
                      <p className="text-sm text-muted-600">42 Galle Road, Colombo 03, Sri Lanka</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-text-800">Hours</p>
                      <p className="text-sm text-muted-600">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-accent-50 p-8">
                <MessageSquare className="mb-3 h-6 w-6 text-accent-600" />
                <h3 className="font-serif text-lg font-bold text-text-900">Need Urgent Help?</h3>
                <p className="mt-2 text-sm text-muted-600">
                  For urgent order issues, use our live chat for immediate assistance from our support team.
                </p>
                <button className="mt-4 w-full rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600">
                  Start Live Chat
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-text-200">
                <div className="flex aspect-[4/3] items-center justify-center bg-muted-200">
                  <MapPin className="h-10 w-10 text-muted-400" />
                  <p className="ml-2 text-sm text-muted-500">Map</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
