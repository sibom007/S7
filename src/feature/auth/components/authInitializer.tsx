"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export function AuthInitializer() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const initTokens = useMutation(api.auth.createToken);

  const hasRun = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;

    // Prevent running multiple times
    if (hasRun.current) return;

    hasRun.current = true;
    initTokens();
  }, [isAuthenticated, isLoading, initTokens]);

  return null;
}
