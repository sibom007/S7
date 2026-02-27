"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Github, Twitter, Linkedin } from "lucide-react";

export function LandingCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/20">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
          Ready to Build Better?
        </h2>
        <p className="text-foreground/60 text-lg mb-8">
          Join developers worldwide using AI IDE to build faster
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg h-12 px-8">
            Start Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-foreground/20 hover:bg-foreground/5 text-lg h-12 px-8">
            Schedule Demo
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

export function LandingFooter() {
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Documentation", "Security"],
    },
    { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
    {
      title: "Resources",
      links: ["Community", "Support", "Status", "Roadmap"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Cookie Policy", "Compliance"],
    },
  ];

  const socialLinks = [
    { icon: Github, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Mail, href: "#" },
  ];

  return (
    <footer className="border-t border-border bg-foreground/2 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  AI
                </span>
              </div>
              <span className="font-bold text-lg text-foreground">IDE</span>
            </div>
            <p className="text-foreground/60 text-sm">
              The future of development is here
            </p>
          </motion.div>

          {/* Links */}
          {footerLinks.map((column, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}>
              <h4 className="font-semibold text-foreground mb-4">
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-foreground/60 hover:text-foreground transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-foreground/60 text-sm mb-4 md:mb-0">
            © 2025 AI IDE. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social, i) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="text-foreground/60 hover:text-foreground transition-colors">
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
