import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-background
        px-6
      "
    >
      <div
        className="
          max-w-sm
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-primary-light
            text-primary
          "
        >
          <WifiOff className="h-7 w-7" />
        </div>

        <h1
          className="
            mt-5
            text-2xl
            font-extrabold
            text-text-primary
          "
        >
          You&apos;re offline
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-text-secondary
          "
        >
          Check your internet connection
          and try again.
        </p>
      </div>
    </main>
  );
}