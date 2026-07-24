import React from "react";
import {
  GripVertical,
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
  Box,
} from "lucide-react";
import { PALETTE, COMPONENT_CATEGORIES } from "../data/components";

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
  Box,
  Layers: Archive,
};

export default function Palette() {
  const grouped = PALETTE.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([cat, items]) => {
        const category = COMPONENT_CATEGORIES[cat];
        return (
          <div key={cat}>
            <p
              className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: category.color }}
            >
              {category.label}
            </p>
            <div className="flex flex-col gap-1.5">
              {items.map((item) => {
                const Icon = ICONS[item.icon] || Box;
                return (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="flex cursor-grab items-center gap-2 rounded-lg border border-ink/10 bg-paper px-2.5 py-2 text-xs font-medium text-ink transition-all hover:border-ink/30 hover:shadow-[2px_2px_0_0_rgba(21,20,15,0.08)] active:cursor-grabbing"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                      style={{
                        background: category.soft,
                        color: category.color,
                      }}
                    >
                      <Icon size={12} strokeWidth={2.2} />
                    </span>
                    <span className="flex-1 leading-tight">{item.label}</span>
                    <GripVertical size={11} className="text-ink/20" />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
