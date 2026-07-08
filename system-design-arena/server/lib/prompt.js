/**
 * Converts the blueprint JSON from the frontend into a prompt that makes
 * the LLM behave like a principal engineer doing a system design interview.
 */

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
  const hasReasoning = reasoning.trim().length > 30;

  return `You are a senior principal engineer with 15 years of experience at companies like Google, Amazon, and Netflix. You are conducting a system design interview and have just received a candidate's architecture submission. You speak honestly but constructively.
  
  ## Challenge
  The candidate was asked to: **${challengeTitle}**
  
  ## Their Architecture (inferred from drag-and-drop diagram)
  ${topology}
  
  Component types used: ${nodeTypes}
  Total components: ${nodes.length}
  Total connections: ${edges.length}
  
  ## Candidate's Written Reasoning
  ${
    hasReasoning
      ? reasoning
      : "(No reasoning provided — the candidate did not explain their choices.)"
  }
  
  ---
  
  Evaluate this design as a system design interviewer. Be specific, reference the actual components they used or did not use, and identify concrete gaps.
  
  Respond with ONLY a valid JSON object — no markdown fences, no preamble:
  
  {
    "overallScore": <integer 0-100>,
    "overallVerdict": "<2-3 sentence honest summary>",
    "scores": {
      "functionality":     { "score": <0-10>, "comment": "<1-2 sentences>" },
      "scalability":       { "score": <0-10>, "comment": "<1-2 sentences>" },
      "database_design":   { "score": <0-10>, "comment": "<1-2 sentences>" },
      "performance":       { "score": <0-10>, "comment": "<1-2 sentences>" },
      "security":          { "score": <0-10>, "comment": "<1-2 sentences>" },
      "reliability":       { "score": <0-10>, "comment": "<1-2 sentences>" },
      "cost_awareness":    { "score": <0-10>, "comment": "<1-2 sentences>" },
      "design_reasoning":  { "score": <0-10>, "comment": "<1-2 sentences>" }
    },
    "strengths":  ["<specific strength 1>", "<specific strength 2>"],
    "bottlenecks": ["<specific bottleneck 1>", "<specific bottleneck 2>"],
    "improvements": [
      { "title": "<short title>", "detail": "<1-2 sentence explanation>" },
      { "title": "<short title>", "detail": "<1-2 sentence explanation>" }
    ],
    "followUpQuestions": [
      "<interview follow-up question 1>",
      "<interview follow-up question 2>",
      "<interview follow-up question 3>"
    ],
    "reviewerPersona": "Principal Engineer"
  }`;
}
