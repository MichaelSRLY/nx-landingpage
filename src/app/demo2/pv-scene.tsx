"use client";

import { useEffect, useRef, useState } from "react";

type Stage = { id: string; kicker: string; heading: string; body: string };
type Component = { id: string; label: string; spec: string; stage: 1 | 2 | 3 };
type Stat = { v: number; suffix: string; label: string };

type Props = {
  totalFrames: number;
  frameBase: string;
  stages: Stage[];
  components: Component[];
  stats: Stat[];
};

const GOLD = "#d4a574";
const GOLD_SOFT = "rgba(212,165,116,0.22)";
const SCROLL_VH = 5;
const FRAME_PAD = 4;

const framePath = (base: string, i: number) =>
  `${base}${String(i).padStart(FRAME_PAD, "0")}.jpg`;

export default function PVScene({
  totalFrames,
  frameBase,
  stages,
  components,
  stats,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(0);
  const rafPending = useRef(false);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pastAnimation, setPastAnimation] = useState(false);

  // preload frames, viewport-aware tier
  useEffect(() => {
    let cancelled = false;
    const wantHD =
      typeof window !== "undefined" &&
      window.innerWidth >= 1600 &&
      (window.devicePixelRatio || 1) >= 1;
    const base = wantHD ? frameBase.replace("/frames/", "/frames-hd/") : frameBase;
    const imgs: HTMLImageElement[] = new Array(totalFrames);
    let done = 0;
    const onOne = () => {
      if (cancelled) return;
      done += 1;
      setLoaded(done);
      if (done === totalFrames) setReady(true);
    };
    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(base, i);
      img.onload = onOne;
      img.onerror = onOne;
      imgs[i] = img;
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [totalFrames, frameBase]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const cr = cw / ch, ir = iw / ih;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) {
      dh = ch; dw = dh * ir; dx = (cw - dw) / 2; dy = 0;
    } else {
      dw = cw; dh = dw / ir; dx = 0; dy = (ch - dh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      drawFrame(currentFrame.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        const rect = container.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        setProgress(p);
        const frame = Math.min(totalFrames - 1, Math.max(0, Math.round(p * (totalFrames - 1))));
        if (frame !== currentFrame.current) {
          currentFrame.current = frame;
          drawFrame(frame);
        }
        const idx = p < 0.33 ? 0 : p < 0.7 ? 1 : 2;
        setActive(idx);
        setPastAnimation(rect.bottom <= window.innerHeight);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, totalFrames]);

  const progressPct = Math.round((loaded / totalFrames) * 100);

  return (
    <>
      <style>{`
        @keyframes nxFadeUp { 0% { opacity: 0; transform: translateY(12px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes nxBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        @keyframes nxPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        .nx2-navlink:hover { color: #fff !important; }
        .nx2-cta:hover { background: ${GOLD} !important; color: #0a0b0d !important; }
        .nx2-card { transition: transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 400ms, background 400ms; }
        .nx2-card:hover { transform: translateY(-6px); border-color: rgba(212,165,116,0.35) !important; background: linear-gradient(180deg, rgba(212,165,116,0.08), rgba(255,255,255,0.02)) !important; }
        .nx2-reveal { opacity: 0; transform: translateY(32px); transition: opacity 900ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1); }
        .nx2-reveal.is-visible { opacity: 1; transform: translateY(0); }

        /* ---------- MOBILE ---------- */
        @media (max-width: 900px) {
          .nx-nav-links { display: none !important; }
          .nx-nav-location { display: none !important; }
          .nx-bom-rail { display: none !important; }
          .nx-bottom-meta-extras { display: none !important; }
          .nx-panel-copy {
            left: 4vw !important;
            right: 4vw !important;
            max-width: none !important;
            bottom: 14vh !important;
            padding: 18px 20px !important;
          }
          .nx-brand-sub { display: none !important; }
          .nx-brand-div { display: none !important; }
        }
        @media (max-width: 600px) {
          .nx-section-heading { font-size: clamp(28px, 8vw, 40px) !important; }
          .nx-cta-large { padding: 14px 20px !important; font-size: 13px !important; }
          .nx-nav-inner { padding: 8px 12px 8px 16px !important; gap: 8px !important; }
          .nx-brand-text { font-size: 11px !important; letter-spacing: 0.2em !important; }
          .nx-cta-text { display: none; }
        }
      `}</style>

      {/* FIXED STAGE */}
      <div
        style={{
          ...sx.fixedStage,
          opacity: pastAnimation ? 0 : 1,
          pointerEvents: pastAnimation ? "none" : "auto",
        }}
      >
        <canvas ref={canvasRef} style={sx.canvas} />
        <div style={sx.vignette} />
        <div style={sx.goldenTint} />

        {!ready && (
          <div style={sx.loader}>
            <div style={sx.loaderLabel}>Loading assembly</div>
            <div style={sx.loaderPct}>{progressPct}%</div>
            <div style={sx.loaderBarOuter}>
              <div style={{ ...sx.loaderBarInner, width: `${progressPct}%` }} />
            </div>
            <div style={sx.loaderCount}>
              {loaded} / {totalFrames} frames · 4K · 30 fps
            </div>
          </div>
        )}

        <TopNav />
        <BOMRail components={components} progress={progress} />
        <BottomMeta progress={progress} />
      </div>

      {/* Scroll spacer with in-flow stage panels that move up with the scroll */}
      <div
        ref={containerRef}
        style={{ height: `${SCROLL_VH * 100}vh`, position: "relative", zIndex: 10 }}
      >
        {stages.map((s, i) => (
          <ScrollPanel key={s.id} stage={s} index={i} total={stages.length} />
        ))}
      </div>

      {/* Scroll-interactive closing */}
      <HandoffSection />
      <StatsSection stats={stats} />
      <GewerkeSection />
      <ClosingCTA />
    </>
  );
}

/* ============================== Sections ============================== */

function TopNav() {
  return (
    <header style={sx.nav}>
      <div className="nx-nav-inner" style={sx.navInner}>
        <div style={sx.brand}>
          <span style={sx.brandMark}>N</span>
          <span className="nx-brand-text" style={sx.brandText}>NEXORA</span>
          <span className="nx-brand-div" style={sx.brandDiv} />
          <span className="nx-brand-sub" style={sx.brandSub}>PV-Anlage · Assembly</span>
        </div>
        <nav className="nx-nav-links" style={sx.navLinks}>
          <a className="nx2-navlink" style={sx.navLink}>Elektro</a>
          <a className="nx2-navlink" style={sx.navLink}>PV</a>
          <a className="nx2-navlink" style={sx.navLink}>Blitzschutz</a>
          <a className="nx2-navlink" style={sx.navLink}>Wärmepumpe</a>
        </nav>
        <div style={sx.navRight}>
          <span className="nx-nav-location" style={sx.location}>
            <span style={sx.locationDot} /> Leipzig
          </span>
          <button className="nx2-cta" style={sx.cta}>
            <span className="nx-cta-text">Projekt anfragen</span> <span style={sx.ctaArrow}>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * ScrollPanel lives INSIDE the scroll spacer and scrolls naturally with
 * document scroll. Its copy is anchored near the bottom-left so it passes
 * through the viewport like scroll-telling content flowing past the fixed
 * hero behind it. Opacity pulses 0 → 1 → 0 across its own viewport pass.
 */
function ScrollPanel({
  stage,
  index,
  total,
}: {
  stage: Stage;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    const copy = copyRef.current;
    if (!el || !copy) return;
    let pending = false;
    const on = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // Normalize element position: -1 = below viewport, 0 = centered, +1 = above
        const center = rect.top + rect.height / 2;
        const n = (center - vh / 2) / (vh * 0.7);
        // Bell: opacity 1 near center (|n|<0.4), fade to 0 at |n|≈1
        const op = Math.max(0, 1 - Math.abs(n) * 1.4);
        const y = Math.max(-40, Math.min(40, n * 30));
        copy.style.opacity = op.toFixed(3);
        copy.style.transform = `translateY(${-y}px)`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
      }}
    >
      <div ref={copyRef} style={sx.panelCopy} className="nx-panel-copy">
        <div style={sx.stageKicker}>
          <span style={sx.stageDot} />
          {stage.kicker}{" "}
          <span style={sx.stageProgressNum}>
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </div>
        <h2 style={sx.stageHeading}>{stage.heading}</h2>
        <p style={sx.stageBody}>{stage.body}</p>
      </div>
    </div>
  );
}

function BOMRail({
  components,
  progress,
}: {
  components: Component[];
  progress: number;
}) {
  // components light up as we pass their stage threshold
  const stageOf = (p: number) => (p < 0.33 ? 1 : p < 0.7 ? 2 : 3);
  const cur = stageOf(progress);
  return (
    <aside className="nx-bom-rail" style={sx.rail}>
      <div style={sx.railGlass}>
        <div style={sx.railHeader}>
          <span style={sx.railHeaderLabel}>Bill of materials</span>
          <span style={sx.railHeaderValue}>
            {String(Math.round(progress * 100)).padStart(2, "0")}%
          </span>
        </div>
        <ul style={sx.railList}>
          {components.map((c) => {
            const installed = c.stage <= cur;
            const activeNow = c.stage === cur;
            return (
              <li key={c.id} style={sx.railItem}>
                <span
                  style={{
                    ...sx.railDot,
                    background: installed ? GOLD : "rgba(255,255,255,0.18)",
                    boxShadow: activeNow ? `0 0 0 5px ${GOLD_SOFT}` : "none",
                    animation: activeNow ? "nxPulse 1.6s ease-in-out infinite" : "none",
                  }}
                />
                <span style={sx.railItemBody}>
                  <span
                    style={{
                      ...sx.railItemName,
                      color: installed ? "#fff" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {c.label}
                  </span>
                  <span style={sx.railItemSpec}>{c.spec}</span>
                </span>
                <span
                  style={{
                    ...sx.railItemCheck,
                    color: installed ? GOLD : "rgba(255,255,255,0.15)",
                  }}
                >
                  {installed ? "✓" : "·"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

function BottomMeta({ progress }: { progress: number }) {
  return (
    <div style={sx.bottomMeta}>
      <div className="nx-bottom-meta-extras" style={sx.metaLeft}>
        <span style={sx.metaLabel}>State</span>
        <span style={sx.metaValue}>
          {progress < 0.33 ? "READY" : progress < 0.7 ? "ASSEMBLING" : "OPERATIONAL"}
        </span>
      </div>
      <div style={sx.metaCenter}>
        <span style={sx.scrollHint}>Scroll to commission</span>
        <span style={sx.scrollArrow}>↓</span>
      </div>
      <div className="nx-bottom-meta-extras" style={sx.metaRight}>
        <span style={sx.metaLabel}>Project</span>
        <span style={sx.metaValue}>NX-PV · 5.4 kWp Demo</span>
      </div>
    </div>
  );
}

/* ---------- Scroll-reveal hook + wrapper ---------- */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const r = useReveal<HTMLDivElement>();
  return (
    <div
      ref={r}
      className="nx2-reveal"
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- Handoff: big image reveal + tagline ---------- */

function HandoffSection() {
  return (
    <section style={sx.handoffSection}>
      <div style={sx.handoffGlow} />
      <div style={sx.sectionInner}>
        <Reveal>
          <div style={sx.sectionKicker}>Ergebnis</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="nx-section-heading" style={sx.sectionHeading}>
            Vom Komponentenkit zur{" "}
            <span style={{ color: GOLD }}>laufenden Anlage</span> — in 8 Sekunden, und in echt in 3 Tagen.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p style={sx.sectionLede}>
            Jede PV-Anlage von Nexora ist durchgeplant, vormontiert und dokumentiert,
            bevor sie die Werkstatt verlässt. Was auf der Baustelle passiert, ist nur
            noch die saubere Montage.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Stats with animated count-up ---------- */

function StatsSection({ stats }: { stats: Stat[] }) {
  return (
    <section style={sx.statsSection}>
      <div style={sx.sectionInner}>
        <div style={sx.statsGrid}>
          {stats.map((s, i) => (
            <CountUp key={i} target={s.v} suffix={s.suffix} label={s.label} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CountUp({
  target,
  suffix,
  label,
  delay,
}: {
  target: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) setStarted(true);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, delay]);

  const shown =
    target >= 100
      ? Math.round(val).toLocaleString("de-DE")
      : target >= 10
      ? Math.round(val).toLocaleString("de-DE")
      : val.toFixed(1).replace(".", ",");

  return (
    <div ref={ref} style={sx.statItem}>
      <div style={sx.statValue}>
        {shown}
        <span style={sx.statSuffix}>{suffix}</span>
      </div>
      <div style={sx.statLabel}>{label}</div>
    </div>
  );
}

/* ---------- Gewerke grid with parallax reveal ---------- */

function GewerkeSection() {
  const items = [
    { n: "01", title: "Elektro", body: "Niederspannung, Mittelspannung, USV, Schaltschrankbau · VDE 0100." },
    { n: "02", title: "PV", body: "Aufdach & Freifläche bis Multi-MW · Wechselrichter, Netzanschluss, Monitoring." },
    { n: "03", title: "Blitzschutz", body: "Äußerer + innerer Blitzschutz · DIN EN 62305-3 Beiblatt 5 für PV." },
    { n: "04", title: "Wärmepumpe", body: "Luft-Wasser & Sole-Wasser · Auslegung, hydraulischer Abgleich, Inbetriebnahme." },
  ];
  return (
    <section style={sx.gewerkeSection}>
      <div style={sx.sectionInner}>
        <Reveal><div style={sx.sectionKicker}>Gewerke</div></Reveal>
        <Reveal delay={80}>
          <h2 className="nx-section-heading" style={sx.sectionHeading}>
            Vier Gewerke. <span style={{ color: GOLD }}>Ein Generalunternehmer.</span>
          </h2>
        </Reveal>
        <div style={sx.grid}>
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 90}>
              <div className="nx2-card" style={sx.card}>
                <div style={sx.cardNum}>{it.n}</div>
                <div style={sx.cardTitle}>{it.title}</div>
                <div style={sx.cardBody}>{it.body}</div>
                <div style={sx.cardLink}>Details →</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing CTA with parallax glow ---------- */

function ClosingCTA() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const off = Math.max(-300, Math.min(300, rect.top - window.innerHeight / 2));
      el.style.transform = `translate(-50%, ${-off * 0.15}px)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section style={sx.ctaSection}>
      <div ref={glowRef} style={sx.ctaGlow} />
      <div style={sx.sectionInner}>
        <Reveal><div style={sx.sectionKicker}>Ihr Projekt</div></Reveal>
        <Reveal delay={80}>
          <h2 className="nx-section-heading" style={sx.sectionHeading}>
            Von der Planung bis zur <span style={{ color: GOLD }}>Inbetriebnahme</span>.
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p style={sx.sectionLede}>
            Wir erstellen Ihnen ein Komplettangebot über alle Gewerke —
            Zeitplan, Mengengerüst, Dokumentationsumfang, Abnahme.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div style={sx.ctaActions}>
            <button className="nx2-cta nx-cta-large" style={sx.ctaLarge}>
              Projekt anfragen <span style={sx.ctaArrow}>→</span>
            </button>
            <a style={sx.ctaGhost}>hallo@nexora.energy</a>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div style={sx.ctaMeta}>
            Nexora GmbH · Leipzig · Generalunternehmer für Energieinfrastruktur
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================== Styles ============================== */

const glass: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px) saturate(140%)",
  WebkitBackdropFilter: "blur(20px) saturate(140%)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 80px -20px rgba(0,0,0,0.6)",
};

const sx: Record<string, React.CSSProperties> = {
  fixedStage: {
    position: "fixed", inset: 0, width: "100vw", height: "100vh",
    overflow: "hidden", background: "#05070a", zIndex: 1,
    transition: "opacity 500ms ease", fontFamily: "Inter, system-ui, sans-serif",
  },
  canvas: { position: "absolute", inset: 0, width: "100%", height: "100%", background: "#05070a", display: "block" },
  vignette: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
    pointerEvents: "none",
  },
  goldenTint: {
    position: "absolute", inset: 0,
    background: "linear-gradient(180deg, rgba(212,165,116,0.04) 0%, transparent 40%, transparent 60%, rgba(5,7,10,0.5) 100%)",
    pointerEvents: "none",
  },

  loader: {
    position: "absolute", inset: 0, zIndex: 40,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: "rgba(5,7,10,0.96)", color: "#fff",
  },
  loaderLabel: { fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: GOLD, opacity: 0.9 },
  loaderPct: { marginTop: 16, fontSize: 56, fontWeight: 200, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" },
  loaderBarOuter: { marginTop: 20, height: 1, width: 260, background: "rgba(255,255,255,0.1)", overflow: "hidden" },
  loaderBarInner: { height: "100%", background: GOLD, transition: "width 80ms linear", boxShadow: `0 0 20px ${GOLD}` },
  loaderCount: { marginTop: 14, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.4 },

  /* nav */
  nav: { position: "absolute", top: 16, left: 16, right: 16, zIndex: 20 },
  navInner: { ...glass, borderRadius: 999, padding: "10px 16px 10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: {
    width: 26, height: 26, borderRadius: 999,
    background: `linear-gradient(135deg, ${GOLD}, #8a6a43)`,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 600, color: "#111",
  },
  brandText: { fontSize: 13, fontWeight: 500, letterSpacing: "0.28em" },
  brandDiv: { width: 1, height: 14, background: "rgba(255,255,255,0.18)", marginLeft: 6 },
  brandSub: { fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.55 },
  navLinks: { display: "flex", gap: 22 },
  navLink: { fontSize: 12, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", cursor: "pointer", transition: "color 200ms" },
  navRight: { display: "flex", alignItems: "center", gap: 14 },
  location: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" },
  locationDot: { width: 6, height: 6, borderRadius: 999, background: GOLD, boxShadow: `0 0 10px ${GOLD}` },
  cta: { background: "#fff", color: "#0a0b0d", border: "none", padding: "9px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 200ms, color 200ms" },
  ctaArrow: { fontSize: 14, lineHeight: 1 },

  /* stage copy */
  panelCopy: {
    ...glass,
    position: "absolute", left: "max(24px, 4vw)", bottom: "18vh",
    maxWidth: 520, borderRadius: 18, padding: "26px 30px",
    willChange: "opacity, transform",
    transition: "opacity 220ms linear, transform 220ms linear",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  stageProgressNum: {
    marginLeft: 10, fontSize: 10, letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.45)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  stageKicker: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD },
  stageDot: { width: 5, height: 5, borderRadius: 999, background: GOLD, boxShadow: `0 0 10px ${GOLD}` },
  stageHeading: { marginTop: 14, marginBottom: 0, fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 200, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fff" },
  stageBody: { marginTop: 12, fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", maxWidth: 440 },

  /* BOM rail */
  rail: { position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", zIndex: 15 },
  railGlass: { ...glass, borderRadius: 18, padding: "22px 22px", width: 320, fontFamily: "Inter, system-ui, sans-serif" },
  railHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  railHeaderLabel: { fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" },
  railHeaderValue: { fontSize: 13, color: GOLD, letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" },
  railList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 },
  railItem: { display: "flex", alignItems: "center", gap: 12 },
  railDot: { width: 8, height: 8, borderRadius: 999, flexShrink: 0, transition: "background 200ms, box-shadow 200ms" },
  railItemBody: { display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 },
  railItemName: { fontSize: 12, letterSpacing: "0.05em", transition: "color 200ms" },
  railItemSpec: { fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" },
  railItemCheck: { fontSize: 14, transition: "color 200ms", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },

  /* bottom meta */
  bottomMeta: {
    position: "absolute", left: 0, right: 0, bottom: 24, zIndex: 15,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", pointerEvents: "none",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  metaLeft: { display: "flex", flexDirection: "column", gap: 4 },
  metaCenter: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  metaRight: { display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" },
  metaLabel: { fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" },
  metaValue: { fontSize: 12, letterSpacing: "0.05em", color: "rgba(255,255,255,0.85)", fontVariantNumeric: "tabular-nums" },
  scrollHint: { fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: GOLD },
  scrollArrow: { fontSize: 14, color: "rgba(255,255,255,0.7)", animation: "nxBob 2s ease-in-out infinite" },

  /* sections */
  sectionInner: { maxWidth: 1200, margin: "0 auto" },
  sectionKicker: { fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: GOLD },
  sectionHeading: { marginTop: 18, marginBottom: 0, fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 200, letterSpacing: "-0.02em", lineHeight: 1.05, color: "#fff", maxWidth: 960 },
  sectionLede: { marginTop: 24, maxWidth: 680, fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.65)" },

  handoffSection: {
    position: "relative", zIndex: 2,
    background: "radial-gradient(ellipse at 30% 20%, rgba(212,165,116,0.08), transparent 60%), #05070a",
    padding: "160px 24px 100px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  handoffGlow: {
    position: "absolute", right: "-10%", top: "-20%", width: 640, height: 640,
    borderRadius: 999, background: `radial-gradient(circle, ${GOLD_SOFT}, transparent 65%)`,
    filter: "blur(80px)", pointerEvents: "none",
  },

  statsSection: { position: "relative", zIndex: 2, background: "#05070a", padding: "40px 24px 100px", fontFamily: "Inter, system-ui, sans-serif" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24,
    borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "48px 0",
  },
  statItem: { display: "flex", flexDirection: "column", gap: 10 },
  statValue: { fontSize: "clamp(32px, 3.4vw, 48px)", fontWeight: 200, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" },
  statSuffix: { color: GOLD, fontSize: "0.55em", marginLeft: 6, letterSpacing: "0.02em" },
  statLabel: { fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" },

  gewerkeSection: { position: "relative", zIndex: 2, background: "linear-gradient(180deg, #05070a 0%, #080a0e 80%, #05070a 100%)", padding: "120px 24px 80px", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "Inter, system-ui, sans-serif" },
  grid: { marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 },
  card: {
    ...glass, borderRadius: 20, padding: "28px 26px 24px",
    display: "flex", flexDirection: "column", gap: 14, minHeight: 240, cursor: "pointer",
  },
  cardNum: { fontSize: 11, letterSpacing: "0.35em", color: GOLD, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  cardTitle: { fontSize: 22, fontWeight: 300, letterSpacing: "-0.01em", color: "#fff" },
  cardBody: { fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", flexGrow: 1 },
  cardLink: { fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD },

  ctaSection: {
    position: "relative", zIndex: 2,
    background: "radial-gradient(ellipse at 50% 120%, rgba(212,165,116,0.12) 0%, transparent 60%), #05070a",
    padding: "140px 24px 160px", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  ctaGlow: {
    position: "absolute", left: "50%", bottom: "-160px", transform: "translateX(-50%)",
    width: 900, height: 900, borderRadius: 999,
    background: `radial-gradient(circle, ${GOLD_SOFT} 0%, transparent 60%)`,
    filter: "blur(60px)", pointerEvents: "none",
    willChange: "transform",
  },
  ctaActions: { marginTop: 48, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  ctaLarge: { background: "#fff", color: "#0a0b0d", border: "none", padding: "18px 28px", borderRadius: 999, fontSize: 14, fontWeight: 500, letterSpacing: "0.05em", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 20px 60px -20px ${GOLD_SOFT}`, transition: "background 200ms, transform 200ms" },
  ctaGhost: { fontSize: 13, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", borderBottom: "1px solid rgba(255,255,255,0.25)", padding: "4px 0", cursor: "pointer" },
  ctaMeta: { marginTop: 60, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" },
};
