"use client";

import { motion, easeInOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeInOut },
    },
  };

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(88,86,214,0.1) 1px, transparent 1px), linear-gradient(rgba(88,86,214,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              AI-Powered Development
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance">
          <span className="text-foreground">The Future of</span>
          <br />
          <span className="bg-linear-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
            Code Development
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Write code faster with AI assistance, autocompletion, and intelligent
          debugging. Build, test, and deploy with a single unified interface.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg h-12 px-8 gap-2 group" asChild>
            <Link href={"projects"}>
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg h-12 px-8 border-foreground/20 hover:bg-foreground/5">
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 sm:gap-8 pt-12 border-t border-border">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
              10x
            </div>
            <div className="text-sm text-foreground/60">Faster Development</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
              99%
            </div>
            <div className="text-sm text-foreground/60">Error Reduction</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
              24/7
            </div>
            <div className="text-sm text-foreground/60">AI Assistance</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
