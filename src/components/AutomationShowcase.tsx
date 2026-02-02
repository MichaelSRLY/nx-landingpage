"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PenTool, ShieldCheck, Cpu, Zap, Activity } from "lucide-react";

const steps = [
    {
        title: "Requirement Analysis",
        desc: "Automated aggregation of technical specifications and regulatory constraints.",
        icon: <Search size={24} />,
        color: "var(--accent)"
    },
    {
        title: "Digital Coordination",
        desc: "AI-driven scheduling across all trades to eliminate idle times and interface errors.",
        icon: <Cpu size={24} />,
        color: "#6366f1"
    },
    {
        title: "Real-time Auditing",
        desc: "Continuous monitoring of progress and quality via digital twin integration.",
        icon: <ShieldCheck size={24} />,
        color: "#10b981"
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
        <section className="section-padding" style={{ background: "var(--surface)", overflow: "hidden" }}>
            <div className="max-w-content">
                <div style={{ textAlign: "center", marginBottom: "80px" }}>
                    <span className="eyebrow">The REAP Odyssey</span>
                    <h2 style={{ fontSize: "48px", marginBottom: "24px" }}>Automatisierte Präzision</h2>
                    <p style={{ color: "var(--muted-foreground)", maxWidth: "600px", margin: "0 auto", fontSize: "18px", fontWeight: 300 }}>
                        Wir haben Projektmanagement neu definiert. Durch technologische Integration schaffen wir Sicherheit, wo andere in Komplexität versinken.
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
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 3 }}
                                            style={{
                                                width: "200px",
                                                height: "200px",
                                                borderRadius: "100px",
                                                border: `2px solid ${steps[2].color}`,
                                                margin: "0 auto",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                position: "relative"
                                            }}
                                        >
                                            <div style={{ position: "absolute", inset: "-20px", border: `1px solid ${steps[2].color}`, opacity: 0.2, borderRadius: "50%" }} />
                                            <Activity size={60} color={steps[2].color} />
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
