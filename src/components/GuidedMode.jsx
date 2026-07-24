import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Unlock,
} from "lucide-react";

export default function GuidedMode({ steps, onPlaceComponent, onComplete }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [wrong, setWrong] = useState(null);
  const [showExpl, setShowExpl] = useState(false);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const isDone = stepIdx >= steps.length;

  if (isDone) return null;

  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);

    if (idx === step.correctIndex) {
      setShowExpl(true);
      if (step.component) onPlaceComponent(step.component);
    } else {
      setWrong(idx);
      setShowHint(true);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setWrong(null);
    setShowHint(false);
    setShowExpl(false);
    if (isLast) {
      onComplete();
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* progress dots */}
      <div className="mb-4 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full overflow-hidden bg-ink/10"
          >
            <motion.div
              className="h-full rounded-full bg-blueprint"
              initial={false}
              animate={{
                width: i < stepIdx ? "100%" : i === stepIdx ? "50%" : "0%",
              }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>
      <p className="mb-1 font-mono text-[10px] text-blueprint uppercase tracking-wide">
        Guided Build · Step {stepIdx + 1} of {steps.length}
      </p>

      {/* question */}
      <p className="mb-5 text-sm font-semibold leading-snug text-ink">
        {step.instruction}
      </p>

      {/* choices */}
      <div className="flex flex-col gap-2">
        {step.choices.map((choice, idx) => {
          const isCorrect = idx === step.correctIndex;
          const isWrong = idx === wrong;
          const isChosen = idx === selected;
          let border = "border-ink/15 bg-paper";
          if (isChosen && isCorrect) border = "border-mint bg-mint-soft";
          if (isWrong) border = "border-redline bg-redline-soft";

          return (
            <motion.button
              key={idx}
              onClick={() => handleChoice(idx)}
              disabled={selected !== null}
              whileHover={selected === null ? { x: 2 } : {}}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all ${border} ${
                selected === null ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/20 font-mono text-[10px] font-bold text-ink/50">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{choice}</span>
              {isChosen && isCorrect && (
                <CheckCircle2 size={15} className="shrink-0 text-mint" />
              )}
              {isWrong && (
                <XCircle size={15} className="shrink-0 text-redline" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* hint */}
      <AnimatePresence>
        {showHint && !showExpl && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex gap-2 rounded-lg bg-redline-soft p-3 text-sm text-redline"
          >
            <Lightbulb size={15} className="mt-0.5 shrink-0" />
            <span>
              Not quite — think about what needs to happen before requests reach
              your services. Try again!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* explanation */}
      <AnimatePresence>
        {showExpl && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-mint/30 bg-mint-soft p-4"
          >
            <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-mint">
              <CheckCircle2 size={12} /> Correct!
            </p>
            <p className="text-sm leading-relaxed text-ink">
              {step.explanation}
            </p>
            <button
              onClick={handleNext}
              className="mt-3 flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
            >
              {isLast ? (
                <>
                  <Unlock size={14} /> Switch to free-build
                </>
              ) : (
                <>
                  Next step <ArrowRight size={14} />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
