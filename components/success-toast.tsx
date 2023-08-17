"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SuccessToast({ message }: { message: string }) {
  const router = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    if (params.get("success")) {
      toast.success(message);
      router.replace("/");
    }
    if (params.get("signedOut")) {
      toast.success("Successfully signed out");
      router.replace("/");
    }
    if (params.get("registration-success")) {
      toast.success(message);
      router.replace("/signin");
    }
  }, [message, router, params]);

  return null;
}
