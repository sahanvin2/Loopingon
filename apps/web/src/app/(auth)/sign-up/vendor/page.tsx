"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Check, X, ChevronLeft, ChevronRight, Upload, Store, Briefcase, Palette, FileText } from "lucide-react";
import { post } from "@/lib/api-client";
import { vendorApplicationSchema } from "@/lib/validators";
import { cn } from "@/lib/utils";
import { SRI_LANKAN_DISTRICTS, CRAFT_TYPES } from "@/lib/constants";
import { useDebounce } from "@/hooks/use-debounce";

type VendorApplicationFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  storeName: string;
  storeDescription: string;
  businessName: string;
  businessRegistrationNo: string;
  businessType: string;
  craftType: string[];
  craftDescription: string;
  yearsOfExperience: number | undefined;
  employeeCount: number | undefined;
  workshopCity: string;
  workshopDistrict: string;
  taxId: string;
  acceptTerms: true;
};

const steps = ["Account", "Business Details", "Craft Details", "Documents"];

const businessTypes = [
  { value: "individual", label: "Individual Artisan" },
  { value: "sole_proprietorship", label: "Registered Business" },
  { value: "cooperative", label: "Cooperative" },
  { value: "ngo", label: "NGO" },
];

export default function SignUpVendorPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState<Record<string, File[]>>({});
  const [storeAvailable, setStoreAvailable] = useState<boolean | null>(null);
  const [checkingStore, setCheckingStore] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<VendorApplicationFormValues>({
    resolver: zodResolver(vendorApplicationSchema),
    defaultValues: {
      email: "", password: "", confirmPassword: "", fullName: "", phone: "",
      storeName: "", storeDescription: "", businessName: "", businessRegistrationNo: "",
      businessType: "individual", craftType: [] as string[], craftDescription: "",
      yearsOfExperience: undefined as number | undefined, employeeCount: undefined as number | undefined,
      workshopCity: "", workshopDistrict: "", taxId: "", acceptTerms: true as unknown as true,
    },
    mode: "onChange",
  });

  const storeName = watch("storeName");
  const debouncedStore = useDebounce(storeName, 500);

  const checkStore = useCallback(async (name: string) => {
    if (name.length < 3) { setStoreAvailable(null); return; }
    setCheckingStore(true);
    try { await post("/vendors/check-store-name", { storeName: name }); setStoreAvailable(true); }
    catch { setStoreAvailable(false); }
    finally { setCheckingStore(false); }
  }, []);

  useEffect(() => {
    if (debouncedStore && debouncedStore.length >= 3) {
      void checkStore(debouncedStore);
    }
  }, [checkStore, debouncedStore]);

  const password = watch("password");
  const strength = password
    ? password.length < 8 ? { label: "Weak", color: "bg-red-500", w: "25%" }
    : password.length < 12 ? { label: "Medium", color: "bg-accent-500", w: "50%" }
    : { label: "Strong", color: "bg-muted-500", w: "100%" }
    : null;

  const handleNext = async () => {
    const fields: Record<number, (keyof VendorApplicationFormValues)[]> = {
      0: ["email", "password", "confirmPassword", "fullName", "phone"],
      1: ["storeName", "storeDescription", "businessType", "workshopCity", "workshopDistrict"],
      2: ["craftType", "craftDescription"],
      3: [],
    };
    if (fields[step]) {
      const valid = await trigger(fields[step] as any);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 3));
    setError("");
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  const handleDocDrop = (docType: string, e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setDocuments((prev) => ({ ...prev, [docType]: [...(prev[docType] || []), ...files] }));
  };

  const handleDocSelect = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments((prev) => ({ ...prev, [docType]: [...(prev[docType] || []), ...files] }));
  };

  const removeDoc = (docType: string, index: number) => {
    setDocuments((prev) => ({ ...prev, [docType]: prev[docType]?.filter((_, i) => i !== index) || [] }));
  };

  const onSubmit = async () => {
    setError("");
    try {
      const email = getValues("email");
      const password = getValues("password");
      const fullName = getValues("fullName");
      const phone = getValues("phone");

      // Step 1: Create the user account
      await post("/auth/signup", {
        email,
        password,
        fullName,
        phone: phone || undefined,
        acceptTerms: true,
      });

      // Step 2: Sign in to get tokens
      const signinRes = await post("/auth/signin", {
        email,
        password,
      }) as { data?: { accessToken?: string; refreshToken?: string; user?: Record<string, unknown> } };

      if (signinRes?.data?.accessToken) {
        localStorage.setItem("accessToken", signinRes.data.accessToken);
        localStorage.setItem("refreshToken", signinRes.data.refreshToken || "");
      }

      // Update auth store
      if (signinRes?.data?.user) {
        const { useAuthStore } = await import("@/stores/auth-store");
        useAuthStore.getState().setUser(signinRes.data.user as never);
      }

      // Step 3: Apply for vendor
      const storeNameVal = getValues("storeName");
      const storeSlug = storeNameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      await post("/vendors/apply", {
        storeName: storeNameVal,
        storeSlug,
        storeDescription: getValues("storeDescription"),
        businessName: getValues("businessName") || undefined,
        businessRegistrationNo: getValues("businessRegistrationNo") || undefined,
        businessType: getValues("businessType") || "individual",
        taxId: getValues("taxId") || undefined,
        craftType: getValues("craftType"),
        craftDescription: getValues("craftDescription"),
        yearsOfExperience: getValues("yearsOfExperience") ? Number(getValues("yearsOfExperience")) : undefined,
        workshopCity: getValues("workshopCity") || undefined,
        workshopDistrict: getValues("workshopDistrict") || undefined,
      });

      router.push("/vendor/dashboard?welcome=true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Application failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-soft-sm md:p-10">
          <div className="mb-6 text-center">
            <Link href="/" className="font-serif text-2xl font-bold text-primary-600">Kandyam</Link>
            <p className="mt-1 text-sm text-muted-500">Vendor Application</p>
          </div>

          <div className="mb-8 flex items-center justify-between">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors", i < step ? "bg-muted-600 text-white" : i === step ? "bg-primary-600 text-white" : "bg-text-100 text-text-500")}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={cn("mx-2 h-0.5 w-8", i < step ? "bg-muted-600" : "bg-text-200")} />}
              </div>
            ))}
          </div>

          <p className="text-center text-sm font-medium text-text-700">{steps[step]}</p>

          {error && <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mt-6">
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-700">Full Name</label>
                    <div className="relative mt-1.5"><User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input {...register("fullName")} placeholder="Your full name" className={cn("w-full rounded-lg border py-3 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.fullName ? "border-red-400" : "border-text-200")} /></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Email</label>
                    <div className="relative mt-1.5"><Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input {...register("email")} type="email" placeholder="you@example.com" className={cn("w-full rounded-lg border py-3 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.email ? "border-red-400" : "border-text-200")} /></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Phone</label>
                    <div className="relative mt-1.5"><Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input {...register("phone")} placeholder="+94 XX XXX XXXX" className={cn("w-full rounded-lg border py-3 pl-10 pr-4 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.phone ? "border-red-400" : "border-text-200")} /></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Password</label>
                    <div className="relative mt-1.5"><Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input {...register("password")} type={showPw ? "text" : "password"} placeholder="Min 8 characters" className={cn("w-full rounded-lg border py-3 pl-10 pr-12 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.password ? "border-red-400" : "border-text-200")} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPw ? <EyeOff className="h-4 w-4 text-muted-400" /> : <Eye className="h-4 w-4 text-muted-400" />}</button></div>
                    {strength && <div className="mt-2"><div className="h-1.5 rounded-full bg-text-200"><div className={cn("h-1.5 rounded-full transition-all", strength.color)} style={{ width: strength.w }} /></div><p className="mt-1 text-xs text-muted-500">{strength.label}</p></div>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Confirm Password</label>
                    <div className="relative mt-1.5"><Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input {...register("confirmPassword")} type={showCpw ? "text" : "password"} placeholder="Re-enter password" className={cn("w-full rounded-lg border py-3 pl-10 pr-12 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.confirmPassword ? "border-red-400" : "border-text-200")} /><button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2">{showCpw ? <EyeOff className="h-4 w-4 text-muted-400" /> : <Eye className="h-4 w-4 text-muted-400" />}</button></div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-700">Store Name</label>
                    <div className="relative mt-1.5"><Store className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400" /><input {...register("storeName")} placeholder="Your store name" className={cn("w-full rounded-lg border py-3 pl-10 pr-10 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.storeName ? "border-red-400" : "border-text-200")} /><div className="absolute right-3 top-1/2 -translate-y-1/2">{checkingStore ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-text-300 border-t-primary-500" /> : storeAvailable === true ? <Check className="h-4 w-4 text-muted-500" /> : storeAvailable === false ? <X className="h-4 w-4 text-red-500" /> : null}</div></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Business Type</label>
                    <select {...register("businessType")} className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                      {businessTypes.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                    </select>
                  </div>
                  <div><label className="text-sm font-medium text-text-700">Business Registration Number</label><input {...register("businessRegistrationNo")} placeholder="Optional" className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" /></div>
                  <div><label className="text-sm font-medium text-text-700">Tax ID</label><input {...register("taxId")} placeholder="Optional" className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none" /></div>
                  <div><label className="text-sm font-medium text-text-700">Workshop City</label><input {...register("workshopCity")} placeholder="e.g. Colombo" className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm" /></div>
                  <div>
                    <label className="text-sm font-medium text-text-700">District</label>
                    <select {...register("workshopDistrict")} className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm">
                      <option value="">Select district</option>
                      {SRI_LANKAN_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Store Description</label>
                    <textarea {...register("storeDescription")} rows={4} placeholder="Describe your store and craft (min 50 chars)..." className={cn("mt-1.5 w-full rounded-lg border px-4 py-3 text-sm resize-y focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.storeDescription ? "border-red-400" : "border-text-200")} />
                    {errors.storeDescription && <p className="mt-1 text-xs text-red-500">{errors.storeDescription.message}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-700">Craft Type (select one or more)</label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {(CRAFT_TYPES as unknown as readonly { value: string; label: string }[]).slice(0, 12).map((ct) => {
                        const selected = (watch("craftType") || []).includes(ct.value);
                        return (
                          <button
                            key={ct.value}
                            type="button"
                            onClick={() => {
                              const current = watch("craftType") || [];
                              setValue("craftType", selected ? current.filter((v: string) => v !== ct.value) : [...current, ct.value], { shouldValidate: true });
                            }}
                            className={cn("rounded-lg border px-3 py-2 text-xs font-medium transition-colors text-left", selected ? "border-primary-400 bg-primary-50 text-primary-700" : "border-text-200 text-text-600 hover:border-text-300")}
                          >
                            {ct.label}
                          </button>
                        );
                      })}
                    </div>
                    {errors.craftType && <p className="mt-1 text-xs text-red-500">{errors.craftType.message}</p>}
                  </div>
                  <div><label className="text-sm font-medium text-text-700">Years of Experience</label><input type="number" {...register("yearsOfExperience", { valueAsNumber: true })} placeholder="e.g. 5" className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm" /></div>
                  <div><label className="text-sm font-medium text-text-700">Employee Count</label><input type="number" {...register("employeeCount", { valueAsNumber: true })} placeholder="e.g. 2" className="mt-1.5 w-full rounded-lg border border-text-200 px-4 py-3 text-sm" /></div>
                  <div>
                    <label className="text-sm font-medium text-text-700">Craft Description / Story</label>
                    <textarea {...register("craftDescription")} rows={4} placeholder="Tell us about your craft journey, techniques, and materials (min 30 chars)..." className={cn("mt-1.5 w-full rounded-lg border px-4 py-3 text-sm resize-y focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none", errors.craftDescription ? "border-red-400" : "border-text-200")} />
                    {errors.craftDescription && <p className="mt-1 text-xs text-red-500">{errors.craftDescription.message}</p>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {[
                    { key: "nationalId", label: "National ID", required: true },
                    { key: "addressProof", label: "Address Proof", required: true },
                    { key: "businessReg", label: "Business Registration", required: false },
                    { key: "craftCert", label: "Craft Certification", required: false },
                    { key: "workshopPhotos", label: "Workshop Photos (min 2)", required: true },
                  ].map((doc) => {
                    const files = documents[doc.key] || [];
                    return (
                      <div key={doc.key}>
                        <label className="text-sm font-medium text-text-700">{doc.label} {doc.required && <span className="text-red-500">*</span>}</label>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDocDrop(doc.key, e)}
                          className="mt-2 rounded-lg border-2 border-dashed border-text-300 bg-surface-50 p-6 text-center transition-colors hover:border-primary-400"
                        >
                          <Upload className="mx-auto h-8 w-8 text-muted-400" />
                          <p className="mt-2 text-sm text-muted-500">Drag & drop files here, or{" "}
                            <label className="cursor-pointer text-primary-600 hover:underline">
                              browse
                              <input type="file" multiple={doc.key === "workshopPhotos"} accept="image/*,.pdf" onChange={(e) => handleDocSelect(doc.key, e)} className="hidden" />
                            </label>
                          </p>
                        </div>
                        {files.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {files.map((file, i) => (
                              <div key={i} className="relative rounded-lg border border-text-200 bg-white p-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-400" />
                                  <span className="max-w-[150px] truncate text-xs text-text-700">{file.name}</span>
                                  <button type="button" onClick={() => removeDoc(doc.key, i)} className="ml-1 text-red-400 hover:text-red-600"><X className="h-3 w-3" /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button type="button" onClick={handlePrev} className="inline-flex items-center gap-1 text-sm font-medium text-text-600 hover:text-text-800">
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
            ) : <div />}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primary-700">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={onSubmit} className="inline-flex items-center gap-1 rounded-lg bg-muted-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-muted-700">
                Submit Application <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
