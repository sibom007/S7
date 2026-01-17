"use client";

import React from "react";
import { shadcn } from "@clerk/themes";
import { useAuth } from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Authenticated, AuthLoading, ConvexReactClient } from "convex/react";
import { AuthLoadingView } from "@/feature/auth/components/auth-loading-view";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
      }}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
          attribute={"class"}>
          <Authenticated>{children}</Authenticated>
          <AuthLoading>
            <AuthLoadingView />
          </AuthLoading>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
