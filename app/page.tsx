"use client";
import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   NEXORA - Generalunternehmer für Energie & Infrastruktur
   Warm Paper Design System · Light/Dark Theme
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
      border: "hsl(35, 15%, 85%)",
      borderSubtle: "hsl(35, 12%, 90%)",
      accent: "hsl(35, 20%, 88%)",
      hoverBg: "hsl(40, 25%, 93%)",
      overlay: "hsla(30, 15%, 15%, 0.95)",
    },
    dark: {
      bg: "hsl(30, 5%, 10.5%)",
      surface: "hsl(30, 5%, 12%)",
      surfaceElevated: "hsl(30, 6%, 14%)",
      textPrimary: "hsl(40, 20%, 92%)",
      textSecondary: "hsl(40, 15%, 70%)",
      textMuted: "hsl(30, 10%, 50%)",
      border: "hsl(30, 5%, 20%)",
      borderSubtle: "hsl(30, 5%, 16%)",
      accent: "hsl(35, 20%, 30%)",
      hoverBg: "hsl(30, 5%, 15%)",
      overlay: "hsla(30, 5%, 5%, 0.95)",
    },
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    paper: "0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)",
    elevated: "0 25px 50px -12px rgba(0,0,0,0.08)",
  },
};

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

// ── Scroll Down Animation ─────────────────────────────
const ScrollDown = ({ isDark }: { isDark: boolean }) => {
  const c = isDark ? tokens.colors.dark : tokens.colors.light;
  return (
    <div style={{
      position: "absolute",
      bottom: 48,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      animation: "nexoraBounce 2s ease-in-out infinite",
      cursor: "pointer",
    }} onClick={() => {
      document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" });
    }}>
      <span style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: "0.625rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: c.textMuted,
      }}>Scrollen</span>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke={c.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

// ══════════════════════════════════════════════════════
// ── MAIN COMPONENT ───────────────────────────────────
// ══════════════════════════════════════════════════════

export default function NexoraLandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const c = isDark ? tokens.colors.dark : tokens.colors.light;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = `
        @keyframes nexoraFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes nexoraSlowSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes nexoraBounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Geist Sans', system-ui, sans-serif; }
      `;
      document.head.appendChild(style);
      return () => { document.head.removeChild(style); };
    }
  }, []);

  const navLinks = [
    { label: "Startseite", href: "#home" },
    { label: "Leistungen", href: "#leistungen" },
    { label: "Vorgehen", href: "#vorgehen" },
    { label: "Referenzen", href: "#referenzen" },
    { label: "Über uns", href: "#ueber-uns" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.textPrimary, transition: "all 0.3s ease" }}>
      {/* ═══════ NAVIGATION ═══════ */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: isDark ? c.overlay : c.overlay,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${c.border}`,
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "16px 20px" : "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          {/* Logo */}
          <div style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: 600, color: c.textPrimary }}>
            NEXORA
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} style={{
                  color: c.textSecondary,
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  transition: "color 0.2s ease",
                }} onMouseEnter={(e) => e.currentTarget.style.color = c.textPrimary}
                   onMouseLeave={(e) => e.currentTarget.style.color = c.textSecondary}>
                  {link.label}
                </a>
              ))}
              <a href="#kontakt" style={{
                padding: "10px 24px",
                background: c.textPrimary,
                color: c.bg,
                borderRadius: 6,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                transition: "all 0.2s ease",
                boxShadow: tokens.shadows.sm,
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = tokens.shadows.md;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = tokens.shadows.sm;
              }}>
                Projekt anfragen
              </a>

              {/* Theme Toggle */}
              <button onClick={() => setIsDark(!isDark)} style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${c.border}`,
                background: c.surface,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }} onMouseEnter={(e) => e.currentTarget.style.background = c.hoverBg}
                 onMouseLeave={(e) => e.currentTarget.style.background = c.surface}>
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={() => setIsDark(!isDark)} style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${c.border}`,
                background: c.surface,
                cursor: "pointer",
              }}>
                {isDark ? "☀️" : "🌙"}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                width: 40,
                height: 40,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: c.textPrimary,
                fontSize: "1.5rem",
              }}>
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && menuOpen && (
          <div style={{
            background: c.surface,
            borderTop: `1px solid ${c.border}`,
            padding: "20px",
          }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                display: "block",
                padding: "12px 0",
                color: c.textPrimary,
                textDecoration: "none",
                fontSize: "1rem",
                borderBottom: `1px solid ${c.borderSubtle}`,
              }}>
                {link.label}
              </a>
            ))}
            <a href="#kontakt" onClick={() => setMenuOpen(false)} style={{
              display: "block",
              marginTop: 16,
              padding: "12px 24px",
              background: c.textPrimary,
              color: c.bg,
              borderRadius: 6,
              textDecoration: "none",
              textAlign: "center",
              fontWeight: 500,
            }}>
              Projekt anfragen
            </a>
          </div>
        )}
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <section id="home" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "120px 20px 80px" : "160px 48px 100px",
        position: "relative",
        textAlign: "center",
      }}>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? 300 : 600,
          height: isMobile ? 300 : 600,
          opacity: isDark ? 0.04 : 0.03,
          pointerEvents: "none",
          animation: "nexoraSlowSpin 180s linear infinite",
        }}>
          <EscherPattern color={c.textPrimary} />
        </div>

        <div style={{ maxWidth: 900, position: "relative", zIndex: 2 }}>
          <h1 style={{
            fontSize: isMobile ? "2.5rem" : "4rem",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 24,
            animation: "nexoraFadeUp 0.8s ease-out 0.2s both",
          }}>
            Generalunternehmer für<br />Energie & Infrastruktur
          </h1>

          <p style={{
            fontSize: isMobile ? "1.25rem" : "1.75rem",
            fontWeight: 300,
            color: c.textSecondary,
            marginBottom: 16,
            animation: "nexoraFadeUp 0.8s ease-out 0.35s both",
          }}>
            Komplexe Projekte. Ein Partner.
          </p>

          <p style={{
            fontSize: isMobile ? "1rem" : "1.125rem",
            fontWeight: 300,
            color: c.textMuted,
            lineHeight: 1.7,
            maxWidth: 700,
            margin: "0 auto 40px",
            animation: "nexoraFadeUp 0.8s ease-out 0.5s both",
          }}>
            Nexora übernimmt die Gesamtverantwortung für Ihre Energie-, Elektro- und
            Infrastrukturprojekte – von der Anfrage bis zur Abnahme.
          </p>

          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 16,
            justifyContent: "center",
            alignItems: "center",
            animation: "nexoraFadeUp 0.8s ease-out 0.65s both",
          }}>
            <a href="#kontakt" style={{
              padding: isMobile ? "14px 32px" : "16px 40px",
              background: c.textPrimary,
              color: c.bg,
              borderRadius: 8,
              textDecoration: "none",
              fontSize: isMobile ? "0.938rem" : "1rem",
              fontWeight: 500,
              boxShadow: tokens.shadows.md,
              transition: "all 0.2s ease",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = tokens.shadows.paper;
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = tokens.shadows.md;
            }}>
              Projekt anfragen
            </a>

            <a href="#leistungen" style={{
              padding: isMobile ? "14px 32px" : "16px 40px",
              background: "transparent",
              color: c.textPrimary,
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              textDecoration: "none",
              fontSize: isMobile ? "0.938rem" : "1rem",
              fontWeight: 400,
              transition: "all 0.2s ease",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = c.surface;
              e.currentTarget.style.borderColor = c.textMuted;
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = c.border;
            }}>
              Leistungen entdecken
            </a>
          </div>
        </div>

        <ScrollDown isDark={isDark} />
      </section>

      {/* ═══════ DAS PROBLEM ═══════ */}
      <section id="problem" style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
        background: c.surface,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: isMobile ? "1.75rem" : "2.5rem",
            fontWeight: 600,
            lineHeight: 1.2,
            marginBottom: 24,
          }}>
            Komplexe Projekte, viele Gewerke – wer koordiniert?
          </h2>
          <p style={{
            fontSize: isMobile ? "1rem" : "1.125rem",
            lineHeight: 1.8,
            color: c.textSecondary,
            marginBottom: 16,
          }}>
            Bei Großprojekten im Bereich Energie und Infrastruktur arbeiten zahlreiche
            Spezialisten zusammen: Elektriker, Tiefbauer, Blitzschutz-Experten, PV-Installateure
            und viele mehr.
          </p>
          <p style={{
            fontSize: isMobile ? "1rem" : "1.125rem",
            lineHeight: 1.8,
            color: c.textSecondary,
          }}>
            Das Ergebnis ohne zentrale Steuerung: <strong>Terminverzögerungen, Schnittstellenprobleme</strong> und <strong>undurchsichtige Verantwortlichkeiten</strong>.
          </p>
        </div>
      </section>

      {/* ═══════ UNSERE LÖSUNG ═══════ */}
      <section id="loesung" style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? "1.75rem" : "2.5rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 48,
          }}>
            Unsere Lösung: One Face to the Customer
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 24,
          }}>
            {[
              "Ein Ansprechpartner für alle Gewerke",
              "Klare Verantwortlichkeiten und Prozesse",
              "Transparente Kommunikation und Reporting",
              "Terminsicherheit durch professionelles Projektmanagement",
              "Qualitätssicherung über alle Schnittstellen",
            ].map((item, i) => (
              <div key={i} style={{
                padding: 24,
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                transition: "all 0.2s ease",
                cursor: "default",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = tokens.shadows.paper;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c.textPrimary,
                  flexShrink: 0,
                  marginTop: 8,
                }} />
                <p style={{ fontSize: "1rem", lineHeight: 1.6, color: c.textPrimary }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ IHRE VORTEILE ═══════ */}
      <section id="vorteile" style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
        background: c.surface,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              fontWeight: 600,
              marginBottom: 16,
            }}>
              Ihre Vorteile
            </h2>
            <p style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              color: c.textSecondary,
              maxWidth: 700,
              margin: "0 auto",
            }}>
              Warum Auftraggeber mit Nexora arbeiten
            </p>
            <p style={{
              fontSize: isMobile ? "0.938rem" : "1rem",
              color: c.textMuted,
              marginTop: 12,
            }}>
              Wir reduzieren Komplexität und schaffen klare Strukturen für Ihren Projekterfolg.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: 32,
          }}>
            {[
              {
                title: "Ein Ansprechpartner",
                desc: "Keine Koordination zwischen Dutzenden Gewerken. Sie sprechen mit uns – wir kümmern uns um den Rest.",
              },
              {
                title: "Gesamtverantwortung",
                desc: "Wir übernehmen die volle Verantwortung für Ihr Projekt. Termine, Qualität und Budget aus einer Hand.",
              },
              {
                title: "Strukturiertes Vorgehen",
                desc: "Klare Prozesse, transparente Kommunikation und nachvollziehbare Meilensteine von Anfang bis Ende.",
              },
            ].map((vorteil, i) => (
              <div key={i} style={{
                padding: 32,
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                transition: "all 0.3s ease",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = tokens.shadows.elevated;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: 12,
                  color: c.textPrimary,
                }}>
                  {vorteil.title}
                </h3>
                <p style={{
                  fontSize: "0.938rem",
                  lineHeight: 1.7,
                  color: c.textSecondary,
                }}>
                  {vorteil.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LEISTUNGEN ═══════ */}
      <section id="leistungen" style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              fontWeight: 600,
              marginBottom: 16,
            }}>
              Leistungen
            </h2>
            <p style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              color: c.textSecondary,
            }}>
              Was wir für Sie tun
            </p>
            <p style={{
              fontSize: isMobile ? "0.938rem" : "1rem",
              color: c.textMuted,
              marginTop: 12,
              maxWidth: 700,
              margin: "12px auto 0",
            }}>
              Von der ersten Beratung bis zur finalen Abnahme – wir begleiten Ihr Projekt in allen Phasen.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 24,
          }}>
            {[
              {
                title: "Generalunternehmung",
                desc: "Wir bündeln alle Gewerke und übernehmen die Gesamtverantwortung für Ihr Projekt.",
              },
              {
                title: "Projektmanagement",
                desc: "Professionelle Steuerung komplexer Vorhaben mit klaren Strukturen und Prozessen.",
              },
              {
                title: "Energie & Elektro",
                desc: "Spezialisiert auf anspruchsvolle Energie- und Elektroinfrastruktur-Projekte.",
              },
              {
                title: "Infrastruktur",
                desc: "Von Tiefbau über Kabelverlegung bis zur schlüsselfertigen Übergabe.",
              },
            ].map((leistung, i) => (
              <div key={i} style={{
                padding: 32,
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                transition: "all 0.2s ease",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = tokens.shadows.paper;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: 12,
                }}>
                  {leistung.title}
                </h3>
                <p style={{
                  fontSize: "0.938rem",
                  lineHeight: 1.7,
                  color: c.textSecondary,
                }}>
                  {leistung.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <a href="#kontakt" style={{
              display: "inline-block",
              padding: "14px 32px",
              border: `1px solid ${c.border}`,
              borderRadius: 8,
              textDecoration: "none",
              color: c.textPrimary,
              fontSize: "0.938rem",
              transition: "all 0.2s ease",
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = c.surface;
              e.currentTarget.style.borderColor = c.textMuted;
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = c.border;
            }}>
              Alle Leistungen ansehen
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ STATS ═══════ */}
      <section style={{
        padding: isMobile ? "60px 20px" : "80px 48px",
        background: c.surface,
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? 32 : 48,
        }}>
          {[
            { value: "150+", label: "Abgeschlossene Projekte" },
            { value: "98%", label: "Termingerechte Übergabe" },
            { value: "15+", label: "Jahre Erfahrung" },
            { value: "100%", label: "Gesamtverantwortung" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: isMobile ? "2rem" : "3rem",
                fontWeight: 700,
                color: c.textPrimary,
                marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: isMobile ? "0.813rem" : "0.938rem",
                color: c.textMuted,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FÜR WEN WIR ARBEITEN ═══════ */}
      <section id="referenzen" style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontSize: isMobile ? "1.75rem" : "2.5rem",
              fontWeight: 600,
              marginBottom: 16,
            }}>
              Für wen wir arbeiten
            </h2>
            <p style={{
              fontSize: isMobile ? "1rem" : "1.125rem",
              color: c.textSecondary,
            }}>
              Unsere Auftraggeber
            </p>
            <p style={{
              fontSize: isMobile ? "0.938rem" : "1rem",
              color: c.textMuted,
              marginTop: 12,
            }}>
              Wir sind der richtige Partner für Unternehmen mit komplexen Anforderungen.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: 24,
          }}>
            {[
              { title: "Industrieunternehmen", desc: "Produktions- und Logistikstandorte" },
              { title: "Projektentwickler", desc: "Gewerbliche Bauprojekte" },
              { title: "Energieversorger", desc: "Infrastruktur & Netzausbau" },
              { title: "Betreiber", desc: "Märkte, Gewerbeimmobilien" },
            ].map((kunde, i) => (
              <div key={i} style={{
                padding: 32,
                background: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                textAlign: "center",
                transition: "all 0.2s ease",
              }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = tokens.shadows.paper;
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  {kunde.title}
                </h3>
                <p style={{
                  fontSize: "0.938rem",
                  color: c.textSecondary,
                }}>
                  {kunde.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section id="kontakt" style={{
        padding: isMobile ? "80px 20px" : "120px 48px",
        background: c.surface,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{
            fontSize: isMobile ? "1.75rem" : "2.5rem",
            fontWeight: 600,
            marginBottom: 24,
          }}>
            Bereit für Ihr nächstes Projekt?
          </h2>
          <p style={{
            fontSize: isMobile ? "1rem" : "1.125rem",
            color: c.textSecondary,
            lineHeight: 1.7,
            marginBottom: 32,
          }}>
            Lassen Sie uns gemeinsam besprechen, wie wir Ihr Vorhaben erfolgreich umsetzen können. Unverbindlich und transparent.
          </p>
          <a href="mailto:info@nexora-pv.de" style={{
            display: "inline-block",
            padding: isMobile ? "14px 40px" : "16px 48px",
            background: c.textPrimary,
            color: c.bg,
            borderRadius: 8,
            textDecoration: "none",
            fontSize: isMobile ? "0.938rem" : "1rem",
            fontWeight: 500,
            boxShadow: tokens.shadows.md,
            transition: "all 0.2s ease",
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = tokens.shadows.paper;
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = tokens.shadows.md;
          }}>
            Projekt anfragen
          </a>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{
        padding: isMobile ? "60px 20px 40px" : "80px 48px 40px",
        borderTop: `1px solid ${c.border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 40 : 48,
            marginBottom: 48,
          }}>
            {/* Company Info */}
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 16 }}>NEXORA</div>
              <p style={{ fontSize: "0.875rem", color: c.textMuted, lineHeight: 1.6 }}>
                Ihr Generalunternehmer für komplexe Energie-, Elektro- und Infrastrukturprojekte.
                Ein Ansprechpartner – von der Anfrage bis zur Abnahme.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: "0.938rem", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Kontakt
              </h4>
              <div style={{ fontSize: "0.875rem", color: c.textSecondary, lineHeight: 1.8 }}>
                <p>Grüner Ring 15</p>
                <p>04509 Delitzsch</p>
                <p style={{ marginTop: 12 }}>
                  <a href="mailto:info@nexora-pv.de" style={{ color: c.textSecondary, textDecoration: "none" }}>
                    info@nexora-pv.de
                  </a>
                </p>
                <p>
                  <a href="tel:+493420289988 2" style={{ color: c.textSecondary, textDecoration: "none" }}>
                    +49 (0) 34202 899882
                  </a>
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ fontSize: "0.938rem", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Navigation
              </h4>
              <div style={{ fontSize: "0.875rem", lineHeight: 1.8 }}>
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <a href={link.href} style={{ color: c.textSecondary, textDecoration: "none" }}>
                      {link.label}
                    </a>
                  </div>
                ))}
                <div>
                  <a href="#kontakt" style={{ color: c.textSecondary, textDecoration: "none" }}>
                    Kontakt
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: 32,
            borderTop: `1px solid ${c.borderSubtle}`,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 16,
            fontSize: "0.813rem",
            color: c.textMuted,
          }}>
            <div>© 2026 Nexora GmbH. Alle Rechte vorbehalten.</div>
            <div style={{ display: "flex", gap: 24 }}>
              <a href="#impressum" style={{ color: c.textMuted, textDecoration: "none" }}>Impressum</a>
              <a href="#datenschutz" style={{ color: c.textMuted, textDecoration: "none" }}>Datenschutz</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
