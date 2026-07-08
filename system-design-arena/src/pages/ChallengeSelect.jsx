import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Bot, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { CHALLENGES } from "../data/challenges";

const DIFFICULTY_STYLE = {
  Easy: { color: "var(--color-mint)", bg: "var(--color-mint-soft)" },
  Medium: {
    color: "var(--color-blueprint)",
    bg: "var(--color-blueprint-soft)",
  },
  Hard: { color: "var(--color-redline)", bg: "var(--color-redline-soft)" },
};

const SECTIONS = [
  {
    id: "classical",
    label: "Classical System Design",
    icon: BookOpen,
    color: "var(--color-blueprint)",
    desc: "Master the foundations — distributed systems, databases, caches, queues, and everything that makes systems scale.",
  },
  {
    id: "ai",
    label: "AI System Design",
    icon: Bot,
    color: "#c47a1c",
    desc: "Design modern AI applications — RAG pipelines, agent systems, MCP integrations, and LLM-powered products.",
  },
];

function ChallengeCard({ challenge, index }) {
  const diff = DIFFICULTY_STYLE[challenge.difficulty];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link
        to={`/workspace/${challenge.id}`}
        className="group flex flex-col rounded-xl border p-5 transition-all hover:-translate-y-1"
        style={{
          borderColor: "var(--color-ink)",
          background: "var(--color-paper)",
          opacity: 1,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = "5px 5px 0 0 rgba(0,0,0,0.15)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
      >
        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: diff.color, background: diff.bg }}
          >
            {challenge.difficulty}
          </span>
          {challenge.guidedSteps?.length > 0 && (
            <span
              className="flex items-center gap-1 font-mono text-[10px]"
              style={{ color: "var(--color-graphite)" }}
            >
              <Zap size={10} /> Guided
            </span>
          )}
        </div>
        <h3
          className="mt-3 font-display text-xl font-bold leading-tight"
          style={{ color: "var(--color-ink)" }}
        >
          {challenge.title}
        </h3>
        <p className="mt-1 text-sm" style={{ color: "var(--color-ink-soft)" }}>
          {challenge.tagline}
        </p>
        <p
          className="mt-3 font-mono text-[11px]"
          style={{ color: "var(--color-graphite)" }}
        >
          {challenge.scale}
        </p>
        <div
          className="mt-4 flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          Begin{" "}
          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export default function ChallengeSelect() {
  const [active, setActive] = useState("classical");
  const section = SECTIONS.find((s) => s.id === active);
  const displayed = CHALLENGES.filter((c) => c.category === active);

  return (
    <div
      className="min-h-screen px-6 py-10 lg:px-12"
      style={{ background: "var(--color-paper)" }}
    >
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm transition-colors"
        style={{ color: "var(--color-ink-soft)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--color-ink-soft)")
        }
      >
        <ArrowLeft size={15} /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1
          className="font-display text-4xl font-black tracking-tight lg:text-5xl"
          style={{ color: "var(--color-ink)" }}
        >
          Choose a Challenge
        </h1>
        <p
          className="mt-2 max-w-lg text-sm"
          style={{ color: "var(--color-ink-soft)" }}
        >
          Build the architecture, get AI feedback, then compare with the
          reference solution.
        </p>
      </motion.div>

      {/* section tabs */}
      <div className="mt-8 flex gap-3">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all"
            style={
              active === s.id
                ? {
                    background: s.color,
                    color: "var(--color-paper)",
                    borderColor: s.color,
                  }
                : {
                    background: "transparent",
                    color: s.color,
                    borderColor: s.color,
                  }
            }
          >
            <s.icon size={15} />
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm" style={{ color: "var(--color-ink-soft)" }}>
        {section.desc}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((c, i) => (
          <ChallengeCard key={c.id} challenge={c} index={i} />
        ))}
      </div>
    </div>
  );
}
