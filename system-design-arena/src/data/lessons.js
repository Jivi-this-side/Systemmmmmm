export const CHAPTERS = [
  { id: "classical", label: "Classical Systems", color: "#2c4fc4" },
  { id: "ai", label: "AI & MCP Systems", color: "#c47a1c" },
];

export const LESSONS = [
  // ── CHAPTER 1: Classical Systems ─────────────────────────────────────────
  {
    id: "client-server",
    chapter: "classical",
    eyebrow: "Lesson 1 · The basics",
    title: "Client & Server",
    body: "Every system starts here: a client sends a request and a server responds. Everything else — load balancers, caches, queues — exists to make this exchange faster, more reliable, and able to handle millions of clients simultaneously.",
    keyInsight:
      "The client-server model is the foundation. Scale problems are just this pattern repeated under pressure.",
    companies: [
      "Every web app on the internet",
      "Early-stage startups before scale problems appear",
      "Internal tools and admin dashboards",
    ],
    pros: [
      "Simple to reason about",
      "Easy to debug — one request, one response",
      "Cheap to start — one server handles thousands of users",
    ],
    cons: [
      "Single point of failure",
      "Hard ceiling on throughput",
      "Latency grows with distance between client and server",
    ],
    interviewQuestions: [
      "What happens when the server goes down?",
      "How do you handle 10x traffic overnight?",
      "Where would you add the first layer of optimization?",
    ],
    diagram: {
      type: "chain",
      nodes: [
        { icon: "Smartphone", label: "Client" },
        { icon: "Server", label: "Server" },
      ],
    },
  },
  {
    id: "load-balancer",
    chapter: "classical",
    eyebrow: "Lesson 2 · Distributing traffic",
    title: "Load Balancer",
    body: "A load balancer distributes incoming requests across a pool of servers so no single machine gets overwhelmed. It also enables horizontal scaling — adding more servers handles more load. Common strategies: round-robin, least-connections, IP-hash for sticky sessions.",
    keyInsight:
      "The load balancer is the reason 'add more servers' actually works. Without it, adding servers does nothing.",
    companies: [
      "Netflix uses AWS ALB + custom L7 routing",
      "Cloudflare uses anycast for global load balancing",
      "Google uses Maglev — a custom software load balancer handling millions of RPS",
    ],
    pros: [
      "Eliminates single point of failure",
      "Enables horizontal scaling",
      "Health checks auto-remove dead servers",
    ],
    cons: [
      "Becomes a bottleneck if not scaled itself",
      "Sticky sessions complicate stateless design",
      "SSL termination adds CPU cost",
    ],
    interviewQuestions: [
      "How do you maintain user sessions with multiple servers?",
      "What is the difference between L4 and L7 load balancing?",
      "How do you health-check backend servers?",
    ],
    diagram: {
      type: "fanout",
      source: { icon: "Smartphone", label: "Client" },
      hub: { icon: "Scale", label: "Load Balancer" },
      targets: [
        { icon: "Server", label: "Server A" },
        { icon: "Server", label: "Server B" },
        { icon: "Server", label: "Server C" },
      ],
      highlightColor: "#d2401f",
    },
  },
  {
    id: "api-gateway",
    chapter: "classical",
    eyebrow: "Lesson 3 · Single front door",
    title: "API Gateway",
    body: "An API gateway is the single entry point for all client requests. It routes to the right microservice, handles authentication, rate limiting, request transformation, and logging — so each service doesn't need to implement these itself.",
    keyInsight:
      "The API gateway is where cross-cutting concerns live. Auth, rate limiting, and logging belong here, not in every service.",
    companies: [
      "Amazon API Gateway serves AWS customers",
      "Stripe uses Kong as their gateway",
      "Netflix Zuul routes 2B+ requests/day",
    ],
    pros: [
      "Centralizes auth and rate limiting",
      "Decouples clients from internal service topology",
      "Single place for logging and metrics",
    ],
    cons: [
      "New latency hop on every request",
      "Can become a bottleneck",
      "Complex configuration for large systems",
    ],
    interviewQuestions: [
      "How do you handle versioning across multiple API versions?",
      "What is the difference between an API gateway and a load balancer?",
      "How would you rate-limit per user, per plan?",
    ],
    diagram: {
      type: "fanout",
      source: { icon: "Smartphone", label: "Client" },
      hub: { icon: "Shield", label: "API Gateway" },
      targets: [
        { icon: "User", label: "Users" },
        { icon: "CreditCard", label: "Billing" },
        { icon: "Bell", label: "Notify" },
      ],
      highlightColor: "#2c4fc4",
    },
  },
  {
    id: "database",
    chapter: "classical",
    eyebrow: "Lesson 4 · Where state lives",
    title: "Databases",
    body: "Databases persist state beyond the lifetime of a request. SQL databases (PostgreSQL, MySQL) give you ACID transactions and strong consistency. NoSQL (MongoDB, Cassandra) trade consistency for scale and flexibility. The wrong choice here is expensive to fix.",
    keyInsight:
      "Pick SQL by default. Only choose NoSQL if you have a specific reason: document flexibility, massive write scale, or wide-column access patterns.",
    companies: [
      "Instagram uses PostgreSQL for its core data",
      "Discord switched from Cassandra to ScyllaDB for messages",
      "Airbnb runs on MySQL with read replicas",
    ],
    pros: [
      "Durable storage that survives restarts",
      "SQL gives ACID guarantees for free",
      "Rich query capabilities",
    ],
    cons: [
      "Single write node is a hard ceiling",
      "Migrations on large tables are painful",
      "N+1 query problems at scale",
    ],
    interviewQuestions: [
      "When would you choose NoSQL over SQL?",
      "How do you handle database migrations without downtime?",
      "Explain the difference between read replicas and sharding.",
    ],
    diagram: {
      type: "chain",
      nodes: [
        { icon: "Server", label: "Service" },
        { icon: "Database", label: "Database" },
      ],
      labels: ["read / write"],
    },
  },
  {
    id: "cache",
    chapter: "classical",
    eyebrow: "Lesson 5 · Speed vs. freshness",
    title: "Caching",
    body: "A cache stores the results of expensive operations in fast memory so they don't need to be recomputed. Cache-aside (read through cache, fall back to DB) is the most common pattern. The hardest problem is cache invalidation — knowing when to evict stale data.",
    keyInsight:
      "There are only two hard things in CS: cache invalidation and naming things. Cache invalidation is hard because your cache and database can disagree about the truth.",
    companies: [
      "Twitter caches timelines in Redis — generating them fresh would take seconds",
      "Facebook uses Memcached at 700TB+ scale",
      "GitHub caches Git objects in Redis for fast diffs",
    ],
    pros: [
      "Dramatically reduces database load",
      "Sub-millisecond response for hot data",
      "Absorbs read traffic spikes",
    ],
    cons: [
      "Cache invalidation is hard to get right",
      "Cache stampede when many requests miss simultaneously",
      "Memory is finite — eviction policy matters",
    ],
    interviewQuestions: [
      "How do you handle a cache stampede?",
      "What is the difference between write-through and write-back caching?",
      "When would you NOT cache something?",
    ],
    diagram: {
      type: "compare",
      source: { icon: "Server", label: "Service" },
      topTarget: {
        icon: "Zap",
        label: "Cache",
        resultLabel: "hit · ~1ms",
        color: "#3d8361",
        soft: "#dcefe5",
      },
      bottomTarget: {
        icon: "Database",
        label: "Database",
        resultLabel: "miss · ~80ms",
        color: "#d2401f",
        soft: "#fbe2da",
      },
    },
  },
  {
    id: "queue",
    chapter: "classical",
    eyebrow: "Lesson 6 · Decoupling work",
    title: "Message Queues",
    body: "A queue decouples the service that creates work (producer) from the service that does it (consumer). The producer drops a message and moves on immediately. Consumers process at their own pace. This absorbs traffic spikes, enables retries, and prevents slow downstream services from blocking fast upstream ones.",
    keyInsight:
      "Queues turn synchronous tight-coupling into asynchronous loose-coupling. If service B going down shouldn't break service A, put a queue between them.",
    companies: [
      "Uber uses Kafka to process 4 trillion messages/day for real-time matching",
      "LinkedIn invented Kafka — still uses it for 7 trillion messages/day",
      "Robinhood uses Kafka for every trade event",
    ],
    pros: [
      "Absorbs traffic spikes via buffering",
      "Decouples producer and consumer speeds",
      "Built-in retry and dead-letter queue support",
    ],
    cons: [
      "Adds operational complexity",
      "Message ordering is hard at scale",
      "Duplicate delivery requires idempotent consumers",
    ],
    interviewQuestions: [
      "How do you guarantee exactly-once message processing?",
      "What is a dead-letter queue and when do you need one?",
      "Kafka vs RabbitMQ — when to use which?",
    ],
    diagram: {
      type: "stack",
      producer: { icon: "Server", label: "Producer" },
      queueLabel: "Queue",
      consumer: { icon: "Cog", label: "Consumer" },
    },
  },
  {
    id: "cdn",
    chapter: "classical",
    eyebrow: "Lesson 7 · Distance is latency",
    title: "CDN",
    body: "A CDN (Content Delivery Network) caches static assets — images, videos, JS bundles — on edge servers distributed globally, close to users. A request to a server on the other side of the world adds 150ms+ of latency from physics alone. A nearby edge node cuts that to <20ms.",
    keyInsight:
      "The speed of light is not optional. CDNs win by placing content close to users — the only way to beat physics.",
    companies: [
      "Netflix serves 15% of global internet traffic via its Open Connect CDN",
      "Cloudflare CDN serves 20M+ websites from 285 cities",
      "Amazon CloudFront caches S3 content globally for AWS customers",
    ],
    pros: [
      "Dramatically reduces origin server load",
      "Near-instant delivery of static assets",
      "Built-in DDoS protection at the edge",
    ],
    cons: [
      "Cached content can be stale during propagation",
      "Cache invalidation across edge nodes is slow",
      "Cost can be significant at very high traffic volumes",
    ],
    interviewQuestions: [
      "How do you handle CDN cache invalidation after a deploy?",
      "What types of content should NOT be cached on a CDN?",
      "How does a CDN help with DDoS mitigation?",
    ],
    diagram: {
      type: "compare",
      source: { icon: "Smartphone", label: "Client" },
      topTarget: {
        icon: "Globe",
        label: "Edge Node",
        resultLabel: "nearby · fast",
        color: "#3d8361",
        soft: "#dcefe5",
      },
      bottomTarget: {
        icon: "Server",
        label: "Origin Server",
        resultLabel: "far away · slow",
        color: "#d2401f",
        soft: "#fbe2da",
      },
    },
  },
  {
    id: "scalability",
    chapter: "classical",
    eyebrow: "Lesson 8 · Handling growth",
    title: "Scalability",
    body: "Scalability means handling more load by adding resources. Vertical scaling (bigger machine) has a ceiling and creates downtime. Horizontal scaling (more machines) is theoretically unlimited but requires stateless services and a load balancer. Design for horizontal from day one.",
    keyInsight:
      "The bottleneck is always somewhere. Scale one component and the bottleneck moves to the next. Profiling beats guessing.",
    companies: [
      "Discord scaled from 0 to 19M concurrent users in 6 years — horizontal scaling throughout",
      "WhatsApp handled 1B users with only 50 engineers by keeping systems simple",
      "Twitter struggled for years because its original architecture was not designed to scale",
    ],
    pros: [
      "Horizontal scaling handles theoretically unlimited load",
      "Multiple replicas provide redundancy",
      "Can scale individual services independently",
    ],
    cons: [
      "Stateful services are hard to scale horizontally",
      "Distributed systems have partial failures",
      "Coordination overhead grows with scale",
    ],
    interviewQuestions: [
      "How do you scale a stateful service?",
      "What makes a service easy or hard to scale horizontally?",
      "How do you find the bottleneck in a slow system?",
    ],
    diagram: { type: "scale", node: { icon: "Server", label: "Server" } },
  },
  {
    id: "reliability",
    chapter: "classical",
    eyebrow: "Lesson 9 · Design for failure",
    title: "Reliability",
    body: "Reliable systems assume components will fail and route around it automatically. Key patterns: health checks detect dead nodes, circuit breakers stop calling failing services, retries with exponential backoff handle transient errors, and standby replicas take over when primaries die.",
    keyInsight:
      "Availability = uptime / (uptime + downtime). Five 9s (99.999%) allows 5 minutes of downtime per year. Every unplanned dependency reduces your availability.",
    companies: [
      "AWS builds for failure — multiple AZs, automatic failover, SQS for decoupling",
      "Netflix Chaos Monkey randomly kills production servers to force reliability improvements",
      "Google SRE invented the concept of error budgets to balance reliability and velocity",
    ],
    pros: [
      "Automatic recovery without human intervention",
      "Graceful degradation instead of total failure",
      "Higher confidence in deployment and change",
    ],
    cons: [
      "Circuit breakers add complexity and false-positives",
      "Retry storms can amplify load on a recovering service",
      "Testing failure modes in production is risky",
    ],
    interviewQuestions: [
      "What is a circuit breaker and when do you open it?",
      "How do you design a system with 99.99% availability?",
      "What is the difference between fault tolerance and high availability?",
    ],
    diagram: {
      type: "failover",
      source: { icon: "Smartphone", label: "Client" },
      primary: { icon: "Server", label: "Primary" },
      standby: { icon: "Server", label: "Standby" },
    },
  },
  {
    id: "microservices",
    chapter: "classical",
    eyebrow: "Lesson 10 · Breaking it apart",
    title: "Microservices",
    body: "Microservices decompose a large application into small, independent services each owning a specific domain. Each service has its own database, deploys independently, and communicates over APIs or queues. The tradeoff: operational complexity increases dramatically, but each service can scale, fail, and be developed independently.",
    keyInsight:
      "Microservices are an organizational solution as much as a technical one. Conway's Law: systems mirror the communication structures of teams that build them.",
    companies: [
      "Amazon decomposed their monolith into microservices in 2002 — Bezos mandated it",
      "Netflix runs 700+ microservices in production",
      "Uber moved from a monolith to 2000+ microservices — then consolidated back to ~200",
    ],
    pros: [
      "Independent deployment reduces risk per deploy",
      "Services can use different tech stacks",
      "Failure in one service does not cascade (with circuit breakers)",
    ],
    cons: [
      "Distributed tracing is hard",
      "Network calls replace in-process function calls — 1000x slower",
      "Data consistency across service boundaries requires eventual consistency patterns",
    ],
    interviewQuestions: [
      "How do you handle a transaction that spans multiple microservices?",
      "What is the Saga pattern and when do you use it?",
      "When should you NOT use microservices?",
    ],
    diagram: {
      type: "cluster",
      nodes: [
        { icon: "User", label: "Users" },
        { icon: "Package", label: "Orders" },
        { icon: "CreditCard", label: "Payments" },
      ],
    },
  },

  // ── CHAPTER 2: Modern AI & MCP Systems ───────────────────────────────────
  {
    id: "intro-ai",
    chapter: "ai",
    eyebrow: "Lesson 1 · The new paradigm",
    title: "Introduction to AI Systems",
    body: "AI systems are software applications where the core logic is implemented by a machine learning model rather than explicit code. You describe what you want (a prompt, a training set), and the model learns the behavior. This shifts engineering effort from writing logic to curating data, writing prompts, and evaluating outputs.",
    keyInsight:
      "Traditional software: if X then Y. AI software: given examples of X→Y, the model learns the rule. The code is no longer the logic — the model is.",
    companies: [
      "GitHub Copilot: LLM autocompletes your code as you type",
      "Notion AI: LLM drafts and edits documents in-product",
      "Perplexity: LLM + retrieval answers questions with citations",
    ],
    pros: [
      "Handles tasks too complex for explicit rules",
      "Generalizes to new inputs without reprogramming",
      "Can match or exceed human performance on specific tasks",
    ],
    cons: [
      "Outputs are probabilistic — not deterministic",
      "Hallucinations are a fundamental challenge",
      "Hard to debug and audit decision-making",
    ],
    interviewQuestions: [
      "What is the difference between a rule-based system and an AI system?",
      "How do you test an AI system when outputs are non-deterministic?",
      "What new failure modes does an AI system introduce vs a traditional app?",
    ],
    diagram: {
      type: "chain",
      nodes: [
        { icon: "FileText", label: "Prompt" },
        { icon: "BrainCircuit", label: "LLM" },
        { icon: "MessageSquare", label: "Response" },
      ],
    },
  },
  {
    id: "llm-api",
    chapter: "ai",
    eyebrow: "Lesson 2 · The new compute primitive",
    title: "LLM APIs",
    body: "A Large Language Model API lets you call an AI model over HTTP. You send a prompt (text), and get a completion (text). Models like GPT-4, Claude, and Gemini are pre-trained on trillions of tokens — you get this capability without training anything. The LLM API is now the compute primitive of AI apps the way a database was for web apps.",
    keyInsight:
      "You don't deploy the model — you call it like an API. The challenge shifts from 'how do I train this' to 'how do I prompt, chain, and evaluate this'.",
    companies: [
      "OpenAI GPT-4: most widely used LLM API",
      "Anthropic Claude: used heavily in coding and reasoning tasks",
      "Google Gemini: multimodal, tightly integrated with Google products",
    ],
    pros: [
      "No infrastructure to manage — just HTTP calls",
      "State-of-the-art capability for zero ML expertise",
      "Pay per token — cost scales with usage",
    ],
    cons: [
      "Latency is high (1-30s) vs traditional APIs (<100ms)",
      "Token costs add up quickly at scale",
      "No control over model updates or deprecations",
    ],
    interviewQuestions: [
      "How do you handle LLM latency in a user-facing product?",
      "How do you control costs when LLM calls are expensive per token?",
      "What do you do when the LLM API goes down?",
    ],
    diagram: {
      type: "llm",
      nodes: [
        { icon: "Smartphone", label: "User" },
        { icon: "BrainCircuit", label: "LLM API" },
        { icon: "MessageSquare", label: "Response" },
      ],
    },
  },
  {
    id: "prompt-engineering",
    chapter: "ai",
    eyebrow: "Lesson 3 · Programming with words",
    title: "Prompt Engineering",
    body: "Prompt engineering is the practice of crafting inputs that reliably produce good outputs from an LLM. A system prompt defines the model's role and constraints. Few-shot examples show it the desired pattern. Chain-of-thought prompting ('think step by step') dramatically improves reasoning. The prompt is your program — treat it like code.",
    keyInsight:
      "A bad prompt to a great model produces bad output. A great prompt to a good model often beats a bad prompt to a great model. Prompting skill compounds.",
    companies: [
      "Anthropic publishes a detailed prompt engineering guide for Claude",
      "OpenAI uses meta-prompting to generate better prompts automatically",
      "Cursor uses carefully crafted system prompts to keep code suggestions in context",
    ],
    pros: [
      "No training required — immediate iteration",
      "Few-shot examples dramatically improve quality",
      "System prompts give consistent persona and constraints",
    ],
    cons: [
      "Prompts are fragile — small changes can break behavior",
      "Hard to version and test like normal code",
      "Model updates can break existing prompts silently",
    ],
    interviewQuestions: [
      "How do you version and test prompts across model updates?",
      "What is chain-of-thought prompting and when does it help?",
      "How do you prevent prompt injection attacks?",
    ],
    diagram: {
      type: "chain",
      nodes: [
        { icon: "FileText", label: "System Prompt" },
        { icon: "BrainCircuit", label: "LLM" },
        { icon: "CheckCircle2", label: "Consistent Output" },
      ],
    },
  },
  {
    id: "embeddings",
    chapter: "ai",
    eyebrow: "Lesson 4 · Meaning as numbers",
    title: "Embeddings",
    body: "An embedding model converts text into a dense vector — an array of floating point numbers (e.g. 1536 floats) that encodes semantic meaning. Similar texts produce similar vectors. This enables semantic search: find content by meaning, not just keywords. 'I want food' and 'I am hungry' are very close in embedding space even though they share no words.",
    keyInsight:
      "Embeddings transform the problem of 'finding similar meaning' into the mathematical problem of 'finding nearby points in space' — which computers can solve very fast.",
    companies: [
      "OpenAI text-embedding-3 is the most widely deployed embedding model",
      "Cohere offers multilingual embeddings for global search",
      "Google uses embeddings in Search to match intent, not just keywords",
    ],
    pros: [
      "Captures semantic similarity, not just lexical",
      "Language-agnostic — same vector space across languages",
      "One embedding per document — computed once, searched many times",
    ],
    cons: [
      "Vectors are opaque — hard to interpret why two things are similar",
      "Embedding quality depends heavily on the model and training data",
      "Updating embeddings when documents change requires recomputation",
    ],
    interviewQuestions: [
      "How do you update embeddings when source documents are edited?",
      "What is the tradeoff between embedding dimensionality and search speed?",
      "How would you embed multi-modal content (text + images)?",
    ],
    diagram: {
      type: "embed",
      source: { icon: "FileText", label: "Text" },
      model: { icon: "BrainCircuit", label: "Embed Model" },
      output: { icon: "BarChart2", label: "Vector [1536d]" },
    },
  },
  {
    id: "vector-db",
    chapter: "ai",
    eyebrow: "Lesson 5 · Searching by meaning",
    title: "Vector Databases",
    body: "A vector database stores embeddings and finds the most similar ones to a query vector in milliseconds — even across millions of documents. Under the hood, algorithms like HNSW (Hierarchical Navigable Small World) approximate nearest-neighbor search without scanning every record. Popular options: Pinecone, Weaviate, Qdrant, and pgvector.",
    keyInsight:
      "A vector database is to semantic search what an index is to SQL. Without it, finding similar embeddings requires scanning every vector — O(n) becomes milliseconds vs minutes.",
    companies: [
      "Notion uses Pinecone to power AI-based doc search",
      "GitHub Copilot uses a vector DB to find relevant code context",
      "Spotify uses vector search to find similar songs for recommendations",
    ],
    pros: [
      "Sub-50ms similarity search across millions of vectors",
      "Supports metadata filtering alongside vector search",
      "Handles billion-scale datasets with the right configuration",
    ],
    cons: [
      "ANN (approximate) search has a recall tradeoff — not always exact",
      "Index building takes time and memory",
      "Adding new vectors incrementally can degrade index quality over time",
    ],
    interviewQuestions: [
      "What is the difference between exact and approximate nearest-neighbor search?",
      "How do you handle updates and deletions in a vector database?",
      "When would you use pgvector vs a dedicated vector database?",
    ],
    diagram: {
      type: "compare",
      source: { icon: "Search", label: "Query" },
      topTarget: {
        icon: "Layers",
        label: "Vector DB",
        resultLabel: "semantic · fast",
        color: "#3d8361",
        soft: "#dcefe5",
      },
      bottomTarget: {
        icon: "Database",
        label: "SQL LIKE %",
        resultLabel: "keyword · misses",
        color: "#d2401f",
        soft: "#fbe2da",
      },
    },
  },
  {
    id: "rag",
    chapter: "ai",
    eyebrow: "Lesson 6 · Grounding LLMs in facts",
    title: "Retrieval-Augmented Generation",
    body: "RAG fixes LLM hallucinations by grounding answers in real data. The pipeline: embed the user query → retrieve the top-k most similar documents from your vector DB → inject those documents as context into the LLM prompt → ask the LLM to answer based only on the retrieved context. The model reasons over your data, not just its weights.",
    keyInsight:
      "RAG = retrieval + generation. The retriever finds the relevant facts; the LLM formats and reasons over them. Neither alone is enough.",
    companies: [
      "Perplexity uses RAG to answer questions with real-time web search as the retrieval step",
      "Notion AI uses RAG to answer questions about your workspace documents",
      "Slack AI uses RAG to summarize and search across your channel history",
    ],
    pros: [
      "No fine-tuning required — update knowledge by updating the document store",
      "Citations and source attribution are straightforward",
      "Reduces hallucination by constraining the model to retrieved context",
    ],
    cons: [
      "Retrieval quality is the ceiling — bad retrieval = bad answers regardless of LLM quality",
      "Long context windows are expensive — retrieving too many docs costs tokens",
      "Chunking strategy significantly impacts retrieval quality",
    ],
    interviewQuestions: [
      "How do you choose chunk size for RAG?",
      "What is hybrid search and when does it beat pure vector search?",
      "How do you evaluate RAG quality at scale?",
    ],
    diagram: {
      type: "rag",
      steps: [
        { icon: "Search", label: "Query" },
        { icon: "Layers", label: "Vector DB" },
        { icon: "FileText", label: "Context" },
        { icon: "BrainCircuit", label: "LLM" },
        { icon: "MessageSquare", label: "Answer" },
      ],
    },
  },
  {
    id: "ai-agents",
    chapter: "ai",
    eyebrow: "Lesson 7 · LLMs that take actions",
    title: "AI Agents",
    body: "An agent is an LLM in a loop: observe the environment → decide what action to take → execute the action (call a tool, read a file, search the web) → observe the result → repeat until the goal is done. The LLM is the reasoning engine; tools are how it affects the world. The ReAct framework (Reason + Act) is the standard pattern.",
    keyInsight:
      "The difference between an LLM and an agent: an LLM responds once. An agent acts repeatedly until a goal is achieved. Loops + tools = agency.",
    companies: [
      "Devin (Cognition) is an autonomous coding agent that can write and run code",
      "Cursor uses agents that can edit multiple files, run tests, and fix errors",
      "AutoGPT was the first widely popular autonomous agent framework",
    ],
    pros: [
      "Handles multi-step tasks that require reasoning and action",
      "Tools give the LLM access to real-time information and systems",
      "Can parallelize subtasks across multiple agent instances",
    ],
    cons: [
      "Errors compound — one bad decision can derail the whole task",
      "Hard to predict how many steps/tokens a task will take",
      "Requires careful tool design to prevent dangerous actions",
    ],
    interviewQuestions: [
      "How do you prevent an agent from taking destructive actions?",
      "How do you handle an agent that gets stuck in a loop?",
      "What is the difference between a ReAct agent and a plan-and-execute agent?",
    ],
    diagram: {
      type: "agentloop",
      steps: ["Observe", "Think", "Act", "Result"],
    },
  },
  {
    id: "tool-calling",
    chapter: "ai",
    eyebrow: "Lesson 8 · LLMs using APIs",
    title: "Tool Calling",
    body: "Tool calling (also called function calling) lets an LLM pause mid-response to invoke a function. You define the tools (name, description, parameters) and the model decides when to call which tool and with what arguments. The result comes back, and the model incorporates it into its next response. This turns LLMs from text generators into action-takers.",
    keyInsight:
      "Tools are how LLMs escape the prompt. Without tools, an LLM can only describe actions. With tools, it can perform them.",
    companies: [
      "OpenAI introduced function calling in GPT-4 — now standard across all major models",
      "Anthropic Claude supports tool use for agentic workflows",
      "LangChain built a whole ecosystem around tool-enabled LLM chains",
    ],
    pros: [
      "LLM self-selects the right tool based on the situation",
      "Structured outputs from tool calls are reliable vs free-form text parsing",
      "Enables real-time data access (weather, stock prices, databases)",
    ],
    cons: [
      "LLM can call the wrong tool or with wrong parameters",
      "Parallel tool calls increase latency when sequential",
      "Tool descriptions must be precise — ambiguity leads to misuse",
    ],
    interviewQuestions: [
      "How do you validate LLM tool call arguments before execution?",
      "How do you handle tool call failures gracefully?",
      "What is the maximum number of tools an LLM can effectively choose between?",
    ],
    diagram: {
      type: "toolcall",
      steps: [
        { icon: "BrainCircuit", label: "LLM" },
        { icon: "Wrench", label: "Tool Call" },
        { icon: "Cog", label: "Execution" },
        { icon: "BrainCircuit", label: "LLM + Result" },
      ],
    },
  },
  {
    id: "mcp",
    chapter: "ai",
    eyebrow: "Lesson 9 · Standard tool interface",
    title: "MCP (Model Context Protocol)",
    body: "MCP is an open standard (by Anthropic) for connecting AI models to external tools and data. Before MCP, every AI app built custom integrations for every service. MCP standardizes the interface: a host (your AI app) connects to MCP servers that expose tools, resources, and prompts. The LLM discovers available tools and calls them by name. Think USB-C for AI tools.",
    keyInsight:
      "MCP solves the N×M integration problem. N AI apps × M tools = N×M integrations. With MCP: N apps + M tools, all speaking the same protocol.",
    companies: [
      "Anthropic introduced MCP in Nov 2024 — adopted by Cursor, Cline, Claude Desktop",
      "Zapier built MCP servers for 5000+ apps",
      "GitHub has an official MCP server for repository operations",
    ],
    pros: [
      "One integration per tool, works with any MCP-compatible host",
      "Tools are discoverable at runtime — no hardcoding",
      "Security model: users grant access per server, per session",
    ],
    cons: [
      "MCP servers require hosting and maintenance",
      "Relatively new — ecosystem is still maturing",
      "Latency adds up when chaining many MCP tool calls",
    ],
    interviewQuestions: [
      "How does MCP differ from a traditional REST API integration?",
      "How do you handle authentication in MCP servers?",
      "How would you design an MCP server for a database?",
    ],
    diagram: {
      type: "mcp",
      client: { icon: "BrainCircuit", label: "LLM Host" },
      servers: [
        { icon: "Globe", label: "GitHub MCP" },
        { icon: "Database", label: "DB MCP" },
        { icon: "Globe", label: "Browser MCP" },
      ],
    },
  },
  {
    id: "multi-agent",
    chapter: "ai",
    eyebrow: "Lesson 10 · Divide and conquer",
    title: "Multi-Agent Systems",
    body: "Complex tasks benefit from specialization. A multi-agent system has an orchestrator that breaks a goal into subtasks, delegates each to a specialist agent, and assembles the results. Patterns: hierarchical (orchestrator → workers), peer-to-peer (agents collaborate), or pipeline (each agent's output feeds the next). Parallelism is the main win.",
    keyInsight:
      "Multi-agent systems are microservices for AI. Each agent specializes; the orchestrator coordinates. The tradeoff is the same: more powerful, but harder to debug.",
    companies: [
      "AutoGen (Microsoft) is the leading multi-agent framework",
      "ChatGPT's o3 uses a chain of reasoning agents for complex math",
      "Cognition Devin uses multiple specialized agents for different parts of a coding task",
    ],
    pros: [
      "Tasks execute in parallel — dramatically faster than sequential",
      "Specialist agents outperform generalist agents on focused tasks",
      "Failure in one agent does not necessarily fail the whole task",
    ],
    cons: [
      "Orchestration logic is complex — subtle bugs cascade",
      "Token costs multiply with agent count",
      "Debugging an incorrect final output requires tracing through all agents",
    ],
    interviewQuestions: [
      "How do you prevent agents from contradicting each other?",
      "How do you handle an agent in a multi-agent system that produces wrong output?",
      "When does a multi-agent system make things worse instead of better?",
    ],
    diagram: {
      type: "fanout",
      source: { icon: "BrainCircuit", label: "Orchestrator" },
      hub: { icon: "GitBranch", label: "Delegate" },
      targets: [
        { icon: "Search", label: "Researcher" },
        { icon: "Code2", label: "Coder" },
        { icon: "CheckCircle2", label: "Critic" },
      ],
      highlightColor: "#8a4fc4",
    },
  },
  {
    id: "memory",
    chapter: "ai",
    eyebrow: "Lesson 11 · What the agent remembers",
    title: "AI Memory",
    body: "Agents need memory across turns. In-context memory is the conversation in the current prompt — fast but limited by token count (16K–200K tokens). External memory persists to a database or vector store and is retrieved when relevant. Episodic memory stores past interactions. Semantic memory stores facts. Good agents combine all three.",
    keyInsight:
      "An LLM with no memory is a goldfish. Context window = short-term memory. Vector store = long-term memory. The skill is knowing what to keep and what to retrieve.",
    companies: [
      "ChatGPT Memory stores user preferences across conversations",
      "Mem.ai is built entirely around AI with persistent personal memory",
      "Character.ai uses memory to make characters remember past conversations",
    ],
    pros: [
      "Persistent memory enables truly personalized experiences",
      "External memory scales beyond any context window limit",
      "Summarization can compress episodic memory to save tokens",
    ],
    cons: [
      "Retrieving the wrong memories degrades quality worse than no retrieval",
      "Privacy concerns — stored memories can contain sensitive information",
      "Memory staleness — old memories can contradict current state",
    ],
    interviewQuestions: [
      "How do you decide what to store in long-term memory vs keep in context?",
      "How do you handle conflicting memories?",
      "How do you let users view and delete their stored memories?",
    ],
    diagram: {
      type: "compare",
      source: { icon: "BrainCircuit", label: "Agent" },
      topTarget: {
        icon: "MessageSquare",
        label: "Context Window",
        resultLabel: "fast · token-limited",
        color: "#2c4fc4",
        soft: "#dbe3fb",
      },
      bottomTarget: {
        icon: "Layers",
        label: "Vector Store",
        resultLabel: "unlimited · retrieved",
        color: "#3d8361",
        soft: "#dcefe5",
      },
    },
  },
  {
    id: "guardrails",
    chapter: "ai",
    eyebrow: "Lesson 12 · Safety by design",
    title: "AI Guardrails",
    body: "Guardrails prevent AI systems from producing harmful, incorrect, or off-brand outputs. Input guardrails screen prompts for injection attacks, off-topic requests, or policy violations before they reach the model. Output guardrails check responses for hallucinations, PII leakage, or harmful content before delivery. Both layers are required in production.",
    keyInsight:
      "Guardrails are not optional for production AI. Assume users will try to break your system. Input + output validation is the minimum viable safety layer.",
    companies: [
      "NeMo Guardrails (NVIDIA) is the most widely used open-source guardrails framework",
      "Anthropic builds Constitutional AI into Claude — model-level guardrails",
      "Lakera Guard detects and blocks prompt injections in real time",
    ],
    pros: [
      "Prevents reputation damage from harmful outputs",
      "Input guardrails catch prompt injections early",
      "Customizable to your specific use case and policies",
    ],
    cons: [
      "Every guardrail adds latency",
      "Overly strict guardrails frustrate legitimate users",
      "Adversarial users continually find new bypass techniques",
    ],
    interviewQuestions: [
      "How do you design guardrails that do not false-positive on legitimate requests?",
      "What is prompt injection and how do you prevent it?",
      "How do you evaluate guardrail effectiveness at scale?",
    ],
    diagram: {
      type: "guardrails",
      source: { icon: "Smartphone", label: "User" },
      inputCheck: { icon: "ShieldCheck", label: "Input Guard" },
      llm: { icon: "BrainCircuit", label: "LLM" },
      outputCheck: { icon: "ShieldCheck", label: "Output Guard" },
      output: { icon: "MessageSquare", label: "Response" },
    },
  },
  {
    id: "ai-evaluation",
    chapter: "ai",
    eyebrow: "Lesson 13 · Measuring quality",
    title: "AI Evaluation",
    body: "You cannot improve what you cannot measure. AI evaluation uses LLM-as-judge (ask a model to score outputs), golden datasets (curated question-answer pairs you know are correct), and human review. Evals catch regressions when you change prompts or upgrade models. Without evals, you are flying blind.",
    keyInsight:
      "Traditional software: tests pass or fail. AI software: outputs are probabilistic — you need statistical evaluation across many examples, not binary pass/fail.",
    companies: [
      "Braintrust is the leading eval platform for LLM applications",
      "Anthropic evaluates Claude on thousands of handcrafted test cases before every release",
      "OpenAI uses automated evals + red-teaming before deploying new models",
    ],
    pros: [
      "Catches regressions before they reach users",
      "LLM-as-judge scales to thousands of test cases cheaply",
      "Golden datasets provide ground truth for critical behaviors",
    ],
    cons: [
      "Creating high-quality golden datasets is expensive and slow",
      "LLM judges have their own biases and failure modes",
      "Eval coverage can never be complete — novel failures will occur",
    ],
    interviewQuestions: [
      "How do you evaluate a RAG system end-to-end?",
      "What metrics would you track for a customer support AI?",
      "How do you handle evaluation when ground truth is subjective?",
    ],
    diagram: {
      type: "chain",
      nodes: [
        { icon: "FileText", label: "Test Cases" },
        { icon: "BrainCircuit", label: "LLM Judge" },
        { icon: "BarChart2", label: "Score Report" },
      ],
    },
  },
  {
    id: "ai-observability",
    chapter: "ai",
    eyebrow: "Lesson 14 · Seeing what happens",
    title: "AI Observability",
    body: "AI observability means tracing, logging, and monitoring every LLM call in production. A single user request often involves multiple LLM calls, retrieval steps, and tool calls. You need to see the full trace: what was the prompt, what was the output, how long it took, how many tokens it used, and whether the output was flagged as problematic.",
    keyInsight:
      "In traditional software, logs tell you what happened. In AI systems, you also need to capture the prompt and output of every model call — that is where the logic lives.",
    companies: [
      "Langfuse is the leading open-source LLM observability platform",
      "Datadog added LLM observability as a first-class feature",
      "Helicone intercepts every OpenAI API call for logging and analytics",
    ],
    pros: [
      "Debugging production issues without traces is nearly impossible",
      "Cost visibility — token usage per user, per feature, per day",
      "Latency breakdown shows which step in a chain is slowest",
    ],
    cons: [
      "Storing full prompts and outputs is expensive at scale",
      "PII in prompts creates compliance risks in logs",
      "Traces alone do not tell you if the output was good",
    ],
    interviewQuestions: [
      "What would you log for every LLM API call?",
      "How do you detect when your AI system is degrading in production?",
      "How do you handle PII in LLM observability logs?",
    ],
    diagram: {
      type: "chain",
      nodes: [
        { icon: "BrainCircuit", label: "LLM Call" },
        { icon: "Activity", label: "Trace Store" },
        { icon: "BarChart2", label: "Dashboard" },
      ],
    },
  },
  {
    id: "ai-security",
    chapter: "ai",
    eyebrow: "Lesson 15 · Securing AI systems",
    title: "AI Security",
    body: "AI systems introduce new attack surfaces: prompt injection (malicious instructions hidden in user input or retrieved documents), model inversion (extracting training data), and indirect injection (documents that hijack an agent's behavior). Defense: validate all inputs, sandbox tool execution, use least-privilege for tool access, and monitor for anomalous behavior.",
    keyInsight:
      "Prompt injection is to AI what SQL injection is to databases. The model executes instructions in data. Never trust user-provided content in a prompt without sanitization.",
    companies: [
      "Bing Chat was compromised by prompt injection via web page content in its first week",
      "Simon Willison documented how AI agents can be hijacked via documents they read",
      "OWASP published the Top 10 security risks for LLM applications in 2024",
    ],
    pros: [
      "Defense-in-depth stops most attacks",
      "Sandboxing tool execution prevents catastrophic actions",
      "Monitoring anomalous LLM behavior catches attacks early",
    ],
    cons: [
      "Prompt injection is fundamentally hard to prevent — the model cannot distinguish data from instructions",
      "New attack techniques emerge faster than defenses",
      "Security review for AI systems requires new skills most teams lack",
    ],
    interviewQuestions: [
      "How would you prevent a prompt injection attack in a RAG system?",
      "What permissions should an AI agent NOT have, even if technically possible?",
      "How do you securely handle user-provided documents in an AI pipeline?",
    ],
    diagram: {
      type: "guardrails",
      source: { icon: "Smartphone", label: "Attacker" },
      inputCheck: { icon: "ShieldCheck", label: "Sanitize" },
      llm: { icon: "BrainCircuit", label: "LLM" },
      outputCheck: { icon: "ShieldCheck", label: "Audit" },
      output: { icon: "MessageSquare", label: "Safe Output" },
    },
  },
];
