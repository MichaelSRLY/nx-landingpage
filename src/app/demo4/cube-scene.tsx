"use client";

import { useEffect, useRef, useState } from "react";

type Stage = { id: string; kicker: string; heading: string; body: string };
type Stat = { v: number; suffix: string; label: string };
type Props = { stages: Stage[]; stats: Stat[] };

const GOLD = "#d4a574";
const GOLD_SOFT = "rgba(212,165,116,0.22)";
const SCROLL_VH = 6;

const glass: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(20px) saturate(140%)",
  WebkitBackdropFilter: "blur(20px) saturate(140%)",
  boxShadow:
    "0 1px 0 rgba(255,255,255,0.06) inset, 0 24px 80px -20px rgba(0,0,0,0.6)",
};

/* ---------- Cube face definitions (6 faces = 4 Gewerke + 2 accents) ---------- */

type FaceKey = "front" | "back" | "right" | "left" | "top" | "bottom";
type FaceDef = {
  key: FaceKey;
  label: string;
  code: string;
  sub: string;
  explodeDir: [number, number, number];
  rotation: string;
  tone: "gold" | "slate";
};

const FACES: FaceDef[] = [
  { key: "front",  label: "Elektroinstallation", code: "01", sub: "VDE 0100", explodeDir: [0, 0, 1], rotation: "translateZ(var(--s))", tone: "gold" },
  { key: "top",    label: "PV-Anlage",          code: "02", sub: "EEG · MsbG",  explodeDir: [0, -1, 0], rotation: "rotateX(90deg) translateZ(var(--s))", tone: "gold" },
  { key: "right",  label: "Blitzschutz",        code: "03", sub: "DIN EN 62305", explodeDir: [1, 0, 0], rotation: "rotateY(90deg) translateZ(var(--s))", tone: "gold" },
  { key: "left",   label: "Wärmepumpe",         code: "04", sub: "GEG",          explodeDir: [-1, 0, 0], rotation: "rotateY(-90deg) translateZ(var(--s))", tone: "gold" },
  { key: "back",   label: "Monitoring",         code: "—",  sub: "Live Daten",   explodeDir: [0, 0, -1], rotation: "rotateY(180deg) translateZ(var(--s))", tone: "slate" },
  { key: "bottom", label: "Tiefbau & Erdung",   code: "—",  sub: "Fundament",    explodeDir: [0, 1, 0], rotation: "rotateX(-90deg) translateZ(var(--s))", tone: "slate" },
];

/* ============================================================ */
/*  Main Scene                                                    */
/* ============================================================ */

export default function CubeScene({ stages, stats }: Props) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafPending = useRef(false);
  const [progress, setProgress] = useState(0);
  const [pastAnimation, setPastAnimation] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const scene = sceneRef.current;
    if (!container || !scene) return;

    const smoothstep = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const onScroll = () => {
      if (rafPending.current) return;
      rafPending.current = true;
      requestAnimationFrame(() => {
        rafPending.current = false;
        const rect = container.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), total);
        const p = total > 0 ? scrolled / total : 0;

        // Hold assembled 0..0.15, rise to full explode by 0.5, hold till 0.7, fall to 0 by 0.9
        const expl =
          p < 0.5
            ? smoothstep(0.15, 0.5, p)
            : 1 - smoothstep(0.7, 0.9, p);

        // Continuous rotation
        const rotY = p * 420;
        const rotX = -18 + Math.sin(p * Math.PI * 2) * 6;
        // Gentle breathing scale on the whole scene
        const scale = 1 + Math.sin(p * Math.PI) * 0.05;

        scene.style.setProperty("--expl", expl.toFixed(4));
        scene.style.setProperty("--rx", `${rotX.toFixed(2)}deg`);
        scene.style.setProperty("--ry", `${rotY.toFixed(2)}deg`);
        scene.style.setProperty("--scl", scale.toFixed(4));

        setProgress(p);
        setPastAnimation(rect.bottom <= window.innerHeight);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Derive the stage index from progress
  const stage =
    progress < 0.2
      ? 0
      : progress < 0.5
      ? 1
      : progress < 0.8
      ? 2
      : 3;

  const mode =
    progress < 0.15
      ? "ASSEMBLED"
      : progress < 0.55
      ? "EXPLODING"
      : progress < 0.85
      ? "EXPLODED"
      : "REASSEMBLED";

  return (
    <>
      <style>{`
        @keyframes nxFadeUp { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes nxBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
        @keyframes nxOrbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes nxPulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        .nx4-reveal { opacity: 0; transform: translateY(32px); transition: opacity 900ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1); }
        .nx4-reveal.is-visible { opacity: 1; transform: translateY(0); }

        .nx4-navlink:hover { color: #fff !important; }
        .nx4-cta:hover { background: ${GOLD} !important; color: #0a0b0d !important; }
        .nx4-cta-large:hover { background: ${GOLD} !important; transform: translateY(-2px); }
        .nx4-card { transition: transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 400ms, background 400ms; }
        .nx4-card:hover { transform: translateY(-6px); border-color: rgba(212,165,116,0.35) !important; background: linear-gradient(180deg, rgba(212,165,116,0.08), rgba(255,255,255,0.02)) !important; }

        /* Mobile */
        @media (max-width: 900px) {
          .nx-nav-links { display: none !important; }
          .nx-nav-location { display: none !important; }
          .nx-readout { display: none !important; }
          .nx-meta-extras { display: none !important; }
          .nx-brand-sub { display: none !important; }
          .nx-brand-div { display: none !important; }
          .nx-panel-copy {
            left: 4vw !important;
            right: 4vw !important;
            max-width: none !important;
            bottom: 12vh !important;
            padding: 18px 20px !important;
          }
          .nx-cube-scene {
            --s: 80px !important;
            width: 160px !important;
            height: 160px !important;
          }
          .nx4-section-heading { font-size: clamp(32px, 9vw, 48px) !important; }
          .nx4-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .nx-nav-inner { padding: 8px 12px 8px 16px !important; gap: 8px !important; }
          .nx-brand-text { font-size: 11px !important; letter-spacing: 0.2em !important; }
          .nx-cta-text { display: none !important; }
        }
      `}</style>

      {/* =============== FIXED STAGE =============== */}
      <div
        style={{
          ...sx.fixedStage,
          opacity: pastAnimation ? 0 : 1,
          pointerEvents: pastAnimation ? "none" : "auto",
        }}
      >
        {/* Ambient FX */}
        <div style={sx.bgGrid} />
        <div style={sx.bgRadial} />
        <div style={sx.bgOrbit}>
          <div style={{ ...sx.bgOrbitRing, width: 720, height: 720 }} />
          <div
            style={{
              ...sx.bgOrbitRing,
              width: 1080,
              height: 1080,
              animationDuration: "48s",
              animationDirection: "reverse",
            }}
          />
          <div
            style={{
              ...sx.bgOrbitRing,
              width: 1440,
              height: 1440,
              animationDuration: "72s",
              opacity: 0.35,
            }}
          />
        </div>
        <div style={sx.vignette} />

        {/* Top nav */}
        <TopNav />

        {/* Cube */}
        <div style={sx.stageWrap}>
          <div
            ref={sceneRef}
            className="nx-cube-scene"
            style={{
              ...sx.scene,
              ["--s" as string]: "110px",
              ["--expl" as string]: "0",
              ["--rx" as string]: "-18deg",
              ["--ry" as string]: "0deg",
              ["--scl" as string]: "1",
            }}
          >
            <div style={sx.cube}>
              {FACES.map((f, i) => (
                <Face key={f.key} f={f} progress={progress} index={i} />
              ))}
              <div style={sx.edgeGlow} />
            </div>
          </div>
          <div style={sx.reflection} />
        </div>

        {/* Right-side readout */}
        <Readout progress={progress} mode={mode} />

        {/* Bottom meta */}
        <BottomMeta progress={progress} mode={mode} />
      </div>

      {/* =============== SPACER with flowing stage panels =============== */}
      <div
        ref={containerRef}
        style={{ height: `${SCROLL_VH * 100}vh`, position: "relative", zIndex: 10 }}
      >
        {stages.map((s, i) => (
          <ScrollPanel key={s.id} stage={s} index={i} total={stages.length} />
        ))}
      </div>

      {/* =============== POST-ANIMATION SECTIONS =============== */}
      <PrinciplesSection />
      <StatsBand stats={stats} />
      <ClosingCTA />
    </>
  );
}

/* ============================================================ */
/*  Face                                                          */
/* ============================================================ */

function Face({
  f,
  progress,
  index,
}: {
  f: FaceDef;
  progress: number;
  index: number;
}) {
  const toneFill =
    f.tone === "gold"
      ? "linear-gradient(135deg, rgba(212,165,116,0.18) 0%, rgba(212,165,116,0.04) 40%, rgba(15,18,24,0.92) 100%)"
      : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(10,12,16,0.94) 100%)";
  const borderColor =
    f.tone === "gold" ? "rgba(212,165,116,0.5)" : "rgba(255,255,255,0.1)";

  const dist = 280;
  const [dx, dy, dz] = f.explodeDir;
  const transform = `
    ${f.rotation}
    translate3d(
      calc(${dx} * ${dist}px * var(--expl)),
      calc(${dy} * ${dist}px * var(--expl)),
      calc(${dz} * ${dist}px * var(--expl))
    )
  `;

  // Content reveal: only show labels when the piece is reasonably exploded
  const reveal = Math.min(1, Math.max(0, (progress - 0.28) / 0.2)) *
                 Math.min(1, Math.max(0, 1 - (progress - 0.78) / 0.1));

  const ICONS: Record<FaceKey, React.ReactNode> = {
    front: <ElektroIcon />,
    top: <PVIcon />,
    right: <BlitzIcon />,
    left: <WPIcon />,
    back: <MonitoringIcon />,
    bottom: <TiefbauIcon />,
  };

  return (
    <div
      style={{
        ...sx.face,
        transform,
        background: toneFill,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div style={sx.faceBevel} />
      <div style={{ ...sx.faceInner, opacity: 0.4 + reveal * 0.6 }}>
        <div style={sx.faceIcon}>{ICONS[f.key]}</div>
        <div
          style={{
            ...sx.faceLabel,
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 6}px)`,
          }}
        >
          <div style={sx.faceLabelName}>{f.label}</div>
          <div style={sx.faceLabelSub}>{f.sub}</div>
        </div>
      </div>
      <div style={{ ...sx.faceCorner, top: 10, left: 12 }}>{f.code}</div>
      <div style={{ ...sx.faceCorner, bottom: 10, right: 12, opacity: 0.45 }}>
        NX/{index.toString(16).toUpperCase().padStart(2, "0")}
      </div>
    </div>
  );
}

/* ============================================================ */
/*  Icons                                                         */
/* ============================================================ */

const stroke = { stroke: GOLD, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const soft = { stroke: "rgba(255,255,255,0.5)", strokeWidth: 1.2, fill: "none", strokeLinecap: "round" } as const;

function PVIcon() {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <g {...stroke}>
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect key={`${r}-${c}`} x={10 + c * 20} y={10 + r * 20} width={18} height={18} rx={1.5} />
          ))
        )}
      </g>
    </svg>
  );
}
function ElektroIcon() {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <path d="M42 8 L24 44 L38 44 L30 72 L58 36 L44 36 L52 8 Z" {...stroke} />
    </svg>
  );
}
function BlitzIcon() {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <g {...stroke}>
        <line x1="40" y1="6" x2="40" y2="54" />
        <path d="M18 54 Q40 62 62 54" />
        <line x1="40" y1="56" x2="40" y2="74" {...soft} />
        <line x1="34" y1="70" x2="46" y2="70" {...soft} />
      </g>
    </svg>
  );
}
function WPIcon() {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <g {...stroke}>
        <circle cx="40" cy="40" r="22" />
        <path d="M40 18 L46 40 L40 40 Z M40 62 L34 40 L40 40 Z M18 40 L40 34 L40 40 Z M62 40 L40 46 L40 40 Z" />
        <circle cx="40" cy="40" r="4" />
      </g>
    </svg>
  );
}
function MonitoringIcon() {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <g {...soft}>
        <rect x="12" y="18" width="56" height="36" rx={1.5} />
      </g>
      <polyline points="16,48 26,36 34,42 44,28 54,34 64,24" {...stroke} />
    </svg>
  );
}
function TiefbauIcon() {
  return (
    <svg viewBox="0 0 80 80" width={64} height={64}>
      <g {...soft}>
        <line x1="8" y1="56" x2="72" y2="56" />
        <line x1="8" y1="60" x2="72" y2="60" />
      </g>
      <g {...stroke}>
        <path d="M26 56 L32 48 L48 48 L54 56 Z" />
        <line x1="40" y1="48" x2="40" y2="36" />
        <line x1="34" y1="36" x2="46" y2="36" />
      </g>
    </svg>
  );
}

/* ============================================================ */
/*  Readout (right-side glass panel)                              */
/* ============================================================ */

function Readout({ progress, mode }: { progress: number; mode: string }) {
  const items = FACES.filter((f) => f.tone === "gold");
  return (
    <aside className="nx-readout" style={sx.readout}>
      <div style={sx.readoutGlass}>
        <div style={sx.readoutHeader}>
          <span style={sx.readoutLabel}>System integrity</span>
          <span style={sx.readoutValue}>
            {String(Math.round(progress * 100)).padStart(2, "0")}%
          </span>
        </div>
        <ul style={sx.readoutList}>
          {items.map((f) => (
            <li key={f.key} style={sx.readoutItem}>
              <span
                style={{
                  ...sx.readoutDot,
                  animation: "nxPulse 2s ease-in-out infinite",
                }}
              />
              <span style={sx.readoutName}>{f.label}</span>
              <span style={sx.readoutCode}>{f.code}</span>
            </li>
          ))}
        </ul>
        <div style={sx.readoutFooter}>
          <span>Mode</span>
          <span style={{ color: "#fff", letterSpacing: "0.08em" }}>{mode}</span>
        </div>
      </div>
    </aside>
  );
}

/* ============================================================ */
/*  Flowing scroll panel (copy moves with scroll)                 */
/* ============================================================ */

function ScrollPanel({
  stage,
  index,
  total,
}: {
  stage: Stage;
  index: number;
  total: number;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sectionRef.current;
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
    <div ref={sectionRef} style={{ position: "relative", height: "100vh", width: "100%" }}>
      <div ref={copyRef} className="nx-panel-copy" style={sx.panelCopy}>
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

/* ============================================================ */
/*  Bottom meta                                                   */
/* ============================================================ */

function BottomMeta({
  progress,
  mode,
}: {
  progress: number;
  mode: string;
}) {
  return (
    <div style={sx.bottomMeta}>
      <div className="nx-meta-extras" style={sx.metaLeft}>
        <span style={sx.metaLabel}>State</span>
        <span style={sx.metaValue}>{mode}</span>
      </div>
      <div style={sx.metaCenter}>
        <span style={sx.scrollHint}>Scroll to explore the system</span>
        <span style={sx.scrollArrow}>↓</span>
      </div>
      <div className="nx-meta-extras" style={sx.metaRight}>
        <span style={sx.metaLabel}>Progress</span>
        <span style={sx.metaValue}>
          {String(Math.round(progress * 100)).padStart(2, "0")}%
        </span>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  Post-animation sections                                       */
/* ============================================================ */

function PrinciplesSection() {
  const items = [
    { n: "01", t: "Elektroinstallation", b: "Niederspannung, Mittelspannung, USV, Schaltschrankbau · VDE 0100." },
    { n: "02", t: "PV-Anlagen", b: "Aufdach & Freifläche bis Multi-MW · Wechselrichter, Netzanschluss, Monitoring." },
    { n: "03", t: "Blitzschutz", b: "Äußerer + innerer Blitzschutz · DIN EN 62305-3 Beiblatt 5 für PV." },
    { n: "04", t: "Wärmepumpe", b: "Luft-Wasser & Sole-Wasser · Auslegung, hydraulischer Abgleich, Inbetriebnahme." },
  ];
  return (
    <section style={sx.principlesSection}>
      <div style={sx.sectionInner}>
        <Reveal><div style={sx.sectionKicker}>Gewerke · Einzeln</div></Reveal>
        <Reveal delay={80}>
          <h2 className="nx4-section-heading" style={sx.sectionHeading}>
            Vier Bereiche. <span style={{ color: GOLD }}>Ein System.</span>
          </h2>
        </Reveal>
        <div className="nx4-grid" style={sx.grid}>
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 90}>
              <div className="nx4-card" style={sx.card}>
                <div style={sx.cardNum}>{it.n}</div>
                <div style={sx.cardTitle}>{it.t}</div>
                <div style={sx.cardBody}>{it.b}</div>
                <div style={sx.cardLink}>Details →</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBand({ stats }: { stats: Stat[] }) {
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
    target >= 100 ? Math.round(val).toLocaleString("de-DE") :
    target >= 10 ? Math.round(val).toLocaleString("de-DE") :
    val.toFixed(1).replace(".", ",");
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

function ClosingCTA() {
  return (
    <section style={sx.ctaSection}>
      <div style={sx.ctaGlow} />
      <div style={sx.sectionInner}>
        <Reveal><div style={sx.sectionKicker}>Ihr Projekt</div></Reveal>
        <Reveal delay={80}>
          <h2 className="nx4-section-heading" style={sx.sectionHeading}>
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
            <button className="nx4-cta-large" style={sx.ctaLarge}>
              Projekt anfragen <span style={sx.ctaArrow}>→</span>
            </button>
            <a style={sx.ctaGhost}>hallo@nexora.energy</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================ */
/*  Reveal hook                                                   */
/* ============================================================ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
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
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const r = useReveal<HTMLDivElement>();
  return (
    <div ref={r} className="nx4-reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ============================================================ */
/*  TopNav                                                        */
/* ============================================================ */

function TopNav() {
  return (
    <header style={sx.nav}>
      <div className="nx-nav-inner" style={sx.navInner}>
        <div style={sx.brand}>
          <span style={sx.brandMark}>N</span>
          <span className="nx-brand-text" style={sx.brandText}>NEXORA</span>
          <span className="nx-brand-div" style={sx.brandDiv} />
          <span className="nx-brand-sub" style={sx.brandSub}>Das System</span>
        </div>
        <nav className="nx-nav-links" style={sx.navLinks}>
          <a className="nx4-navlink" style={sx.navLink}>Elektro</a>
          <a className="nx4-navlink" style={sx.navLink}>PV</a>
          <a className="nx4-navlink" style={sx.navLink}>Blitzschutz</a>
          <a className="nx4-navlink" style={sx.navLink}>Wärmepumpe</a>
        </nav>
        <div style={sx.navRight}>
          <span className="nx-nav-location" style={sx.location}>
            <span style={sx.locationDot} /> Leipzig
          </span>
          <button className="nx4-cta" style={sx.cta}>
            <span className="nx-cta-text">Projekt anfragen</span>
            <span style={sx.ctaArrow}>→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ============================================================ */
/*  Styles                                                        */
/* ============================================================ */

const sx: Record<string, React.CSSProperties> = {
  fixedStage: {
    position: "fixed", inset: 0, width: "100vw", height: "100vh",
    overflow: "hidden", background: "#05070a", zIndex: 1,
    transition: "opacity 500ms ease",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  bgGrid: {
    position: "absolute", inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
    pointerEvents: "none",
  },
  bgRadial: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at 50% 55%, rgba(212,165,116,0.1) 0%, transparent 45%)",
    pointerEvents: "none",
  },
  bgOrbit: {
    position: "absolute", inset: 0,
    display: "grid", placeItems: "center", pointerEvents: "none",
  },
  bgOrbitRing: {
    position: "absolute", borderRadius: "50%",
    border: "1px dashed rgba(255,255,255,0.08)",
    animation: "nxOrbit 36s linear infinite",
  },
  vignette: {
    position: "absolute", inset: 0,
    background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
    pointerEvents: "none",
  },

  /* nav */
  nav: { position: "absolute", top: 16, left: 16, right: 16, zIndex: 20 },
  navInner: {
    ...glass, borderRadius: 999, padding: "10px 16px 10px 22px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 16, maxWidth: 1400, margin: "0 auto",
  },
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
  cta: {
    background: "#fff", color: "#0a0b0d", border: "none",
    padding: "9px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500,
    letterSpacing: "0.05em", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 6,
    transition: "background 200ms, color 200ms",
  },
  ctaArrow: { fontSize: 14, lineHeight: 1 },

  /* cube stage */
  stageWrap: {
    position: "absolute", inset: 0,
    display: "grid", placeItems: "center",
    perspective: "1400px",
    perspectiveOrigin: "50% 48%",
  },
  scene: {
    position: "relative",
    width: 220, height: 220,
    transformStyle: "preserve-3d",
    transform: "rotateX(var(--rx)) rotateY(var(--ry)) scale(var(--scl))",
    willChange: "transform",
  },
  cube: { position: "absolute", inset: 0, transformStyle: "preserve-3d" },
  face: {
    position: "absolute",
    width: 220, height: 220,
    borderRadius: 8,
    backfaceVisibility: "visible",
    overflow: "hidden",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.04) inset, 0 30px 80px rgba(0,0,0,0.6)",
    transition: "background 400ms",
    willChange: "transform",
  },
  faceBevel: {
    position: "absolute", inset: 0,
    background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)",
    pointerEvents: "none",
  },
  faceInner: {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 14, padding: 20, textAlign: "center",
    transition: "opacity 400ms",
  },
  faceIcon: { display: "grid", placeItems: "center", filter: `drop-shadow(0 0 14px ${GOLD_SOFT})` },
  faceLabel: { transition: "opacity 400ms, transform 400ms" },
  faceLabelName: { fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", fontWeight: 500 },
  faceLabelSub: { marginTop: 6, fontSize: 10, letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" },
  faceCorner: {
    position: "absolute",
    fontSize: 9, letterSpacing: "0.35em",
    color: "rgba(212,165,116,0.7)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  edgeGlow: {
    position: "absolute", inset: -2, borderRadius: 12,
    pointerEvents: "none",
    boxShadow: `0 0 120px 20px ${GOLD_SOFT}`,
  },
  reflection: {
    position: "absolute",
    left: "50%", top: "74%",
    transform: "translateX(-50%)",
    width: 520, height: 180, borderRadius: "50%",
    background: "radial-gradient(ellipse at center, rgba(212,165,116,0.2) 0%, transparent 70%)",
    filter: "blur(22px)",
    pointerEvents: "none",
  },

  /* readout */
  readout: { position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", zIndex: 15 },
  readoutGlass: {
    ...glass, borderRadius: 18, padding: "22px 22px", width: 280,
    display: "flex", flexDirection: "column", gap: 18,
  },
  readoutHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  readoutLabel: { fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" },
  readoutValue: { fontSize: 13, color: GOLD, letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" },
  readoutList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 },
  readoutItem: { display: "flex", alignItems: "center", gap: 12 },
  readoutDot: { width: 6, height: 6, borderRadius: 999, background: GOLD, boxShadow: `0 0 8px ${GOLD}` },
  readoutName: { fontSize: 12, letterSpacing: "0.05em", color: "#fff", flexGrow: 1 },
  readoutCode: {
    fontSize: 10, letterSpacing: "0.25em", color: "rgba(255,255,255,0.4)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  readoutFooter: {
    paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex", justifyContent: "space-between",
    fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase",
    color: "rgba(255,255,255,0.5)",
  },

  /* scroll panel */
  panelCopy: {
    ...glass,
    position: "absolute", left: "max(24px, 4vw)", bottom: "18vh",
    maxWidth: 520, borderRadius: 18, padding: "26px 30px",
    willChange: "opacity, transform",
    transition: "opacity 220ms linear, transform 220ms linear",
  },
  stageKicker: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD },
  stageDot: { width: 5, height: 5, borderRadius: 999, background: GOLD, boxShadow: `0 0 10px ${GOLD}` },
  stageProgressNum: {
    marginLeft: 10, fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.45)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  stageHeading: {
    marginTop: 14, marginBottom: 0,
    fontSize: "clamp(28px, 3.4vw, 40px)", fontWeight: 200, lineHeight: 1.1,
    letterSpacing: "-0.02em", color: "#fff",
  },
  stageBody: {
    marginTop: 12, fontSize: 14, lineHeight: 1.6,
    color: "rgba(255,255,255,0.72)", maxWidth: 440,
  },

  /* bottom meta */
  bottomMeta: {
    position: "absolute", left: 0, right: 0, bottom: 24, zIndex: 15,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", pointerEvents: "none",
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
  sectionHeading: {
    marginTop: 18, marginBottom: 0,
    fontSize: "clamp(36px, 5.5vw, 64px)", fontWeight: 200,
    letterSpacing: "-0.02em", lineHeight: 1.05, color: "#fff",
    maxWidth: 960,
  },
  sectionLede: {
    marginTop: 24, maxWidth: 680,
    fontSize: 16, lineHeight: 1.65, color: "rgba(255,255,255,0.65)",
  },

  principlesSection: {
    position: "relative", zIndex: 2,
    background: "linear-gradient(180deg, #05070a 0%, #080a0e 80%, #05070a 100%)",
    padding: "140px 24px 80px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  grid: {
    marginTop: 64,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    ...glass, borderRadius: 20, padding: "28px 26px 24px",
    display: "flex", flexDirection: "column", gap: 14,
    minHeight: 240, cursor: "pointer",
  },
  cardNum: { fontSize: 11, letterSpacing: "0.35em", color: GOLD, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  cardTitle: { fontSize: 22, fontWeight: 300, letterSpacing: "-0.01em", color: "#fff" },
  cardBody: { fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", flexGrow: 1 },
  cardLink: { fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD },

  statsSection: {
    position: "relative", zIndex: 2,
    background: "#05070a",
    padding: "40px 24px 100px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    padding: "48px 0",
  },
  statItem: { display: "flex", flexDirection: "column", gap: 10 },
  statValue: {
    fontSize: "clamp(32px, 3.4vw, 48px)", fontWeight: 200, color: "#fff",
    letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums",
  },
  statSuffix: { color: GOLD, fontSize: "0.55em", marginLeft: 6, letterSpacing: "0.02em" },
  statLabel: { fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" },

  ctaSection: {
    position: "relative", zIndex: 2,
    background: "radial-gradient(ellipse at 50% 120%, rgba(212,165,116,0.12) 0%, transparent 60%), #05070a",
    padding: "140px 24px 160px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  ctaGlow: {
    position: "absolute", left: "50%", bottom: "-160px", transform: "translateX(-50%)",
    width: 900, height: 900, borderRadius: 999,
    background: `radial-gradient(circle, ${GOLD_SOFT} 0%, transparent 60%)`,
    filter: "blur(60px)", pointerEvents: "none",
  },
  ctaActions: { marginTop: 48, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  ctaLarge: {
    background: "#fff", color: "#0a0b0d", border: "none",
    padding: "18px 28px", borderRadius: 999, fontSize: 14, fontWeight: 500,
    letterSpacing: "0.05em", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    boxShadow: `0 20px 60px -20px ${GOLD_SOFT}`,
    transition: "background 200ms, transform 200ms",
  },
  ctaGhost: {
    fontSize: 13, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.25)",
    padding: "4px 0", cursor: "pointer",
  },
};
