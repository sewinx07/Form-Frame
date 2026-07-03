"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Design", href: "#pillars" },
  { label: "Frame", href: "#pillars" },
  { label: "Code", href: "#pillars" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "glass border-b border-charcoal-700/40 shadow-[0_1px_0_rgba(255,255,255,0.02)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={`font-serif text-xl tracking-[0.1em] text-off-white transition-opacity duration-300 ${
            scrolled ? "opacity-90" : "opacity-100"
          }`}
        >
          Form <span className="text-off-white-dim">&amp;</span> Frame
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[9px] uppercase tracking-[0.2em] text-off-white-muted hover:text-off-white transition-all duration-300 hover:tracking-[0.25em]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-off-white-muted hover:text-off-white transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-charcoal-700/40 glass px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-[9px] uppercase tracking-[0.2em] text-off-white-muted hover:text-off-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
