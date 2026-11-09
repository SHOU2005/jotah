import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

interface Row { name: string; score: number }
export const SCORE_SAVED_EVENT = "jotah-score-saved";

/** Weekly Stack the Packs top list. Refreshes when a score is saved anywhere on the page. */
export default function Leaderboard({ limit = 10, dark = true }: { limit?: number; dark?: boolean }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/scores", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => { if (alive) { setRows(d.top); setFailed(false); } })
        .catch(() => alive && setFailed(true));
    load();
    window.addEventListener(SCORE_SAVED_EVENT, load);
    return () => { alive = false; window.removeEventListener(SCORE_SAVED_EVENT, load); };
  }, []);

  const muted = dark ? "text-paper/55" : "text-ink-soft";
  const box = dark ? "border-paper/10 bg-paper/[.04]" : "border-ink/10 bg-paper";
  if (failed) return null;

  return (
    <div className={`rounded-3xl border p-5 ${box}`} data-testid="leaderboard">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-lg font-black"><Trophy className="h-5 w-5 text-flame" /> This week's top {limit}</p>
        <span className={`text-xs ${muted}`}>Resets Monday</span>
      </div>
      {rows === null ? (
        <p className={`py-4 text-sm ${muted}`}>Loading…</p>
      ) : rows.length === 0 ? (
        <p className={`py-4 text-sm ${muted}`}>No scores yet this week — be the first! 🔥</p>
      ) : (
        <ol className="space-y-1.5">
          {rows.slice(0, limit).map((r, i) => (
            <li key={r.name + i} className="flex items-center gap-3 text-sm">
              <span className={`w-6 text-center font-display font-black ${i < 3 ? "text-flame" : muted}`}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}</span>
              <span className="flex-1 truncate font-semibold">{r.name}</span>
              <span className="font-display font-black tabular-nums">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
