export const SCORE_CATEGORIES = [
  "functionality",
  "scalability",
  "database_design",
  "performance",
  "security",
  "reliability",
  "cost_awareness",
  "design_reasoning",
];

function describeTopology(nodes, edges) {
  if (!nodes.length) return "No components placed.";
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const lines = [];
  for (const edge of edges) {
    const src = nodeMap[edge.source];
    const tgt = nodeMap[edge.target];
    if (src && tgt)
      lines.push(`  ${src.label} (${src.type}) -> ${tgt.label} (${tgt.type})`);
  }
  const isolated = nodes.filter(
    (n) => !edges.some((e) => e.source === n.id || e.target === n.id)
  );
  if (lines.length) lines.unshift("Connected components:");
  if (isolated.length) {
    lines.push("Unconnected components:");
    isolated.forEach((n) => lines.push(`  ${n.label} (${n.type})`));
  }
  return lines.join("\n") || "Components placed but not connected.";
}

export function buildPrompt(blueprint) {
  const { challengeTitle, nodes = [], edges = [], reasoning = "" } = blueprint;
  const topology = describeTopology(nodes, edges);
  const nodeTypes = [...new Set(nodes.map((n) => n.type))].join(", ") || "none";
  const hasReason = reasoning.trim().length > 30;

  return `You are a senior principal engineer with 15 years of experience at Google, Amazon, and Netflix. You are conducting a system design interview and have just received a candidate's architecture submission. Be honest but constructive — don't pad scores, explain how to improve.
  
  ## Challenge
  The candidate was asked to: **${challengeTitle}**
  
  ## Their Architecture (from drag-and-drop diagram)
  ${topology}
  
  Component types used: ${nodeTypes}
  Total components: ${nodes.length}
  Total connections: ${edges.length}
  
  ## Candidate's Written Reasoning
  ${hasReason ? reasoning : "(No reasoning provided.)"}
  
  ---
  
  Evaluate this design. Be specific — reference the actual components they used or missed. Identify concrete gaps.
  
  Respond with ONLY valid JSON, no markdown fences:
  
  {
    "overallScore": <integer 0-100>,
    "overallVerdict": "<2-3 sentence honest summary>",
    "scores": {
      "functionality":    { "score": <0-10>, "comment": "<1-2 sentences>" },
      "scalability":      { "score": <0-10>, "comment": "<1-2 sentences>" },
      "database_design":  { "score": <0-10>, "comment": "<1-2 sentences>" },
      "performance":      { "score": <0-10>, "comment": "<1-2 sentences>" },
      "security":         { "score": <0-10>, "comment": "<1-2 sentences>" },
      "reliability":      { "score": <0-10>, "comment": "<1-2 sentences>" },
      "cost_awareness":   { "score": <0-10>, "comment": "<1-2 sentences>" },
      "design_reasoning": { "score": <0-10>, "comment": "<1-2 sentences>" }
    },
    "strengths":  ["<strength 1>", "<strength 2>"],
    "bottlenecks": ["<bottleneck 1>", "<bottleneck 2>"],
    "improvements": [
      { "title": "<short title>", "detail": "<1-2 sentences>" },
      { "title": "<short title>", "detail": "<1-2 sentences>" }
    ],
    "followUpQuestions": ["<question 1>", "<question 2>", "<question 3>"],
    "reviewerPersona": "Principal Engineer"
  }`;
}
