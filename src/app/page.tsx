"use client";

import React, { useState } from "react";
import { StatItem } from "@/components/StatItem";
import { ServiceCard } from "@/components/ServiceCard";
import { Navbar } from "@/components/Navbar";
import { ProjectInquiry } from "@/components/ProjectInquiry";
import { AutomationShowcase } from "@/components/AutomationShowcase";
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
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <Navbar onInquiryClick={() => setIsInquiryOpen(true)} />
      <ProjectInquiry isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />

      <div className="overlay-grain" />
      <div className="overlay-noise" />

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "180px 40px 120px",
        position: "relative",
        textAlign: "center"
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: "900px" }}
        >
          <span className="eyebrow" style={{ letterSpacing: "0.3em", marginBottom: "24px" }}>CORE ARCHITECTURE · NEXORA PV</span>
          <h1 className="text-gradient" style={{
            fontSize: "var(--font-hero)",
            fontWeight: 200,
            letterSpacing: "-0.04em",
            marginBottom: "32px",
            lineHeight: 1.05
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

          {/* Software Status Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "24px",
              padding: "12px 24px",
              background: "var(--surface)",
              borderRadius: "100px",
              border: "1px solid var(--border)",
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "var(--muted-foreground)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "3px", background: "#27c93f" }} />
              <span>SYSTEM_READY</span>
            </div>
            <div style={{ width: "1px", height: "12px", background: "var(--border)" }} />
            <span>REGION: EU-CENTRAL-1</span>
            <div style={{ width: "1px", height: "12px", background: "var(--border)" }} />
            <span>UPTIME: 99.9%</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <motion.section id="vorteile" {...revealProps} className="section-padding" style={{ background: "var(--surface)", position: "relative", overflow: "hidden" }}>
        <div className="max-w-content">
          <div style={{ marginBottom: "100px", maxWidth: "700px" }}>
            <span className="eyebrow">Ihre Vorteile</span>
            <h2 style={{ fontSize: "42px", display: "inline-block" }}>
              Wir reduzieren Komplexität und schaffen klare Strukturen für Ihren Projekterfolg.
            </h2>
          </div>

          <div className="bento-grid">
            <div className="bento-wide bento-tall">
              <div className="escher-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "48px", marginBottom: "24px", opacity: 0.2 }}>01</span>
                <h3 style={{ fontSize: "32px", fontWeight: 200, marginBottom: "20px" }}>Ein Ansprechpartner</h3>
                <p style={{ fontSize: "18px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6, maxWidth: "450px" }}>
                  Keine Koordination zwischen Dutzenden Gewerken. Sie sprechen mit uns – wir kümmern uns um den Rest.
                  Wir bündeln Kommunikation und Verantwortung.
                </p>
              </div>
            </div>
            <div className="bento-standard">
              <div className="glass-card" style={{ padding: "40px", borderRadius: "24px", height: "100%" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Gesamtverantwortung</h3>
                <p style={{ fontSize: "14px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6 }}>
                  Wir übernehmen die volle Verantwortung für Ihr Projekt. Termine, Qualität und Budget aus einer Hand.
                </p>
              </div>
            </div>
            <div className="bento-standard">
              <div className="glass-card" style={{ padding: "40px", borderRadius: "24px", height: "100%" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 400, marginBottom: "16px" }}>Strukturiertes Vorgehen</h3>
                <p style={{ fontSize: "14px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6 }}>
                  Klare Prozesse, transparente Kommunikation und nachvollziehbare Meilensteine von Anfang bis Ende.
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
              <span className="eyebrow">Digitaler Zwilling</span>
              <h2 style={{ fontSize: "48px", marginBottom: "32px" }}>
                Echtzeit-Übersicht Ihrer Projekte.
              </h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "18px", lineHeight: 1.6, fontWeight: 300, marginBottom: "40px" }}>
                Wir setzen auf modernste Management-Tools. Mit unserem digitalen Dashboard behalten Sie jederzeit den Überblick über Fortschritt, Gewerke und Meilensteine — transparent und unkompliziert.
              </p>
              <div style={{ display: "flex", gap: "16px" }}>
                <div className="glass-card" style={{ padding: "20px", borderRadius: "16px", flex: 1, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", background: "radial-gradient(circle, var(--foreground) 0%, transparent 70%)", opacity: 0.05 }} />
                  <div style={{ fontSize: "24px", fontWeight: 200, marginBottom: "8px" }}>24/7</div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Monitoring</div>
                </div>
                <div className="glass-card" style={{ padding: "20px", borderRadius: "16px", flex: 1 }}>
                  <div style={{ fontSize: "24px", fontWeight: 200, marginBottom: "8px" }}>100%</div>
                  <div style={{ fontSize: "12px", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Transparenz</div>
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
                    <div style={{ width: "6px", height: "6px", borderRadius: "3px", background: "#27c93f", boxShadow: "0 0 10px #27c93f" }} />
                    LIVE_CONNECTION
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
                      <div style={{ fontSize: "10px", fontWeight: 500, padding: "4px 8px", background: "var(--accent)", borderRadius: "100px", opacity: 0.6 }}>ACTIVE_SPRINT</div>
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

      {/* New Automation Showcase */}
      <motion.div {...revealProps}>
        <AutomationShowcase />
      </motion.div>

      {/* Leistungen Section - Using App-style components */}
      <motion.section id="leistungen" {...revealProps} className="section-padding" style={{ background: "var(--background)" }}>
        <div className="max-w-content">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "80px", flexWrap: "wrap", gap: "32px" }}>
            <div style={{ maxWidth: "600px" }}>
              <span className="eyebrow">Leistungen</span>
              <h2 style={{ fontSize: "48px" }}>Was wir für Sie tun</h2>
              <p style={{ color: "var(--muted-foreground)", marginTop: "24px", fontSize: "18px", fontWeight: 300 }}>
                Entdecken Sie unsere spezialisierten Lösungen für moderne Infrastruktur. Intuitive Abwicklung, maximale Kontrolle.
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ gap: "40px" }}>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="01" title="Generalunternehmung" text="Wir bündeln alle Gewerke und übernehmen die Gesamtverantwortung." image="/generalunternehmung.png" /></div>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="02" title="Projektmanagement" text="Professionelle Steuerung komplexer Vorhaben mit modernsten Tools." image="/management.png" /></div>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="03" title="Energie & Elektro" text="Spezialisierung auf anspruchsvolle Elektroinfrastruktur." image="/energie.png" /></div>
            <div onClick={() => setIsInquiryOpen(true)}><ServiceCard index="04" title="Infrastruktur" text="Ganzheitliche Tiefbau- und Erschließungslösungen." image="/infrastruktur.png" /></div>
          </div>
        </div>
      </motion.section>

      {/* Impact Stats */}
      <motion.section {...revealProps} className="stats-section">
        <div className="max-w-content grid-4" style={{ textAlign: "center" }}>
          <StatItem value="150+" label="Projekte" />
          <StatItem value="98%" label="Termintreue" />
          <StatItem value="15+" label="Jahre" />
          <StatItem value="100%" label="Verantwortung" />
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section id="anfrage" {...revealProps} className="section-padding" style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-content" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "56px", marginBottom: "40px", letterSpacing: "-0.04em" }}>Bereit für Ihr Projekt?</h2>
          <button
            onClick={() => setIsInquiryOpen(true)}
            className="btn-primary"
            style={{ fontSize: "18px", padding: "24px 80px", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            Anfrage stellen
          </button>
        </div>
      </motion.section>

      <footer className="section-padding" style={{ borderTop: "1px solid var(--border)", background: "var(--background)" }}>
        <div className="max-w-content">
          <div className="grid-2">
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: 200, marginBottom: "32px" }}>Nexora</h1>
              <p style={{ maxWidth: "400px", color: "var(--muted-foreground)", fontSize: "15px", fontWeight: 300 }}>
                Ihr Generalunternehmer für komplexe Projekte.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "14px", lineHeight: 2.2 }}>
                Grüner Ring 15, 04509 Delitzsch<br />
                info@nexora-pv.de
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
