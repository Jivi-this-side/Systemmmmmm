import { buildPrompt } from "./prompt.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile gives the best instruction-following for JSON output on Groq free tier
const MODEL = "llama-3.3-70b-versatile";

export async function getReview(blueprint) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    // Return a mock scorecard so the frontend is usable without a real key
    return buildMockReview(blueprint);
  }

  const prompt = buildPrompt(blueprint);

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? "{}";

  // Strip any accidental markdown fences before parsing
  const clean = raw
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("AI returned invalid JSON: " + raw.slice(0, 200));
  }
}

// ------------------------------------------------------------------
// Mock scorecard used when no API key is configured.
// Gives the frontend team something real to work with during development.
// ------------------------------------------------------------------
function buildMockReview(blueprint) {
  const { challengeTitle = "Unknown", nodes = [], edges = [] } = blueprint;
  const hasDB = nodes.some((n) => n.type === "database");
  const hasCache = nodes.some((n) => n.type === "cache");
  const hasLB = nodes.some((n) => n.type === "load-balancer");
  const hasQueue = nodes.some((n) => n.type === "queue");

  return {
    overallScore: 54,
    overallVerdict: `The candidate put together a basic architecture for "${challengeTitle}" with ${nodes.length} components and ${edges.length} connections. The core request path is present, but several critical production concerns — fault tolerance, data partitioning, and security boundaries — are missing or underspecified. This design would pass a junior screening but needs significant depth for a senior role.`,
    scores: {
      functionality: {
        score: 7,
        comment:
          "Core happy path is represented. Edge cases and failure modes are not addressed.",
      },
      scalability: {
        score: hasLB ? 6 : 3,
        comment: hasLB
          ? "A load balancer is present, but no horizontal scaling strategy or auto-scaling policy is specified."
          : "No load balancer — a single server is a hard ceiling on throughput.",
      },
      database_design: {
        score: hasDB ? 5 : 2,
        comment: hasDB
          ? "Database is present but no discussion of indexing, replication, or read replicas."
          : "No persistent storage in the diagram — data would be lost on restart.",
      },
      performance: {
        score: hasCache ? 6 : 4,
        comment: hasCache
          ? "Caching layer is a good instinct. Cache invalidation strategy is not addressed."
          : "No caching — every read hits the database directly, which will bottleneck at scale.",
      },
      security: {
        score: 4,
        comment:
          "No API gateway or auth service visible. Authentication, authorization, and TLS termination are unaccounted for.",
      },
      reliability: {
        score: hasQueue ? 6 : 3,
        comment: hasQueue
          ? "Queue is a good pattern for decoupling. No mention of dead-letter queues or retry policies."
          : "No queuing or async patterns — synchronous coupling means one slow downstream takes down the whole system.",
      },
      cost_awareness: {
        score: 4,
        comment:
          "No discussion of data transfer costs, instance sizing, or reserved vs on-demand capacity.",
      },
      design_reasoning: {
        score: 5,
        comment:
          "Written reasoning is present but lacks specific trade-off analysis and alternatives considered.",
      },
    },
    strengths: [
      nodes.length > 3
        ? "Multiple distinct layers are represented, showing awareness of separation of concerns."
        : "The basic client-server pattern is correctly captured.",
      edges.length > 2
        ? "The connection topology shows understanding of request flow through the system."
        : "Starting point for a more complete architecture is in place.",
    ],
    bottlenecks: [
      hasLB
        ? "Load balancer present but no mention of sticky sessions or consistent hashing for stateful services."
        : "Single server is a single point of failure and throughput ceiling — add a load balancer and multiple replicas.",
      hasDB
        ? "Single database node is a write bottleneck — consider read replicas and a sharding strategy for high-traffic scenarios."
        : "No database means state is not persisted. Add a primary DB with read replicas at minimum.",
    ],
    improvements: [
      {
        title: "Add a read replica",
        detail:
          "Separate read and write traffic onto a primary + replica pair. This doubles read throughput with minimal added complexity.",
      },
      {
        title: "Introduce a CDN for static assets",
        detail:
          "Any user-facing media or JS bundles should be served from a CDN edge node, not your origin servers — this alone can cut p95 latency by 60%.",
      },
      {
        title: "Define your auth boundary",
        detail:
          "Add an API gateway or auth service that validates JWTs before traffic reaches your microservices. Right now the entry point is unauthenticated.",
      },
    ],
    followUpQuestions: [
      `How would you handle a database failure mid-request in your ${challengeTitle.toLowerCase()} design?`,
      "Walk me through what happens when traffic spikes 10x in the next five minutes — which component fails first and why?",
      "If you had to shard your database, what key would you shard on and what are the trade-offs of that choice?",
    ],
    reviewerPersona: "Principal Engineer",
    isMock: true,
  };
}
