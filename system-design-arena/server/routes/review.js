import { Router } from "express";
import { getReview } from "../lib/ai.js";

const router = Router();

router.post("/", async (req, res) => {
  const blueprint = req.body;

  if (!blueprint || !blueprint.challengeId || !Array.isArray(blueprint.nodes)) {
    return res.status(400).json({ error: "Invalid blueprint payload" });
  }

  try {
    const review = await getReview(blueprint);
    return res.json(review);
  } catch (err) {
    console.error("[review] AI call failed:", err.message);
    return res
      .status(502)
      .json({ error: "AI review failed", detail: err.message });
  }
});

export default router;
