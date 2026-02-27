"use client";

import { motion } from "framer-motion";

export function LandingShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
            See it in Action
          </h2>
          <p className="text-foreground/60 text-lg">
            Experience the power of AI-assisted development
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl">
          {/* Simulated IDE Interface */}
          <div className="bg-linear-to-b from-secondary/50 to-card border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-foreground/50 ml-4">
                AI IDE — untitled.tsx
              </span>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-48 border-r border-border bg-secondary/20 p-4 hidden md:block">
              <div className="space-y-2">
                <div className="h-2 bg-primary/20 rounded w-24" />
                <div className="h-2 bg-primary/20 rounded w-32" />
                <div className="h-2 bg-primary/20 rounded w-28" />
                <div className="mt-6 space-y-2">
                  <div className="h-2 bg-primary/10 rounded w-full" />
                  <div className="h-2 bg-primary/10 rounded w-full" />
                  <div className="h-2 bg-primary/10 rounded w-4/5" />
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-6 font-mono text-sm overflow-x-auto">
              <div className="space-y-2">
                <div className="text-primary">
                  {"// AI suggests the next line..."}
                </div>
                <div className="text-foreground">
                  {`export const Button = ({ children }) => {`}
                </div>
                <div className="text-foreground/70 ml-4">{`return (`}</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="ml-8">
                  <div className="text-accent">
                    {'<button className="px-4 py-2 rounded">'}
                  </div>
                  <div className="text-foreground/70">{"{children}"}</div>
                  <div className="text-accent">{"</button>"}</div>
                </motion.div>
                <div className="text-foreground/70 ml-4">{`)`}</div>
                <div className="text-foreground">{`}`}</div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="border-t border-border bg-secondary/20 p-4 flex items-center justify-between text-xs text-foreground/60">
            <span>Line 1, Column 24</span>
            <div className="flex items-center gap-4">
              <span>Generated in 234ms</span>
              <span className="text-primary">● AI Ready</span>
            </div>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: "Smart Completion",
              desc: "Context-aware suggestions as you type",
            },
            {
              title: "Instant Debugging",
              desc: "AI identifies and fixes errors automatically",
            },
            {
              title: "Code Review",
              desc: "Real-time suggestions for improvements",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center">
              <h3 className="font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-foreground/60 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
