import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Layers,
  Map,
} from "lucide-react";

const CATEGORY_LABELS = {
  functionality: "Functionality",
  scalability: "Scalability",
  database_design: "Database Design",
  performance: "Performance",
  security: "Security",
  reliability: "Reliability",
  cost_awareness: "Cost Awareness",
  design_reasoning: "Design Reasoning",
};

function scoreColor(s) {
  if (s >= 8) return { text: "text-mint", bg: "bg-mint" };
  if (s >= 5) return { text: "text-blueprint", bg: "bg-blueprint" };
  return { text: "text-redline", bg: "bg-redline" };
}

function overallMeta(s) {
  if (s >= 80) return { label: "Strong hire", color: "#3d8361" };
  if (s >= 65) return { label: "Lean hire", color: "#2c4fc4" };
  if (s >= 50) return { label: "Borderline", color: "#2c4fc4" };
  if (s >= 35) return { label: "Needs work", color: "#d2401f" };
  return { label: "Not ready", color: "#d2401f" };
}

function ScoreRing({ score }) {
  const { color } = overallMeta(score);
  const C = 2 * Math.PI * 42;
  return (
    <div className="relative flex h-36 w-36 items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#e8e4da"
          strokeWidth="9"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C - (score / 100) * C }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="text-center">
        <motion.p
          className="font-display text-4xl font-black leading-none"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {score}
        </motion.p>
        <p className="font-mono text-[10px] uppercase tracking-wide text-graphite">
          / 100
        </p>
      </div>
    </div>
  );
}

function CategoryBar({ category, data }) {
  const [open, setOpen] = useState(false);
  const { text, bg } = scoreColor(data.score);
  return (
    <div className="border-b border-ink/8 py-3 last:border-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 text-left"
      >
        <span className="w-32 shrink-0 text-sm font-medium text-ink">
          {CATEGORY_LABELS[category] ?? category}
        </span>
        <div className="relative flex-1 h-2 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${bg}`}
            initial={{ width: 0 }}
            animate={{ width: `${data.score * 10}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span
          className={`w-8 shrink-0 text-right font-mono text-sm font-semibold ${text}`}
        >
          {data.score}/10
        </span>
        {open ? (
          <ChevronUp size={14} className="shrink-0 text-graphite" />
        ) : (
          <ChevronDown size={14} className="shrink-0 text-graphite" />
        )}
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 pl-[152px] text-sm leading-relaxed text-ink-soft"
        >
          {data.comment}
        </motion.p>
      )}
    </div>
  );
}

function ReferenceSolution({ solution }) {
  const [open, setOpen] = useState(false);
  if (!solution) return null;
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper shadow-[4px_4px_0_0_rgba(21,20,15,0.06)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-graphite" />
          <h3 className="font-display text-xl font-bold">
            Reference Architecture
          </h3>
          <span className="rounded-full bg-blueprint-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-blueprint">
            Expert Solution
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-graphite" />
        ) : (
          <ChevronDown size={16} className="text-graphite" />
        )}
      </button>

      <AnimateContent open={open}>
        <div className="space-y-5 border-t border-ink/10 p-5">
          <p className="text-sm leading-relaxed text-ink-soft">
            {solution.overview}
          </p>

          {solution.keyDecisions?.length > 0 && (
            <div>
              <h4 className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-graphite">
                Key Decisions
              </h4>
              <div className="space-y-3">
                {solution.keyDecisions.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-blueprint/20 bg-blueprint-soft p-4"
                  >
                    <p className="font-semibold text-ink">{d.title}</p>
                    <p className="mt-1 text-sm text-ink-soft">{d.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {solution.components?.length > 0 && (
            <div>
              <h4 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-graphite">
                Components in the reference design
              </h4>
              <div className="flex flex-wrap gap-2">
                {solution.components.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-ink/15 bg-paper-dim px-3 py-1 font-mono text-xs text-ink"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </AnimateContent>
    </div>
  );
}

function AnimateContent({ open, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}

export default function ReviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const review = state?.review;
  const blueprint = state?.blueprint;
  const challenge = state?.challenge;

  if (!review) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <p className="font-display text-2xl font-bold">No review data found.</p>
        <p className="text-ink-soft">
          Submit a blueprint from the workspace first.
        </p>
        <Link
          to="/challenges"
          className="text-sm font-medium text-blueprint underline"
        >
          Back to challenges
        </Link>
      </div>
    );
  }

  const { label, color } = overallMeta(review.overallScore ?? 0);
  const scores = review.scores ?? {};

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-paper/95 px-6 py-4 backdrop-blur lg:px-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
        >
          <ArrowLeft size={15} /> Back to workspace
        </button>
        <span className="font-mono text-xs uppercase tracking-widest text-graphite">
          AI Review · {review.reviewerPersona ?? "Principal Engineer"}
        </span>
        <Link
          to={`/solution/${blueprint?.challengeId}`}
          className="flex items-center gap-1.5 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
        >
          <Map size={13} /> View Solution
        </Link>
        <Link
          to="/challenges"
          className="flex items-center gap-1.5 rounded-md border border-ink/15 px-3 py-2 text-sm font-medium hover:border-ink/40"
        >
          <RotateCcw size={13} /> New challenge
        </Link>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-6 py-10 lg:px-0">
        {review.isMock && (
          <div className="rounded-lg border border-blueprint/30 bg-blueprint-soft px-4 py-3 font-mono text-xs text-blueprint">
            ⚠ Demo mode — add{" "}
            <code className="font-semibold">VITE_GROQ_API_KEY=gsk_...</code> to
            your root <code className="font-semibold">.env</code> file and
            restart for real AI reviews.
          </div>
        )}

        {/* hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 rounded-2xl border border-ink/10 bg-paper-dim p-8 shadow-[4px_4px_0_0_rgba(21,20,15,0.06)] sm:flex-row sm:text-left"
        >
          <ScoreRing score={review.overallScore ?? 0} />
          <div className="flex-1 text-center sm:text-left">
            <p
              className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-widest"
              style={{ color }}
            >
              {label}
            </p>
            <h1 className="font-display text-3xl font-black leading-tight lg:text-4xl">
              {blueprint?.challengeTitle ?? "Your Design"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {review.overallVerdict}
            </p>
          </div>
        </motion.div>

        {/* reference solution — show prominently */}
        {challenge?.referenceSolution && (
          <ReferenceSolution solution={challenge.referenceSolution} />
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* left: scores + improvements + questions */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Award size={16} className="text-ink/50" />
                <h3 className="font-display text-xl font-bold">
                  Category Scores
                </h3>
              </div>
              <div className="rounded-xl border border-ink/10 bg-paper px-5 py-2">
                {Object.entries(scores).map(([cat, data]) => (
                  <CategoryBar key={cat} category={cat} data={data} />
                ))}
              </div>
            </div>

            {review.improvements?.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp size={16} className="text-blueprint" />
                  <h3 className="font-display text-xl font-bold">
                    Improvements
                  </h3>
                </div>
                <div className="space-y-3">
                  {review.improvements.map((imp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-xl border border-blueprint/20 bg-blueprint-soft p-4"
                    >
                      <p className="font-semibold text-ink">{imp.title}</p>
                      <p className="mt-1 text-sm text-ink-soft">{imp.detail}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {review.followUpQuestions?.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-redline" />
                  <h3 className="font-display text-xl font-bold">
                    Follow-up Questions
                  </h3>
                </div>
                <div className="space-y-3">
                  {review.followUpQuestions.map((q, i) => (
                    <div
                      key={i}
                      className="flex gap-3 rounded-xl border border-redline/20 bg-redline-soft p-4"
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] font-semibold text-redline">
                        Q{i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-ink">{q}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right: strengths + bottlenecks + reasoning */}
          <div className="space-y-5">
            {review.strengths?.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-mint" />
                  <h3 className="font-display text-lg font-bold">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {review.strengths.map((s, i) => (
                    <li
                      key={i}
                      className="flex gap-2 rounded-lg bg-mint-soft px-3 py-2.5 text-sm text-ink"
                    >
                      <span className="mt-0.5 shrink-0 text-mint">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.bottlenecks?.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-redline" />
                  <h3 className="font-display text-lg font-bold">
                    Bottlenecks
                  </h3>
                </div>
                <ul className="space-y-2">
                  {review.bottlenecks.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-2 rounded-lg bg-redline-soft px-3 py-2.5 text-sm text-ink"
                    >
                      <span className="mt-0.5 shrink-0 text-redline">▲</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {blueprint?.reasoning?.trim().length > 10 && (
              <div>
                <h3 className="mb-2 font-display text-lg font-bold">
                  Your Reasoning
                </h3>
                <p className="rounded-xl border border-ink/10 bg-paper-dim p-4 font-mono text-xs leading-relaxed text-ink-soft">
                  {blueprint.reasoning}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
