"use client";

import { ConvexReactClient } from "convex/react";
import React from "react";
import { Toaster } from "./ui/sonner";
import { shadcn } from "@clerk/themes";
import { useAuth } from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthInitializer } from "@/feature/auth/components/authInitializer";

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
          attribute="class">
          {/* Run once after login */}
          <AuthInitializer />

          {children}
          <Toaster />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
