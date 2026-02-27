"use client";

import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@clerk/nextjs/experimental";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function BillingSuccessPage() {
  const { user, isLoaded } = useUser();
  const { data: subscription } = useSubscription();
  const router = useRouter();
  const synced = useRef(false);
  const [loading, setLoading] = useState(true);

  const updateTokens = useMutation(api.auth.updateBalanceTokenByBilling);

  useEffect(() => {
    const run = async () => {
      // Wait until everything is fully loaded
      if (!isLoaded || !user || !subscription || synced.current) {
        return;
      }

      try {
        //  Correct: check ANY active Pro plan (not index 0)
        const isPro = subscription.subscriptionItems?.some(
          (item) =>
            item.status === "active" &&
            item.plan?.name?.toLowerCase() === "pro",
        );

        if (isPro) {
          synced.current = true;

          await updateTokens({
            clerkId: user.id,
          });
        } else {
          // Not Pro → redirect immediately
          router.replace("/projects");
          return;
        }
      } catch (err) {
        console.error("Billing sync error:", err);
      }

      // Show success UI for 1 second then redirect
      setTimeout(() => {
        setLoading(false);
        router.replace("/projects");
      }, 1000);
    };

    run();
  }, [user, isLoaded, subscription, updateTokens, router]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Success Icon + Loader */}
        <div className="relative">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
          {loading && (
            <Loader2 className="w-8 h-8 animate-spin text-primary absolute -bottom-2 -right-2" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold">
          Upgrade Successful 🎉
        </h1>

        {/* Description */}
        <p className="text-muted-foreground max-w-md">
          Your Pro plan is now active and 40 credits have been added.
          Redirecting to your projects...
        </p>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[progress_1s_linear]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
