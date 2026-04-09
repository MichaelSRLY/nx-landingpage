"use client";

import React, { useState } from "react";
import { StatItem } from "@/components/StatItem";
import { ServiceCard } from "@/components/ServiceCard";
import { Navbar } from "@/components/Navbar";
import { ProjectInquiry } from "@/components/ProjectInquiry";
import { ProcessSection } from "@/components/ProcessSection";
import { IntroReveal } from "@/components/IntroReveal";
import { motion } from "framer-motion";

const revealProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as string },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
};

export default function Home() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
      <IntroReveal />
      <Navbar onInquiryClick={() => setIsInquiryOpen(true)} />
      <ProjectInquiry isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />

      <div className="overlay-grain" />
      <div className="overlay-noise" />

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "clamp(140px, 15vh, 200px) 40px 180px",
        position: "relative",
        textAlign: "center"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          style={{ maxWidth: "900px" }}
        >
          <span className="eyebrow" style={{ letterSpacing: "0.3em", marginBottom: "24px" }}>GENERALUNTERNEHMER · GESAMTVERANTWORTUNG</span>
          <h1 className="text-gradient" style={{
            fontSize: "var(--font-hero)",
            fontWeight: 200,
            letterSpacing: "-0.04em",
            marginBottom: "32px",
            lineHeight: 1.2,
            paddingBottom: "8px"
          }}>
            Sie haben die Vision.<br />
            Wir tragen die Verantwortung.
          </h1>
          <p style={{
            fontSize: "18px",
            color: "var(--muted-foreground)",
            maxWidth: "650px",
            lineHeight: 1.6,
            fontWeight: 300,
            margin: "0 auto 48px"
          }}>
            Komplexe Energie- und Infrastrukturprojekte, Dutzende Gewerke — eine Verantwortung.
            Nexora koordiniert Spezialisten unter einem Dach: ein Ansprechpartner, volle Terminsicherheit, null Schnittstellenprobleme.
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "80px" }}>
            <button onClick={() => setIsInquiryOpen(true)} className="btn-primary" style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              Projekt anfragen
            </button>
            <a href="#leistungen" className="btn-secondary">Leistungen entdecken</a>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <div style={{
              width: "24px",
              height: "40px",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              paddingTop: "8px"
            }}>
              <motion.div
                animate={{
                  y: [0, 16, 0],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: "2px",
                  height: "6px",
                  background: "var(--foreground)",
                  borderRadius: "1px"
                }}
              />
            </div>
            <span style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              opacity: 0.4,
              fontFamily: "var(--font-mono)"
            }}>
              SCROLL
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <motion.section id="vorteile" {...revealProps} className="section-padding" style={{ background: "var(--background)", position: "relative", overflow: "hidden" }}>
        <div className="max-w-content">
          <div style={{ marginBottom: "100px", maxWidth: "700px" }}>
            <span className="eyebrow">Warum Unternehmen mit Nexora bauen</span>
            <h2 style={{ fontSize: "var(--font-h2)", display: "inline-block" }}>
              Komplexe Projekte erfordern einen Partner, der Verantwortung übernimmt — nicht verteilt.
            </h2>
          </div>

          <div className="bento-grid">
            <div className="bento-wide bento-tall">
              <div className="escher-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "48px", marginBottom: "24px", opacity: 0.2 }}>01</span>
                <h3 style={{ fontSize: "var(--font-h3)", fontWeight: 200, marginBottom: "20px" }}>Ein Ansprechpartner. Volle Verantwortung.</h3>
                <p style={{ fontSize: "18px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6, maxWidth: "450px" }}>
                  Sie koordinieren nicht. Sie entscheiden. Nexora bündelt alle Gewerke, alle Schnittstellen, alle Abstimmungen — Sie erhalten Updates, nicht Probleme.
                </p>
              </div>
            </div>
            <div className="bento-standard">
              <div className="glass-card" style={{ padding: "40px", borderRadius: "24px", height: "100%" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Termine. Qualität. Budget. Garantiert.</h3>
                <p style={{ fontSize: "14px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6 }}>
                  Wir unterschreiben für das Ergebnis, nicht für den Versuch. Verbindliche Termine, definierte Qualitätsstandards, transparente Kosten — eine Verantwortung.
                </p>
              </div>
            </div>
            <div className="bento-standard">
              <div className="glass-card" style={{ padding: "40px", borderRadius: "24px", height: "100%" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Klare Prozesse. Keine Überraschungen.</h3>
                <p style={{ fontSize: "14px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6 }}>
                  Jede Phase definiert. Jeder Meilenstein messbar. Von der Anfrage bis zur Abnahme wissen Sie genau, wo Ihr Projekt steht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Application Context Section - Software Focus */}
      <motion.section {...revealProps} className="section-padding" style={{ background: "var(--background)", overflow: "hidden" }}>
        <div className="max-w-content">
          <div className="grid-2" style={{ alignItems: "center", gap: "80px" }}>
            <div className="animate-fade-in">
              <span className="eyebrow">Volle Transparenz. Jederzeit.</span>
              <h2 style={{ fontSize: "var(--font-h2)", marginBottom: "32px" }}>
                Ihr Projekt. Ihr Überblick.
              </h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "18px", lineHeight: 1.6, fontWeight: 300, marginBottom: "40px" }}>
                Wir verlassen uns nicht auf Standard-Software. Mit unserem eigens entwickelten Management-System haben Sie absolute Klarheit über Fortschritt, Schnittstellen und Meilensteine. Keine Statusmeetings. Keine Nachfragen. Sie sehen, was wir sehen.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <div className="glass-card" style={{ padding: "20px", borderRadius: "16px", flex: 1, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", background: "radial-gradient(circle, var(--foreground) 0%, transparent 70%)", opacity: 0.05 }} />
                  <div style={{ fontSize: "14px", fontWeight: 400, marginBottom: "8px" }}>Echtzeit-Updates</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>Immer auf dem neuesten Stand.</div>
                </div>
                <div className="glass-card" style={{ padding: "20px", borderRadius: "16px", flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 400, marginBottom: "8px" }}>Meilenstein-Tracking</div>
                  <div style={{ fontSize: "11px", color: "var(--muted-foreground)", letterSpacing: "0.05em" }}>Jede Phase im Blick.</div>
                </div>
              </div>
            </div>

            <div className="dashboard-preview shadow-premium">
              <div className="dashboard-inner" style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", width: "200%", height: "200%", background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)", transform: "translate(-50%, -50%)", opacity: 0.05, pointerEvents: "none" }} />
                <div className="dashboard-header">
                  <div className="dot" style={{ background: "#ff5f56", opacity: 0.8 }} />
                  <div className="dot" style={{ background: "#ffbd2e", opacity: 0.8 }} />
                  <div className="dot" style={{ background: "#27c93f", opacity: 0.8 }} />
                  <div style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.4, fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "8px" }}>
                    Dokumentation
                  </div>
                </div>
                <div className="dashboard-grid">
                  <div className="sidebar">
                    <div className="sidebar-item" style={{ width: "80%", opacity: 0.8 }} />
                    <div className="sidebar-item" style={{ width: "60%" }} />
                    <div className="sidebar-item" style={{ width: "70%" }} />
                    <div style={{ marginTop: "40px" }}>
                      <div className="sidebar-item" style={{ width: "90%" }} />
                      <div className="sidebar-item" style={{ width: "40%" }} />
                    </div>
                  </div>
                  <div className="main-content">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", alignItems: "center" }}>
                      <div style={{ width: "120px", height: "12px", background: "var(--foreground)", opacity: 0.1, borderRadius: "6px" }} />
                    </div>
                    <div className="chart-placeholder" style={{ position: "relative" }}>
                      <div style={{ position: "absolute", bottom: "20%", left: "30%", width: "2px", height: "40%", background: "var(--foreground)", opacity: 0.2 }} />
                      <div style={{ position: "absolute", bottom: "40%", left: "60%", width: "2px", height: "20%", background: "var(--foreground)", opacity: 0.2 }} />
                    </div>
                    <div className="line-placeholder" style={{ width: "80%" }} />
                    <div className="line-placeholder" style={{ width: "100%" }} />

                    <div className="grid-2" style={{ marginTop: "32px", gap: "16px" }}>
                      <div style={{ height: "60px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px" }}>
                        <div style={{ width: "20%", height: "4px", background: "var(--foreground)", opacity: 0.1, borderRadius: "2px", marginBottom: "8px" }} />
                        <div style={{ width: "60%", height: "8px", background: "var(--foreground)", opacity: 0.05, borderRadius: "4px" }} />
                      </div>
                      <div style={{ height: "60px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px" }}>
                        <div style={{ width: "20%", height: "4px", background: "var(--foreground)", opacity: 0.1, borderRadius: "2px", marginBottom: "8px" }} />
                        <div style={{ width: "40%", height: "8px", background: "var(--foreground)", opacity: 0.05, borderRadius: "4px" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEXORA System Deep Dive */}
      <motion.div {...revealProps}>
        <ProcessSection />
      </motion.div>

      {/* Leistungen Section - Using App-style components */}
      <motion.section id="leistungen" {...revealProps} className="section-padding" style={{ background: "var(--background)" }}>
        <div className="max-w-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "80px", flexWrap: "wrap", gap: "32px" }}>
            <div style={{ maxWidth: "600px" }}>
              <span className="eyebrow">Leistungsportfolio</span>
              <h2 style={{ fontSize: "var(--font-h2)" }}>Was wir übernehmen</h2>
              <p style={{ color: "var(--muted-foreground)", marginTop: "24px", fontSize: "18px", fontWeight: 300 }}>
                Von der Generalunternehmung bis zur Spezialgewerk-Koordination. Alles, was Ihr Projekt braucht — aus einer Hand.
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ gap: "40px" }}>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="01" title="Generalunternehmung" text="Ein Vertrag. Ein Ansprechpartner. Volle Verantwortung für Ihr gesamtes Projekt — von der Planung bis zur schlüsselfertigen Übergabe." image="/generalunternehmung.png" /></div>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="02" title="Projektsteuerung" text="Termine, Kosten, Qualität — wir steuern Ihr Projekt mit klaren Prozessen und halten alle Beteiligten auf Kurs." image="/management.png" /></div>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="03" title="Energie & Elektro" text="PV-Anlagen, Trafostationen, Mittelspannung, Blitzschutz — komplexe Elektroinfrastruktur ist unser Kerngeschäft." image="/energie.png" /></div>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="04" title="Tiefbau & Erschließung" text="Kabeltrassen, Erdarbeiten, Fundamente — die unsichtbare Basis, die Ihr Projekt trägt." image="/infrastruktur.png" /></div>
          </div>
        </div>
      </motion.section>

      {/* Impact Stats */}
      <motion.section {...revealProps} className="stats-section">
        <div className="max-w-content grid-4" style={{ textAlign: "center" }}>
          <StatItem value="150+" label="abgeschlossene Projekte" />
          <StatItem value="98%" label="termingerechte Übergabe" />
          <StatItem value="15+" label="Jahre Erfahrung" />
          <StatItem value="100%" label="Gesamtverantwortung" />
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section id="anfrage" {...revealProps} className="section-padding" style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-content" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", marginBottom: "24px", letterSpacing: "-0.04em" }}>Ihr nächstes Projekt verdient einen klaren Kopf.</h2>
          <p style={{ fontSize: "18px", color: "var(--muted-foreground)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
            Lassen Sie uns besprechen, wie wir Ihre Anforderungen umsetzen — unverbindlich und konkret.
          </p>
          <button
            onClick={() => setIsInquiryOpen(true)}
            className="btn-primary"
            style={{ fontSize: "18px", padding: "24px 80px", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Projekt besprechen
          </button>
        </div>
      </motion.section>

      <footer className="section-padding" style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}>
        <div className="max-w-content">
          <div className="grid-2">
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 200, marginBottom: "32px" }}>Nexora</h1>
              <p style={{ maxWidth: "400px", color: "var(--muted-foreground)", fontSize: "15px", fontWeight: 300 }}>
                Generalunternehmer für Energie- und Infrastrukturprojekte. Ein Partner. Volle Verantwortung.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "14px", lineHeight: 2.2 }}>
                Grüner Ring 15, 04509 Delitzsch<br />
                info@nexora-pv.de
              </p>
            </div>
          </div>
          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <a
              href="https://www.willowwisp.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "9px",
                color: "var(--muted-foreground)",
                opacity: 0.25,
                textDecoration: "none",
                letterSpacing: "0.05em"
              }}
            >
              created by ww
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
