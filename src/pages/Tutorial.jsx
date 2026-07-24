import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Building2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { LESSONS, CHAPTERS } from "../data/lessons";
import AnimatedDiagram from "../components/lessons/AnimatedDiagram";

const TABS = [
  { id: "learn", label: "Learn", icon: Lightbulb },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "tradeoffs", label: "Trade-offs", icon: ThumbsUp },
  { id: "interview", label: "Interview Qs", icon: HelpCircle },
];

export default function Tutorial() {
  const [chapterIdx, setChapterIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [tab, setTab] = useState("learn");
  const navigate = useNavigate();

  const chapter = CHAPTERS[chapterIdx];
  const chapterLessons = LESSONS.filter((l) => l.chapter === chapter.id);
  const lesson = chapterLessons[lessonIdx];
  const isLastLesson = lessonIdx === chapterLessons.length - 1;
  const isLastChapter = chapterIdx === CHAPTERS.length - 1;
  const overallIdx = LESSONS.indexOf(lesson);

  const goNext = () => {
    setTab("learn");
    if (!isLastLesson) {
      setDirection(1);
      setLessonIdx((i) => i + 1);
    } else if (!isLastChapter) {
      setDirection(1);
      setChapterIdx((i) => i + 1);
      setLessonIdx(0);
    } else {
      navigate("/challenges");
    }
  };

  const goBack = () => {
    setTab("learn");
    if (lessonIdx > 0) {
      setDirection(-1);
      setLessonIdx((i) => i - 1);
    } else if (chapterIdx > 0) {
      setDirection(-1);
      const prevChapter = CHAPTERS[chapterIdx - 1];
      const prevLessons = LESSONS.filter((l) => l.chapter === prevChapter.id);
      setChapterIdx((i) => i - 1);
      setLessonIdx(prevLessons.length - 1);
    }
  };

  const canGoBack = lessonIdx > 0 || chapterIdx > 0;
  const isVeryLast = isLastLesson && isLastChapter;

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* top bar */}
      <header className="flex items-center gap-4 border-b border-ink/10 px-6 py-4 lg:px-12">
        <Link to="/" className="text-ink/40 hover:text-ink">
          <X size={18} />
        </Link>

        {/* chapter pills */}
        <div className="flex gap-2">
          {CHAPTERS.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => {
                setChapterIdx(i);
                setLessonIdx(0);
                setTab("learn");
              }}
              className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide transition-all"
              style={{
                background: chapterIdx === i ? ch.color : "transparent",
                color: chapterIdx === i ? "#faf8f3" : ch.color,
                border: `1.5px solid ${ch.color}`,
              }}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* progress bar */}
        <div className="flex flex-1 items-center gap-1">
          {chapterLessons.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: chapter.color }}
                initial={false}
                animate={{ width: i <= lessonIdx ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        <span className="font-mono text-[11px] text-graphite">
          {lessonIdx + 1} / {chapterLessons.length}
        </span>

        <Link
          to="/challenges"
          className="font-mono text-[11px] uppercase tracking-wide text-graphite hover:text-ink"
        >
          Skip
        </Link>
      </header>

      {/* lesson body */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={lesson.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-1 flex-col lg:grid lg:grid-cols-2 lg:gap-0"
          >
            {/* LEFT: text + tabs */}
            <div className="flex flex-col px-6 py-8 lg:overflow-y-auto lg:px-12">
              <p
                className="font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: chapter.color }}
              >
                {lesson.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-4xl font-black leading-none tracking-tight lg:text-5xl">
                {lesson.title}
              </h1>

              {/* tabs */}
              <div className="mt-6 flex gap-1 border-b border-ink/10">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className="flex items-center gap-1.5 px-3 pb-2.5 pt-1 font-mono text-[11px] uppercase tracking-wide transition-colors"
                    style={{
                      color: tab === t.id ? chapter.color : "#87857a",
                      borderBottom:
                        tab === t.id
                          ? `2px solid ${chapter.color}`
                          : "2px solid transparent",
                    }}
                  >
                    <t.icon size={12} />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* tab content */}
              <div className="mt-5 flex-1">
                {tab === "learn" && (
                  <div className="space-y-4">
                    <p className="text-base leading-relaxed text-ink-soft">
                      {lesson.body}
                    </p>
                    {lesson.keyInsight && (
                      <div
                        className="rounded-xl border-l-4 bg-paper-dim p-4"
                        style={{ borderColor: chapter.color }}
                      >
                        <p
                          className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wide"
                          style={{ color: chapter.color }}
                        >
                          Key insight
                        </p>
                        <p className="text-sm leading-relaxed text-ink">
                          {lesson.keyInsight}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {tab === "companies" && (
                  <ul className="space-y-3">
                    {(lesson.companies || []).map((c, i) => (
                      <li
                        key={i}
                        className="flex gap-3 rounded-xl border border-ink/10 bg-paper-dim p-4 text-sm"
                      >
                        <Building2
                          size={15}
                          className="mt-0.5 shrink-0"
                          style={{ color: chapter.color }}
                        />
                        <span className="leading-relaxed text-ink">{c}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {tab === "tradeoffs" && (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-mint">
                        <ThumbsUp size={12} /> Advantages
                      </p>
                      <ul className="space-y-2">
                        {(lesson.pros || []).map((p, i) => (
                          <li
                            key={i}
                            className="flex gap-2 rounded-lg bg-mint-soft px-3 py-2.5 text-sm text-ink"
                          >
                            <span className="mt-0.5 text-mint">✓</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-redline">
                        <ThumbsDown size={12} /> Disadvantages
                      </p>
                      <ul className="space-y-2">
                        {(lesson.cons || []).map((c, i) => (
                          <li
                            key={i}
                            className="flex gap-2 rounded-lg bg-redline-soft px-3 py-2.5 text-sm text-ink"
                          >
                            <span className="mt-0.5 text-redline">✗</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === "interview" && (
                  <ul className="space-y-3">
                    {(lesson.interviewQuestions || []).map((q, i) => (
                      <li
                        key={i}
                        className="rounded-xl border border-redline/20 bg-redline-soft p-4"
                      >
                        <p className="mb-1 font-mono text-[10px] font-semibold text-redline">
                          Q{i + 1}
                        </p>
                        <p className="text-sm leading-relaxed text-ink">{q}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* RIGHT: animated diagram */}
            <div className="grid-paper-dense flex items-center justify-center border-t border-ink/10 p-8 lg:border-l lg:border-t-0">
              <div className="w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-6 shadow-[4px_4px_0_0_rgba(21,20,15,0.06)]">
                <AnimatedDiagram diagram={lesson.diagram} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* bottom nav */}
      <footer className="flex items-center justify-between border-t border-ink/10 px-6 py-5 lg:px-12">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors enabled:hover:text-ink disabled:opacity-0"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={goNext}
          className="flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
          style={{ background: chapter.color }}
        >
          {isVeryLast ? (
            <>
              <Check size={15} /> Choose a challenge
            </>
          ) : (
            <>
              Next <ArrowRight size={15} />
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
