"use client";

import { db } from "@/lib/instant-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, user, error } = db.useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Error</CardTitle>
            <CardDescription>
              There was a problem with authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <GuestSignIn />;
  }

  return <>{children}</>;
}

function GuestSignIn() {
  const handleGuestSignIn = async () => {
    try {
      await db.auth.signInAsGuest();
    } catch (err) {
      console.error("Guest sign-in failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Guardrail
          </h1>
          <p className="mt-2 text-lg text-zinc-600">
            Decide once. Execute calmly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Start validating your ideas with Guardrail's objective scoring system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">What you'll get:</h3>
              <ul className="space-y-1 text-sm text-zinc-600">
                <li>✓ Score ideas on 10 proven criteria</li>
                <li>✓ Get clear GO / MODIFY / DROP decisions</li>
                <li>✓ Weekly focus lock to prevent idea-hopping</li>
                <li>✓ Track execution progress without judgment</li>
              </ul>
            </div>

            <Button
              onClick={handleGuestSignIn}
              className="w-full"
              size="lg"
            >
              Start Validating Ideas
            </Button>

            <p className="text-xs text-center text-zinc-500">
              No account needed to get started. Your data is saved automatically.
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-zinc-500">
          <p>
            Guardrail helps solo founders and indie builders decide which ideas
            deserve execution and commit to focused progress.
          </p>
        </div>
      </div>
    </div>
  );
}
