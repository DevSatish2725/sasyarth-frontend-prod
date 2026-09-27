import { LoaderCircle } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({
  message = "Loading...",
}: PageLoaderProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle
          className="h-8 w-8 animate-spin text-[#159447]"
          aria-hidden="true"
        />

        <p className="text-sm font-medium text-[#536157]">
          {message}
        </p>
      </div>
    </div>
  );
}