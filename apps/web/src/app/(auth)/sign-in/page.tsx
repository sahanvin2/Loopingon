"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

export default function SignInRedirectPage() {
  const router = useRouter();
  const { openModal } = useUIStore();

  useEffect(() => {
    openModal("signin");
    router.replace("/");
  }, [router, openModal]);

  return null;
}
