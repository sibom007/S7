"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Settings,
  Shield,
  BarChart3,
  GitBranch,
} from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "AI Code Generation",
    description:
      "Write entire functions and components with natural language instructions.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Millisecond response times with optimized inference engines.",
  },
  {
    icon: Settings,
    title: "Seamless Integration",
    description: "Works with your existing development workflow and tools.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "End-to-end encryption and compliance with industry standards.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track code quality metrics and performance improvements.",
  },
  {
    icon: GitBranch,
    title: "Version Control",
    description: "Built-in Git integration with intelligent commit messages.",
  },
];

export function LandingFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="features"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground/2">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            Powerful Features
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Everything you need to supercharge your development
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group p-8 rounded-2xl border border-border hover:border-primary/50 bg-card hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                <div className="mb-4">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
