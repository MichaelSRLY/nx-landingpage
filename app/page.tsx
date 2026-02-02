"use client";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   NEXORA - Generalunternehmer für Energie & Infrastruktur
   ═══════════════════════════════════════════════════════ */

// ── Design Tokens ──────────────────────────────────────
const tokens = {
  colors: {
    light: {
      bg: "hsl(40, 30%, 97%)",
      surface: "hsl(40, 25%, 95%)",
      surfaceElevated: "hsl(40, 28%, 98%)",
      textPrimary: "hsl(30, 15%, 15%)",
      textSecondary: "hsl(30, 10%, 40%)",
      textMuted: "hsl(35, 10%, 60%)",
      textDisabled: "hsl(35, 8%, 75%)",
      border: "hsl(35, 15%, 85%)",
      borderSubtle: "hsl(35, 12%, 90%)",
      accent: "hsl(35, 20%, 88%)",
      accentHover: "hsl(35, 22%, 84%)",
      hoverBg: "hsl(40, 25%, 93%)",
      focusRing: "hsl(35, 30%, 80%)",
      overlay: "hsla(30, 15%, 15%, 0.04)",
    },
    dark: {
      bg: "hsl(30, 5%, 10.5%)",
      surface: "hsl(30, 5%, 12%)",
      surfaceElevated: "hsl(30, 6%, 14%)",
      textPrimary: "hsl(40, 20%, 92%)",
      textSecondary: "hsl(40, 15%, 70%)",
      textMuted: "hsl(30, 10%, 50%)",
      textDisabled: "hsl(30, 8%, 35%)",
      border: "hsl(30, 5%, 20%)",
      borderSubtle: "hsl(30, 5%, 16%)",
      accent: "hsl(35, 20%, 30%)",
      accentHover: "hsl(35, 22%, 35%)",
      hoverBg: "hsl(30, 5%, 15%)",
      focusRing: "hsl(35, 20%, 50%)",
      overlay: "hsla(40, 20%, 92%, 0.04)",
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    paper: "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
    elevated: "0 25px 50px -12px rgba(0,0,0,0.08)",
  },
} as const;

// ── Escher Pattern SVG ────────────────────────────────
const EscherPattern = ({ color }: { color: string }) => (
  <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <pattern id="escher" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {[0, 40].map((x) => [0, 40].map((y) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} L${x + 40} ${y} L${x + 40} ${y + 40} L${x} ${y + 40} Z`} stroke={color} strokeWidth="0.5" fill="none" />
        )))}
        {[20, 60].map((cx) => [0, 40].map((y) => (
          <path key={`v-${cx}-${y}`} d={`M${cx} ${y} Q${cx + 10} ${y + 20} ${cx} ${y + 40} Q${cx - 10} ${y + 20} ${cx} ${y}`} stroke={color} strokeWidth="0.5" fill="none" />
        )))}
        {[0, 40].map((x) => [20, 60].map((cy) => (
          <path key={`h-${x}-${cy}`} d={`M${x} ${cy} Q${x + 20} ${cy + 10} ${x + 40} ${cy} Q${x + 20} ${cy - 10} ${x} ${cy}`} stroke={color} strokeWidth="0.5" fill="none" />
        )))}
        {[20, 60].map((cx) => [20, 60].map((cy) => (
          <circle key={`c-${cx}-${cy}`} cx={cx} cy={cy} r="3" stroke={color} strokeWidth="0.3" fill="none" />
        )))}
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#escher)" />
  </svg>
);

// ── Skeleton Card ─────────────────────────────────────
interface SkeletonCardProps {
  lines: Array<"dot" | number>;
  style: React.CSSProperties;
  animDelay: number;
  isDark: boolean;
}

const SkeletonCard = ({ lines, style, animDelay, isDark }: SkeletonCardProps) => {
  const c = isDark ? tokens.colors.dark : tokens.colors.light;
  return (
    <div style={{
      position: "absolute",
      background: c.surface,
      border: `1px solid ${c.border}`,
      borderRadius: 8,
      padding: 24,
      boxShadow: tokens.shadows.paper,
      opacity: 0,
      animation: `nexoraFloatIn ${animDelay}s ease-out forwards, nexoraFloat 12s ease-in-out ${animDelay + 0.8}s infinite`,
      ...style,
    }}>
      {lines.map((line, i) => line === "dot" ? (
        <div key={i} style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: c.accent,
          marginBottom: 12,
        }} />
      ) : (
        <div key={i} style={{
          height: 6,
          borderRadius: 3,
          background: c.accent,
          width: `${line}%`,
          marginBottom: i < lines.length - 1 ? 8 : 0,
        }} />
      ))}
    </div>
  );
};

// ── Hamburger Icon ────────────────────────────────────
const HamburgerIcon = ({ open, color }: { open: boolean; color: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <line x1="3" y1="5" x2="17" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"
      style={{ transition: "all 300ms ease", transformOrigin: "center", transform: open ? "translateY(5px) rotate(45deg)" : "none" }} />
    <line x1="3" y1="10" x2="17" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"
      style={{ transition: "all 300ms ease", opacity: open ? 0 : 1 }} />
    <line x1="3" y1="15" x2="17" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round"
      style={{ transition: "all 300ms ease", transformOrigin: "center", transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
  </svg>
);

// ── Scroll Line Animation ─────────────────────────────
const ScrollLine = () => (
  <div style={{
    width: 1,
    height: 32,
    backgroundColor: "rgba(150, 130, 100, 0.15)",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  }}>
    <div style={{
      position: "absolute",
      width: "100%",
      height: 12,
      backgroundColor: "rgba(200, 160, 100, 0.5)",
      animation: "scrollLine 1.6s ease-in-out infinite",
    }} />
  </div>
);

// ══════════════════════════════════════════════════════
// ── MAIN COMPONENT ───────────────────────────────────
// ══════════════════════════════════════════════════════

export default function NexoraLandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const stylesRef = useRef<HTMLStyleElement | null>(null);

  const c = isDark ? tokens.colors.dark : tokens.colors.light;

  // ── Responsive listener ──
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Inject keyframes ──
  useEffect(() => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes nexoraFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes nexoraFadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes nexoraSlowSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
      @keyframes nexoraFloatIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      @keyframes nexoraFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      @keyframes nexoraMenuSlide { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes scrollLine { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
    `;
    document.head.appendChild(style);
    stylesRef.current = style;
    return () => { if (stylesRef.current) document.head.removeChild(stylesRef.current); };
  }, []);

  const navLinks = ["Leistungen", "Vorgehen", "Referenzen"];

  return (
    <div style={{
      fontFamily: "'Geist Sans', system-ui, -apple-system, sans-serif",
      background: c.bg,
      color: c.textPrimary,
      minHeight: "100vh",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* ── Grain overlay ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(at 50% 20%, rgba(160,120,70,0.06) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* ── Noise overlay ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: isDark ? 0.05 : 0.035,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* ═══════ NAV ═══════ */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: isMobile ? "12px 16px" : "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        animation: "nexoraFadeDown 0.8s ease-out",
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: isMobile ? "0.75rem" : "0.875rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: c.textPrimary,
        }}>Nexora</span>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navLinks.map((link) => (
              <a key={link} href="#" style={{
                fontSize: "0.875rem",
                fontWeight: 300,
                color: c.textSecondary,
                textDecoration: "none",
                letterSpacing: "0.02em",
                transition: "color 0.3s ease",
              }} onMouseEnter={(e) => e.currentTarget.style.color = c.textPrimary}
                 onMouseLeave={(e) => e.currentTarget.style.color = c.textSecondary}>
                {link}
              </a>
            ))}
            <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme" style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${c.border}`,
              background: "transparent",
              color: c.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              fontSize: "0.625rem",
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 600,
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = c.accent;
              e.currentTarget.style.color = c.textPrimary;
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = c.textSecondary;
            }}>
              {isDark ? "L" : "D"}
            </button>
          </div>
        )}

        {/* Mobile controls */}
        {isMobile && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme" style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${c.border}`,
              background: "transparent",
              color: c.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.625rem",
              fontFamily: "'Geist Mono', monospace",
              fontWeight: 600,
            }}>
              {isDark ? "L" : "D"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen} style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: `1px solid ${c.border}`,
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}>
              <HamburgerIcon open={menuOpen} color={c.textSecondary} />
            </button>
          </div>
        )}
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      {isMobile && menuOpen && (
        <div style={{
          position: "fixed",
          top: isMobile ? 52 : 64,
          left: 0,
          right: 0,
          zIndex: 99,
          background: c.surface,
          borderBottom: `1px solid ${c.border}`,
          padding: "8px 16px 16px",
          animation: "nexoraMenuSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
          {navLinks.map((link) => (
            <a key={link} href="#" onClick={() => setMenuOpen(false)} style={{
              display: "block",
              padding: "16px 0",
              fontSize: "0.938rem",
              fontWeight: 300,
              color: c.textSecondary,
              textDecoration: "none",
              borderBottom: `1px solid ${c.borderSubtle}`,
            }}>
              {link}
            </a>
          ))}
        </div>
      )}

      {/* ═══════ HERO ═══════ */}
      <section style={{
        minHeight: "110vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "80px 20px 60px" : "100px 48px 80px",
        position: "relative",
        zIndex: 2,
        textAlign: "center",
      }}>
        {/* Escher pattern */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? 280 : 560,
          height: isMobile ? 280 : 560,
          opacity: isDark ? 0.06 : 0.04,
          pointerEvents: "none",
          animation: "nexoraSlowSpin 120s linear infinite",
        }}>
          <EscherPattern color={c.textPrimary} />
        </div>

        {/* Floating cards — desktop only */}
        {!isMobile && (
          <div style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}>
            <SkeletonCard isDark={isDark} lines={["dot", 90, 60, 80]} style={{ top: "18%", left: "8%", width: 180, height: 120 }} animDelay={1.0} />
            <SkeletonCard isDark={isDark} lines={[70, 90, 40]} style={{ top: "22%", right: "7%", width: 160, height: 100 }} animDelay={1.2} />
            <SkeletonCard isDark={isDark} lines={["dot", 80, 60]} style={{ bottom: "20%", left: "10%", width: 140, height: 90 }} animDelay={1.4} />
            <SkeletonCard isDark={isDark} lines={[60, 90, 70, 40]} style={{ bottom: "18%", right: "9%", width: 170, height: 110 }} animDelay={1.6} />
          </div>
        )}

        {/* ── Content ── */}
        <p style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: isMobile ? "0.563rem" : "0.75rem",
          fontWeight: 400,
          letterSpacing: "0.15em",
          textTransform: "uppercase" as const,
          color: c.textMuted,
          marginBottom: 32,
          animation: "nexoraFadeUp 0.8s ease-out 0.2s both",
        }}>
          Generalunternehmer
        </p>

        <h1 style={{
          fontSize: isMobile ? "2rem" : "4rem",
          fontWeight: 200,
          lineHeight: isMobile ? 1.1 : 1.05,
          letterSpacing: isMobile ? "-0.02em" : "-0.03em",
          color: c.textPrimary,
          maxWidth: isMobile ? "100%" : 720,
          marginBottom: 32,
          animation: "nexoraFadeUp 0.8s ease-out 0.35s both",
        }}>
          Energie & Infrastruktur,
          <br />
          <em style={{ fontStyle: "italic", fontWeight: 100 }}>ein Partner</em>
        </h1>

        <p style={{
          fontSize: isMobile ? "0.813rem" : "1rem",
          fontWeight: 300,
          color: c.textSecondary,
          maxWidth: isMobile ? "100%" : 480,
          lineHeight: 1.7,
          marginBottom: 48,
          animation: "nexoraFadeUp 0.8s ease-out 0.5s both",
        }}>
          Nexora übernimmt die Gesamtverantwortung für Ihre Energie-, Elektro- und
          Infrastrukturprojekte – von der Anfrage bis zur Abnahme.
        </p>

        {/* CTA Group */}
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 12 : 16,
          alignItems: "center",
          width: isMobile ? "100%" : "auto",
          maxWidth: isMobile ? 280 : "none",
          animation: "nexoraFadeUp 0.8s ease-out 0.65s both",
        }}>
          <button style={{
            fontFamily: "'Geist Sans', system-ui, sans-serif",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            fontWeight: 400,
            letterSpacing: "0.02em",
            padding: isMobile ? "12px 24px" : "14px 32px",
            background: c.textPrimary,
            color: c.bg,
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: tokens.shadows.md,
            width: isMobile ? "100%" : "auto",
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = tokens.shadows.paper;
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = tokens.shadows.md;
          }}>
            Projekt anfragen
          </button>
          <button style={{
            fontFamily: "'Geist Sans', system-ui, sans-serif",
            fontSize: isMobile ? "0.75rem" : "0.875rem",
            fontWeight: 300,
            letterSpacing: "0.02em",
            padding: isMobile ? "12px 24px" : "14px 32px",
            background: "transparent",
            color: c.textSecondary,
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            cursor: "pointer",
            transition: "all 0.3s ease",
            width: isMobile ? "100%" : "auto",
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = c.textMuted;
            e.currentTarget.style.color = c.textPrimary;
            e.currentTarget.style.background = c.surface;
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = c.border;
            e.currentTarget.style.color = c.textSecondary;
            e.currentTarget.style.background = "transparent";
          }}>
            Leistungen entdecken
          </button>
        </div>

        {/* Scroll Line Animation */}
        <div style={{
          position: "absolute",
          bottom: 48,
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          <ScrollLine />
        </div>
      </section>
    </div>
  );
}
