"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/stores/ui-store";

export default function SignUpRedirectPage() {
  const router = useRouter();
  const { openModal } = useUIStore();

  useEffect(() => {
    openModal("signup");
    router.replace("/");
  }, [router, openModal]);

  return null;
}
