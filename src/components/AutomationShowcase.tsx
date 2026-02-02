"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PenTool, ShieldCheck, Cpu, Zap, Activity, CheckCircle2 } from "lucide-react";

const steps = [
    {
        title: "1. Anforderungsanalyse",
        desc: "Wir erfassen Ihre Anforderungen, prüfen technische Machbarkeit und identifizieren alle relevanten Gewerke und Schnittstellen.",
        icon: <Search size={24} />,
        color: "var(--accent)"
    },
    {
        title: "2. Planung & Koordination",
        desc: "Alle Gewerke werden terminiert, Schnittstellen definiert und Abhängigkeiten geplant — bevor die erste Schaufel den Boden berührt.",
        icon: <PenTool size={24} />,
        color: "#6366f1"
    },
    {
        title: "3. Umsetzung & Kontrolle",
        desc: "Wir steuern alle Gewerke, überwachen Qualität und Termine, und lösen Probleme bevor sie eskalieren.",
        icon: <Activity size={24} />,
        color: "#10b981"
    },
    {
        title: "4. Abnahme & Übergabe",
        desc: "Dokumentierte Qualitätsprüfung, vollständige Unterlagen, und ein Projekt, das hält was wir versprochen haben.",
        icon: <CheckCircle2 size={24} />,
        color: "var(--foreground)"
    }
];

export const AutomationShowcase = () => {
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="section-padding" style={{ background: "var(--surface)", position: "relative", overflow: "hidden" }}>
            <div className="max-w-content">
                <div style={{ textAlign: "center", marginBottom: "80px" }}>
                    <span className="eyebrow">Unser Vorgehen</span>
                    <h2 style={{ fontSize: "48px", marginBottom: "24px" }}>Von der Anfrage bis zur Abnahme</h2>
                    <p style={{ color: "var(--muted-foreground)", maxWidth: "700px", margin: "0 auto", fontSize: "18px", fontWeight: 300 }}>
                        Vier Phasen. Ein Verantwortlicher. Jedes Projekt durchläuft unseren bewährten Prozess — strukturiert, transparent, termingerecht.
                    </p>
                </div>

                <div className="grid-2" style={{ gap: "80px", alignItems: "center" }}>
                    {/* List Side */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {steps.map((step, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveStep(i)}
                                style={{
                                    textAlign: "left",
                                    padding: "32px",
                                    borderRadius: "24px",
                                    background: activeStep === i ? "var(--background)" : "transparent",
                                    border: "1px solid",
                                    borderColor: activeStep === i ? "var(--border)" : "transparent",
                                    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                                    cursor: "pointer",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                            >
                                {activeStep === i && (
                                    <motion.div
                                        layoutId="active-bg"
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            width: "4px",
                                            height: "100%",
                                            background: step.color
                                        }}
                                    />
                                )}
                                <div style={{ display: "flex", gap: "24px" }}>
                                    <div style={{
                                        color: activeStep === i ? step.color : "var(--muted-foreground)",
                                        opacity: activeStep === i ? 1 : 0.4,
                                        transition: "all 0.5s ease"
                                    }}>
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 style={{
                                            fontSize: "20px",
                                            fontWeight: 400,
                                            marginBottom: "8px",
                                            color: activeStep === i ? "var(--foreground)" : "var(--muted-foreground)"
                                        }}>
                                            {step.title}
                                        </h3>
                                        <p style={{
                                            fontSize: "15px",
                                            color: "var(--muted-foreground)",
                                            lineHeight: 1.5,
                                            fontWeight: 300,
                                            opacity: activeStep === i ? 1 : 0.6
                                        }}>
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Visualization Side */}
                    <div style={{
                        background: "var(--background)",
                        borderRadius: "32px",
                        border: "1px solid var(--border)",
                        aspectRatio: "4/3",
                        position: "relative",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <div style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
                            <div style={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: "radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)",
                                backgroundSize: "40px 40px"
                            }} />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px" }}
                            >
                                {activeStep === 0 && (
                                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                        <div className="scanner-line" />
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    style={{ height: "60px", background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "12px" }}
                                                >
                                                    <div style={{ width: "40%", height: "4px", background: "var(--foreground)", opacity: 0.1, marginBottom: "8px" }} />
                                                    <div style={{ width: "80%", height: "4px", background: "var(--foreground)", opacity: 0.05 }} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeStep === 1 && (
                                    <div style={{ position: "relative", display: "flex", gap: "40px", alignItems: "center" }}>
                                        <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <Zap size={32} color={steps[1].color} />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {[1, 2, 3].map(i => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: 200 }}
                                                    transition={{ delay: i * 0.2, duration: 1 }}
                                                    style={{ height: "12px", background: steps[1].color, opacity: 0.2, borderRadius: "6px" }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeStep === 2 && (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ width: "100%", maxWidth: "300px", padding: "20px", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)", position: "relative" }}>
                                            <div style={{ height: "8px", width: "100%", background: "var(--border)", borderRadius: "4px", marginBottom: "20px", overflow: "hidden" }}>
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: "75%" }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                                    style={{ height: "100%", background: steps[2].color }}
                                                />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                                                <div style={{ width: "60px", height: "8px", background: "var(--foreground)", opacity: 0.1, borderRadius: "4px" }} />
                                                <div style={{ width: "30px", height: "8px", background: steps[2].color, opacity: 0.6, borderRadius: "4px" }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <div style={{ width: "80px", height: "8px", background: "var(--foreground)", opacity: 0.1, borderRadius: "4px" }} />
                                                <div style={{ width: "20px", height: "8px", background: steps[2].color, opacity: 0.6, borderRadius: "4px" }} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeStep === 3 && (
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", damping: 12 }}
                                            style={{
                                                width: "160px",
                                                height: "160px",
                                                borderRadius: "40px",
                                                background: "var(--surface)",
                                                border: `2px solid ${steps[3].color}`,
                                                margin: "0 auto",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: `0 20px 40px -10px ${steps[3].color}33`
                                            }}
                                        >
                                            <CheckCircle2 size={80} color={steps[3].color} strokeWidth={1.5} />
                                        </motion.div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scanner-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--foreground), transparent);
                    opacity: 0.2;
                    animation: scan 4s linear infinite;
                    z-index: 10;
                }
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </section>
    );
};
