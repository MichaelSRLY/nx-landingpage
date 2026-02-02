"use client";
import { useState, useEffect, useRef } from "react";

const tokens = {
  colors: {
    light: {
      bg: "hsl(40, 30%, 97%)",
      surface: "hsl(40, 25%, 95%)",
      textPrimary: "hsl(30, 15%, 15%)",
      textSecondary: "hsl(30, 10%, 40%)",
      textMuted: "hsl(35, 10%, 60%)",
      border: "hsl(35, 15%, 85%)",
      borderSubtle: "hsl(35, 12%, 90%)",
      accent: "hsl(35, 20%, 88%)",
    },
    dark: {
      bg: "hsl(30, 5%, 10.5%)",
      surface: "hsl(30, 5%, 12%)",
      textPrimary: "hsl(40, 20%, 92%)",
      textSecondary: "hsl(40, 15%, 70%)",
      textMuted: "hsl(30, 10%, 50%)",
      border: "hsl(30, 5%, 20%)",
      borderSubtle: "hsl(30, 5%, 16%)",
      accent: "hsl(35, 20%, 30%)",
    },
  },
  shadows: {
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    paper: "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
  },
};

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

export default function NexoraLandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const stylesRef = useRef<HTMLStyleElement | null>(null);

  const c = isDark ? tokens.colors.dark : tokens.colors.light;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const style = document.createElement("style");
    style.textContent = `
      @keyframes nexoraFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes nexoraFadeDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes nexoraSlowSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
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
      <div style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(at 50% 20%, rgba(160,120,70,0.06) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      <div style={{
        position: "fixed",
        inset: 0,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: isDark ? 0.05 : 0.035,
        pointerEvents: "none",
        zIndex: 1,
      }} />

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
        <div style={{
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "rgba(180, 150, 100, 0.6)",
          fontFamily: "monospace",
        }}>nexora</div>

        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navLinks.map((link) => (
              <a key={link} href="#" style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: "rgba(180, 150, 100, 0.6)",
                fontFamily: "monospace",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }} onMouseEnter={(e) => e.currentTarget.style.color = "rgba(180, 150, 100, 0.9)"}
                 onMouseLeave={(e) => e.currentTarget.style.color = "rgba(180, 150, 100, 0.6)"}>
                {link}
              </a>
            ))}
            <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme" style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: `1px solid ${c.border}`,
              background: isDark ? c.textPrimary : "transparent",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }} />
          </div>
        )}

        {isMobile && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => setIsDark(!isDark)} aria-label="Toggle theme" style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: `1px solid ${c.border}`,
              background: isDark ? c.textPrimary : "transparent",
              cursor: "pointer",
            }} />
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{
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

      {isMobile && menuOpen && (
        <div style={{
          position: "fixed",
          top: 52,
          left: 0,
          right: 0,
          zIndex: 99,
          background: c.surface,
          borderBottom: `1px solid ${c.border}`,
          padding: "8px 16px 16px",
        }}>
          {navLinks.map((link) => (
            <a key={link} href="#" onClick={() => setMenuOpen(false)} style={{
              display: "block",
              padding: "16px 0",
              fontSize: "10px",
              letterSpacing: "0.12em",
              color: "rgba(180, 150, 100, 0.6)",
              fontFamily: "monospace",
              textDecoration: "none",
              borderBottom: `1px solid ${c.borderSubtle}`,
            }}>
              {link}
            </a>
          ))}
        </div>
      )}

      <section style={{
        minHeight: "110vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "20px 20px 60px" : "30px 48px 80px",
        position: "relative",
        zIndex: 2,
        textAlign: "center",
      }}>
        {!isDark && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? 280 : 560,
            height: isMobile ? 280 : 560,
            opacity: 0.04,
            pointerEvents: "none",
            animation: "nexoraSlowSpin 120s linear infinite",
          }}>
            <EscherPattern color={c.textPrimary} />
          </div>
        )}

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
