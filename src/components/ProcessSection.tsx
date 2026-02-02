"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Search,
    PenTool,
    Activity,
    CheckCircle2,
    Zap,
    Clock,
    BarChart3,
    LayoutDashboard,
    ArrowRight,
    Shield,
    Database,
    Binary
} from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Anforderungsanalyse",
        subtitle: "Digitale Erfassung & Scoping",
        desc: "Wir erfassen Ihre Anforderungen, prüfen die technische Machbarkeit und definieren alle Gewerke und Schnittstellen.",
        icon: <Search size={22} />,
        color: "var(--foreground)",
        widget: "RequirementsWidget"
    },
    {
        id: "02",
        title: "Planung & Koordination",
        subtitle: "Präzision vor dem ersten Spatenstich",
        desc: "Alle Gewerke werden terminiert, Abhängigkeiten geplant, Verantwortlichkeiten geklärt — bevor die Umsetzung beginnt.",
        icon: <PenTool size={22} />,
        color: "#6366f1",
        widget: "ScheduleWidget"
    },
    {
        id: "03",
        title: "Umsetzung & Kontrolle",
        subtitle: "Echtzeit-Tracking & Management",
        desc: "Wir steuern alle Beteiligten, überwachen Qualität und Termine, und lösen Engpässe bevor sie eskalieren. Über Ihr persönliches Dashboard sehen Sie jederzeit den Projektfortschritt — Meilensteine, offene Punkte, nächste Schritte.",
        icon: <Activity size={22} />,
        color: "#10b981",
        widget: "DashboardWidget"
    },
    {
        id: "04",
        title: "Abnahme & Dokumentation",
        subtitle: "Schlüsselfertige Qualität",
        desc: "Dokumentierte Qualitätsprüfung, vollständige Unterlagen, und ein Ergebnis, das hält was wir versprochen haben.",
        icon: <CheckCircle2 size={22} />,
        color: "var(--accent)",
        widget: "HandoverWidget"
    }
];

const RequirementsWidget = () => (
    <div style={{ width: "100%", height: "100%", padding: "40px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "12px", fontFamily: "var(--font-mono)", opacity: 0.5 }}>ANALYZE_PHASE_01</div>
            <div style={{ fontSize: "10px", color: "var(--accent)", background: "var(--accent)22", padding: "4px 8px", borderRadius: "100px" }}>SCANNING...</div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
            {[0.2, 0.4, 0.6, 0.8].map((op, i) => (
                <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: i * 0.2, duration: 1.5, repeat: Infinity }}
                    style={{ height: "1px", background: "var(--foreground)", opacity: op, marginBottom: "30px" }}
                />
            ))}
            <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                        style={{ background: "var(--foreground)", borderRadius: "4px", height: "40px" }}
                    />
                ))}
            </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ height: "4px", flex: 1, background: "var(--accent)", borderRadius: "2px" }} />
            <div style={{ height: "4px", flex: 0.4, background: "var(--border)", borderRadius: "2px" }} />
        </div>
    </div>
);

const ScheduleWidget = () => (
    <div style={{ width: "100%", height: "100%", padding: "40px" }}>
        <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={18} />
            </div>
            <div>
                <div style={{ fontSize: "14px", fontWeight: 500 }}>Terminsicherheit</div>
                <div style={{ fontSize: "11px", opacity: 0.5 }}>99.8% Effizienz</div>
            </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[0, 1, 2].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{ width: "80px", height: "6px", background: "var(--foreground)", opacity: 0.05, borderRadius: "3px" }} />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: i === 0 ? "60%" : i === 1 ? "40%" : "75%" }}
                        transition={{ duration: 1.5, delay: i * 0.2 }}
                        style={{ height: "12px", background: i === 0 ? "#6366f1" : "var(--foreground)", opacity: 0.2, borderRadius: "6px" }}
                    />
                </div>
            ))}
        </div>
        <div style={{ marginTop: "40px", padding: "15px", border: "1px solid var(--border)", borderRadius: "12px", background: "var(--surface)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "10px", opacity: 0.4 }}>CONFLICT_RESOLVED</div>
                <CheckCircle2 size={12} color="#10b981" />
            </div>
        </div>
    </div>
);

const DashboardWidget = () => (
    <div style={{ width: "100%", height: "100%", padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
            <div style={{ display: "flex", gap: "30px" }}>
                <div>
                    <div style={{ fontSize: "24px", fontWeight: 200 }}>84%</div>
                    <div style={{ fontSize: "10px", opacity: 0.5 }}>PROGRESS</div>
                </div>
                <div>
                    <div style={{ fontSize: "24px", fontWeight: 200 }}>04</div>
                    <div style={{ fontSize: "10px", opacity: 0.5 }}>ACTIVE_TRADES</div>
                </div>
            </div>
            <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#10b981" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "3px", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
                    LIVE
                </div>
                <div style={{ fontSize: "10px", opacity: 0.4 }}>SYNC_OK</div>
            </div>
        </div>
        <div style={{ height: "100px", position: "relative", marginBottom: "20px" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 100" fill="none">
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity }}
                    d="M0 80C50 70 100 90 150 50C200 10 250 40 400 20"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeOpacity="0.5"
                />
                <motion.circle
                    animate={{ x: [0, 400], y: [80, 20] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    r="4"
                    fill="#10b981"
                />
            </svg>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
            <div style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                <div style={{ height: "4px", width: "40%", background: "var(--foreground)", opacity: 0.1, marginBottom: "8px" }} />
                <div style={{ height: "8px", width: "100%", background: "#10b981", opacity: 0.2, borderRadius: "4px" }} />
            </div>
            <div style={{ padding: "12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px" }}>
                <div style={{ height: "4px", width: "30%", background: "var(--foreground)", opacity: 0.1, marginBottom: "8px" }} />
                <div style={{ height: "8px", width: "100%", background: "var(--foreground)", opacity: 0.1, borderRadius: "4px" }} />
            </div>
        </div>
    </div>
);

const HandoverWidget = () => (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
                width: "200px",
                height: "280px",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                position: "relative",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                padding: "20px"
            }}
        >
            <div style={{ width: "30px", height: "30px", border: "1px solid var(--accent)", marginBottom: "20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ height: "1px", width: i === 5 ? "50%" : "100%", background: "var(--foreground)", opacity: 0.1 }} />
                ))}
            </div>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{ position: "absolute", bottom: "30px", right: "20px", display: "flex", alignItems: "center", gap: "8px" }}
            >
                <div style={{ fontSize: "10px", opacity: 0.4 }}>VERIFIED</div>
                <CheckCircle2 size={16} color="var(--accent)" />
            </motion.div>
        </motion.div>

        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.05, pointerEvents: "none" }}>
            <div style={{
                width: "200%",
                height: "200%",
                backgroundImage: "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
                backgroundSize: "20px 20px"
            }} />
        </div>
    </div>
);

export const ProcessSection = () => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="section-padding" style={{ background: "var(--background)", position: "relative", overflow: "hidden" }}>
            <div className="max-w-content">
                <div style={{ marginBottom: "clamp(40px, 10vw, 100px)" }}>
                    <span className="eyebrow">DAS NEXORA SYSTEM</span>
                    <h2 style={{ fontSize: "clamp(32px, 8vw, 72px)", lineHeight: 0.95, letterSpacing: "-0.04em", marginBottom: "40px" }}>
                        Vom Konzept zur Abnahme. <br />
                        <span style={{ opacity: 0.4 }}>Ohne Reibungsverluste.</span>
                    </h2>
                    <p style={{ maxWidth: "600px", fontSize: "18px", color: "var(--muted-foreground)", fontWeight: 300, lineHeight: 1.6 }}>
                        Jedes Projekt durchläuft unseren bewährten Prozess — strukturiert, transparent, termingerecht.
                    </p>
                </div>

                <div className="grid-2" style={{ gap: "40px", alignItems: "start" }}>
                    {/* Left Side: Steps List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {steps.map((step, i) => (
                            <motion.button
                                key={step.id}
                                onClick={() => setActiveStep(i)}
                                whileHover={{ x: 10 }}
                                style={{
                                    textAlign: "left",
                                    padding: "40px",
                                    borderRadius: "32px",
                                    background: activeStep === i ? "var(--surface)" : "transparent",
                                    border: "1px solid",
                                    borderColor: activeStep === i ? "var(--border)" : "transparent",
                                    cursor: "pointer",
                                    position: "relative",
                                    transition: "background 0.3s ease, border 0.3s ease"
                                }}
                            >
                                <div style={{ display: "flex", gap: "24px" }}>
                                    <div style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "12px",
                                        background: activeStep === i ? "var(--foreground)" : "transparent",
                                        border: "1px solid var(--border)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "10px",
                                        fontFamily: "var(--font-mono)",
                                        color: activeStep === i ? "var(--background)" : "var(--muted-foreground)",
                                        transition: "all 0.3s ease"
                                    }}>
                                        {step.id}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: "20px",
                                            fontWeight: 400,
                                            marginBottom: "8px",
                                            color: activeStep === i ? "var(--foreground)" : "var(--muted-foreground)"
                                        }}>
                                            {step.title}
                                        </h3>
                                        <AnimatePresence mode="wait">
                                            {activeStep === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                    style={{ overflow: "hidden" }}
                                                >
                                                    <p style={{ fontSize: "14px", color: "var(--muted-foreground)", lineHeight: 1.6, marginTop: "16px" }}>
                                                        {step.desc}
                                                    </p>
                                                    <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 500 }}>
                                                        DETAILS ANSEHEN <ArrowRight size={14} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Right Side: Visualized Widgets */}
                    <div className="process-visual-container" style={{ position: "sticky", top: "120px" }}>
                        <div className="visual-card-inner">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.05, y: -20 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    {activeStep === 0 && <RequirementsWidget />}
                                    {activeStep === 1 && <ScheduleWidget />}
                                    {activeStep === 2 && <DashboardWidget />}
                                    {activeStep === 3 && <HandoverWidget />}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Speed Badge */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="speed-badge"
                            style={{
                                position: "absolute",
                                bottom: "-40px",
                                right: "-40px",
                                background: "var(--foreground)",
                                color: "var(--background)",
                                padding: "30px",
                                borderRadius: "24px",
                                maxWidth: "240px",
                                zIndex: 10
                            }}
                        >
                            <Zap size={24} style={{ marginBottom: "16px" }} />
                            <div style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.2, marginBottom: "8px" }}>Bis zu 30% schnellere Abwicklung.</div>
                            <div style={{ fontSize: "12px", opacity: 0.6 }}>Durch digitale Synchronisation aller Gewerke.</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
