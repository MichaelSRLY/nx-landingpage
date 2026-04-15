"use client";

import { useEffect, useRef, useState } from "react";

type Stage = { id: string; kicker: string; heading: string; body: string };
type Props = {
  totalFrames: number;
  frameBase: string;
  stages: Stage[];
};

const SCROLL_MULTIPLIER = 6; // 6× viewport to give room for each stage to breathe
const FRAME_PAD = 4;
const GOLD = "#d4a574";
const GOLD_SOFT = "rgba(212, 165, 116, 0.18)";

const framePath = (base: string, i: number) =>
  `${base}${String(i).padStart(FRAME_PAD, "0")}.jpg`;

export default function ScrollSequence({ totalFrames, frameBase, stages }: Props) {
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

  // Preload all frames (viewport-aware tier)
  useEffect(() => {
    let cancelled = false;
    // Pick HD tier for wide screens with a decent DPR → sharper on large displays
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
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const cr = cw / ch;
    const ir = iw / ih;
    let dw: number, dh: number, dx: number, dy: number;
    if (ir > cr) {
      dh = ch;
      dw = dh * ir;
      dx = (cw - dw) / 2;
      dy = 0;
    } else {
      dw = cw;
      dh = dw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Size canvas
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

  // Scroll -> frame + stage + progress
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
        const frame = Math.min(
          totalFrames - 1,
          Math.max(0, Math.round(p * (totalFrames - 1)))
        );
        if (frame !== currentFrame.current) {
          currentFrame.current = frame;
          drawFrame(frame);
        }
        const idx = Math.min(
          stages.length - 1,
          Math.max(0, Math.floor(p * stages.length))
        );
        setActive(idx);
        setPastAnimation(rect.bottom <= window.innerHeight);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, totalFrames, stages.length]);

  const progressPct = Math.round((loaded / totalFrames) * 100);

  return (
    <>
      <style>{`
        @keyframes nxFadeUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes nxBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .nx-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212,165,116,0.35) !important;
          background: linear-gradient(180deg, rgba(212,165,116,0.08) 0%, rgba(255,255,255,0.02) 100%) !important;
        }
        .nx-navlink:hover { color: #fff !important; }
        .nx-cta:hover { background: ${GOLD} !important; color: #0a0b0d !important; }
        .nx-cta-large:hover { background: ${GOLD} !important; transform: translateY(-2px); }

        /* Mobile */
        @media (max-width: 900px) {
          .nx-nav-links { display: none !important; }
          .nx-nav-location { display: none !important; }
          .nx-rail { display: none !important; }
          .nx-meta-extras { display: none !important; }
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
          .nx-nav-inner { padding: 8px 12px 8px 16px !important; gap: 8px !important; }
          .nx-brand-text { font-size: 11px !important; letter-spacing: 0.2em !important; }
          .nx-cta-text { display: none !important; }
        }
      `}</style>

      {/* === FIXED HERO STAGE === */}
      <div
        style={{
          ...sx.fixedStage,
          opacity: pastAnimation ? 0 : 1,
          pointerEvents: pastAnimation ? "none" : "auto",
        }}
        aria-hidden={pastAnimation}
      >
        <canvas ref={canvasRef} style={sx.canvas} />

        {/* Cinematic vignette + golden-hour tint */}
        <div style={sx.vignette} />
        <div style={sx.goldenTint} />

        {/* Loader */}
        {!ready && (
          <div style={sx.loader}>
            <div style={sx.loaderLabel}>Commissioning sequence</div>
            <div style={sx.loaderPct}>{progressPct}%</div>
            <div style={sx.loaderBarOuter}>
              <div style={{ ...sx.loaderBarInner, width: `${progressPct}%` }} />
            </div>
            <div style={sx.loaderCount}>
              {loaded} / {totalFrames} frames
            </div>
          </div>
        )}

        {/* Top nav */}
        <TopNav />

        {/* Stage rail right */}
        <StageRail stages={stages} active={active} progress={progress} />

        {/* Bottom meta row */}
        <BottomMeta progress={progress} />
      </div>

      {/* === SPACER with scroll-telling panels === */}
      <div
        ref={containerRef}
        style={{ height: `${SCROLL_MULTIPLIER * 100}vh`, position: "relative", zIndex: 10 }}
      >
        {stages.map((s, i) => (
          <ScrollPanel key={s.id} stage={s} index={i} total={stages.length} />
        ))}
      </div>

      {/* === POST-ANIMATION SECTIONS === */}
      <GewerkeGrid />
      <StatsRow />
      <ClosingCTA />
    </>
  );
}

/* --------------------------- components --------------------------- */

function TopNav() {
  return (
    <header style={sx.nav}>
      <div className="nx-nav-inner" style={sx.navInner}>
        <div style={sx.brand}>
          <span style={sx.brandMark}>N</span>
          <span className="nx-brand-text" style={sx.brandText}>NEXORA</span>
          <span className="nx-brand-div" style={sx.brandDiv} />
          <span className="nx-brand-sub" style={sx.brandSub}>Energieinfrastruktur</span>
        </div>
        <nav className="nx-nav-links" style={sx.navLinks}>
          <a className="nx-navlink" style={sx.navLink}>Elektro</a>
          <a className="nx-navlink" style={sx.navLink}>PV</a>
          <a className="nx-navlink" style={sx.navLink}>Blitzschutz</a>
          <a className="nx-navlink" style={sx.navLink}>Wärmepumpe</a>
        </nav>
        <div style={sx.navRight}>
          <span className="nx-nav-location" style={sx.location}>
            <span style={sx.locationDot} />
            Standort Leipzig
          </span>
          <button className="nx-cta" style={sx.cta}>
            <span className="nx-cta-text">Projekt anfragen</span>
            <span style={sx.ctaArrow}>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

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
        const center = rect.top + rect.height / 2;
        const n = (center - vh / 2) / (vh * 0.7);
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
    <div ref={ref} style={{ position: "relative", height: "100vh", width: "100%" }}>
      <div ref={copyRef} className="nx-panel-copy" style={sx.panelCopy}>
        <div style={sx.stageKicker}>
          <span style={sx.stageKickerDot} />
          {stage.kicker}{" "}
          <span style={sx.panelProgress}>
            {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
          </span>
        </div>
        <h2 style={sx.stageHeading}>{stage.heading}</h2>
        <p style={sx.stageBody}>{stage.body}</p>
      </div>
    </div>
  );
}

function StageRail({
  stages,
  active,
  progress,
}: {
  stages: Stage[];
  active: number;
  progress: number;
}) {
  return (
    <aside className="nx-rail" style={sx.rail}>
      <div style={sx.railGlass}>
        <div style={sx.railHeader}>
          <span style={sx.railHeaderLabel}>Commissioning</span>
          <span style={sx.railHeaderValue}>
            {String(Math.round(progress * 100)).padStart(2, "0")}%
          </span>
        </div>
        <div style={sx.railTrack}>
          <div style={{ ...sx.railTrackFill, height: `${progress * 100}%` }} />
        </div>
        <ul style={sx.railList}>
          {stages.map((s, i) => (
            <li key={s.id} style={sx.railItem}>
              <span
                style={{
                  ...sx.railDot,
                  background: i <= active ? GOLD : "rgba(255,255,255,0.18)",
                  boxShadow:
                    i === active ? `0 0 0 5px ${GOLD_SOFT}` : "none",
                }}
              />
              <span
                style={{
                  ...sx.railLabel,
                  color:
                    i === active
                      ? "#fff"
                      : i < active
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(255,255,255,0.35)",
                }}
              >
                {s.kicker}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function BottomMeta({ progress }: { progress: number }) {
  return (
    <div style={sx.bottomMeta}>
      <div className="nx-meta-extras" style={sx.metaLeft}>
        <span style={sx.metaLabel}>Viewpoint</span>
        <span style={sx.metaValue}>
          {progress < 0.2
            ? "Interior · Ground"
            : progress < 0.55
            ? "Cinematic Ascent"
            : "Aerial · 50°"}
        </span>
      </div>
      <div style={sx.metaCenter}>
        <span style={sx.scrollHint}>Scroll to commission</span>
        <span style={sx.scrollArrow}>↓</span>
      </div>
      <div className="nx-meta-extras" style={sx.metaRight}>
        <span style={sx.metaLabel}>Project</span>
        <span style={sx.metaValue}>NX-2026 · Industriehalle</span>
      </div>
    </div>
  );
}

function GewerkeGrid() {
  const items = [
    {
      n: "01",
      title: "Elektroinstallation",
      body:
        "Niederspannung, Mittelspannung, USV, Schaltschrankbau. VDE 0100 konform, dokumentiert und messbar.",
    },
    {
      n: "02",
      title: "PV-Anlagen",
      body:
        "Aufdach und Freifläche, bis Multi-MW. Wechselrichter, Zählerplatz, Netzanschluss, Monitoring.",
    },
    {
      n: "03",
      title: "Blitzschutz",
      body:
        "Äußerer + innerer Blitzschutz. DIN EN 62305-3 Beiblatt 5 für PV. Fundamenterder, Überspannungsschutz.",
    },
    {
      n: "04",
      title: "Wärmepumpen",
      body:
        "Luft-Wasser, Sole-Wasser. Auslegung, Installation, hydraulischer Abgleich, Inbetriebnahme.",
    },
  ];
  return (
    <section style={sx.gewerkeSection}>
      <div style={sx.sectionInner}>
        <div style={sx.sectionKicker}>Gewerke</div>
        <h2 style={sx.sectionHeading}>
          Vier Gewerke.{" "}
          <span style={{ color: GOLD }}>Ein Generalunternehmer.</span>
        </h2>
        <p style={sx.sectionLede}>
          Elektroinstallation, PV, Blitzschutz und Wärmepumpe — koordiniert,
          dokumentiert, abgenommen. Eine Halle, ein Vertrag, eine Abnahme.
        </p>
        <div style={sx.grid}>
          {items.map((it) => (
            <div key={it.n} className="nx-card" style={sx.card}>
              <div style={sx.cardNum}>{it.n}</div>
              <div style={sx.cardTitle}>{it.title}</div>
              <div style={sx.cardBody}>{it.body}</div>
              <div style={sx.cardLink}>
                Details <span style={{ marginLeft: 6 }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  const stats = [
    { v: "42+", l: "Projekte in Ausführung" },
    { v: "12,8", l: "MWp installierte PV-Leistung" },
    { v: "DIN EN 62305", l: "Blitzschutz normkonform" },
    { v: "Sachsen", l: "Standort & Einsatzregion" },
  ];
  return (
    <section style={sx.statsSection}>
      <div style={sx.sectionInner}>
        <div style={sx.statsGrid}>
          {stats.map((s, i) => (
            <div key={i} style={sx.statItem}>
              <div style={sx.statValue}>{s.v}</div>
              <div style={sx.statLabel}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section style={sx.ctaSection}>
      <div style={sx.ctaGlow} />
      <div style={sx.sectionInner}>
        <div style={sx.sectionKicker}>Ihr Projekt</div>
        <h2 style={sx.sectionHeading}>
          Von der Planung bis zur{" "}
          <span style={{ color: GOLD }}>Inbetriebnahme</span>.
        </h2>
        <p style={sx.sectionLede}>
          Sprechen Sie mit uns über Ihre Halle. Wir erstellen Ihnen ein
          Komplettangebot über alle Gewerke — inklusive Zeitplan, Mengengerüst
          und Dokumentationsumfang.
        </p>
        <div style={sx.ctaActions}>
          <button className="nx-cta-large" style={sx.ctaLarge}>
            Projekt anfragen <span style={sx.ctaArrow}>→</span>
          </button>
          <a style={sx.ctaGhost}>
            hallo@nexora.energy
          </a>
        </div>
        <div style={sx.ctaMeta}>
          Nexora GmbH · Leipzig · Generalunternehmer für Energieinfrastruktur
        </div>
      </div>
    </section>
  );
}

/* --------------------------- styles --------------------------- */

const glassBase: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px) saturate(140%)",
  WebkitBackdropFilter: "blur(20px) saturate(140%)",
  boxShadow:
    "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 80px -20px rgba(0,0,0,0.6)",
};

const sx: Record<string, React.CSSProperties> = {
  fixedStage: {
    position: "fixed",
    inset: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#05070a",
    zIndex: 1,
    transition: "opacity 500ms ease",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  canvas: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    background: "#05070a",
    display: "block",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
    pointerEvents: "none",
  },
  goldenTint: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(212,165,116,0.04) 0%, transparent 40%, transparent 60%, rgba(5,7,10,0.5) 100%)",
    pointerEvents: "none",
  },

  /* ---------- loader ---------- */
  loader: {
    position: "absolute",
    inset: 0,
    zIndex: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(5,7,10,0.96)",
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  loaderLabel: {
    fontSize: 10,
    letterSpacing: "0.38em",
    textTransform: "uppercase",
    color: GOLD,
    opacity: 0.9,
  },
  loaderPct: {
    marginTop: 16,
    fontSize: 56,
    fontWeight: 200,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "-0.02em",
  },
  loaderBarOuter: {
    marginTop: 20,
    height: 1,
    width: 260,
    background: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  loaderBarInner: {
    height: "100%",
    background: GOLD,
    transition: "width 80ms linear",
    boxShadow: `0 0 20px ${GOLD}`,
  },
  loaderCount: {
    marginTop: 14,
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    opacity: 0.4,
  },

  /* ---------- nav ---------- */
  nav: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  navInner: {
    ...glassBase,
    borderRadius: 999,
    padding: "10px 16px 10px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandMark: {
    width: 26,
    height: 26,
    borderRadius: 999,
    background: `linear-gradient(135deg, ${GOLD}, #8a6a43)`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
    color: "#111",
  },
  brandText: {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: "0.28em",
  },
  brandDiv: {
    width: 1,
    height: 14,
    background: "rgba(255,255,255,0.18)",
    marginLeft: 6,
  },
  brandSub: {
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    opacity: 0.55,
  },
  navLinks: { display: "flex", gap: 22 },
  navLink: {
    fontSize: 12,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
    transition: "color 200ms",
  },
  navRight: { display: "flex", alignItems: "center", gap: 14 },
  location: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    background: GOLD,
    boxShadow: `0 0 10px ${GOLD}`,
  },
  cta: {
    background: "#fff",
    color: "#0a0b0d",
    border: "none",
    padding: "9px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: "0.05em",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  ctaArrow: { fontSize: 14, lineHeight: 1 },

  /* ---------- stage copy ---------- */
  panelCopy: {
    ...glassBase,
    position: "absolute",
    left: "max(24px, 4vw)",
    bottom: "18vh",
    maxWidth: 540,
    borderRadius: 18,
    padding: "26px 30px",
    willChange: "opacity, transform",
    transition: "opacity 220ms linear, transform 220ms linear",
  },
  panelProgress: {
    marginLeft: 10,
    fontSize: 10,
    letterSpacing: "0.3em",
    color: "rgba(255,255,255,0.45)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  stageKicker: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: GOLD,
  },
  stageKickerDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    background: GOLD,
    boxShadow: `0 0 10px ${GOLD}`,
  },
  stageHeading: {
    marginTop: 14,
    marginBottom: 0,
    fontSize: "clamp(26px, 3.4vw, 38px)",
    fontWeight: 300,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    color: "#fff",
  },
  stageBody: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.75)",
    maxWidth: 460,
  },

  /* ---------- rail ---------- */
  rail: {
    position: "absolute",
    right: 32,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 15,
  },
  railGlass: {
    ...glassBase,
    borderRadius: 18,
    padding: "22px 22px 22px 22px",
    width: 260,
    display: "flex",
    flexDirection: "column",
    gap: 18,
    position: "relative",
  },
  railHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  railHeaderLabel: {
    fontSize: 10,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.55)",
  },
  railHeaderValue: {
    fontSize: 13,
    color: GOLD,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.05em",
  },
  railTrack: {
    position: "absolute",
    left: 34,
    top: 66,
    bottom: 22,
    width: 1,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  railTrackFill: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    background: `linear-gradient(180deg, ${GOLD} 0%, rgba(212,165,116,0.2) 100%)`,
    boxShadow: `0 0 12px ${GOLD_SOFT}`,
    transition: "height 120ms linear",
  },
  railList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  railItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  railDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    flexShrink: 0,
    marginLeft: 7,
    transition: "background 200ms, box-shadow 200ms",
  },
  railLabel: {
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    transition: "color 200ms",
  },

  /* ---------- bottom meta ---------- */
  bottomMeta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    zIndex: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    pointerEvents: "none",
  },
  metaLeft: { display: "flex", flexDirection: "column", gap: 4 },
  metaCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  metaRight: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 9,
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.45)",
  },
  metaValue: {
    fontSize: 12,
    letterSpacing: "0.05em",
    color: "rgba(255,255,255,0.85)",
    fontVariantNumeric: "tabular-nums",
  },
  scrollHint: {
    fontSize: 10,
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: GOLD,
  },
  scrollArrow: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    animation: "nxBob 2s ease-in-out infinite",
  },

  /* ---------- sections ---------- */
  gewerkeSection: {
    position: "relative",
    zIndex: 2,
    background:
      "linear-gradient(180deg, #05070a 0%, #080a0e 80%, #05070a 100%)",
    padding: "140px 24px 80px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  statsSection: {
    position: "relative",
    zIndex: 2,
    background: "#05070a",
    padding: "40px 24px 100px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  ctaSection: {
    position: "relative",
    zIndex: 2,
    background:
      "radial-gradient(ellipse at 50% 120%, rgba(212,165,116,0.12) 0%, transparent 60%), #05070a",
    padding: "140px 24px 160px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  ctaGlow: {
    position: "absolute",
    left: "50%",
    bottom: "-160px",
    transform: "translateX(-50%)",
    width: 900,
    height: 900,
    borderRadius: 999,
    background: `radial-gradient(circle, ${GOLD_SOFT} 0%, transparent 60%)`,
    filter: "blur(60px)",
    pointerEvents: "none",
  },
  sectionInner: { maxWidth: 1200, margin: "0 auto" },
  sectionKicker: {
    fontSize: 10,
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: GOLD,
  },
  sectionHeading: {
    marginTop: 18,
    marginBottom: 0,
    fontSize: "clamp(36px, 5.5vw, 64px)",
    fontWeight: 200,
    letterSpacing: "-0.02em",
    lineHeight: 1.05,
    color: "#fff",
    maxWidth: 900,
  },
  sectionLede: {
    marginTop: 24,
    maxWidth: 640,
    fontSize: 16,
    lineHeight: 1.65,
    color: "rgba(255,255,255,0.65)",
  },

  /* ---------- gewerke grid ---------- */
  grid: {
    marginTop: 64,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    ...glassBase,
    borderRadius: 20,
    padding: "28px 26px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    transition: "transform 400ms, border-color 400ms, background 400ms",
    cursor: "pointer",
    minHeight: 240,
  },
  cardNum: {
    fontSize: 11,
    letterSpacing: "0.35em",
    color: GOLD,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 300,
    letterSpacing: "-0.01em",
    color: "#fff",
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.65)",
    flexGrow: 1,
  },
  cardLink: {
    fontSize: 11,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: GOLD,
    display: "inline-flex",
    alignItems: "center",
  },

  /* ---------- stats ---------- */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 24,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "48px 0",
  },
  statItem: { display: "flex", flexDirection: "column", gap: 10 },
  statValue: {
    fontSize: "clamp(32px, 3.2vw, 44px)",
    fontWeight: 200,
    color: "#fff",
    letterSpacing: "-0.02em",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
  },

  /* ---------- cta ---------- */
  ctaActions: {
    marginTop: 48,
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  ctaLarge: {
    background: "#fff",
    color: "#0a0b0d",
    border: "none",
    padding: "18px 28px",
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: "0.05em",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    boxShadow: `0 20px 60px -20px ${GOLD_SOFT}`,
  },
  ctaGhost: {
    fontSize: 13,
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.25)",
    padding: "4px 0",
    cursor: "pointer",
  },
  ctaMeta: {
    marginTop: 60,
    fontSize: 11,
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
  },
};
