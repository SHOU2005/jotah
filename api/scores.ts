// Vercel Function: weekly Stack the Packs leaderboard.
// GET  /api/scores            → top 10 this week
// POST /api/scores {name, score}
import { addScore, cleanName, hasScoresDb, MAX_SCORE, topScores, weekKey } from "../shared/scores-db.js";

const noDb = () => Response.json({ message: "Leaderboard unavailable" }, { status: 503 });

export async function GET() {
  if (!hasScoresDb()) return noDb();
  return Response.json({ week: weekKey(), top: await topScores(10) }, { headers: { "cache-control": "public, max-age=15, stale-while-revalidate=30" } });
}

export async function POST(request: Request) {
  if (!hasScoresDb()) return noDb();
  let body: any;
  try { body = await request.json(); } catch { return Response.json({ message: "Invalid request" }, { status: 400 }); }
  const name = cleanName(body?.name);
  if (!name) return Response.json({ message: "Use 2–16 letters or numbers for your name" }, { status: 400 });
  const score = Number(body?.score);
  if (!Number.isInteger(score) || score < 1 || score > MAX_SCORE) return Response.json({ message: "Invalid score" }, { status: 400 });
  const { rank, week } = await addScore(name, score);
  return Response.json({ rank, week }, { status: 201 });
}
