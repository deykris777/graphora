import { SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { env } from "../lib/env";
import { useToast } from "../components/ToastProvider";

export const AuthPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (isSignedIn) {
      addToast("Signed in successfully", "success");
      navigate("/dashboard", { replace: true });
    }
  }, [addToast, isSignedIn, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-10 dark:border-white/10 dark:bg-white/5">
        <div className="mb-6 text-lg font-semibold">Sign in to Graphyn</div>
        {env.clerkPublishableKey ? (
          <>
            <SignedOut>
              <SignIn
                routing="path"
                path="/auth"
                redirectUrl="/dashboard"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              />
            </SignedOut>
            <SignedIn>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                Redirecting to dashboard...
              </div>
            </SignedIn>
          </>
        ) : (
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Set VITE_CLERK_PUBLISHABLE_KEY to enable authentication.
          </div>
        )}
      </div>
    </div>
  );
};
