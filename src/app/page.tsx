"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Send, Pencil, Film, Code } from "lucide-react";
import { detectPlatform } from "@/lib/platform";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LuxuryBackground } from "@/components/LuxuryBackground";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProjectData, StatData, TabFilter } from "@/lib/types";

const tabs: TabFilter[] = ["All", "Design", "Development", "Editing", "Other"];

const pillars = [
  {
    icon: Pencil,
    title: "Design",
    subtitle: "UI/UX & Branding",
    description:
      "We craft digital interfaces and brand identities that feel inevitable. Every curve, color, and component is intentional.",
  },
  {
    icon: Film,
    title: "Frame",
    subtitle: "Cinema & Post-Production",
    description:
      "Cinematic storytelling through frame-perfect editing, color grading, and motion design that commands attention.",
  },
  {
    icon: Code,
    title: "Code",
    subtitle: "Next-Gen Development",
    description:
      "Architecting performant, scalable applications with modern stacks. Clean code that ships fast and lasts.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

function FloatingLabelInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        className={`peer w-full bg-transparent border-b px-0 pb-3 pt-6 text-sm text-off-white placeholder-transparent transition-all duration-300 focus:outline-none ${
          error
            ? "border-red-500/70 focus:border-red-400"
            : "border-charcoal-500 focus:border-off-white/60"
        }`}
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
          active
            ? "top-0 text-[9px] tracking-[0.15em] uppercase text-off-white-muted"
            : "top-5 text-sm text-charcoal-400"
        } ${error ? "text-red-400" : ""}`}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-[9px] tracking-wider text-red-400">{error}</p>
      )}
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [stats, setStats] = useState<StatData[]>([]);
  const [activeTab, setActiveTab] = useState<TabFilter>("All");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [heroLoaded, setHeroLoaded] = useState(false);
  const workRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .catch(() => {});
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats ?? []))
      .catch(() => {});
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setFormStatus("error");
      return;
    }
    setFormStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setFormStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 4000);
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <>
      <Header />

      <LuxuryBackground />

      <main className="relative z-10">
        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-950 to-charcoal-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.025)_0%,_transparent_70%)]" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="text-[9px] uppercase tracking-[0.3em] text-off-white-muted mb-6"
            >
              Luxury Creative Agency
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-off-white"
            >
              Forming Ideas.
              <br />
              <span className="text-off-white-muted">Framing Impact.</span>
            </motion.h1>

            {heroLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease }}
                className="mt-16"
              >
                <a
                  href="#pillars"
                  className="inline-flex flex-col items-center gap-1.5 text-off-white-muted hover:text-off-white transition-all duration-300 group"
                >
                  <span className="text-[8px] uppercase tracking-[0.3em] group-hover:tracking-[0.35em] transition-all duration-300">
                    Scroll
                  </span>
                  <ArrowDown size={13} className="animate-bounce opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </motion.div>
            )}
          </div>
        </section>

        {/* ─── PILLARS ─── */}
        <section id="pillars" className="py-28 md:py-36 border-t border-charcoal-700/40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease }}
              className="mb-14"
            >
              <p className="text-[9px] uppercase tracking-[0.3em] text-off-white-muted mb-3">
                What We Do
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-off-white">
                Three Disciplines, One Vision
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease }}
                    className="glass group p-8 md:p-10 min-h-[280px] flex flex-col"
                  >
                    <Icon
                      size={18}
                      className="text-off-white-muted group-hover:text-off-white transition-colors duration-500 mb-5"
                    />
                    <h3 className="font-serif text-xl text-off-white mb-1">
                      {pillar.title}
                    </h3>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-off-white-muted mb-4">
                      {pillar.subtitle}
                    </p>
                    <p className="text-sm text-off-white-muted leading-relaxed mt-auto">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="py-24 md:py-28 border-t border-charcoal-700/40">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="glass py-10 px-6 text-center"
                >
                  <p className="font-serif text-3xl md:text-4xl text-off-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[8px] uppercase tracking-[0.2em] text-off-white-dim">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PORTFOLIO ─── */}
        <section id="work" ref={workRef} className="py-28 md:py-36 border-t border-charcoal-700/40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease }}
              className="mb-12"
            >
              <p className="text-[9px] uppercase tracking-[0.3em] text-off-white-muted mb-3">
                Selected Work
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-off-white">
                Projects
              </h2>
            </motion.div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-0.5 mb-10 border-b border-charcoal-700/40 pb-px">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-[9px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    activeTab === tab
                      ? "text-off-white border-b border-off-white/40"
                      : "text-off-white-dim hover:text-off-white-muted border-b border-transparent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease }}
                    className="glass group overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-charcoal-850 border-b border-charcoal-700/30 flex items-center justify-center overflow-hidden">
                      {project.imageUrl ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 border border-charcoal-500/30 flex items-center justify-center">
                          {project.linkUrl ? (
                            <span className={detectPlatform(project.linkUrl).color}>
                              {detectPlatform(project.linkUrl).icon}
                            </span>
                          ) : (
                            <div className="w-4 h-4 border border-charcoal-500/50" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-off-white-dim">
                          {project.category}
                        </span>
                        {project.linkUrl && (
                          <a
                            href={project.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`${detectPlatform(project.linkUrl).color} hover:scale-110 transition-transform`}
                            title={detectPlatform(project.linkUrl).label}
                          >
                            {detectPlatform(project.linkUrl).icon}
                          </a>
                        )}
                      </div>
                      <h3 className="mt-1.5 font-serif text-lg text-off-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-xs text-off-white-muted line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <p className="text-center text-sm text-charcoal-400 py-16">
                No projects in this category yet.
              </p>
            )}
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" ref={contactRef} className="py-28 md:py-36 border-t border-charcoal-700/40">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease }}
              className="text-center mb-12"
            >
              <p className="text-[9px] uppercase tracking-[0.3em] text-off-white-muted mb-3">
                Start a Project
              </p>
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-off-white">
                Let&apos;s Create Together
              </h2>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              onSubmit={handleContact}
              className="space-y-8"
            >
              <FloatingLabelInput
                id="contact-name"
                label="Your Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={formStatus === "error" && !form.name ? "Required" : undefined}
              />
              <FloatingLabelInput
                id="contact-email"
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                error={formStatus === "error" && !form.email ? "Required" : undefined}
              />
              <div className="relative">
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                  className={`peer w-full bg-transparent border-b px-0 pb-3 pt-6 text-sm text-off-white placeholder-transparent transition-all duration-300 focus:outline-none resize-none h-28 ${
                    formStatus === "error" && !form.message
                      ? "border-red-500/70 focus:border-red-400"
                      : "border-charcoal-500 focus:border-off-white/60"
                  }`}
                  placeholder="Tell us about your project"
                />
                <label
                  htmlFor="contact-message"
                  className={`absolute left-0 transition-all duration-300 pointer-events-none ${
                    form.message.length > 0
                      ? "top-0 text-[9px] tracking-[0.15em] uppercase text-off-white-muted"
                      : "top-5 text-sm text-charcoal-400"
                  } ${formStatus === "error" && !form.message ? "text-red-400" : ""}`}
                >
                  Project Details
                </label>
                {formStatus === "error" && !form.message && (
                  <p className="mt-1.5 text-[9px] tracking-wider text-red-400">Required</p>
                )}
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  disabled={formStatus === "sending"}
                  className="inline-flex items-center gap-2"
                >
                  <Send size={13} />
                  {formStatus === "sending" ? "Sending..." : formStatus === "sent" ? "Message Sent" : "Send Inquiry"}
                </Button>
                {formStatus === "sent" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-[9px] uppercase tracking-[0.15em] text-emerald-400"
                  >
                    Thank you. We&apos;ll be in touch.
                  </motion.p>
                )}
              </div>
            </motion.form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
