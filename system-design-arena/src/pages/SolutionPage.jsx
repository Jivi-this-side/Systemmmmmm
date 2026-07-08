import React, { useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  ArrowLeft,
  X,
  BookOpen,
  Lightbulb,
  Layers,
  CheckCircle2,
  Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ArchitectureNode from "../components/nodes/ArchitectureNode";
import { CHALLENGES, SOLUTION_DIAGRAMS } from "../data/challenges";

const nodeTypes = { architecture: ArchitectureNode };

function NoSolution({ challengeId }) {
  const withSolutions = Object.keys(SOLUTION_DIAGRAMS);
  const available = CHALLENGES.filter((c) => withSolutions.includes(c.id));
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-ink/10 bg-paper-dim">
        <Map size={28} className="text-graphite" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold">Solution coming soon</p>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">
          We don't have a reference diagram for this challenge yet. Try one of
          these:
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {available.map((c) => (
          <Link
            key={c.id}
            to={`/solution/${c.id}`}
            className="flex items-center justify-between rounded-xl border border-ink/10 bg-paper px-4 py-3 text-sm font-medium text-ink transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(21,20,15,0.08)]"
          >
            {c.title}
            <CheckCircle2 size={14} className="text-mint" />
          </Link>
        ))}
      </div>
      <Link to="/challenges" className="text-sm text-blueprint underline">
        Back to challenges
      </Link>
    </div>
  );
}

export default function SolutionPage() {
  const { challengeId } = useParams();
  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  const diagram = SOLUTION_DIAGRAMS?.[challengeId];

  const [nodes, , onNodesChange] = useNodesState(diagram?.nodes ?? []);
  const [edges, , onEdgesChange] = useEdgesState(diagram?.edges ?? []);
  const [selected, setSelected] = useState(null);

  const onNodeClick = useCallback(
    (_, node) => {
      const annotation = diagram?.annotations?.[node.id];
      if (annotation) setSelected({ node, annotation });
      else setSelected(null);
    },
    [diagram]
  );

  if (!challenge || !diagram) return <NoSolution challengeId={challengeId} />;

  const isAI = challenge.category === "ai";
  const accentColor = isAI ? "#c47a1c" : "#2c4fc4";
  const solution = challenge.referenceSolution;

  return (
    <div className="flex h-screen flex-col bg-paper">
      {/* header */}
      <header className="flex items-center justify-between border-b border-ink/10 px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            to={`/workspace/${challengeId}`}
            className="text-ink/40 hover:text-ink"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: accentColor }}
            >
              Reference Solution · {challenge.difficulty}
            </p>
            <h1 className="font-display text-2xl font-bold leading-none">
              {challenge.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold"
            style={{
              background: accentColor + "18",
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            Expert Architecture
          </span>
          <Link
            to={`/workspace/${challengeId}`}
            className="rounded-md border border-ink/15 px-3 py-2 text-sm font-medium text-ink-soft hover:border-ink/40"
          >
            Try it yourself
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* diagram canvas */}
        <div className="relative flex-1">
          {/* hint pill */}
          <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-paper/95 px-4 py-2 shadow-sm backdrop-blur">
              <Lightbulb size={13} style={{ color: accentColor }} />
              <span className="font-mono text-[11px] text-ink-soft">
                Click any component to learn why it's here
              </span>
            </div>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelected(null)}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable className="!bg-paper" />
            <Background color={accentColor} gap={20} size={1} variant="dots" />
          </ReactFlow>

          {/* annotation tooltip */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="absolute bottom-6 left-1/2 z-20 w-full max-w-md -translate-x-1/2 rounded-2xl border border-ink/10 bg-paper p-5 shadow-[4px_4px_0_0_rgba(21,20,15,0.12)]"
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-4 top-4 text-ink/30 hover:text-ink"
                >
                  <X size={16} />
                </button>
                <p
                  className="mb-1 font-mono text-[10px] uppercase tracking-wide"
                  style={{ color: accentColor }}
                >
                  Why this component?
                </p>
                <p className="font-display text-lg font-bold leading-tight">
                  {selected.node.data.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {selected.annotation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* right sidebar */}
        <aside className="w-80 shrink-0 overflow-y-auto border-l border-ink/10 bg-paper">
          {/* overview */}
          <div className="border-b border-ink/10 p-5">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen size={15} className="text-graphite" />
              <h2 className="font-display text-lg font-bold">
                Architecture Breakdown
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">
              {solution?.overview}
            </p>
          </div>

          {/* key decisions */}
          {solution?.keyDecisions?.length > 0 && (
            <div className="border-b border-ink/10 p-5">
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-wide text-graphite">
                Key Decisions
              </p>
              <div className="space-y-3">
                {solution.keyDecisions.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-ink/10 bg-paper-dim p-3"
                  >
                    <p className="flex items-start gap-2 text-sm font-semibold text-ink">
                      <Layers
                        size={13}
                        className="mt-0.5 shrink-0"
                        style={{ color: accentColor }}
                      />
                      {d.title}
                    </p>
                    <p className="mt-1.5 pl-5 text-xs leading-relaxed text-ink-soft">
                      {d.reasoning}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* components checklist */}
          {solution?.components?.length > 0 && (
            <div className="p-5">
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-wide text-graphite">
                Components in this design
              </p>
              <div className="space-y-1.5">
                {solution.components.map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 rounded-lg bg-paper-dim px-3 py-2 text-xs text-ink"
                  >
                    <CheckCircle2 size={12} style={{ color: accentColor }} />
                    {c}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
