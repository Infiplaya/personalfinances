"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export function TransactionsToast() {
  const params = useSearchParams();
  const router = useRouter();
  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    if (params.get("success")) {
      onDismiss();
      toast.success("Successfully added new transaction!");
    }
  }, [params, onDismiss]);

  return null;
}
