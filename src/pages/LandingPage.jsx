import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Scale,
  Server,
  Database,
  BookOpen,
  Bot,
} from "lucide-react";

const HERO_NODES = [
  { icon: Smartphone, label: "Client", color: "#4a4940" },
  { icon: Scale, label: "Load Balancer", color: "#2c4fc4" },
  { icon: Server, label: "Service", color: "#3d8361" },
  { icon: Database, label: "Database", color: "#d2401f" },
];

function HeroNode({ icon: Icon, label, color, delay }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <div
        className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl border-2 shadow-[3px_3px_0_0_rgba(21,20,15,0.1)]"
        style={{ borderColor: color, background: "var(--color-paper)" }}
      >
        <Icon size={22} strokeWidth={2} style={{ color }} />
      </div>
      <span
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "var(--color-graphite)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function HeroDiagram() {
  return (
    <div className="relative mx-auto flex w-full max-w-2xl items-end justify-between gap-0 py-8">
      <svg
        className="pointer-events-none absolute left-0 top-1/2 h-0.5 w-full -translate-y-6"
        preserveAspectRatio="none"
      >
        <motion.line
          x1="6%"
          y1="1"
          x2="94%"
          y2="1"
          stroke="var(--color-blueprint)"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
      {HERO_NODES.map((n, i) => (
        <HeroNode key={n.label} {...n} delay={0.1 + i * 0.12} />
      ))}
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Learn the pieces",
    body: "Animated lessons cover every component — from load balancers to LLM APIs — one concept at a time.",
  },
  {
    n: "02",
    title: "Build the blueprint",
    body: "Drag components onto a canvas, wire them together, and explain your design decisions.",
  },
  {
    n: "03",
    title: "Get redlined",
    body: "An AI principal engineer reviews your architecture — strengths, bottlenecks, follow-up questions, and a reference solution.",
  },
];

const STATS = [
  { value: "25+", label: "Lessons" },
  { value: "9", label: "Challenges" },
  { value: "2", label: "Tracks" },
  { value: "AI", label: "Powered Review" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-paper)" }}>
      {/* nav */}
      <nav className="flex items-center justify-between px-6 py-5 lg:px-12">
        <span
          className="font-display text-xl font-bold tracking-tight"
          style={{ color: "var(--color-ink)" }}
        >
          SYSTEM DESIGN{" "}
          <span style={{ color: "var(--color-redline)" }}>ARENA</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            to="/tutorial"
            className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Learn
          </Link>
          <Link
            to="/challenges"
            className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--color-ink)",
              color: "var(--color-ink)",
              background: "transparent",
            }}
          >
            Challenges
          </Link>
        </div>
      </nav>

      {/* hero */}
      <section
        className="grid-paper border-y px-6 py-20 lg:px-12"
        style={{ borderColor: "var(--color-ink)", opacity: 1 }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-blueprint)" }}
          >
            Interactive System Design Practice
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl font-black leading-[0.95] tracking-tight lg:text-7xl"
            style={{ color: "var(--color-ink)" }}
          >
            Design systems like a principal engineer.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-base lg:text-lg"
            style={{ color: "var(--color-ink-soft)" }}
          >
            Learn classical and AI system design through animated lessons,
            drag-and-drop architecture building, and AI-powered interview
            feedback.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Link
              to="/tutorial"
              className="group inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold transition-transform hover:-translate-y-0.5"
              style={{
                background: "var(--color-redline)",
                color: "var(--color-paper)",
              }}
            >
              Start Learning
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 rounded-xl border px-7 py-3.5 font-semibold transition-colors"
              style={{
                borderColor: "var(--color-ink)",
                color: "var(--color-ink)",
                background: "transparent",
              }}
            >
              Browse Challenges
            </Link>
          </motion.div>
        </div>

        <HeroDiagram />

        {/* stats */}
        <div className="mx-auto mt-4 grid max-w-xl grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p
                className="font-display text-3xl font-black"
                style={{ color: "var(--color-ink)" }}
              >
                {s.value}
              </p>
              <p
                className="font-mono text-[11px] uppercase tracking-wide"
                style={{ color: "var(--color-graphite)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* tracks */}
      <section className="px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-8 font-display text-3xl font-black"
            style={{ color: "var(--color-ink)" }}
          >
            Two tracks. One platform.
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              to="/tutorial"
              className="group rounded-2xl border p-6 transition-all hover:-translate-y-1"
              style={{
                borderColor: "var(--color-blueprint)",
                background: "var(--color-blueprint-soft)",
              }}
            >
              <BookOpen
                size={24}
                style={{ color: "var(--color-blueprint)" }}
                className="mb-4"
              />
              <h3
                className="mb-2 font-display text-xl font-bold"
                style={{ color: "var(--color-ink)" }}
              >
                Classical System Design
              </h3>
              <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                Load balancers, databases, caches, queues, CDNs — the
                foundations every engineer needs. 10 lessons.
              </p>
            </Link>
            <Link
              to="/tutorial"
              className="group rounded-2xl border p-6 transition-all hover:-translate-y-1"
              style={{ borderColor: "#c47a1c", background: "#faebd620" }}
            >
              <Bot size={24} style={{ color: "#c47a1c" }} className="mb-4" />
              <h3
                className="mb-2 font-display text-xl font-bold"
                style={{ color: "var(--color-ink)" }}
              >
                AI & MCP Systems
              </h3>
              <p className="text-sm" style={{ color: "var(--color-ink-soft)" }}>
                LLMs, RAG, agents, tool calling, MCP, guardrails — how modern AI
                applications are architected. 15 lessons.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section
        className="border-t px-6 py-16 lg:px-12"
        style={{ borderColor: "var(--color-ink)", opacity: 1 }}
      >
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="border-t-2 pt-4"
              style={{ borderColor: "var(--color-ink)" }}
            >
              <span
                className="font-display text-3xl font-black"
                style={{ color: "var(--color-graphite)" }}
              >
                {step.n}
              </span>
              <h3
                className="mt-2 font-display text-xl font-bold"
                style={{ color: "var(--color-ink)" }}
              >
                {step.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--color-ink-soft)" }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        className="border-t px-6 py-8 text-center"
        style={{ borderColor: "var(--color-ink)", opacity: 1 }}
      >
        <p
          className="font-mono text-xs"
          style={{ color: "var(--color-graphite)" }}
        >
          System Design Arena — built for learning, not just interviewing.
        </p>
      </footer>
    </div>
  );
}
