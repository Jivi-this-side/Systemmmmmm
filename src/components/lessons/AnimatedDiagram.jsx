import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Server,
  Scale,
  Shield,
  User,
  CreditCard,
  Bell,
  Package,
  Database,
  Zap,
  Globe,
  Cog,
  FileText,
  BrainCircuit,
  MessageSquare,
  BarChart2,
  Search,
  Layers,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Activity,
  GitBranch,
  Code2,
  Globe2,
} from "lucide-react";

const ICONS = {
  Smartphone,
  Server,
  Scale,
  Shield,
  User,
  CreditCard,
  Bell,
  Package,
  Database,
  Zap,
  Globe,
  Cog,
  FileText,
  BrainCircuit,
  MessageSquare,
  BarChart2,
  Search,
  Layers,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  Activity,
  GitBranch,
  Code2,
  Globe2,
};

// Uses CSS vars so nodes automatically pick up dark/light theme
function NodeBox({
  icon,
  label,
  x,
  y,
  color = "#15140f",
  soft = "#ece9e1",
  dim = false,
  pulse = false,
}) {
  const Icon = ICONS[icon] || Server;
  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1.5"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
      animate={{ opacity: dim ? 0.22 : 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="flex h-10 w-10 items-center justify-center rounded-lg border-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]"
        style={{
          borderColor: color,
          backgroundColor: "var(--color-paper)",
        }}
        animate={pulse ? { scale: [1, 1.07, 1] } : {}}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <span style={{ color }}>
          <Icon size={15} strokeWidth={2.1} />
        </span>
      </motion.div>
      <span
        className="whitespace-nowrap font-mono text-[9px] uppercase tracking-wide"
        style={{ color: "var(--color-graphite)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function Canvas({ lines, nodes, height = "h-52" }) {
  return (
    <div className={`relative w-full ${height} select-none`}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines}
      </svg>
      {nodes}
    </div>
  );
}

function AnimLine({
  x1,
  y1,
  x2,
  y2,
  color = "#2c4fc4",
  dim = false,
  delay = 0,
}) {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={1.5}
      strokeDasharray="5 3"
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: dim ? 0.18 : 1 }}
      transition={{
        pathLength: { duration: 0.7, delay },
        opacity: { duration: 0.3, delay },
      }}
      style={{ animation: !dim ? "dashflow 1.4s linear infinite" : undefined }}
    />
  );
}

// ── Chain ───────────────────────────────────────────────────────────────────
function ChainDiagram({ nodes, labels }) {
  const pos = nodes.map((_, i) => 10 + (80 / (nodes.length - 1)) * i);
  return (
    <Canvas
      lines={pos.slice(0, -1).map((x, i) => (
        <AnimLine
          key={i}
          x1={x + 8}
          y1={50}
          x2={pos[i + 1] - 8}
          y2={50}
          delay={i * 0.2}
          color="var(--color-blueprint)"
        />
      ))}
      nodes={nodes.map((n, i) => (
        <NodeBox
          key={i}
          {...n}
          x={pos[i]}
          y={50}
          color={
            i === 0
              ? "var(--color-graphite)"
              : i === nodes.length - 1
              ? "var(--color-mint)"
              : "var(--color-blueprint)"
          }
        />
      ))}
    />
  );
}

// ── Fanout ──────────────────────────────────────────────────────────────────
function FanoutDiagram({ source, hub, targets, highlightColor = "#d2401f" }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setActive((i) => (i + 1) % targets.length),
      1100
    );
    return () => clearInterval(t);
  }, [targets.length]);
  const ys = targets.length === 3 ? [18, 50, 82] : [30, 70];
  return (
    <Canvas
      lines={
        <>
          <AnimLine
            x1={18}
            y1={50}
            x2={35}
            y2={50}
            color="var(--color-graphite)"
          />
          {targets.map((_, i) => (
            <AnimLine
              key={i}
              x1={42}
              y1={50}
              x2={80}
              y2={ys[i]}
              color={active === i ? highlightColor : "var(--color-graphite)"}
              dim={active !== i}
            />
          ))}
        </>
      }
      nodes={
        <>
          <NodeBox {...source} x={10} y={50} color="var(--color-graphite)" />
          <NodeBox {...hub} x={38} y={50} color={highlightColor} />
          {targets.map((t, i) => (
            <NodeBox
              key={i}
              {...t}
              x={86}
              y={ys[i]}
              color={active === i ? highlightColor : "var(--color-graphite)"}
              dim={active !== i}
            />
          ))}
        </>
      }
    />
  );
}

// ── Cluster ─────────────────────────────────────────────────────────────────
function ClusterDiagram({ nodes }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % nodes.length), 1100);
    return () => clearInterval(t);
  }, [nodes.length]);
  const pos = [
    { x: 50, y: 18 },
    { x: 20, y: 82 },
    { x: 80, y: 82 },
  ];
  return (
    <Canvas
      lines={
        <>
          {[
            [0, 1],
            [1, 2],
            [2, 0],
          ].map(([a, b], i) => (
            <AnimLine
              key={i}
              x1={pos[a].x}
              y1={pos[a].y}
              x2={pos[b].x}
              y2={pos[b].y}
              color="var(--color-graphite)"
            />
          ))}
          <AnimLine
            x1={50}
            y1={2}
            x2={pos[active].x}
            y2={pos[active].y}
            color="var(--color-redline)"
          />
        </>
      }
      nodes={
        <>
          {nodes.map((n, i) => (
            <NodeBox
              key={i}
              {...n}
              x={pos[i].x}
              y={pos[i].y}
              color={
                active === i ? "var(--color-redline)" : "var(--color-mint)"
              }
            />
          ))}
          <span
            className="absolute -translate-x-1/2 font-mono text-[9px] uppercase tracking-wide"
            style={{ left: "50%", top: "0%", color: "var(--color-graphite)" }}
          >
            request
          </span>
        </>
      }
    />
  );
}

// ── Compare ─────────────────────────────────────────────────────────────────
function CompareDiagram({ source, topTarget, bottomTarget }) {
  return (
    <Canvas
      lines={
        <>
          <motion.line
            x1={20}
            y1={50}
            x2={78}
            y2={24}
            stroke={topTarget.color}
            strokeWidth={1.8}
            strokeDasharray="5 3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 0.4,
              repeatType: "loop",
            }}
          />
          <motion.line
            x1={20}
            y1={50}
            x2={78}
            y2={76}
            stroke={bottomTarget.color}
            strokeWidth={1.8}
            strokeDasharray="5 3"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatDelay: 0.4,
              repeatType: "loop",
            }}
          />
        </>
      }
      nodes={
        <>
          <NodeBox {...source} x={12} y={50} color="var(--color-graphite)" />
          <NodeBox {...topTarget} x={86} y={24} color={topTarget.color} />
          <NodeBox {...bottomTarget} x={86} y={76} color={bottomTarget.color} />
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1 font-mono text-[9px]"
            style={{
              left: "52%",
              top: "32%",
              color: topTarget.color,
              background: "var(--color-paper)",
            }}
          >
            {topTarget.resultLabel}
          </span>
          <span
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1 font-mono text-[9px]"
            style={{
              left: "52%",
              top: "68%",
              color: bottomTarget.color,
              background: "var(--color-paper)",
            }}
          >
            {bottomTarget.resultLabel}
          </span>
        </>
      }
    />
  );
}

// ── Stack (queue) ────────────────────────────────────────────────────────────
function StackDiagram({ producer, queueLabel, consumer }) {
  return (
    <Canvas
      lines={
        <>
          <AnimLine
            x1={18}
            y1={50}
            x2={35}
            y2={50}
            color="var(--color-graphite)"
          />
          <AnimLine
            x1={65}
            y1={50}
            x2={82}
            y2={50}
            color="var(--color-graphite)"
          />
          <motion.rect
            x="35"
            y="42"
            width="30"
            height="16"
            rx="2"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="0.8"
          />
        </>
      }
      nodes={
        <>
          <NodeBox {...producer} x={10} y={50} color="var(--color-blueprint)" />
          <NodeBox {...consumer} x={90} y={50} color="var(--color-mint)" />
          <span
            className="absolute -translate-x-1/2 font-mono text-[9px] uppercase tracking-wide"
            style={{ left: "50%", top: "30%", color: "var(--color-graphite)" }}
          >
            {queueLabel}
          </span>
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute h-3 w-3 rounded-sm"
              style={{
                top: "50%",
                marginTop: "-6px",
                background: "var(--color-redline)",
              }}
              initial={{ left: "30%", opacity: 0 }}
              animate={{
                left: ["30%", "62%", "62%", "88%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "linear",
                times: [0, 0.3, 0.75, 1],
              }}
            />
          ))}
        </>
      }
    />
  );
}

// ── Scale ────────────────────────────────────────────────────────────────────
function ScaleDiagram({ node }) {
  const [scaled, setScaled] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setScaled((s) => !s), 1800);
    return () => clearInterval(t);
  }, []);
  const positions = scaled ? [25, 50, 75] : [50];
  return (
    <Canvas
      lines={
        scaled
          ? positions.map((x, i) => (
              <AnimLine
                key={i}
                x1={50}
                y1={82}
                x2={x}
                y2={58}
                color="var(--color-blueprint)"
              />
            ))
          : null
      }
      nodes={
        <>
          <span
            className="absolute -translate-x-1/2 font-mono text-[9px] uppercase tracking-wide"
            style={{
              left: "50%",
              top: "88%",
              color: scaled ? "var(--color-redline)" : "var(--color-graphite)",
            }}
          >
            {scaled ? "traffic ↑" : "normal load"}
          </span>
          <AnimatePresence>
            {positions.map((x) => (
              <motion.div
                key={x}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute flex flex-col items-center gap-1.5"
                style={{
                  left: `${x}%`,
                  top: "40%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg border-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.15)]"
                  style={{
                    borderColor: "var(--color-mint)",
                    background: "var(--color-paper)",
                  }}
                >
                  <span style={{ color: "var(--color-mint)" }}>
                    {React.createElement(ICONS[node.icon] || Server, {
                      size: 15,
                      strokeWidth: 2.1,
                    })}
                  </span>
                </div>
                <span
                  className="whitespace-nowrap font-mono text-[9px] uppercase tracking-wide"
                  style={{ color: "var(--color-graphite)" }}
                >
                  {node.label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      }
    />
  );
}

// ── Failover ─────────────────────────────────────────────────────────────────
function FailoverDiagram({ source, primary, standby }) {
  const [down, setDown] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setDown((d) => !d), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <Canvas
      lines={
        <AnimLine
          x1={18}
          y1={50}
          x2={70}
          y2={down ? 70 : 30}
          color={down ? "var(--color-mint)" : "var(--color-redline)"}
        />
      }
      nodes={
        <>
          <NodeBox {...source} x={10} y={50} color="var(--color-graphite)" />
          <NodeBox
            {...primary}
            x={82}
            y={30}
            color={down ? "var(--color-graphite)" : "var(--color-redline)"}
            dim={down}
          />
          <NodeBox
            {...standby}
            x={82}
            y={70}
            color={down ? "var(--color-mint)" : "var(--color-graphite)"}
            dim={!down}
          />
          {down && (
            <span
              className="absolute font-mono text-[9px] font-semibold"
              style={{
                left: "82%",
                top: "14%",
                transform: "translateX(-50%)",
                color: "var(--color-redline)",
              }}
            >
              ✕ down
            </span>
          )}
        </>
      }
    />
  );
}

// ── LLM ──────────────────────────────────────────────────────────────────────
function LLMDiagram({ nodes }) {
  const pos = nodes.map((_, i) => 10 + (80 / (nodes.length - 1)) * i);
  return (
    <Canvas
      lines={pos.slice(0, -1).map((x, i) => (
        <AnimLine
          key={i}
          x1={x + 8}
          y1={50}
          x2={pos[i + 1] - 8}
          y2={50}
          color="#c47a1c"
          delay={i * 0.25}
        />
      ))}
      nodes={nodes.map((n, i) => (
        <NodeBox
          key={i}
          {...n}
          x={pos[i]}
          y={50}
          color={i === 1 ? "#c47a1c" : "var(--color-graphite)"}
          pulse={i === 1}
        />
      ))}
    />
  );
}

// ── Embed ─────────────────────────────────────────────────────────────────────
function EmbedDiagram({ source, model, output }) {
  return (
    <Canvas
      lines={
        <>
          <AnimLine
            x1={20}
            y1={50}
            x2={38}
            y2={50}
            color="var(--color-graphite)"
          />
          <AnimLine x1={62} y1={50} x2={78} y2={50} color="#c47a1c" />
        </>
      }
      nodes={
        <>
          <NodeBox {...source} x={12} y={50} color="var(--color-graphite)" />
          <NodeBox {...model} x={50} y={50} color="#c47a1c" pulse />
          <NodeBox {...output} x={86} y={50} color="#8a4fc4" />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 rounded-full"
              style={{
                left: "86%",
                top: `${35 + i * 6}%`,
                height: "4%",
                transform: "translateX(-50%)",
                background: "#8a4fc4",
              }}
              animate={{ opacity: [0.2, 1, 0.2], scaleY: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </>
      }
    />
  );
}

// ── RAG ───────────────────────────────────────────────────────────────────────
function RAGDiagram({ steps }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, [steps.length]);
  const pos = steps.map((_, i) => 10 + (80 / (steps.length - 1)) * i);
  const colors = [
    "var(--color-graphite)",
    "#8a4fc4",
    "var(--color-blueprint)",
    "#c47a1c",
    "var(--color-mint)",
  ];
  return (
    <Canvas
      lines={pos.slice(0, -1).map((x, i) => (
        <AnimLine
          key={i}
          x1={x + 7}
          y1={50}
          x2={pos[i + 1] - 7}
          y2={50}
          color={colors[i + 1]}
          dim={active < i}
          delay={0}
        />
      ))}
      nodes={steps.map((s, i) => (
        <NodeBox
          key={i}
          {...s}
          x={pos[i]}
          y={50}
          color={active >= i ? colors[i] : "var(--color-graphite)"}
          pulse={active === i}
        />
      ))}
    />
  );
}

// ── Agent Loop ────────────────────────────────────────────────────────────────
function AgentLoopDiagram({ steps }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, [steps.length]);
  const angle = (i) => (i / steps.length) * 2 * Math.PI - Math.PI / 2;
  const r = 30;
  const cx = 50;
  const cy = 50;
  const pos = steps.map((_, i) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  }));
  const colors = [
    "var(--color-blueprint)",
    "#c47a1c",
    "var(--color-mint)",
    "var(--color-redline)",
  ];
  return (
    <Canvas
      lines={pos.map((p, i) => {
        const next = pos[(i + 1) % pos.length];
        return (
          <AnimLine
            key={i}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            color={active === i ? colors[i] : "var(--color-graphite)"}
            dim={active !== i}
          />
        );
      })}
      nodes={steps.map((label, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center"
          style={{
            left: `${pos[i].x}%`,
            top: `${pos[i].y}%`,
            transform: "translate(-50%,-50%)",
          }}
        >
          <motion.div
            className="flex h-9 w-16 items-center justify-center rounded-lg border-2 font-mono text-[9px] font-semibold uppercase tracking-wide"
            style={{
              borderColor: colors[i],
              color: colors[i],
              background:
                active === i ? "var(--color-paper-dim)" : "var(--color-paper)",
            }}
            animate={{ scale: active === i ? 1.08 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.div>
        </div>
      ))}
    />
  );
}

// ── MCP ───────────────────────────────────────────────────────────────────────
function MCPDiagram({ client, servers }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setActive((i) => (i + 1) % servers.length),
      1100
    );
    return () => clearInterval(t);
  }, [servers.length]);
  const ys = [18, 50, 82];
  return (
    <Canvas
      lines={servers.map((_, i) => (
        <AnimLine
          key={i}
          x1={38}
          y1={50}
          x2={80}
          y2={ys[i]}
          color={active === i ? "#c47a1c" : "var(--color-graphite)"}
          dim={active !== i}
        />
      ))}
      nodes={
        <>
          <NodeBox {...client} x={22} y={50} color="#c47a1c" pulse />
          {servers.map((s, i) => (
            <NodeBox
              key={i}
              {...s}
              x={86}
              y={ys[i]}
              color={active === i ? "#c47a1c" : "var(--color-graphite)"}
              dim={active !== i}
            />
          ))}
          <span
            className="absolute -translate-x-1/2 font-mono text-[9px] uppercase tracking-wide"
            style={{ left: "40%", top: "8%", color: "var(--color-graphite)" }}
          >
            MCP
          </span>
        </>
      }
    />
  );
}

// ── Tool Call ─────────────────────────────────────────────────────────────────
function ToolCallDiagram({ steps }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % steps.length), 900);
    return () => clearInterval(t);
  }, [steps.length]);
  const pos = steps.map((_, i) => 12 + (76 / (steps.length - 1)) * i);
  const colors = ["#c47a1c", "#8a4fc4", "var(--color-mint)", "#c47a1c"];
  return (
    <Canvas
      lines={pos.slice(0, -1).map((x, i) => (
        <AnimLine
          key={i}
          x1={x + 8}
          y1={50}
          x2={pos[i + 1] - 8}
          y2={50}
          color={colors[i]}
          dim={active < i}
        />
      ))}
      nodes={steps.map((s, i) => (
        <NodeBox
          key={i}
          {...s}
          x={pos[i]}
          y={50}
          color={active >= i ? colors[i] : "var(--color-graphite)"}
          pulse={active === i}
        />
      ))}
    />
  );
}

// ── Guardrails ────────────────────────────────────────────────────────────────
function GuardrailsDiagram({ source, inputCheck, llm, outputCheck, output }) {
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setBlocked((b) => !b), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <Canvas
      lines={
        <>
          <AnimLine
            x1={8}
            y1={50}
            x2={24}
            y2={50}
            color="var(--color-graphite)"
          />
          {!blocked && (
            <AnimLine
              x1={36}
              y1={50}
              x2={50}
              y2={50}
              color="var(--color-blueprint)"
            />
          )}
          {!blocked && (
            <AnimLine
              x1={62}
              y1={50}
              x2={76}
              y2={50}
              color="var(--color-blueprint)"
            />
          )}
          {!blocked && (
            <AnimLine
              x1={88}
              y1={50}
              x2={96}
              y2={50}
              color="var(--color-mint)"
            />
          )}
          {blocked && (
            <AnimLine
              x1={36}
              y1={50}
              x2={36}
              y2={78}
              color="var(--color-redline)"
            />
          )}
        </>
      }
      nodes={
        <>
          <NodeBox {...source} x={5} y={50} color="var(--color-graphite)" />
          <NodeBox
            {...inputCheck}
            x={30}
            y={50}
            color={blocked ? "var(--color-redline)" : "var(--color-mint)"}
            pulse={!blocked}
          />
          {!blocked && <NodeBox {...llm} x={56} y={50} color="#c47a1c" pulse />}
          {!blocked && (
            <NodeBox {...outputCheck} x={82} y={50} color="var(--color-mint)" />
          )}
          {!blocked && (
            <NodeBox {...output} x={96} y={50} color="var(--color-mint)" />
          )}
          {blocked && (
            <span
              className="absolute font-mono text-[9px] font-semibold"
              style={{
                left: "30%",
                top: "76%",
                transform: "translateX(-50%)",
                color: "var(--color-redline)",
              }}
            >
              blocked ✕
            </span>
          )}
        </>
      }
    />
  );
}

export default function AnimatedDiagram({ diagram }) {
  switch (diagram?.type) {
    case "chain":
      return <ChainDiagram nodes={diagram.nodes} labels={diagram.labels} />;
    case "fanout":
      return (
        <FanoutDiagram
          source={diagram.source}
          hub={diagram.hub}
          targets={diagram.targets}
          highlightColor={diagram.highlightColor}
        />
      );
    case "cluster":
      return <ClusterDiagram nodes={diagram.nodes} />;
    case "compare":
      return (
        <CompareDiagram
          source={diagram.source}
          topTarget={diagram.topTarget}
          bottomTarget={diagram.bottomTarget}
        />
      );
    case "stack":
      return (
        <StackDiagram
          producer={diagram.producer}
          queueLabel={diagram.queueLabel}
          consumer={diagram.consumer}
        />
      );
    case "scale":
      return <ScaleDiagram node={diagram.node} />;
    case "failover":
      return (
        <FailoverDiagram
          source={diagram.source}
          primary={diagram.primary}
          standby={diagram.standby}
        />
      );
    case "llm":
      return <LLMDiagram nodes={diagram.nodes} />;
    case "embed":
      return (
        <EmbedDiagram
          source={diagram.source}
          model={diagram.model}
          output={diagram.output}
        />
      );
    case "rag":
      return <RAGDiagram steps={diagram.steps} />;
    case "agentloop":
      return <AgentLoopDiagram steps={diagram.steps} />;
    case "mcp":
      return <MCPDiagram client={diagram.client} servers={diagram.servers} />;
    case "toolcall":
      return <ToolCallDiagram steps={diagram.steps} />;
    case "guardrails":
      return <GuardrailsDiagram {...diagram} />;
    default:
      return null;
  }
}
