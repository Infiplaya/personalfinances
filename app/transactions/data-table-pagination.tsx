"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  totalPages,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "5";

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        disabled={!hasPrevPage}
        variant="outline"
        size="sm"
        onClick={() => {
          router.push(
            `/transactions/?page=${Number(page) - 1}&per_page=${per_page}`
          );
        }}
      >
        prev page
      </Button>

      <div>
        {page} / {totalPages}
      </div>

      <Button
        disabled={!hasNextPage}
        variant="outline"
        size="sm"
        onClick={() => {
          router.push(
            `/transactions/?page=${Number(page) + 1}&per_page=${per_page}`
          );
        }}
      >
        next page
      </Button>
    </div>
  );
};

export default PaginationControls;
