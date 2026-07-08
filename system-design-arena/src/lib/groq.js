import { buildPrompt } from "./prompt.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";


const API_KEY =
  import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;

export async function getReview(blueprint) {
  if (!API_KEY) return buildMockReview(blueprint);

  const prompt = buildPrompt(blueprint);

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";
  const clean = raw
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("AI returned invalid JSON — try again.");
  }
}

// Used when no API key is set. Gives realistic output so the UI is always usable.

function buildMockReview(blueprint) {
  const { challengeTitle = "Unknown", nodes = [], edges = [] } = blueprint;
  const hasDB = nodes.some((n) => n.type === "database");
  const hasCache = nodes.some((n) => n.type === "cache");
  const hasLB = nodes.some((n) => n.type === "load-balancer");
  const hasQueue = nodes.some((n) => n.type === "queue");
  const hasGW = nodes.some((n) => n.type === "api-gateway");

  return {
    overallScore: 54,
    overallVerdict: `The candidate put together a starting architecture for "${challengeTitle}" with ${nodes.length} components and ${edges.length} connections. The core request path is present, but several production concerns — fault tolerance, data partitioning, and security boundaries — are missing or underspecified.`,
    scores: {
      functionality: {
        score: 7,
        comment:
          "Core happy path is represented. Edge cases and failure modes are not addressed.",
      },
      scalability: {
        score: hasLB ? 6 : 3,
        comment: hasLB
          ? "Load balancer present but no horizontal scaling or auto-scaling policy specified."
          : "No load balancer — a single server is a hard ceiling on throughput.",
      },
      database_design: {
        score: hasDB ? 5 : 2,
        comment: hasDB
          ? "Database present but no indexing, replication, or sharding strategy discussed."
          : "No persistent storage — data would be lost on restart.",
      },
      performance: {
        score: hasCache ? 6 : 4,
        comment: hasCache
          ? "Caching layer is a good instinct. Cache invalidation strategy not addressed."
          : "No caching — every read hits the database directly, which will bottleneck at scale.",
      },
      security: {
        score: hasGW ? 6 : 4,
        comment: hasGW
          ? "API gateway is a good place for auth. Make sure JWT validation happens there."
          : "No API gateway or auth service — the entry point is unauthenticated.",
      },
      reliability: {
        score: hasQueue ? 6 : 3,
        comment: hasQueue
          ? "Queue decouples services well. Add dead-letter queues and retry policies."
          : "No async patterns — synchronous coupling means one slow downstream takes down the whole system.",
      },
      cost_awareness: {
        score: 4,
        comment:
          "No discussion of instance sizing, data transfer costs, or reserved vs on-demand capacity.",
      },
      design_reasoning: {
        score: 5,
        comment:
          "Written reasoning present but lacks specific trade-off analysis.",
      },
    },
    strengths: [
      nodes.length > 3
        ? "Multiple distinct layers show awareness of separation of concerns."
        : "Basic client-server pattern is correctly captured.",
      edges.length > 2
        ? "Connection topology shows understanding of request flow."
        : "Starting point for a more complete architecture is in place.",
    ],
    bottlenecks: [
      hasLB
        ? "Load balancer present but no sticky sessions or consistent hashing for stateful services."
        : "Single server is a single point of failure — add a load balancer and replicas.",
      hasDB
        ? "Single database is a write bottleneck — add read replicas and a sharding strategy."
        : "No database means state is not persisted — add a primary DB with read replicas.",
    ],
    improvements: [
      {
        title: "Add a read replica",
        detail:
          "Separate read/write traffic onto primary + replica pair. This doubles read throughput with minimal added complexity.",
      },
      {
        title: "Introduce a CDN",
        detail:
          "Serve static assets from a CDN edge node — cuts p95 latency by ~60% and reduces origin load significantly.",
      },
      {
        title: "Define your auth boundary",
        detail:
          "Add an API gateway that validates JWTs before traffic reaches your services. Right now the entry point is wide open.",
      },
    ],
    followUpQuestions: [
      `How would you handle a database failure mid-request in your ${challengeTitle} design?`,
      "Walk me through what happens when traffic spikes 10x in five minutes — which component fails first?",
      "If you had to shard your database, what key would you use and what are the trade-offs?",
    ],
    reviewerPersona: "Principal Engineer",
    isMock: true,
  };
}
