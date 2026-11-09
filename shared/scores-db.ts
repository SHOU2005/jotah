// Server-only: weekly Stack the Packs leaderboard (Postgres / Neon).
import { neon } from "@neondatabase/serverless";

export interface ScoreRow { name: string; score: number; at: string }

const url = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
export const hasScoresDb = () => Boolean(url());

/** ISO week key in India time, e.g. "2026-W45". Leaderboard resets every Monday 00:00 IST. */
export function weekKey(d = new Date()) {
  const ist = new Date(d.getTime() + 5.5 * 3600 * 1000);
  const day = (ist.getUTCDay() + 6) % 7; // Mon=0
  const thursday = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() - day + 3));
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((thursday.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${thursday.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export const MAX_SCORE = 400; // well above anything humanly reachable; rejects obvious fakes

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.trim().replace(/\s+/g, " ");
  return /^[A-Za-z0-9\u0900-\u097F ._-]{2,16}$/.test(name) ? name : null;
}

let ready: Promise<void> | null = null;
function db() {
  const sql = neon(url());
  if (!ready) {
    ready = sql(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id         BIGSERIAL PRIMARY KEY,
        week       TEXT NOT NULL,
        name       TEXT NOT NULL,
        score      INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`)
      .then(() => sql(`CREATE INDEX IF NOT EXISTS game_scores_week_score ON game_scores (week, score DESC)`))
      .then(() => undefined)
      .catch((e) => { ready = null; throw e; });
  }
  return { sql, ready };
}

/** Top players this week (best score per name). */
export async function topScores(limit = 10): Promise<ScoreRow[]> {
  const { sql, ready } = db();
  await ready;
  const rows = (await sql(
    `SELECT MAX(name) AS name, MAX(score) AS score, MIN(created_at) AS at
       FROM game_scores WHERE week = $1
      GROUP BY lower(name)
      ORDER BY score DESC, at ASC
      LIMIT $2`,
    [weekKey(), limit],
  )) as { name: string; score: number; at: string }[];
  return rows.map((r) => ({ name: r.name, score: Number(r.score), at: new Date(r.at).toISOString() }));
}

/** Saves a score; returns the player's rank this week (1 = top). */
export async function addScore(name: string, score: number) {
  const { sql, ready } = db();
  await ready;
  const week = weekKey();
  await sql(`INSERT INTO game_scores (week, name, score) VALUES ($1, $2, $3)`, [week, name, score]);
  const r = (await sql(
    `SELECT COUNT(*)::int + 1 AS rank FROM (
       SELECT lower(name) AS n, MAX(score) AS best FROM game_scores WHERE week = $1 GROUP BY lower(name)
     ) t WHERE t.best > $2`,
    [week, score],
  )) as { rank: number }[];
  return { week, rank: r[0]?.rank ?? 1 };
}
