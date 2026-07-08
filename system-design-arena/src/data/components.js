export const COMPONENT_CATEGORIES = {
  client: { color: "#4a4940", soft: "#ece9e1", label: "Client" },
  network: { color: "#2c4fc4", soft: "#dbe3fb", label: "Network" },
  compute: { color: "#3d8361", soft: "#dcefe5", label: "Compute" },
  storage: { color: "#d2401f", soft: "#fbe2da", label: "Storage" },
  messaging: { color: "#8a4fc4", soft: "#ebe0fa", label: "Messaging" },
  ai: { color: "#c47a1c", soft: "#faebd6", label: "AI / ML" },
  ops: { color: "#2a8080", soft: "#d6f0f0", label: "Ops" },
};

export const PALETTE = [
  // Client
  {
    type: "mobile-app",
    category: "client",
    label: "Mobile App",
    icon: "Smartphone",
  },
  { type: "browser", category: "client", label: "Browser", icon: "Globe2" },
  // Network
  {
    type: "load-balancer",
    category: "network",
    label: "Load Balancer",
    icon: "Scale",
  },
  {
    type: "api-gateway",
    category: "network",
    label: "API Gateway",
    icon: "Shield",
  },
  { type: "cdn", category: "network", label: "CDN", icon: "Globe" },
  {
    type: "websocket",
    category: "network",
    label: "WebSockets",
    icon: "Radio",
  },
  // Compute
  {
    type: "microservice",
    category: "compute",
    label: "Microservice",
    icon: "Server",
  },
  {
    type: "auth-service",
    category: "compute",
    label: "Auth Service",
    icon: "KeyRound",
  },
  { type: "worker", category: "compute", label: "Worker", icon: "Cog" },
  {
    type: "search-service",
    category: "compute",
    label: "Search Service",
    icon: "Search",
  },
  // Storage
  {
    type: "postgres",
    category: "storage",
    label: "PostgreSQL",
    icon: "Database",
  },
  { type: "mongodb", category: "storage", label: "MongoDB", icon: "Database" },
  { type: "redis", category: "storage", label: "Redis", icon: "Zap" },
  {
    type: "object-storage",
    category: "storage",
    label: "Object Storage",
    icon: "Archive",
  },
  {
    type: "vector-db",
    category: "storage",
    label: "Vector Database",
    icon: "Layers",
  },
  // Messaging
  { type: "kafka", category: "messaging", label: "Kafka", icon: "ListOrdered" },
  {
    type: "rabbitmq",
    category: "messaging",
    label: "RabbitMQ",
    icon: "MessageCircle",
  },
  // AI / ML
  { type: "llm-api", category: "ai", label: "LLM API", icon: "BrainCircuit" },
  {
    type: "embedding-model",
    category: "ai",
    label: "Embedding Model",
    icon: "BarChart2",
  },
  { type: "mcp-server", category: "ai", label: "MCP Server", icon: "Plug" },
  { type: "ai-agent", category: "ai", label: "AI Agent", icon: "Bot" },
  {
    type: "memory-store",
    category: "ai",
    label: "Memory Store",
    icon: "BookOpen",
  },
  {
    type: "guardrails",
    category: "ai",
    label: "Guardrails",
    icon: "ShieldCheck",
  },
  // Ops
  {
    type: "monitoring",
    category: "ops",
    label: "Monitoring",
    icon: "Activity",
  },
];
