export const CHALLENGES = [
  // ── Classical ─────────────────────────────────────────────────────────────
  {
    id: "uber",
    category: "classical",
    difficulty: "Hard",
    title: "Design Uber",
    tagline: "Real-time matching at global scale",
    problem:
      "Design a ride-hailing platform where riders request rides and nearby drivers are matched in real time. The system must track driver locations continuously, calculate ETAs, handle surge pricing, and process payments.",
    requirements: [
      "Match riders to nearby drivers in < 2 seconds",
      "Track live driver GPS locations (every 4 seconds)",
      "Handle surge pricing during peak demand",
      "Process payments and split fares",
    ],
    nonFunctional: [
      "99.99% uptime for the matching engine",
      "P99 location update latency < 100ms",
      "Handle 10x traffic spikes during events",
    ],
    scale: "5M daily rides · 500K concurrent drivers · 50 cities",
    interviewTips: [
      "Focus on the real-time location tracking first — it is the hardest part",
      "Discuss WebSockets vs polling for driver location updates",
      "Explain geohashing or S2 cells for proximity search",
    ],
    guidedSteps: [
      {
        instruction:
          "Users open the Uber app. What is the first component they interact with?",
        choices: [
          "PostgreSQL Database",
          "Mobile App / Client",
          "Kafka Queue",
          "Redis Cache",
        ],
        correctIndex: 1,
        explanation:
          "The Mobile App is the client — this is always the starting point. It sends requests and displays the UI to the rider.",
        component: "mobile-app",
      },
      {
        instruction:
          "The app sends requests across the internet. What distributes them across your servers?",
        choices: [
          "Redis Cache",
          "Load Balancer",
          "Message Queue",
          "Object Storage",
        ],
        correctIndex: 1,
        explanation:
          "A Load Balancer distributes incoming requests across multiple API servers so no single server is overwhelmed. Essential for any high-traffic system.",
        component: "load-balancer",
      },
      {
        instruction:
          "You need a single entry point for routing, auth, and rate limiting. What handles this?",
        choices: ["Another Load Balancer", "API Gateway", "MongoDB", "CDN"],
        correctIndex: 1,
        explanation:
          "An API Gateway is the front door to your microservices. It handles auth, rate limiting, and routes requests to the right service — so each service does not have to.",
        component: "api-gateway",
      },
      {
        instruction:
          "Driver locations update every 4 seconds. Where do you store the current position of 500K drivers for fast lookup?",
        choices: ["PostgreSQL", "Kafka", "Redis (in-memory)", "Object Storage"],
        correctIndex: 2,
        explanation:
          "Redis stores driver locations in memory for sub-millisecond reads. PostgreSQL would be too slow for 500K concurrent updates. The data is ephemeral — it is fine if it is lost on restart.",
        component: "redis",
      },
      {
        instruction:
          "You need to store trip history, user accounts, and payment records durably. What handles this?",
        choices: ["Redis", "Kafka", "PostgreSQL", "CDN"],
        correctIndex: 2,
        explanation:
          "PostgreSQL gives ACID guarantees for financial transactions and trip history. Redis is for speed; PostgreSQL is for durability and consistency.",
        component: "postgres",
      },
      {
        instruction:
          "After a trip completes, you need to process payment, send receipt, and update analytics — without blocking the app response. What enables this?",
        choices: [
          "Another API Gateway",
          "Kafka Message Queue",
          "More Redis nodes",
          "A CDN",
        ],
        correctIndex: 1,
        explanation:
          "Kafka decouples post-trip processing from the request path. The app confirms the trip ended immediately; Kafka delivers the event to payment, notification, and analytics services asynchronously.",
        component: "kafka",
      },
    ],
    referenceSolution: {
      overview:
        "Uber is fundamentally a real-time location matching problem. The architecture centers on a geospatial index (like S2 cells) in Redis for driver lookup, WebSockets for real-time updates, and Kafka for async post-trip processing.",
      keyDecisions: [
        {
          title: "WebSockets for driver location",
          reasoning:
            "HTTP polling every 4 seconds creates 500K × 15 requests/minute = 7.5M RPM just for location. WebSockets maintain persistent connections and push updates server-to-client — 10x more efficient.",
        },
        {
          title: "Redis for the matching index",
          reasoning:
            "Geohashing stores driver locations in Redis sorted sets. Finding nearby drivers becomes a range query on a sorted set — microseconds vs. a full PostgreSQL geo query.",
        },
        {
          title: "Kafka for post-trip events",
          reasoning:
            "Payment, notifications, and analytics are triggered by the same TripCompleted event. Kafka fan-out means all three run in parallel without coupling the services.",
        },
        {
          title: "Separate read/write databases",
          reasoning:
            "Trip history is write-heavy during trips, read-heavy for analytics. Read replicas ensure reporting queries do not impact the booking database.",
        },
      ],
      components: [
        "Mobile App",
        "Load Balancer",
        "API Gateway",
        "WebSockets",
        "Matching Service",
        "Redis (locations)",
        "PostgreSQL (trips)",
        "Kafka",
        "Payment Service",
        "Notification Service",
      ],
    },
  },
  {
    id: "whatsapp",
    category: "classical",
    difficulty: "Hard",
    title: "Design WhatsApp",
    tagline: "Low-latency messaging with delivery guarantees",
    problem:
      "Design a messaging platform supporting one-to-one and group chats with guaranteed message delivery. Messages should arrive even if the recipient is offline, with end-to-end encryption and read receipts.",
    requirements: [
      "Real-time message delivery when online",
      "Store-and-forward for offline users",
      "Group chats up to 256 members",
      "Read receipts and online presence",
    ],
    nonFunctional: [
      "Message delivery P99 < 100ms when online",
      "2B users with 100B messages/day",
      "End-to-end encrypted — server never sees plaintext",
    ],
    scale: "2B users · 100B messages/day · 50M concurrent users",
    interviewTips: [
      "Fan-out for group messages is the hardest scaling problem",
      "Discuss the difference between online and offline delivery paths",
      "End-to-end encryption means keys never leave the device",
    ],
    guidedSteps: [
      {
        instruction:
          "Users send messages from their phone. What is the client?",
        choices: ["API Gateway", "Mobile App", "Database", "Queue"],
        correctIndex: 1,
        explanation:
          "The Mobile App is the client. It holds the encryption keys and never sends plaintext to the server.",
        component: "mobile-app",
      },
      {
        instruction:
          "Messages arrive continuously. What ensures your servers handle the load evenly?",
        choices: ["Redis", "Load Balancer", "Kafka", "MongoDB"],
        correctIndex: 1,
        explanation:
          "A Load Balancer distributes connections across your chat servers so no single server handles all 50M concurrent connections.",
        component: "load-balancer",
      },
      {
        instruction:
          "Messages need to be delivered instantly when the recipient is online. What protocol maintains persistent connections?",
        choices: ["REST API", "WebSockets", "FTP", "gRPC polling"],
        correctIndex: 1,
        explanation:
          "WebSockets maintain a persistent connection between the client and server. The server pushes messages to connected clients in real time without the client polling.",
        component: "websocket",
      },
      {
        instruction:
          "Group messages go to 256 members. What handles the async fan-out without blocking the sender?",
        choices: ["Redis", "PostgreSQL", "Kafka", "CDN"],
        correctIndex: 2,
        explanation:
          "Kafka receives the group message once, then fan-out workers read it and deliver to each of the 256 recipients. Without a queue, the sender waits for 256 deliveries — that is too slow.",
        component: "kafka",
      },
      {
        instruction:
          "Offline users need their messages when they come back online. Where are undelivered messages stored?",
        choices: ["Redis only", "Kafka only", "PostgreSQL", "Object Storage"],
        correctIndex: 2,
        explanation:
          "PostgreSQL durably stores messages with delivery status. When a user comes online, the server queries their undelivered messages and pushes them over the WebSocket connection.",
        component: "postgres",
      },
    ],
    referenceSolution: {
      overview:
        "WhatsApp is a messaging pipeline: sender → server → recipient (online) or message store → recipient (when they reconnect). E2E encryption means the server only handles ciphertext — keys stay on devices.",
      keyDecisions: [
        {
          title: "WebSockets for real-time delivery",
          reasoning:
            "Every user maintains a persistent WebSocket to a chat server. Delivery is a server-to-client push, not a client poll.",
        },
        {
          title: "Kafka for group message fan-out",
          reasoning:
            "One incoming message fans out to N recipients. Kafka decouples the sender from delivery to each member.",
        },
        {
          title: "Signal Protocol for E2E encryption",
          reasoning:
            "Keys are generated on-device. The server only stores and routes ciphertext — it cryptographically cannot read messages.",
        },
      ],
      components: [
        "Mobile App",
        "Load Balancer",
        "WebSockets",
        "Chat Service",
        "Kafka",
        "Fan-out Workers",
        "PostgreSQL",
        "Redis (presence)",
        "Notification Service",
      ],
    },
  },
  {
    id: "instagram",
    category: "classical",
    difficulty: "Medium",
    title: "Design Instagram",
    tagline: "Media-heavy social feed with fan-out at scale",
    problem:
      "Design a photo and video sharing platform where users post media, follow other users, and see a personalized feed. The feed must be fast to load and the media must be served globally with low latency.",
    requirements: [
      "Upload and serve photos and videos globally",
      "Generate a personalized home feed",
      "Support likes, comments, and follows",
      "Push notifications for engagement",
    ],
    nonFunctional: [
      "Feed load < 200ms P99",
      "Photo upload available globally within 5 seconds",
      "500M daily active users",
    ],
    scale: "500M DAU · 100M photos uploaded/day · 1B feed reads/day",
    interviewTips: [
      "The feed generation approach (push vs pull) is the core design decision",
      "CDN is essential for media delivery at this scale",
      "Discuss the celebrity problem — accounts with 100M followers",
    ],
    guidedSteps: [
      {
        instruction:
          "A user opens the Instagram app. What is the first component?",
        choices: ["Database", "Mobile App", "Kafka", "Worker"],
        correctIndex: 1,
        explanation:
          "The Mobile App is always the starting point — it is the client that users interact with.",
        component: "mobile-app",
      },
      {
        instruction:
          "Photos and videos are large files. Where do you store them?",
        choices: ["PostgreSQL", "Redis", "Object Storage (S3)", "MongoDB"],
        correctIndex: 2,
        explanation:
          "Object Storage (S3-compatible) is designed for large binary files. It is cheap, durable, and integrates directly with CDNs. Databases are for structured data, not binary blobs.",
        component: "object-storage",
      },
      {
        instruction:
          "A user in India loads the Instagram feed. Photos are stored in the US. What reduces latency?",
        choices: ["More API Servers", "CDN", "Redis", "Kafka"],
        correctIndex: 1,
        explanation:
          "A CDN caches photos and videos at edge servers close to users. A photo uploaded in New York is cached in Mumbai — the user downloads from 20ms away, not 150ms.",
        component: "cdn",
      },
      {
        instruction:
          "When a user posts a photo, their 50M followers need their feeds updated. What handles this async fan-out?",
        choices: [
          "Direct DB write to all followers",
          "Kafka + Feed Workers",
          "Redis pub/sub",
          "WebSockets",
        ],
        correctIndex: 1,
        explanation:
          "Kafka receives the PostCreated event. Feed Workers read it and update each follower's feed asynchronously. Doing it synchronously would block the upload response for seconds.",
        component: "kafka",
      },
      {
        instruction:
          "Feed data needs to be cached for fast reads. What stores the pre-computed feeds?",
        choices: ["PostgreSQL", "Object Storage", "Redis", "Kafka"],
        correctIndex: 2,
        explanation:
          "Redis stores pre-computed feed lists per user — just a list of post IDs. Reading a feed is a single Redis list fetch — microseconds. Computing it from scratch would require joining follows, posts, and engagement data.",
        component: "redis",
      },
    ],
    referenceSolution: {
      overview:
        "Instagram is a fan-out-on-write system: when a post is created, the post ID is pushed into each follower's pre-computed feed in Redis. Feed reads are O(1). Celebrity accounts (100M+ followers) use fan-out-on-read instead.",
      keyDecisions: [
        {
          title: "Fan-out-on-write for normal accounts",
          reasoning:
            "Pre-compute feeds when posts are created. Reads are instant Redis lookups. Only works when follower count is manageable (<10M).",
        },
        {
          title: "Fan-out-on-read for celebrities",
          reasoning:
            "Computing a feed for a celebrity's 100M followers on every post would take hours. Instead, merge their posts at read time for the small % of users following celebrities.",
        },
        {
          title: "Object Storage + CDN for media",
          reasoning:
            "S3 for durable storage, CloudFront for global caching. Never serve media directly from application servers.",
        },
      ],
      components: [
        "Mobile App",
        "CDN",
        "Load Balancer",
        "API Gateway",
        "Post Service",
        "Feed Service",
        "Kafka",
        "Object Storage",
        "Redis (feeds)",
        "PostgreSQL",
      ],
    },
  },
  {
    id: "youtube",
    category: "classical",
    difficulty: "Hard",
    title: "Design YouTube",
    tagline: "Video upload, transcoding, and global delivery",
    problem:
      "Design a video platform where users upload videos, the platform transcodes them into multiple resolutions, and serves them globally with adaptive bitrate streaming.",
    requirements: [
      "Upload videos up to 10GB",
      "Transcode into 360p, 720p, 1080p, 4K",
      "Adaptive bitrate streaming (HLS/DASH)",
      "Search across video metadata and transcripts",
    ],
    nonFunctional: [
      "Video available within 5 minutes of upload",
      "1B hours of video watched per day",
      "500 hours uploaded every minute",
    ],
    scale: "500hrs uploaded/min · 1B hours watched/day · 2B monthly users",
    interviewTips: [
      "Transcoding is CPU-intensive and async — it must never block the upload response",
      "Discuss HLS segmenting and why adaptive bitrate streaming exists",
      "CDN pre-warming for viral videos",
    ],
    guidedSteps: [
      {
        instruction:
          "A creator uploads a 2GB video file. Where does the raw file go first?",
        choices: ["PostgreSQL", "Redis", "Object Storage (S3)", "Kafka"],
        correctIndex: 2,
        explanation:
          "Object Storage stores the raw uploaded video. It handles files of any size reliably and cheaply. After upload, a job is queued for transcoding.",
        component: "object-storage",
      },
      {
        instruction:
          "The raw video needs to be converted into 4 resolutions and HLS segments. What handles this heavy CPU work?",
        choices: ["API Servers", "Kafka + Transcoding Workers", "Redis", "CDN"],
        correctIndex: 1,
        explanation:
          "Kafka receives an UploadComplete event, transcoding workers consume it and run FFmpeg to produce HLS segments. Workers auto-scale — more uploads = more workers.",
        component: "kafka",
      },
      {
        instruction:
          "Transcoded segments are stored in object storage. How do viewers load them fast from anywhere in the world?",
        choices: [
          "Direct from S3",
          "CDN Edge Nodes",
          "Redis Cache",
          "More Database Replicas",
        ],
        correctIndex: 1,
        explanation:
          "A CDN caches HLS segments at edge nodes globally. A viewer in Tokyo gets segments from a nearby edge node — 20ms latency vs 150ms from US origin.",
        component: "cdn",
      },
    ],
    referenceSolution: {
      overview:
        "YouTube is an async transcoding pipeline: upload → object storage → Kafka event → transcoding workers → HLS segments → CDN. The upload response comes immediately; transcoding happens in the background.",
      keyDecisions: [
        {
          title: "Async transcoding via Kafka",
          reasoning:
            "Transcoding a 2GB video takes minutes. Blocking the upload response for that long is unacceptable. Kafka decouples upload from processing.",
        },
        {
          title: "HLS adaptive streaming",
          reasoning:
            "HLS splits video into 10-second segments at multiple bitrates. The player automatically switches quality based on network speed — no rebuffering.",
        },
        {
          title: "CDN pre-warming for trending videos",
          reasoning:
            "When a video goes viral, millions of simultaneous requests would overwhelm origin. CDN pre-warming pushes segments to edge nodes proactively.",
        },
      ],
      components: [
        "Browser",
        "CDN",
        "Load Balancer",
        "API Gateway",
        "Upload Service",
        "Object Storage",
        "Kafka",
        "Transcoding Workers",
        "PostgreSQL (metadata)",
        "Search Service",
      ],
    },
  },
  {
    id: "payments",
    category: "classical",
    difficulty: "Medium",
    title: "Design a Payment System",
    tagline: "Correctness and consistency above all else",
    problem:
      "Design a payment processing system that handles transactions exactly once, reconciles balances, and survives partial failures without losing money.",
    requirements: [
      "Process payments exactly once — never duplicate",
      "Reconcile account balances after failures",
      "Support refunds and chargebacks",
      "Audit trail for every transaction",
    ],
    nonFunctional: [
      "Zero tolerance for double charges",
      "10K transactions/second peak",
      "Regulatory compliance (PCI-DSS)",
    ],
    scale: "10K TPS peak · $1B+ daily volume",
    interviewTips: [
      "Idempotency keys prevent duplicate charges — explain them in detail",
      "Discuss the two-phase commit problem for distributed transactions",
      "Reconciliation jobs are how you catch discrepancies",
    ],
    guidedSteps: [
      {
        instruction:
          'A user clicks "Pay". The app sends a payment request. What handles the request before it reaches services?',
        choices: ["Database", "API Gateway", "Kafka", "Redis"],
        correctIndex: 1,
        explanation:
          "The API Gateway handles auth (validate the user owns the card), rate limiting (prevent abuse), and routes to the payment service. Security starts here.",
        component: "api-gateway",
      },
      {
        instruction:
          "The same payment might be submitted twice if the user double-clicks. Where do you store idempotency keys to prevent duplicate charges?",
        choices: [
          "PostgreSQL only",
          "Redis (fast dedup)",
          "Kafka",
          "Object Storage",
        ],
        correctIndex: 1,
        explanation:
          "Redis stores idempotency keys with a short TTL. Before processing, check Redis for the key — if it exists, return the cached response without charging again. Redis's speed makes this a sub-millisecond check.",
        component: "redis",
      },
      {
        instruction:
          "After charging the user, you need to notify them and update analytics. What decouples these steps?",
        choices: [
          "Direct function calls",
          "Kafka Events",
          "More Redis nodes",
          "CDN",
        ],
        correctIndex: 1,
        explanation:
          "Kafka receives a PaymentCompleted event. Notification service and analytics consume it independently. If the notification service is down, Kafka retains the event — no lost notifications.",
        component: "kafka",
      },
    ],
    referenceSolution: {
      overview:
        "Payment systems prioritize correctness over speed. Idempotency keys prevent duplicates. The Saga pattern handles distributed transactions. Reconciliation jobs run nightly to catch discrepancies.",
      keyDecisions: [
        {
          title: "Idempotency keys for dedup",
          reasoning:
            "Every payment request includes a unique idempotency key. Redis caches processed keys. Duplicate requests return the cached result without re-charging.",
        },
        {
          title: "Saga pattern for multi-step transactions",
          reasoning:
            "Charging, updating balance, and notifying are separate steps. If step 2 fails, a compensating transaction from step 1 reverses the charge.",
        },
        {
          title: "Event sourcing for audit trail",
          reasoning:
            "Every state change is an immutable event. The current balance is derived from the event log. This is required for PCI-DSS compliance.",
        },
      ],
      components: [
        "Mobile App",
        "API Gateway",
        "Auth Service",
        "Payment Service",
        "Redis (idempotency)",
        "PostgreSQL (ledger)",
        "Kafka",
        "Notification Service",
        "Monitoring",
      ],
    },
  },

  // ── AI Challenges ──────────────────────────────────────────────────────────
  {
    id: "ai-coding-assistant",
    category: "ai",
    difficulty: "Medium",
    title: "Design an AI Coding Assistant",
    tagline: "Context-aware code completion and chat",
    problem:
      "Design a coding assistant like GitHub Copilot or Cursor that provides inline code suggestions, answers questions about the codebase, and can make multi-file edits. The assistant must be aware of the project context.",
    requirements: [
      "Inline autocomplete with < 300ms latency",
      "Chat interface for explaining and refactoring code",
      "Index the entire codebase for context",
      "Multi-file edits via agent mode",
    ],
    nonFunctional: [
      "Suggestion latency < 300ms P99",
      "Support codebases up to 1M lines",
      "Privacy-first option with local model",
    ],
    scale: "1M developers · 10B tokens/day · 50ms user-visible latency target",
    interviewTips: [
      "Retrieval of relevant code context is the hardest problem",
      "Discuss streaming tokens for perceived speed",
      "Explain how you chunk and embed code vs prose",
    ],
    guidedSteps: [
      {
        instruction:
          "The developer is typing code in their editor. What is the client?",
        choices: [
          "API Gateway",
          "Browser",
          "IDE / Editor Extension",
          "LLM API",
        ],
        correctIndex: 2,
        explanation:
          "The IDE Extension (VS Code, JetBrains, Neovim) is the client. It captures keystrokes, sends context to the backend, and renders completions inline.",
        component: "mobile-app",
      },
      {
        instruction:
          "The assistant needs to understand what code is relevant in a 100K-line codebase. How do you find relevant files?",
        choices: [
          "Send all 100K lines to the LLM",
          "Embed code chunks in a Vector Database",
          "Use keyword search only",
          "Read from PostgreSQL",
        ],
        correctIndex: 1,
        explanation:
          "Code is chunked (by function/class), embedded with a code embedding model, and stored in a vector database. When the user asks a question, the query is embedded and the most semantically relevant code chunks are retrieved.",
        component: "vector-db",
      },
      {
        instruction:
          "You retrieved the relevant code context. Now you need to generate the suggestion. What handles this?",
        choices: ["PostgreSQL", "Redis Cache", "LLM API", "Kafka"],
        correctIndex: 2,
        explanation:
          "The LLM API (GPT-4, Claude, or a code-specialized model like Code Llama) generates the completion given the retrieved context + current file. Streaming is used so tokens appear progressively.",
        component: "llm-api",
      },
      {
        instruction:
          "Code suggestions should be cached for identical context (same file, same cursor position). What handles caching?",
        choices: [
          "PostgreSQL",
          "Redis",
          "Object Storage",
          "New LLM Call every time",
        ],
        correctIndex: 1,
        explanation:
          "Redis caches completions keyed by a hash of the context. Identical typing patterns (common boilerplate) return the cached completion instantly — zero LLM cost.",
        component: "redis",
      },
      {
        instruction:
          "In agent mode, the assistant edits multiple files. How does it know what actions are available (read file, write file, run tests)?",
        choices: [
          "Hardcoded API calls",
          "MCP Server exposing editor tools",
          "Direct filesystem access",
          "Kafka events",
        ],
        correctIndex: 1,
        explanation:
          "An MCP Server exposes the editor's capabilities (read_file, write_file, run_terminal, list_files) as standardized tools. The LLM calls these tools to take actions in the codebase.",
        component: "mcp-server",
      },
    ],
    referenceSolution: {
      overview:
        "A coding assistant is a RAG + agent system. The retrieval stage finds relevant code context; the LLM generates suggestions grounded in that context. Agent mode adds tool calling for multi-file edits.",
      keyDecisions: [
        {
          title: "Code-specific embeddings",
          reasoning:
            "General text embeddings underperform on code. Models like code-embedding-ada or Voyage Code understand function signatures, variable names, and code structure.",
        },
        {
          title: "Streaming for perceived speed",
          reasoning:
            "LLM completion takes 1-5 seconds. Streaming tokens appear progressively — the user sees characters appearing immediately, making 2s feel like <300ms.",
        },
        {
          title: "MCP for agent tool access",
          reasoning:
            "Instead of hardcoding editor API calls, MCP lets the LLM discover available tools at runtime. Adding a new tool (e.g., run_linter) requires no LLM code changes.",
        },
        {
          title: "Local model option for privacy",
          reasoning:
            "Sending proprietary code to OpenAI is a dealbreaker for many enterprises. A local model (Code Llama via Ollama) keeps all data on-device.",
        },
      ],
      components: [
        "IDE Extension",
        "API Gateway",
        "Embedding Model",
        "Vector Database",
        "LLM API",
        "Redis (cache)",
        "MCP Server",
        "Guardrails",
        "Monitoring",
      ],
    },
  },
  {
    id: "ai-support-agent",
    category: "ai",
    difficulty: "Easy",
    title: "Design an AI Support Agent",
    tagline: "Automated customer support with human escalation",
    problem:
      "Design an AI customer support system that handles incoming support tickets, answers common questions using the product knowledge base, takes actions (check order status, issue refunds), and escalates to human agents when needed.",
    requirements: [
      "Answer questions from the product knowledge base",
      "Take actions: check order status, process refunds",
      "Detect when to escalate to a human agent",
      "Maintain conversation history per session",
    ],
    nonFunctional: [
      "First response < 3 seconds",
      "Escalation decision accuracy > 95%",
      "Handle 10K concurrent conversations",
    ],
    scale: "10K concurrent conversations · 1M tickets/month",
    interviewTips: [
      "Guardrails are critical — the agent must not promise things it cannot deliver",
      "Escalation logic is a classification problem — when is the AI stuck?",
      "RAG over the knowledge base is the core retrieval system",
    ],
    guidedSteps: [
      {
        instruction:
          'A customer types "Where is my order?" in the support widget. What is the first AI component that processes this?',
        choices: ["PostgreSQL", "Guardrails / Input Screening", "Kafka", "CDN"],
        correctIndex: 1,
        explanation:
          "Guardrails screen the input first — checking for prompt injections, abusive content, or out-of-scope requests. No input should reach the LLM without validation.",
        component: "guardrails",
      },
      {
        instruction:
          "The agent needs to answer from your support documentation. How does it find the relevant help articles?",
        choices: [
          "Send all docs to the LLM",
          "RAG: embed query → Vector DB → retrieve context",
          "Keyword search only",
          "Fine-tune the LLM on docs",
        ],
        correctIndex: 1,
        explanation:
          "RAG retrieves the most relevant knowledge base articles for the query. The LLM then answers based on those articles — grounded in facts, not hallucinating.",
        component: "vector-db",
      },
      {
        instruction:
          'The customer asks "Can you refund my order?" The agent needs to actually process the refund. What enables this?',
        choices: [
          "LLM generates refund instructions for the human",
          "LLM API with Tool Calling to the orders API",
          "Kafka event",
          "Redis lookup",
        ],
        correctIndex: 1,
        explanation:
          "Tool calling lets the LLM invoke a check_order(order_id) or process_refund(order_id) function directly. The LLM decides to call the tool; the result comes back and is included in the response.",
        component: "llm-api",
      },
      {
        instruction:
          "Conversation history must be maintained across multiple messages. What stores it?",
        choices: [
          "Client-side only",
          "Redis (session store)",
          "PostgreSQL only",
          "Kafka",
        ],
        correctIndex: 1,
        explanation:
          "Redis stores the conversation history per session with a TTL. Each message appends to the session. The full history is included in each LLM prompt for context continuity.",
        component: "redis",
      },
    ],
    referenceSolution: {
      overview:
        "The support agent is a RAG + tool-calling system with guardrails at input and output. Knowledge retrieval grounds the LLM in your actual docs. Tool calling lets it take real actions. Escalation is a confidence-based classifier.",
      keyDecisions: [
        {
          title: "Guardrails before and after the LLM",
          reasoning:
            'Input guardrails block injections. Output guardrails prevent the agent from making promises (e.g., "I will refund 100%") that your business cannot fulfill.',
        },
        {
          title: "RAG over fine-tuning",
          reasoning:
            "Support docs change constantly. RAG updates by re-embedding documents — no retraining required. Fine-tuning would need retraining every time docs change.",
        },
        {
          title: "Escalation as a tool",
          reasoning:
            "The LLM calls an escalate_to_human() tool when it decides it cannot help. This is more accurate than a separate classifier — the model uses its own judgment about when it is stuck.",
        },
      ],
      components: [
        "Browser",
        "API Gateway",
        "Guardrails",
        "LLM API",
        "Vector Database",
        "Embedding Model",
        "Redis (sessions)",
        "MCP Server (order tools)",
        "PostgreSQL",
        "Monitoring",
      ],
    },
  },
  {
    id: "research-agent",
    category: "ai",
    difficulty: "Hard",
    title: "Design a Research Agent using MCP",
    tagline: "Autonomous research across multiple data sources",
    problem:
      "Design an AI research agent that takes a research question, autonomously searches the web, reads papers, queries databases, synthesizes findings across multiple sources, and produces a structured report — all via MCP-connected tools.",
    requirements: [
      "Accept a research question in natural language",
      "Search web and academic databases autonomously",
      "Read and summarize documents via MCP tools",
      "Produce a structured report with citations",
    ],
    nonFunctional: [
      "Complete research task in < 5 minutes",
      "Support 1000 concurrent research sessions",
      "Verifiable citations for every claim",
    ],
    scale: "1000 concurrent agents · 50 tool calls per research task",
    interviewTips: [
      "The agent loop (plan → search → synthesize → plan again) is the core design",
      "MCP servers for each data source is the key architecture decision",
      "Discuss how you prevent hallucinated citations",
    ],
    guidedSteps: [
      {
        instruction:
          'The user submits "Research the impact of RAG on LLM accuracy". What receives this and starts the agent loop?',
        choices: ["Redis", "AI Agent Orchestrator", "Kafka", "PostgreSQL"],
        correctIndex: 1,
        explanation:
          "An AI Agent Orchestrator receives the research goal and starts a ReAct loop: plan → use tools → observe results → plan next step. The LLM is the brain that decides which tools to call.",
        component: "ai-agent",
      },
      {
        instruction:
          "The agent needs to search academic papers, the web, and internal documents. How does it access all these sources uniformly?",
        choices: [
          "Separate API integrations in code",
          "MCP Servers for each source",
          "All data pre-loaded in context",
          "Single database",
        ],
        correctIndex: 1,
        explanation:
          "Each data source (arXiv, web search, internal wiki) has its own MCP Server exposing search and read tools. The agent discovers all available tools at runtime and calls them by name — no hardcoded integrations.",
        component: "mcp-server",
      },
      {
        instruction:
          "The agent retrieves 50 documents. You need to find the most relevant passages for the report. What stores and retrieves them semantically?",
        choices: ["Kafka", "Redis", "Vector Database", "Object Storage"],
        correctIndex: 2,
        explanation:
          "Retrieved documents are chunked, embedded, and stored in a temporary vector database for this research session. The agent queries it to find the most relevant passages when writing each section.",
        component: "vector-db",
      },
      {
        instruction:
          "Research sessions need memory — the agent must not re-search what it already found. Where is session state stored?",
        choices: ["LLM context only", "Redis (session memory)", "Kafka", "CDN"],
        correctIndex: 1,
        explanation:
          "Redis stores the agent's working memory: what it has searched, what it found, what still needs researching. Keeping this outside the LLM context prevents token overflow for long research tasks.",
        component: "redis",
      },
    ],
    referenceSolution: {
      overview:
        "The research agent is an MCP-powered ReAct agent. Each iteration: the LLM decides what to search, calls MCP tools to gather data, stores findings in a session vector DB, and synthesizes the report section by section.",
      keyDecisions: [
        {
          title: "MCP for tool standardization",
          reasoning:
            "Adding a new data source (PubMed, Crunchbase) is adding an MCP server — no agent code changes. The LLM discovers tools dynamically.",
        },
        {
          title: "Session vector DB for cross-document synthesis",
          reasoning:
            "The agent retrieves 50 documents across multiple searches. A per-session vector DB lets it find relevant passages across all documents when writing the report.",
        },
        {
          title: "Parallel sub-agents for speed",
          reasoning:
            "Each research subtopic can be researched by a parallel sub-agent. An orchestrator merges findings. Research time: O(max subtopic) instead of O(sum of subtopics).",
        },
      ],
      components: [
        "Browser",
        "API Gateway",
        "AI Agent",
        "LLM API",
        "MCP Server (web)",
        "MCP Server (academic)",
        "MCP Server (internal)",
        "Vector Database",
        "Redis (memory)",
        "Guardrails",
        "Monitoring",
      ],
    },
  },
  {
    id: "doc-qa",
    category: "ai",
    difficulty: "Easy",
    title: "Design a Document Q&A System",
    tagline: "Ask questions across your document library",
    problem:
      "Design a system where users upload documents (PDFs, Word files, spreadsheets) and ask natural language questions. The system must retrieve relevant passages and answer accurately with citations.",
    requirements: [
      "Upload and process PDFs, DOCX, XLSX",
      "Index documents for semantic search",
      "Answer questions with source citations",
      "Support follow-up questions with conversation context",
    ],
    nonFunctional: [
      "Answer latency < 5 seconds",
      "Support documents up to 500 pages",
      "Accurate citations — no hallucinated page numbers",
    ],
    scale: "100K users · 10M documents · 1M queries/day",
    interviewTips: [
      "Chunking strategy is the most impactful decision for retrieval quality",
      "Hybrid search (vector + BM25) outperforms pure vector search on long documents",
      "Discuss how you handle tables and figures in PDFs",
    ],
    guidedSteps: [
      {
        instruction:
          "A user uploads a 200-page PDF. What is the first processing step?",
        choices: [
          "Store as-is in PostgreSQL",
          "Parse, chunk, and embed the text",
          "Send all 200 pages to the LLM",
          "Store in Redis",
        ],
        correctIndex: 1,
        explanation:
          "The document is parsed (extract text from PDF), chunked into overlapping 500-token segments, embedded with an embedding model, and stored in a vector database. This enables semantic search over any passage.",
        component: "embedding-model",
      },
      {
        instruction:
          "Where do the document chunks and their embeddings live for fast semantic retrieval?",
        choices: [
          "Redis",
          "PostgreSQL text search",
          "Vector Database",
          "Object Storage",
        ],
        correctIndex: 2,
        explanation:
          "A vector database stores the embeddings and enables sub-50ms similarity search across millions of chunks. When a user asks a question, the query embedding is compared to all chunk embeddings.",
        component: "vector-db",
      },
      {
        instruction:
          "The user asks a question. The top 10 relevant chunks are retrieved. What generates the final answer with citations?",
        choices: [
          "PostgreSQL",
          "Redis",
          "LLM API with retrieved context",
          "Rule-based system",
        ],
        correctIndex: 2,
        explanation:
          "The LLM receives the retrieved chunks as context and generates an answer based only on those chunks. It includes citations (document name, page number) because the source metadata is attached to each chunk.",
        component: "llm-api",
      },
      {
        instruction:
          "The user asks follow-up questions. How is conversation history maintained?",
        choices: [
          "Each message is standalone",
          "Redis stores conversation history",
          "PostgreSQL only",
          "Embedded in every document",
        ],
        correctIndex: 1,
        explanation:
          "Redis stores the conversation history per session. Each follow-up query includes the previous Q&A pairs in the LLM prompt, enabling contextual responses across the conversation.",
        component: "redis",
      },
    ],
    referenceSolution: {
      overview:
        "Document Q&A is a canonical RAG implementation. Ingest: parse → chunk → embed → store in vector DB. Query: embed question → retrieve top-k chunks → LLM generates answer with citations.",
      keyDecisions: [
        {
          title: "Overlapping chunks for context continuity",
          reasoning:
            "Chunks of 500 tokens with 100-token overlap ensure that relevant information is not split across chunk boundaries.",
        },
        {
          title: "Hybrid search for accuracy",
          reasoning:
            "Vector search finds semantically similar passages. BM25 keyword search finds exact term matches. Combining both (reciprocal rank fusion) outperforms either alone.",
        },
        {
          title: "Metadata attachment for citations",
          reasoning:
            "Each chunk stores document name, page number, and section. The LLM cites from this metadata — no hallucinated page numbers.",
        },
      ],
      components: [
        "Browser",
        "API Gateway",
        "Embedding Model",
        "Vector Database",
        "LLM API",
        "Redis (sessions)",
        "Object Storage",
        "PostgreSQL (metadata)",
        "Guardrails",
      ],
    },
  },
];

// ── Solution diagrams (pre-built nodes + edges for each challenge) ─────────
// Imported separately by SolutionPage so challenges.js stays importable
// without React Flow. Export them from here for convenience.

export const SOLUTION_DIAGRAMS = {
  uber: {
    nodes: [
      {
        id: "s-client",
        type: "architecture",
        position: { x: 20, y: 200 },
        data: { label: "Mobile App", category: "client", icon: "Smartphone" },
      },
      {
        id: "s-lb",
        type: "architecture",
        position: { x: 220, y: 200 },
        data: { label: "Load Balancer", category: "network", icon: "Scale" },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 420, y: 200 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-ws",
        type: "architecture",
        position: { x: 620, y: 100 },
        data: { label: "WebSockets", category: "network", icon: "Radio" },
      },
      {
        id: "s-match",
        type: "architecture",
        position: { x: 620, y: 200 },
        data: {
          label: "Matching Service",
          category: "compute",
          icon: "Server",
        },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 820, y: 100 },
        data: { label: "Redis (locations)", category: "storage", icon: "Zap" },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 820, y: 280 },
        data: { label: "PostgreSQL", category: "storage", icon: "Database" },
      },
      {
        id: "s-kafka",
        type: "architecture",
        position: { x: 620, y: 360 },
        data: { label: "Kafka", category: "messaging", icon: "ListOrdered" },
      },
      {
        id: "s-pay",
        type: "architecture",
        position: { x: 820, y: 420 },
        data: { label: "Payment Service", category: "compute", icon: "Server" },
      },
      {
        id: "s-notif",
        type: "architecture",
        position: { x: 820, y: 500 },
        data: {
          label: "Notification Svc",
          category: "compute",
          icon: "Server",
        },
      },
      {
        id: "s-mon",
        type: "architecture",
        position: { x: 420, y: 380 },
        data: { label: "Monitoring", category: "ops", icon: "Activity" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-client",
        target: "s-lb",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-lb",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-gw",
        target: "s-ws",
        animated: true,
        style: { stroke: "#3d8361", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-gw",
        target: "s-match",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-match",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-match",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-match",
        target: "s-kafka",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-kafka",
        target: "s-pay",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-kafka",
        target: "s-notif",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e10",
        source: "s-ws",
        target: "s-redis",
        style: { stroke: "#3d8361", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-ws":
        "WebSockets maintain persistent connections for real-time driver location updates every 4 seconds.",
      "s-redis":
        "Redis stores driver GPS coordinates with a 30s TTL. Geohashing enables fast proximity queries across 500K drivers.",
      "s-match":
        "Matching engine runs the assignment algorithm — finds the nearest available driver within a geohash cell.",
      "s-kafka":
        'TripCompleted events fan out to Payment and Notification services asynchronously — rider sees "trip ended" immediately.',
      "s-pg":
        "Stores trip history, user profiles, and financial records. Read replicas handle analytics queries.",
      "s-mon":
        "Tracks matching latency, driver location freshness, and payment success rates in real time.",
    },
  },

  whatsapp: {
    nodes: [
      {
        id: "s-app",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: { label: "Mobile App", category: "client", icon: "Smartphone" },
      },
      {
        id: "s-lb",
        type: "architecture",
        position: { x: 220, y: 240 },
        data: { label: "Load Balancer", category: "network", icon: "Scale" },
      },
      {
        id: "s-ws",
        type: "architecture",
        position: { x: 420, y: 160 },
        data: { label: "WebSocket Server", category: "network", icon: "Radio" },
      },
      {
        id: "s-chat",
        type: "architecture",
        position: { x: 420, y: 300 },
        data: { label: "Chat Service", category: "compute", icon: "Server" },
      },
      {
        id: "s-kafka",
        type: "architecture",
        position: { x: 620, y: 240 },
        data: { label: "Kafka", category: "messaging", icon: "ListOrdered" },
      },
      {
        id: "s-fanout",
        type: "architecture",
        position: { x: 820, y: 160 },
        data: { label: "Fan-out Workers", category: "compute", icon: "Server" },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 820, y: 300 },
        data: { label: "PostgreSQL", category: "storage", icon: "Database" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 620, y: 400 },
        data: { label: "Redis (presence)", category: "storage", icon: "Zap" },
      },
      {
        id: "s-notif",
        type: "architecture",
        position: { x: 820, y: 420 },
        data: {
          label: "Push Notification",
          category: "compute",
          icon: "Server",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-app",
        target: "s-lb",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-lb",
        target: "s-ws",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-lb",
        target: "s-chat",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-ws",
        target: "s-kafka",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-kafka",
        target: "s-fanout",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-fanout",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-chat",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-fanout",
        target: "s-notif",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-ws":
        "Every user maintains a persistent WebSocket connection. Messages are pushed server→client instantly when recipient is online.",
      "s-kafka":
        "Group message fan-out — one incoming message becomes N deliveries. Kafka buffers messages for offline users.",
      "s-fanout":
        "Workers consume group messages and deliver to each member. Scales horizontally — add workers for larger groups.",
      "s-pg":
        "Stores message history with delivery status (sent/delivered/read). Queried when a user comes back online.",
      "s-redis":
        "Presence store — tracks which users are online and on which WebSocket server. Sub-5ms lookup.",
    },
  },

  instagram: {
    nodes: [
      {
        id: "s-app",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: { label: "Mobile App", category: "client", icon: "Smartphone" },
      },
      {
        id: "s-cdn",
        type: "architecture",
        position: { x: 220, y: 120 },
        data: { label: "CDN", category: "network", icon: "Globe" },
      },
      {
        id: "s-lb",
        type: "architecture",
        position: { x: 220, y: 280 },
        data: { label: "Load Balancer", category: "network", icon: "Scale" },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 420, y: 280 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-feed",
        type: "architecture",
        position: { x: 620, y: 180 },
        data: { label: "Feed Service", category: "compute", icon: "Server" },
      },
      {
        id: "s-post",
        type: "architecture",
        position: { x: 620, y: 320 },
        data: { label: "Post Service", category: "compute", icon: "Server" },
      },
      {
        id: "s-s3",
        type: "architecture",
        position: { x: 820, y: 120 },
        data: { label: "Object Storage", category: "storage", icon: "Archive" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 820, y: 240 },
        data: { label: "Redis (feeds)", category: "storage", icon: "Zap" },
      },
      {
        id: "s-kafka",
        type: "architecture",
        position: { x: 620, y: 460 },
        data: { label: "Kafka", category: "messaging", icon: "ListOrdered" },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 820, y: 380 },
        data: { label: "PostgreSQL", category: "storage", icon: "Database" },
      },
      {
        id: "s-worker",
        type: "architecture",
        position: { x: 820, y: 480 },
        data: { label: "Feed Workers", category: "compute", icon: "Cog" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-app",
        target: "s-cdn",
        animated: true,
        style: { stroke: "#3d8361", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-app",
        target: "s-lb",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-lb",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-gw",
        target: "s-feed",
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-gw",
        target: "s-post",
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-post",
        target: "s-s3",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-feed",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-post",
        target: "s-kafka",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-kafka",
        target: "s-worker",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e10",
        source: "s-worker",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e11",
        source: "s-post",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e12",
        source: "s-cdn",
        target: "s-s3",
        style: { stroke: "#3d8361", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-cdn":
        "Photos and videos are served from CDN edge nodes. A Mumbai user downloads from a nearby edge — 20ms vs 150ms from US origin.",
      "s-redis":
        "Pre-computed feed lists per user — just a list of post IDs. Reading your feed is a single Redis LRANGE — microseconds.",
      "s-kafka":
        "PostCreated event triggers feed fan-out. Workers write the post ID into each follower's Redis feed list asynchronously.",
      "s-worker":
        "Fan-out workers run in parallel. For celebrity accounts (100M followers), fan-out is skipped — their posts are merged at read time.",
      "s-s3":
        "Raw uploads and CDN origin. Videos are stored in multiple resolutions after transcoding.",
    },
  },

  "ai-coding-assistant": {
    nodes: [
      {
        id: "s-ide",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: {
          label: "IDE Extension",
          category: "client",
          icon: "Smartphone",
        },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 220, y: 240 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-embed",
        type: "architecture",
        position: { x: 420, y: 120 },
        data: { label: "Embedding Model", category: "ai", icon: "BarChart2" },
      },
      {
        id: "s-vdb",
        type: "architecture",
        position: { x: 620, y: 120 },
        data: { label: "Vector Database", category: "storage", icon: "Layers" },
      },
      {
        id: "s-llm",
        type: "architecture",
        position: { x: 620, y: 280 },
        data: { label: "LLM API", category: "ai", icon: "BrainCircuit" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 420, y: 380 },
        data: { label: "Redis (cache)", category: "storage", icon: "Zap" },
      },
      {
        id: "s-mcp",
        type: "architecture",
        position: { x: 820, y: 200 },
        data: { label: "MCP Server", category: "ai", icon: "Plug" },
      },
      {
        id: "s-guard",
        type: "architecture",
        position: { x: 420, y: 280 },
        data: { label: "Guardrails", category: "ai", icon: "ShieldCheck" },
      },
      {
        id: "s-mon",
        type: "architecture",
        position: { x: 820, y: 380 },
        data: { label: "Monitoring", category: "ops", icon: "Activity" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-ide",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-gw",
        target: "s-guard",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-guard",
        target: "s-embed",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-embed",
        target: "s-vdb",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-vdb",
        target: "s-llm",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-guard",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-llm",
        target: "s-mcp",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-llm",
        target: "s-mon",
        style: { stroke: "#2a8080", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-embed":
        "Code is chunked by function/class and embedded with a code-specific model. Stored in the vector DB for semantic retrieval.",
      "s-vdb":
        "When you type, the current file context is embedded and the top-k most relevant code chunks are retrieved as context for the LLM.",
      "s-llm":
        "Receives: system prompt + retrieved code context + current file + cursor position. Streams completion tokens back to the IDE.",
      "s-redis":
        "Caches completions keyed by a hash of the context. Identical boilerplate returns instantly — zero LLM cost.",
      "s-mcp":
        "In agent mode, the LLM calls MCP tools: read_file, write_file, run_terminal. Each tool maps to an editor capability.",
      "s-guard":
        "Input: blocks prompt injections in user-provided code comments. Output: strips suggestions containing hardcoded secrets.",
    },
  },

  "doc-qa": {
    nodes: [
      {
        id: "s-app",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: { label: "Browser", category: "client", icon: "Smartphone" },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 220, y: 240 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-s3",
        type: "architecture",
        position: { x: 420, y: 120 },
        data: { label: "Object Storage", category: "storage", icon: "Archive" },
      },
      {
        id: "s-embed",
        type: "architecture",
        position: { x: 420, y: 280 },
        data: { label: "Embedding Model", category: "ai", icon: "BarChart2" },
      },
      {
        id: "s-vdb",
        type: "architecture",
        position: { x: 620, y: 180 },
        data: { label: "Vector Database", category: "storage", icon: "Layers" },
      },
      {
        id: "s-llm",
        type: "architecture",
        position: { x: 620, y: 340 },
        data: { label: "LLM API", category: "ai", icon: "BrainCircuit" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 820, y: 180 },
        data: { label: "Redis (sessions)", category: "storage", icon: "Zap" },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 820, y: 340 },
        data: { label: "PostgreSQL", category: "storage", icon: "Database" },
      },
      {
        id: "s-guard",
        type: "architecture",
        position: { x: 420, y: 420 },
        data: { label: "Guardrails", category: "ai", icon: "ShieldCheck" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-app",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-gw",
        target: "s-s3",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-s3",
        target: "s-embed",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-embed",
        target: "s-vdb",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-gw",
        target: "s-embed",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-vdb",
        target: "s-llm",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-llm",
        target: "s-guard",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-gw",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-gw",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-s3":
        "Raw uploaded PDFs/DOCX stored in object storage. Parsing happens asynchronously — user gets upload confirmation immediately.",
      "s-embed":
        "Document is chunked into 500-token overlapping segments. Each chunk embedded and stored in the vector DB with page metadata.",
      "s-vdb":
        "At query time: embed the question, find top-10 most similar chunks. Hybrid search (vector + BM25) outperforms pure vector alone.",
      "s-llm":
        'Prompt: "Answer based only on these retrieved chunks. Cite [doc name, page N] for each claim." Hallucinated page numbers become impossible.',
      "s-redis":
        "Conversation history per session — enables follow-up questions. TTL of 24h matches user session expectations.",
      "s-guard":
        "Output guardrail: checks the LLM did not cite a page that wasn't in the retrieved chunks (hallucination detection).",
    },
  },
};

// ── Additional solution diagrams ─────────────────────────────────────────────
Object.assign(SOLUTION_DIAGRAMS, {
  youtube: {
    nodes: [
      {
        id: "s-browser",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: {
          label: "Browser / App",
          category: "client",
          icon: "Smartphone",
        },
      },
      {
        id: "s-cdn",
        type: "architecture",
        position: { x: 220, y: 120 },
        data: { label: "CDN", category: "network", icon: "Globe" },
      },
      {
        id: "s-lb",
        type: "architecture",
        position: { x: 220, y: 300 },
        data: { label: "Load Balancer", category: "network", icon: "Scale" },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 420, y: 300 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-upload",
        type: "architecture",
        position: { x: 620, y: 180 },
        data: { label: "Upload Service", category: "compute", icon: "Server" },
      },
      {
        id: "s-s3",
        type: "architecture",
        position: { x: 820, y: 120 },
        data: { label: "Object Storage", category: "storage", icon: "Archive" },
      },
      {
        id: "s-kafka",
        type: "architecture",
        position: { x: 620, y: 340 },
        data: { label: "Kafka", category: "messaging", icon: "ListOrdered" },
      },
      {
        id: "s-transc",
        type: "architecture",
        position: { x: 820, y: 280 },
        data: {
          label: "Transcoding Workers",
          category: "compute",
          icon: "Cog",
        },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 820, y: 420 },
        data: { label: "PostgreSQL", category: "storage", icon: "Database" },
      },
      {
        id: "s-search",
        type: "architecture",
        position: { x: 620, y: 480 },
        data: { label: "Search Service", category: "compute", icon: "Search" },
      },
      {
        id: "s-mon",
        type: "architecture",
        position: { x: 420, y: 480 },
        data: { label: "Monitoring", category: "ops", icon: "Activity" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-browser",
        target: "s-cdn",
        animated: true,
        style: { stroke: "#3d8361", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-browser",
        target: "s-lb",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-lb",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-gw",
        target: "s-upload",
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-upload",
        target: "s-s3",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-upload",
        target: "s-kafka",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-kafka",
        target: "s-transc",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-transc",
        target: "s-s3",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-transc",
        target: "s-cdn",
        style: { stroke: "#3d8361", strokeWidth: 2 },
      },
      {
        id: "e10",
        source: "s-gw",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e11",
        source: "s-gw",
        target: "s-search",
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-s3":
        "Raw uploaded video goes straight to object storage. The upload response is immediate — transcoding happens asynchronously in the background.",
      "s-kafka":
        "UploadComplete event triggers the transcoding pipeline. Kafka retains the event if workers are busy — no uploads are lost.",
      "s-transc":
        "FFmpeg workers run in parallel — one per resolution (360p, 720p, 1080p, 4K). HLS segments are written back to S3 as they complete.",
      "s-cdn":
        "Transcoded HLS segments are pushed to CDN edge nodes. A viewer in Tokyo streams from a nearby edge — eliminating trans-Pacific latency.",
      "s-search":
        "Video title, description, and auto-generated transcript are indexed for search. Separate from the main DB to avoid query contention.",
      "s-mon":
        "Tracks transcoding queue depth, CDN cache hit rate, and streaming error rates. Alerts when queue depth exceeds 10 minutes of video.",
    },
  },

  payments: {
    nodes: [
      {
        id: "s-app",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: { label: "Mobile App", category: "client", icon: "Smartphone" },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 220, y: 240 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-auth",
        type: "architecture",
        position: { x: 420, y: 120 },
        data: { label: "Auth Service", category: "compute", icon: "KeyRound" },
      },
      {
        id: "s-pay",
        type: "architecture",
        position: { x: 420, y: 280 },
        data: { label: "Payment Service", category: "compute", icon: "Server" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 620, y: 160 },
        data: {
          label: "Redis (idempotency)",
          category: "storage",
          icon: "Zap",
        },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 620, y: 320 },
        data: {
          label: "PostgreSQL (ledger)",
          category: "storage",
          icon: "Database",
        },
      },
      {
        id: "s-kafka",
        type: "architecture",
        position: { x: 420, y: 440 },
        data: { label: "Kafka", category: "messaging", icon: "ListOrdered" },
      },
      {
        id: "s-notif",
        type: "architecture",
        position: { x: 620, y: 460 },
        data: {
          label: "Notification Svc",
          category: "compute",
          icon: "Server",
        },
      },
      {
        id: "s-recon",
        type: "architecture",
        position: { x: 820, y: 320 },
        data: {
          label: "Reconciliation Worker",
          category: "compute",
          icon: "Cog",
        },
      },
      {
        id: "s-mon",
        type: "architecture",
        position: { x: 820, y: 180 },
        data: { label: "Monitoring", category: "ops", icon: "Activity" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-app",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-gw",
        target: "s-auth",
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-gw",
        target: "s-pay",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-pay",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-pay",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-pay",
        target: "s-kafka",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-kafka",
        target: "s-notif",
        animated: true,
        style: { stroke: "#8a4fc4", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-pg",
        target: "s-recon",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-pay",
        target: "s-mon",
        style: { stroke: "#2a8080", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-redis":
        "Idempotency keys stored with a 24h TTL. Before processing, check if this key exists — if yes, return the cached result without re-charging. Prevents double charges on retries.",
      "s-pg":
        "Append-only ledger — every transaction is an immutable row. Current balance is derived from summing the event log. Required for PCI-DSS audit trails.",
      "s-kafka":
        "PaymentCompleted event fans out to Notification and Analytics services asynchronously. The payment response returns to the user immediately after DB write.",
      "s-auth":
        "Every payment request must validate the user owns the payment method. Auth happens before the payment service is ever called.",
      "s-recon":
        "Nightly reconciliation job compares our ledger with the payment processor records. Any discrepancy triggers an alert — this is how you catch bugs that slip through.",
      "s-mon":
        "Tracks payment success rate, p99 latency, and idempotency key collision rate. Alert threshold: success rate drops below 99.9%.",
    },
  },

  "ai-support-agent": {
    nodes: [
      {
        id: "s-browser",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: {
          label: "Browser / Chat Widget",
          category: "client",
          icon: "Smartphone",
        },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 220, y: 240 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-guard",
        type: "architecture",
        position: { x: 420, y: 160 },
        data: { label: "Guardrails", category: "ai", icon: "ShieldCheck" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 420, y: 340 },
        data: { label: "Redis (sessions)", category: "storage", icon: "Zap" },
      },
      {
        id: "s-embed",
        type: "architecture",
        position: { x: 620, y: 120 },
        data: { label: "Embedding Model", category: "ai", icon: "BarChart2" },
      },
      {
        id: "s-vdb",
        type: "architecture",
        position: { x: 820, y: 120 },
        data: {
          label: "Vector DB (knowledge)",
          category: "storage",
          icon: "Layers",
        },
      },
      {
        id: "s-llm",
        type: "architecture",
        position: { x: 620, y: 280 },
        data: { label: "LLM API", category: "ai", icon: "BrainCircuit" },
      },
      {
        id: "s-mcp",
        type: "architecture",
        position: { x: 820, y: 280 },
        data: { label: "MCP Server (orders)", category: "ai", icon: "Plug" },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 620, y: 440 },
        data: { label: "PostgreSQL", category: "storage", icon: "Database" },
      },
      {
        id: "s-mon",
        type: "architecture",
        position: { x: 820, y: 420 },
        data: { label: "Monitoring", category: "ops", icon: "Activity" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-browser",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-gw",
        target: "s-guard",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-gw",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-guard",
        target: "s-embed",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-embed",
        target: "s-vdb",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-vdb",
        target: "s-llm",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-llm",
        target: "s-mcp",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-llm",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-llm",
        target: "s-mon",
        style: { stroke: "#2a8080", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-guard":
        'Input guardrail runs before the LLM. Blocks prompt injections, flags abusive language, and rejects out-of-scope requests (e.g., "write me a poem").',
      "s-vdb":
        "Support knowledge base (FAQs, product docs, policies) is chunked and embedded here. RAG retrieves the top-5 most relevant articles for each query.",
      "s-llm":
        "Receives: system prompt (agent persona + constraints) + retrieved knowledge + conversation history + user message. Returns: answer OR a tool call.",
      "s-mcp":
        "Exposes check_order(id), process_refund(id), get_account_status(id) as MCP tools. The LLM calls these when it needs real data — no hallucinated order statuses.",
      "s-redis":
        "Conversation history per session. Each new message appends to the session key. The full history goes into the LLM prompt for contextual multi-turn support.",
      "s-mon":
        "Tracks escalation rate, first-contact resolution %, average conversation length, and guardrail block rate. High escalation = retrieval quality problem.",
    },
  },

  "research-agent": {
    nodes: [
      {
        id: "s-browser",
        type: "architecture",
        position: { x: 20, y: 240 },
        data: { label: "Browser", category: "client", icon: "Smartphone" },
      },
      {
        id: "s-gw",
        type: "architecture",
        position: { x: 220, y: 240 },
        data: { label: "API Gateway", category: "network", icon: "Shield" },
      },
      {
        id: "s-agent",
        type: "architecture",
        position: { x: 420, y: 240 },
        data: { label: "Research Agent", category: "ai", icon: "Bot" },
      },
      {
        id: "s-llm",
        type: "architecture",
        position: { x: 620, y: 160 },
        data: { label: "LLM API", category: "ai", icon: "BrainCircuit" },
      },
      {
        id: "s-mcp1",
        type: "architecture",
        position: { x: 820, y: 80 },
        data: { label: "MCP: Web Search", category: "ai", icon: "Plug" },
      },
      {
        id: "s-mcp2",
        type: "architecture",
        position: { x: 820, y: 200 },
        data: { label: "MCP: arXiv / Papers", category: "ai", icon: "Plug" },
      },
      {
        id: "s-mcp3",
        type: "architecture",
        position: { x: 820, y: 320 },
        data: { label: "MCP: Internal Wiki", category: "ai", icon: "Plug" },
      },
      {
        id: "s-redis",
        type: "architecture",
        position: { x: 420, y: 400 },
        data: {
          label: "Redis (agent memory)",
          category: "storage",
          icon: "Zap",
        },
      },
      {
        id: "s-vdb",
        type: "architecture",
        position: { x: 620, y: 400 },
        data: {
          label: "Vector DB (session)",
          category: "storage",
          icon: "Layers",
        },
      },
      {
        id: "s-pg",
        type: "architecture",
        position: { x: 820, y: 440 },
        data: {
          label: "PostgreSQL (reports)",
          category: "storage",
          icon: "Database",
        },
      },
      {
        id: "s-guard",
        type: "architecture",
        position: { x: 220, y: 380 },
        data: { label: "Guardrails", category: "ai", icon: "ShieldCheck" },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "s-browser",
        target: "s-gw",
        animated: true,
        style: { stroke: "#2c4fc4", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "s-gw",
        target: "s-agent",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "s-agent",
        target: "s-llm",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e4",
        source: "s-llm",
        target: "s-mcp1",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e5",
        source: "s-llm",
        target: "s-mcp2",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e6",
        source: "s-llm",
        target: "s-mcp3",
        animated: true,
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e7",
        source: "s-agent",
        target: "s-redis",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e8",
        source: "s-agent",
        target: "s-vdb",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
      {
        id: "e9",
        source: "s-agent",
        target: "s-pg",
        style: { stroke: "#d2401f", strokeWidth: 2 },
      },
      {
        id: "e10",
        source: "s-gw",
        target: "s-guard",
        style: { stroke: "#c47a1c", strokeWidth: 2 },
      },
    ],
    annotations: {
      "s-agent":
        "The ReAct loop: the LLM decides what to search → calls an MCP tool → observes the result → decides next step. Repeats until the research goal is complete.",
      "s-llm":
        "The reasoning engine. Given the research goal and what has been found so far, it decides: call another tool, write a section, or declare the task complete.",
      "s-mcp1":
        "Web search MCP server. The agent searches Google/Bing for recent information. Returns URLs + snippets that the agent reads with a fetch_page tool.",
      "s-mcp2":
        "Academic paper MCP server. Searches arXiv and Semantic Scholar by title, author, or abstract. Fetches full paper PDFs when needed.",
      "s-redis":
        "Working memory: what subtopics have been researched, what has been found, what still needs searching. Prevents redundant searches in long tasks.",
      "s-vdb":
        "All retrieved documents are chunked and embedded into a per-session vector DB. When writing the report, the agent queries this to find relevant passages across all sources.",
    },
  },
});
