"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
];

export function LandingHeader() {
  const { isSignedIn } = useAuth();
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3">
          <Image src={"/logo.svg"} alt="logo" width={50} height={50} />
          <span className="font-bold text-lg text-foreground hidden sm:inline">
            S7
          </span>
        </motion.div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}>
              <Link
                href={item.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 items-center">
            
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href={"projects"}>Get Started</Link>
          </Button>

          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "size-9",
                },
              }}
            />
          ) : (
            <Button variant={"outline"} asChild>
              <SignInButton />
            </Button>
          )}
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.header>
  );
}
