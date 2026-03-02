"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUserAuthStore } from "@/stores/userAuthStore";

export function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleCallback } = useUserAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const requestToken = searchParams.get("request_token");
      const approved = searchParams.get("approved");

      if (!requestToken) {
        setError("Missing request token");
        return;
      }

      if (approved === "false") {
        setError("Authorization was denied");
        router.push("/");
        return;
      }

      const success = await handleCallback(requestToken);

      if (success) {
        router.push("/");
      } else {
        setError("Failed to complete authentication");
      }
    };

    processCallback();
  }, [searchParams, handleCallback, router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-destructive">{error}</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-primary underline"
          >
            Return home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">Completing authentication...</h1>
        <p className="mt-2 text-muted-foreground">Please wait</p>
      </div>
    </div>
  );
}
