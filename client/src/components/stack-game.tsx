import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { RotateCcw, ShoppingBag, Trophy } from "lucide-react";
import { WhatsAppIcon } from "./brand";

/* ─────────────────────────────────────────────────────────────
   STACK THE PACKS — an original Jotah mini-game.
   A pack slides across; tap to drop it. Overhang falls off.
   Perfect drops build a combo that grows the pack back.
   Used on the home page and on /game.
   ───────────────────────────────────────────────────────────── */

const W = 360;          // logical canvas width
const H = 600;          // logical canvas height
const LAYER = 30;       // pack height
const START_W = 200;    // starting pack width
const PERFECT = 5;      // px tolerance for a perfect drop
const BEST_KEY = "jotah-stack-best";
const MILESTONES: Record<number, string> = { 10: "10! NICE 🔥", 25: "25! ON FIRE", 50: "50!! LEGEND", 100: "100!!! WHAT THE FUN" };

type Phase = "ready" | "playing" | "over";
interface Block { x: number; w: number }
interface Falling { x: number; y: number; w: number; vy: number; vx: number; rot: number; vr: number }
interface Pop { text: string; x: number; y: number; life: number; big?: boolean }
interface Spark { x: number; y: number; vx: number; vy: number; life: number; color: string }

const KRAFT = ["#D9AE7E", "#CFA06C", "#E2BC8E", "#C99C6C"];
/** World y of the pack at stack level i (0 = base). */
const yOf = (i: number) => H - 50 - i * LAYER;

// Background shifts from warm dusk to deep night as you climb.
const SKY: [number, [number, number, number], [number, number, number]][] = [
  [0, [58, 36, 24], [22, 18, 14]],
  [15, [74, 30, 40], [24, 14, 22]],
  [35, [28, 26, 60], [12, 10, 26]],
  [60, [10, 10, 24], [4, 4, 10]],
];
function skyAt(level: number) {
  let a = SKY[0], b = SKY[SKY.length - 1];
  for (let i = 0; i < SKY.length - 1; i++) if (level >= SKY[i][0] && level < SKY[i + 1][0]) { a = SKY[i]; b = SKY[i + 1]; break; }
  if (level >= SKY[SKY.length - 1][0]) a = b;
  const t = a === b ? 0 : (level - a[0]) / (b[0] - a[0]);
  const mix = (x: number[], y: number[]) => `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(",")})`;
  return [mix(a[1], b[1]), mix(a[2], b[2])];
}

export default function StackGame({ autoFocus = false, compact = false }: { autoFocus?: boolean; compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);

  // Mutable game state lives in a ref so the render loop never waits on React.
  const g = useRef({
    stack: [] as Block[],
    cur: { x: 0, w: START_W, dir: 1 } as Block & { dir: number },
    falling: [] as Falling[],
    pops: [] as Pop[],
    sparks: [] as Spark[],
    cam: 0,
    combo: 0,
    best: 0,
    phase: "ready" as Phase,
    flash: 0,
    shake: 0,
    visible: true,
  });

  useEffect(() => {
    try {
      const b = Number(localStorage.getItem(BEST_KEY)) || 0;
      setBest(b);
      g.current.best = b;
    } catch {}
  }, []);

  const buzz = (ms: number) => { try { navigator.vibrate?.(ms); } catch {} };

  const reset = useCallback(() => {
    const s = g.current;
    s.stack = [{ x: (W - START_W) / 2, w: START_W }];
    s.cur = { x: -START_W, w: START_W, dir: 1 };
    s.falling = []; s.pops = []; s.sparks = [];
    s.cam = 0; s.combo = 0; s.flash = 0; s.shake = 0;
  }, []);

  const start = useCallback(() => {
    reset();
    g.current.phase = "playing";
    setPhase("playing");
    setScore(0);
    setNewBest(false);
    boxRef.current?.focus({ preventScroll: true });
  }, [reset]);

  const drop = useCallback(() => {
    const s = g.current;
    if (s.phase !== "playing") return;
    const top = s.stack[s.stack.length - 1];
    const cur = s.cur;
    const level = s.stack.length;
    const yTop = yOf(level);

    let left = Math.max(cur.x, top.x);
    const right = Math.min(cur.x + cur.w, top.x + top.w);
    const overlap = right - left;

    if (overlap <= 0) {
      s.falling.push({ x: cur.x, y: yTop, w: cur.w, vy: 0, vx: cur.dir * 1.5, rot: 0, vr: cur.dir * 0.05 });
      s.phase = "over";
      s.shake = 14;
      buzz(120);
      setPhase("over");
      const final = s.stack.length - 1;
      if (final > s.best) {
        s.best = final;
        try { localStorage.setItem(BEST_KEY, String(final)); } catch {}
        setBest(final);
        setNewBest(true);
      }
      return;
    }

    let w = overlap;
    if (Math.abs(cur.x - top.x) <= PERFECT) {
      left = top.x;
      w = top.w;
      s.combo += 1;
      if (s.combo >= 3) {
        const grow = Math.min(12, START_W - w);
        left -= grow / 2;
        w += grow;
      }
      s.flash = 1;
      buzz(25);
      s.pops.push({ text: s.combo >= 3 ? `PERFECT ×${s.combo}` : "PERFECT!", x: W / 2, y: yTop - 10, life: 1 });
      for (let i = 0; i < 22; i++) {
        const side = i % 2 ? left : left + w;
        s.sparks.push({ x: side, y: yTop + LAYER / 2, vx: (i % 2 ? -1 : 1) * (1 + Math.random() * 3), vy: -1 - Math.random() * 3, life: 1, color: i % 3 ? "#FFB199" : "#E0412F" });
      }
    } else {
      s.combo = 0;
      buzz(10);
      const cutLeft = cur.x < top.x;
      s.falling.push({ x: cutLeft ? cur.x : right, y: yTop, w: cur.w - overlap, vy: 0, vx: cutLeft ? -1.2 : 1.2, rot: 0, vr: cutLeft ? -0.04 : 0.04 });
      s.shake = 4;
    }

    s.stack.push({ x: left, w });
    const next = s.stack.length - 1;
    setScore(next);
    if (MILESTONES[next]) s.pops.push({ text: MILESTONES[next], x: W / 2, y: yTop - 40, life: 1.4, big: true });
    const fromLeft = next % 2 === 1;
    s.cur = { x: fromLeft ? -w : W, w, dir: fromLeft ? 1 : -1 };
  }, []);

  // Keys only while the game box has focus, so Space still scrolls the page elsewhere.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.code !== "Space" && e.code !== "Enter") return;
    if ((e.target as HTMLElement) !== boxRef.current) return; // let buttons inside work normally
    e.preventDefault();
    if (g.current.phase === "playing") drop();
    else start();
  };

  useEffect(() => { if (autoFocus) boxRef.current?.focus({ preventScroll: true }); }, [autoFocus]);

  // Pause the loop when the game is scrolled out of view.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { g.current.visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    reset();

    let raf = 0;
    let last = performance.now();

    const drawPack = (x: number, y: number, w: number, color: string, alpha = 1) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, LAYER - 2);
      ctx.fillStyle = "rgba(255,255,255,.18)";
      ctx.fillRect(x, y, w, 3);
      ctx.fillStyle = "rgba(60,35,15,.22)";
      ctx.fillRect(x, y + LAYER - 6, w, 4);
      ctx.strokeStyle = "rgba(60,35,15,.35)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, LAYER - 3);
      ctx.fillStyle = "#16120E";
      ctx.textBaseline = "middle";
      if (w > 74) {
        ctx.font = "900 13px Archivo, Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("JOTAH", x + w / 2, y + LAYER / 2 - 1);
      }
      if (w > 40) {
        ctx.font = "900 15px Archivo, Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("J", x + 7, y + LAYER / 2);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      const s = g.current;
      if (!s.visible) return; // paused off-screen
      const level = s.stack.length;

      if (s.phase === "playing") {
        const speed = Math.min(2.4 + (level - 1) * 0.11, 7.5);
        s.cur.x += s.cur.dir * speed * dt;
        if (s.cur.x + s.cur.w > W + 30) s.cur.dir = -1;
        if (s.cur.x < -30) s.cur.dir = 1;
      } else if (s.phase === "ready") {
        s.cur.x += s.cur.dir * 1.6 * dt;
        if (s.cur.x + s.cur.w > W - 10) s.cur.dir = -1;
        if (s.cur.x < 10) s.cur.dir = 1;
      }

      const targetCam = Math.max(0, level * LAYER - H * 0.45);
      s.cam += (targetCam - s.cam) * 0.08 * dt;

      for (const f of s.falling) { f.vy += 0.45 * dt; f.y += f.vy * dt; f.x += f.vx * dt; f.rot += f.vr * dt; }
      s.falling = s.falling.filter((f) => f.y - s.cam < H + 200);
      for (const p of s.pops) { p.y -= 0.6 * dt; p.life -= 0.018 * dt; }
      s.pops = s.pops.filter((p) => p.life > 0);
      for (const k of s.sparks) { k.vy += 0.15 * dt; k.x += k.vx * dt; k.y += k.vy * dt; k.life -= 0.03 * dt; }
      s.sparks = s.sparks.filter((k) => k.life > 0);
      s.flash = Math.max(0, s.flash - 0.05 * dt);
      s.shake = Math.max(0, s.shake - 0.6 * dt);

      // ── Draw ──
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const [top, bottom] = skyAt(level - 1);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, top);
      bg.addColorStop(1, bottom);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // stars once you climb high
      if (level > 30) {
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.6, (level - 30) / 30)})`;
        for (let i = 0; i < 40; i++) ctx.fillRect((i * 97) % W, (i * 53 + (s.cam * 0.2)) % H, 1.5, 1.5);
      }

      const glow = ctx.createRadialGradient(W / 2, H * 0.35, 10, W / 2, H * 0.35, 260);
      glow.addColorStop(0, `rgba(224,65,47,${0.14 + s.flash * 0.3})`);
      glow.addColorStop(1, "rgba(224,65,47,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const sx = s.shake ? (Math.random() - 0.5) * s.shake : 0;
      ctx.translate(sx, s.cam);

      ctx.fillStyle = "#3a2a1e";
      ctx.fillRect(-40, yOf(0) + LAYER - 2, W + 80, 200);

      // best-score line
      if (s.best > 0 && s.phase !== "ready") {
        const by = yOf(s.best) + LAYER - 1;
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = "rgba(255,177,153,.55)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(W, by); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,177,153,.8)";
        ctx.font = "800 10px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(`BEST ${s.best}`, W - 8, by - 3);
      }

      s.stack.forEach((b, i) => drawPack(b.x, yOf(i), b.w, KRAFT[i % KRAFT.length]));
      if (s.phase !== "over") drawPack(s.cur.x, yOf(level), s.cur.w, KRAFT[level % KRAFT.length]);

      for (const f of s.falling) {
        ctx.save();
        ctx.translate(f.x + f.w / 2, f.y + LAYER / 2);
        ctx.rotate(f.rot);
        drawPack(-f.w / 2, -LAYER / 2, f.w, "#C99C6C", 0.9);
        ctx.restore();
      }

      for (const k of s.sparks) {
        ctx.globalAlpha = Math.max(0, k.life);
        ctx.fillStyle = k.color;
        ctx.fillRect(k.x, k.y, 3, 3);
      }
      ctx.globalAlpha = 1;

      for (const p of s.pops) {
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = p.big ? "#F3E9DA" : "#FFB199";
        ctx.font = `900 ${p.big ? 28 : 20}px Archivo, Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (s.phase !== "ready") {
        ctx.fillStyle = "rgba(243,233,218,.95)";
        ctx.font = "900 56px Archivo, Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(String(s.stack.length - 1), W / 2, 26);
        if (s.combo >= 2) {
          ctx.font = "800 13px Inter, sans-serif";
          ctx.fillStyle = "#FFB199";
          ctx.fillText(`COMBO ×${s.combo}`, W / 2, 88);
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reset]);

  const shareText = `What The Fun! 🔥 I stacked ${score} Jotah packs. Beat me: https://jotah.in/game`;

  return (
    <div
      ref={boxRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`relative mx-auto w-full select-none overflow-hidden rounded-[2rem] shadow-2xl outline-none ring-1 ring-paper/10 focus-visible:ring-2 focus-visible:ring-flame ${compact ? "max-w-[340px]" : "max-w-[400px]"}`}
      aria-label="Stack the Packs game. Press Space or tap to drop the pack."
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => { e.preventDefault(); if (phase === "playing") drop(); else start(); }}
        className="block aspect-[3/5] w-full touch-none cursor-pointer"
        role="img"
        aria-label="Stack the Packs game board"
      />
      {phase === "ready" && (
        <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent pb-14 text-center text-paper" data-testid="game-start">
          <span className="font-display text-4xl font-black" style={{ fontStretch: "115%" }}>Stack the Packs</span>
          <span className="mt-2 text-paper/70">Tap to drop · perfect = combo</span>
          <span className="btn btn-wa wa-pulse mt-6 px-8">▶ Play</span>
          {best > 0 && <span className="mt-4 flex items-center gap-1.5 text-sm text-paper/60"><Trophy className="h-4 w-4" /> Best: {best}</span>}
        </button>
      )}
      {phase === "over" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 px-6 text-center text-paper backdrop-blur-[2px]" data-testid="game-over">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">{newBest ? "🏆 New best!" : "Game over"}</p>
          <p className="font-display text-7xl font-black" style={{ fontStretch: "115%" }}>{score}</p>
          <p className="text-paper/70">packs stacked</p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-paper/60"><Trophy className="h-4 w-4" /> Best: {best}</p>
          <div className="mt-6 grid w-full max-w-[250px] gap-3">
            <button onClick={start} className="btn btn-wa" data-testid="game-again"><RotateCcw className="h-4 w-4" /> Play again</button>
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light"><WhatsAppIcon className="h-4 w-4" /> Challenge a friend</a>
            <Link href="/product" className="btn bg-paper text-ink hover:bg-white"><ShoppingBag className="h-4 w-4" /> Shop cones</Link>
          </div>
        </div>
      )}
    </div>
  );
}
