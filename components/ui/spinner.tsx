import { Loader2 } from "lucide-react";

export function Spinner() {
  return (
    <Loader2 className="absolute right-2 top-2 ml-2 h-5 w-5 animate-spin text-gray-800 dark:text-gray-200" />
  );
}
