import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Smartphone,
  Scale,
  Shield,
  Globe,
  Server,
  KeyRound,
  Database,
  Zap,
  Archive,
  ListOrdered,
  BrainCircuit,
  BarChart2,
  Plug,
  Bot,
  BookOpen,
  ShieldCheck,
  Activity,
  Cog,
  Search,
  Globe2,
  MessageCircle,
  Radio,
  Layers,
  Box,
} from "lucide-react";
import { COMPONENT_CATEGORIES } from "../../data/components";

const ICONS = {
  Smartphone,
  Scale,
  Shield,
  Globe,
  Server,
  KeyRound,
  Database,
  Zap,
  Archive,
  ListOrdered,
  BrainCircuit,
  BarChart2,
  Plug,
  Bot,
  BookOpen,
  ShieldCheck,
  Activity,
  Cog,
  Search,
  Globe2,
  MessageCircle,
  Radio,
  Layers,
};

export default function ArchitectureNode({ data, selected }) {
  const category =
    COMPONENT_CATEGORIES[data.category] ?? COMPONENT_CATEGORIES.compute;
  const Icon = ICONS[data.icon] ?? Box;

  return (
    <div
      style={{
        borderColor: selected ? "var(--color-ink)" : category.color,
        background: "var(--color-paper)",
        boxShadow: selected
          ? "3px 3px 0 0 rgba(21,20,15,0.2)"
          : "2px 2px 0 0 rgba(21,20,15,0.1)",
      }}
      className="flex items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 transition-shadow"
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "var(--color-ink)",
          border: "2px solid var(--color-paper)",
        }}
        className="!w-2 !h-2"
      />

      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: category.soft, color: category.color }}
      >
        <Icon size={14} strokeWidth={2.2} />
      </span>

      <div className="flex flex-col leading-tight">
        <span
          className="font-mono text-[9px] uppercase tracking-wide"
          style={{ color: category.color }}
        >
          {category.label}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          {data.label}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "var(--color-ink)",
          border: "2px solid var(--color-paper)",
        }}
        className="!w-2 !h-2"
      />
    </div>
  );
}
