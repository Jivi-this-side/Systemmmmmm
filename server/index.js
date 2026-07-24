import "dotenv/config";
import express from "express";
import cors from "cors";
import reviewRouter from "./routes/review.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "https://vvx8qj-3001.csb.app" }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/review", reviewRouter);

app.listen(PORT, () => {
  console.log(`[server] listening on ${PORT}`);
  if (
    !process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY === "your_groq_api_key_here"
  ) {
    console.warn("[server] GROQ_API_KEY not set -- using mock reviews");
  }
});
