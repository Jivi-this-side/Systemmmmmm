import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  ArrowLeft,
  Loader2,
  GraduationCap,
  Pencil,
  Map,
} from "lucide-react";
import Palette from "./Palette";
import ArchitectureNode from "./nodes/ArchitectureNode";
import GuidedMode from "./GuidedMode";
import { CHALLENGES } from "../data/challenges";
import { getReview } from "../lib/groq";
import { PALETTE } from "../data/components";

const seed = [
  {
    id: "node-client",
    type: "architecture",
    data: { label: "Client App", category: "client", icon: "Smartphone" },
    position: { x: 60, y: 200 },
  },
  {
    id: "node-lb",
    type: "architecture",
    data: { label: "Load Balancer", category: "network", icon: "Scale" },
    position: { x: 340, y: 200 },
  },
];
const seedEdges = [
  {
    id: "e1",
    source: "node-client",
    target: "node-lb",
    animated: true,
    style: { stroke: "#2c4fc4", strokeWidth: 2 },
  },
];
const nodeTypes = { architecture: ArchitectureNode };

export default function DesignWorkspace() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const challenge =
    CHALLENGES.find((c) => c.id === challengeId) ?? CHALLENGES[0];

  const [nodes, setNodes, onNodesChange] = useNodesState(seed);
  const [edges, setEdges, onEdgesChange] = useEdgesState(seedEdges);
  const [reasoning, setReasoning] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [guided, setGuided] = useState(!!challenge.guidedSteps?.length);

  const rfWrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  const onConnect = useCallback(
    (p) =>
      setEdges((eds) =>
        addEdge(
          {
            ...p,
            animated: true,
            style: { stroke: "#2c4fc4", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/json");
      if (!raw || !rfInstance) return;
      const item = JSON.parse(raw);
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      setNodes((nds) =>
        nds.concat({
          id: `${item.type}-${Date.now()}`,
          type: "architecture",
          position,
          data: { label: item.label, category: item.category, icon: item.icon },
        })
      );
    },
    [rfInstance, setNodes]
  );

  const placeComponent = useCallback(
    (type) => {
      const template =
        PALETTE.find((p) => p.type === type) ||
        PALETTE.find((p) => p.type.includes(type));
      if (!template) return;
      setNodes((nds) =>
        nds.concat({
          id: `guided-${type}-${Date.now()}`,
          type: "architecture",
          position: { x: 100 + nds.length * 160, y: 200 },
          data: {
            label: template.label,
            category: template.category,
            icon: template.icon,
          },
        })
      );
    },
    [setNodes]
  );

  const blueprint = useMemo(
    () => ({
      challengeId: challenge.id,
      challengeTitle: challenge.title,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.data.category,
        label: n.data.label,
        position: n.position,
      })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
      reasoning,
      submittedAt: new Date().toISOString(),
    }),
    [nodes, edges, reasoning, challenge]
  );

  const handleSubmit = async () => {
    setStatus("loading");
    setErrorMsg("");
    localStorage.setItem(
      `sda-blueprint-${challenge.id}`,
      JSON.stringify(blueprint, null, 2)
    );
    try {
      const review = await getReview(blueprint);
      navigate(`/review/${challenge.id}`, {
        state: { review, blueprint, challenge },
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  const isAI = challenge.category === "ai";

  return (
    <div className="flex h-screen flex-col bg-paper">
      <header className="flex items-center justify-between border-b border-ink/10 bg-paper px-6 py-3">
        <div className="flex items-center gap-4">
          <Link to="/challenges" className="text-ink/40 hover:text-ink">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p
              className="font-mono text-[10px] uppercase tracking-wider"
              style={{ color: isAI ? "#c47a1c" : "#2c4fc4" }}
            >
              {challenge.difficulty} · {challenge.scale}
            </p>
            <h1 className="font-display text-2xl font-bold leading-none">
              {challenge.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {challenge.guidedSteps?.length > 0 && (
            <button
              onClick={() => setGuided((g) => !g)}
              className="flex items-center gap-1.5 rounded-md border border-ink/15 px-3 py-2 text-xs font-medium text-ink-soft hover:border-ink/40"
            >
              {guided ? (
                <>
                  <Pencil size={13} /> Free Build
                </>
              ) : (
                <>
                  <GraduationCap size={13} /> Guided
                </>
              )}
            </button>
          )}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              className="flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Reviewing…
                </>
              ) : (
                <>
                  <ClipboardCheck size={15} />
                  Submit for Review
                </>
              )}
            </button>
            {status === "error" && (
              <p className="max-w-xs text-right font-mono text-[10px] text-redline">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-12 gap-px overflow-hidden bg-ink/10">
        {/* LEFT: guided mode or palette */}
        <aside className="col-span-3 overflow-y-auto bg-paper p-5 lg:col-span-2">
          {guided && challenge.guidedSteps?.length > 0 ? (
            <GuidedMode
              steps={challenge.guidedSteps}
              onPlaceComponent={placeComponent}
              onComplete={() => setGuided(false)}
            />
          ) : (
            <>
              <h3 className="mb-1 font-display text-lg font-bold leading-none">
                Components
              </h3>
              <p className="mb-4 text-xs text-ink/50">Drag onto the canvas.</p>
              <Palette />
            </>
          )}
        </aside>

        {/* CENTER: canvas */}
        <main ref={rfWrapper} className="col-span-6 bg-paper lg:col-span-7">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Controls />
            <MiniMap pannable zoomable className="!bg-paper" />
            <Background
              color={isAI ? "#c47a1c" : "#2c4fc4"}
              gap={20}
              size={1}
              variant="dots"
            />
          </ReactFlow>
        </main>

        {/* RIGHT: requirements + reasoning */}
        <aside className="col-span-3 flex flex-col gap-4 overflow-y-auto bg-paper p-5">
          <div>
            <h3 className="mb-1 font-display text-lg font-bold leading-none">
              Requirements
            </h3>
            <p className="mb-2 font-mono text-[10px] text-graphite">
              {challenge.scale}
            </p>
            <ul className="flex flex-col gap-1.5">
              {challenge.requirements.map((r) => (
                <li key={r} className="flex gap-2 text-xs text-ink-soft">
                  <span
                    className="mt-0.5"
                    style={{ color: isAI ? "#c47a1c" : "#2c4fc4" }}
                  >
                    ▸
                  </span>
                  {r}
                </li>
              ))}
            </ul>
            {challenge.interviewTips?.length > 0 && (
              <div className="mt-3 rounded-lg border border-ink/10 bg-paper-dim p-3">
                <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-graphite">
                  Interview tips
                </p>
                <ul className="flex flex-col gap-1">
                  {challenge.interviewTips.map((t) => (
                    <li
                      key={t}
                      className="text-xs leading-relaxed text-ink-soft"
                    >
                      · {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link
            to={`/solution/${challenge.id}`}
            className="flex items-center justify-center gap-2 rounded-lg border border-ink/15 py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink/40 hover:text-ink"
          >
            <Map size={13} /> View Reference Solution
          </Link>

          <div className="flex flex-1 flex-col">
            <h3 className="mb-2 font-display text-lg font-bold leading-none">
              Your Reasoning
            </h3>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain your scaling strategy, key trade-offs, and why you chose this architecture…"
              className="min-h-[180px] flex-1 resize-none rounded-lg border border-ink/15 bg-paper-dim p-3 font-mono text-xs leading-relaxed text-ink placeholder:text-ink/30 focus:border-blueprint focus:outline-none"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
