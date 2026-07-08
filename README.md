# System Design Arena 🌻

System Design Arena is  for learning both **Classical System Design** (load balancers, databases, caches, queues) and **Modern AI System Design** (LLMs, RAG, agents, MCP, guardrails) — the two tracks every engineer needs for senior-level interviews and real-world architecture work.

The learning loop has three steps:

1. **Learn** — Animated lessons with real company examples, trade-off breakdowns, and interview questions for every concept
2. **Build** — Drag-and-drop canvas to design architectures. Guided mode walks beginners through step-by-step with hints. Free mode for experienced designers
3. **Review** — AI reviewer scores your design across 8 categories, identifies bottlenecks, asks follow-up interview questions, and shows you the reference architecture

---

## Features

### Two full learning tracks
- **Classical Systems** — 10 lessons: Client–Server, Load Balancer, API Gateway, Microservices, Databases, Caching, Message Queues, CDN, Scalability, Reliability
- **AI & MCP Systems** — 15 lessons: LLM APIs, Prompt Engineering, Embeddings, Vector Databases, RAG, AI Agents, Tool Calling, MCP, Multi-Agent Systems, AI Memory, Guardrails, AI Evaluation, AI Observability, AI Security, and more

Each lesson includes:
- Animated architecture diagram (unique to each concept)
- Key insight
- Real company examples (how Netflix, Uber, Slack actually use this)
- Advantages and disadvantages
- Interview questions

### Guided Build Mode
Before tackling challenges independently, beginners get step-by-step guidance. Each guided step presents a multiple-choice question about what component to place next. Correct answers auto-place the component on the canvas with an explanation of *why*. Wrong answers give a hint without revealing the answer. Completing all steps unlocks free-build mode.

### Design Workspace
- Drag-and-drop canvas (React Flow)
- 24 components across 7 categories: Client, Network, Compute, Storage, Messaging, AI/ML, Ops
- AI-specific components: LLM API, Embedding Model, Vector Database, MCP Server, AI Agent, Memory Store, Guardrails, Monitoring
- Interview tips panel per challenge
- Written reasoning textarea

### 9 Challenges with Reference Solutions

**Classical:**
| Challenge | Difficulty |
|-----------|------------|
| Design Uber | Hard |
| Design WhatsApp | Hard |
| Design Instagram | Medium |
| Design YouTube | Hard |
| Design a Payment System | Medium |

**AI System Design:**
| Challenge | Difficulty |
|-----------|------------|
| Design an AI Coding Assistant | Medium |
| Design an AI Customer Support Agent | Easy |
| Design a Research Agent using MCP | Hard |
| Design a Document Q&A System | Easy |

Every challenge includes: problem statement, functional requirements, non-functional requirements, expected scale, constraints, interview tips, guided build steps, and a reference solution.

### AI Review
Submit your design and get back:
- Overall score (0–100) with a hiring verdict
- Category scores: Functionality, Scalability, Database Design, Performance, Security, Reliability, Cost Awareness, Design Reasoning
- Identified strengths and bottlenecks
- Concrete improvement suggestions
- Follow-up interview questions a real interviewer would ask

Works in demo mode without an API key. Add a Groq key for real AI reviews.

### Reference Solution Viewer
After reviewing, click "View Reference Solution" to see the expert architecture on an interactive React Flow canvas. Click any component to learn exactly why it exists in the design. Includes architecture breakdown, key decisions with reasoning, and a component checklist.

### Dark Mode
Full dark theme with smooth transitions. Respects system preference on first visit. Persists across sessions. Toggle with the button in the bottom-right corner.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite 6 |
| Routing | React Router v6 |
| Canvas | React Flow (@xyflow/react) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Icons | Lucide React |
| AI | Groq API (llama-3.3-70b-versatile) |
| Theme | CSS custom properties + .dark class |


---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/your-username/system-design-arena.git
cd system-design-arena
npm install
```

### Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Configure AI Reviews (optional)

Create a `.env` file in the project root:

```
VITE_GROQ_API_KEY=gsk_your_key_here
```

Get a free key at [console.groq.com](https://console.groq.com). The app runs fully in demo mode without one — you just get a realistic mock scorecard instead of a live AI review. Restart the dev server after adding the key.

---

## Project Structure

```
system-design-arena/
├── src/
│   ├── App.jsx                          # Routes + page transitions + ThemeToggle
│   ├── main.jsx                         # Entry point
│   ├── index.css                        # Design tokens, dark theme, React Flow overrides
│   │
│   ├── hooks/
│   │   └── useTheme.js                  # Dark/light mode with localStorage persistence
│   │
│   ├── data/
│   │   ├── lessons.js                   # All 25 lessons (content, diagrams, companies, Q&A)
│   │   ├── challenges.js                # 9 challenges + guided steps + reference solutions
│   │   └── components.js                # Palette component definitions (24 components)
│   │
│   ├── lib/
│   │   ├── groq.js                      # Groq API client + mock fallback
│   │   └── prompt.js                    # LLM prompt builder from blueprint JSON
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx              # Hero, stats, track overview
│   │   ├── Tutorial.jsx                 # Chapter nav, lesson tabs, animated diagrams
│   │   ├── ChallengeSelect.jsx          # Classical/AI tabs, challenge cards
│   │   ├── ReviewPage.jsx               # AI scorecard, improvements, follow-up Qs
│   │   └── SolutionPage.jsx             # Reference architecture (interactive React Flow)
│   │
│   └── components/
│       ├── DesignWorkspace.jsx          # Canvas page with guided/free toggle
│       ├── GuidedMode.jsx               # Step-by-step multiple choice teaching
│       ├── Palette.jsx                  # Draggable component sidebar
│       ├── ThemeToggle.jsx              # Floating dark/light toggle
│       ├── nodes/
│       │   └── ArchitectureNode.jsx     # Custom React Flow node (icon + category color)
│       └── lessons/
│           └── AnimatedDiagram.jsx      # 14 animated diagram types for lessons
```

---

## How the AI Review Works

When you submit a design, the workspace serializes your diagram into a structured JSON blueprint:

```json
{
  "challengeId": "uber",
  "challengeTitle": "Design Uber",
  "nodes": [{ "id": "n1", "type": "network", "label": "Load Balancer" }],
  "edges": [{ "source": "n1", "target": "n2" }],
  "reasoning": "I added a load balancer to..."
}
```

This blueprint — along with your written reasoning — is converted into a system design interview prompt and sent to `llama-3.3-70b-versatile` via the Groq API. The model is instructed to respond with structured JSON only, which is parsed into the scorecard displayed on the review page.

The model evaluates: what components you used, how they're connected, whether critical components are missing, and whether your written reasoning explains the trade-offs.

---


## Contributing

Contributions welcome. The easiest ways to contribute:

- **Add a lesson** — Edit `src/data/lessons.js`. Each lesson needs a title, body, keyInsight, companies, pros, cons, interviewQuestions, and a diagram type
- **Add a challenge** — Edit `src/data/challenges.js`. Follow the existing shape: problem, requirements, nonFunctional, scale, guidedSteps, referenceSolution
- **Add a solution diagram** — Add an entry to `SOLUTION_DIAGRAMS` in `challenges.js` with nodes, edges, and annotations

```bash
# Fork, then:
git checkout -b feature/my-new-challenge
# make changes
git commit -m "Add: Design Netflix challenge"
git push origin feature/my-new-challenge
# open a pull request
```


---

*Built to teach engineers not just what components to use, but why they exist and how they work together.*
