import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { RotateCcw, ShoppingBag, Trophy } from "lucide-react";
import Navigation from "@/components/navigation";
import { Footer } from "@/components/site-chrome";
import { WhatsAppIcon } from "@/components/brand";
import { usePageMeta } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────
   STACK THE PACKS — an original Jotah mini-game.
   A pack slides across; tap to drop it. Overhang falls off.
   Perfect drops build a combo that grows the pack back.
   ───────────────────────────────────────────────────────────── */

const W = 360;          // logical canvas width
const H = 600;          // logical canvas height
const LAYER = 30;       // pack height
const START_W = 200;    // starting pack width
const PERFECT = 5;      // px tolerance for a perfect drop
const BEST_KEY = "jotah-stack-best";

type Phase = "ready" | "playing" | "over";
interface Block { x: number; w: number }
interface Falling { x: number; y: number; w: number; vy: number; vx: number; rot: number; vr: number }
interface Pop { text: string; x: number; y: number; life: number }

const KRAFT = ["#D9AE7E", "#CFA06C", "#E2BC8E", "#C99C6C"];
/** World y of the pack at stack level i (0 = base). */
const yOf = (i: number) => H - 50 - i * LAYER;

export default function Game() {
  usePageMeta("/game");
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    cam: 0,
    combo: 0,
    phase: "ready" as Phase,
    flash: 0,
    shake: 0,
  });

  useEffect(() => {
    try { setBest(Number(localStorage.getItem(BEST_KEY)) || 0); } catch {}
  }, []);

  const reset = useCallback(() => {
    const s = g.current;
    s.stack = [{ x: (W - START_W) / 2, w: START_W }];
    s.cur = { x: -START_W, w: START_W, dir: 1 };
    s.falling = [];
    s.pops = [];
    s.cam = 0;
    s.combo = 0;
    s.flash = 0;
    s.shake = 0;
  }, []);

  const start = useCallback(() => {
    reset();
    g.current.phase = "playing";
    setPhase("playing");
    setScore(0);
    setNewBest(false);
  }, [reset]);

  const drop = useCallback(() => {
    const s = g.current;
    if (s.phase !== "playing") return;
    const top = s.stack[s.stack.length - 1];
    const cur = s.cur;
    const level = s.stack.length;
    const yTop = yOf(level); // world y of the dropped pack

    let left = Math.max(cur.x, top.x);
    let right = Math.min(cur.x + cur.w, top.x + top.w);
    const overlap = right - left;

    if (overlap <= 0) {
      // Missed completely: the whole pack falls and the game ends.
      s.falling.push({ x: cur.x, y: yTop, w: cur.w, vy: 0, vx: cur.dir * 1.5, rot: 0, vr: cur.dir * 0.05 });
      s.phase = "over";
      s.shake = 14;
      setPhase("over");
      const final = s.stack.length - 1;
      setBest((b) => {
        if (final > b) {
          try { localStorage.setItem(BEST_KEY, String(final)); } catch {}
          setNewBest(true);
          return final;
        }
        return b;
      });
      return;
    }

    let w = overlap;
    if (Math.abs(cur.x - top.x) <= PERFECT) {
      // Perfect: snap into place, build combo, grow back after 3 in a row.
      left = top.x;
      w = top.w;
      s.combo += 1;
      if (s.combo >= 3) {
        const grow = Math.min(12, START_W - w);
        left -= grow / 2;
        w += grow;
      }
      s.flash = 1;
      s.pops.push({ text: s.combo >= 3 ? `PERFECT ×${s.combo}` : "PERFECT!", x: W / 2, y: yTop - 10, life: 1 });
    } else {
      s.combo = 0;
      // The overhanging piece falls off.
      const cutLeft = cur.x < top.x;
      const fx = cutLeft ? cur.x : right;
      const fw = cur.w - overlap;
      s.falling.push({ x: fx, y: yTop, w: fw, vy: 0, vx: cutLeft ? -1.2 : 1.2, rot: 0, vr: cutLeft ? -0.04 : 0.04 });
      s.shake = 4;
    }

    s.stack.push({ x: left, w });
    const next = s.stack.length - 1;
    setScore(next);
    // Next pack enters from alternating sides and gets a bit faster.
    const fromLeft = next % 2 === 1;
    s.cur = { x: fromLeft ? -w : W, w, dir: fromLeft ? 1 : -1 };
  }, []);

  // Input: tap/click on the canvas, Space/Enter anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "Enter") return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "A") return;
      e.preventDefault();
      if (g.current.phase === "playing") drop();
      else start();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drop, start]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
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
      // top highlight + bottom shade
      ctx.fillStyle = "rgba(255,255,255,.18)";
      ctx.fillRect(x, y, w, 3);
      ctx.fillStyle = "rgba(60,35,15,.22)";
      ctx.fillRect(x, y + LAYER - 6, w, 4);
      ctx.strokeStyle = "rgba(60,35,15,.35)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, LAYER - 3);
      if (w > 74) {
        ctx.fillStyle = "#16120E";
        ctx.font = "900 13px Archivo, Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("JOTAH", x + w / 2, y + LAYER / 2 - 1);
      }
      if (w > 40) {
        ctx.fillStyle = "#16120E";
        ctx.font = "900 15px Archivo, Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("J", x + 7, y + LAYER / 2);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.67); // frames at 60fps
      last = now;
      const s = g.current;
      const level = s.stack.length;

      // Move current pack
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

      // Camera keeps the top of the stack in view
      const targetCam = Math.max(0, level * LAYER - H * 0.45);
      s.cam += (targetCam - s.cam) * 0.08 * dt;

      // Physics for falling pieces & popups
      for (const f of s.falling) { f.vy += 0.45 * dt; f.y += f.vy * dt; f.x += f.vx * dt; f.rot += f.vr * dt; }
      s.falling = s.falling.filter((f) => f.y - s.cam < H + 200);
      for (const p of s.pops) { p.y -= 0.6 * dt; p.life -= 0.018 * dt; }
      s.pops = s.pops.filter((p) => p.life > 0);
      s.flash = Math.max(0, s.flash - 0.05 * dt);
      s.shake = Math.max(0, s.shake - 0.6 * dt);

      // ── Draw ──
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#2A1D14");
      bg.addColorStop(1, "#16120E");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // soft glow
      const glow = ctx.createRadialGradient(W / 2, H * 0.35, 10, W / 2, H * 0.35, 260);
      glow.addColorStop(0, `rgba(224,65,47,${0.16 + s.flash * 0.25})`);
      glow.addColorStop(1, "rgba(224,65,47,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const sx = s.shake ? (Math.random() - 0.5) * s.shake : 0;
      ctx.translate(sx, s.cam);

      // ground
      ctx.fillStyle = "#3a2a1e";
      ctx.fillRect(-40, yOf(0) + LAYER - 2, W + 80, 200);

      s.stack.forEach((b, i) => drawPack(b.x, yOf(i), b.w, KRAFT[i % KRAFT.length]));
      if (s.phase !== "over") drawPack(s.cur.x, yOf(level), s.cur.w, KRAFT[level % KRAFT.length]);

      for (const f of s.falling) {
        ctx.save();
        ctx.translate(f.x + f.w / 2, f.y + LAYER / 2);
        ctx.rotate(f.rot);
        drawPack(-f.w / 2, -LAYER / 2, f.w, "#C99C6C", 0.9);
        ctx.restore();
      }

      for (const p of s.pops) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = "#FFB199";
        ctx.font = "900 20px Archivo, Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // score
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

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reset]);

  const shareText = `What The Fun! 🔥 I stacked ${score} Jotah packs. Beat me: https://jotah.in/game`;

  return (
    <>
      <Navigation solid />
      <main className="bg-ink pb-20 pt-24 text-paper md:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div className="lg:order-2">
            <div className="relative mx-auto w-full max-w-[400px] select-none overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-paper/10">
              <canvas
                ref={canvasRef}
                onPointerDown={(e) => { e.preventDefault(); phase === "playing" ? drop() : start(); }}
                className="block aspect-[3/5] w-full touch-none cursor-pointer"
                aria-label="Stack the Packs game. Tap or press space to drop the pack."
                role="img"
              />
              {phase === "ready" && (
                <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent pb-16 text-center" data-testid="game-start">
                  <span className="font-display text-4xl font-black" style={{ fontStretch: "115%" }}>Stack the Packs</span>
                  <span className="mt-2 text-paper/70">Tap or press space to drop</span>
                  <span className="btn btn-wa wa-pulse mt-6 px-8">▶ Play</span>
                  {best > 0 && <span className="mt-4 flex items-center gap-1.5 text-sm text-paper/60"><Trophy className="h-4 w-4" /> Best: {best}</span>}
                </button>
              )}
              {phase === "over" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 px-6 text-center backdrop-blur-[2px]" data-testid="game-over">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper/60">{newBest ? "New best!" : "Game over"}</p>
                  <p className="font-display text-7xl font-black" style={{ fontStretch: "115%" }}>{score}</p>
                  <p className="text-paper/70">packs stacked</p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-paper/60"><Trophy className="h-4 w-4" /> Best: {best}</p>
                  <div className="mt-6 grid w-full max-w-[260px] gap-3">
                    <button onClick={start} className="btn btn-wa" data-testid="game-again"><RotateCcw className="h-4 w-4" /> Play again</button>
                    <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light"><WhatsAppIcon className="h-4 w-4" /> Challenge a friend</a>
                    <Link href="/product" className="btn bg-paper text-ink hover:bg-white"><ShoppingBag className="h-4 w-4" /> Shop cones</Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:order-1 lg:max-w-md">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-paper/50">What The Fun · Game</p>
            <h1 className="display text-[clamp(2.8rem,6vw,5rem)]">Stack the Packs.</h1>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              Drop each Jotah pack right on top of the last. Whatever hangs over falls off — so aim well.
              Land three <strong className="text-paper">perfect</strong> drops in a row and your pack grows back.
            </p>
            <ul className="mt-8 space-y-3 text-paper/75">
              <li>👆 <strong className="text-paper">Tap</strong> the game (or press <kbd className="rounded bg-paper/10 px-1.5 py-0.5 text-sm">Space</kbd>) to drop</li>
              <li>🎯 Perfect drop = combo bonus</li>
              <li>⚡ It gets faster as you climb</li>
              <li>🏆 Beat your best, then challenge a friend on WhatsApp</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
