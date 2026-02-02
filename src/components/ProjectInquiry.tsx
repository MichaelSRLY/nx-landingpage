"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ChevronRight, Briefcase, Zap, Building, ArrowRight, Loader2 } from "lucide-react";

interface ProjectInquiryProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ProjectInquiry = ({ isOpen, onClose }: ProjectInquiryProps) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        type: "",
        scope: "",
        contact: "",
    });

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleOptionSelect = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setTimeout(() => setStep(prev => prev + 1), 400);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate "AI coordination" delay
        setTimeout(() => {
            setIsSubmitting(false);
            setStep(4); // Success step
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(20px)"
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    background: "var(--background)",
                    borderRadius: "32px",
                    border: "1px solid var(--border)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 40px 100px -20px rgba(0,0,0,0.3)"
                }}
            >
                {/* Header */}
                <div style={{ padding: "32px 32px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                style={{
                                    width: "32px",
                                    height: "4px",
                                    borderRadius: "2px",
                                    background: step >= i ? "var(--foreground)" : "var(--border)",
                                    transition: "all 0.4s ease"
                                }}
                            />
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: "32px" }}>
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <span className="eyebrow" style={{ marginBottom: "12px" }}>Konfiguration</span>
                                <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Womit können wir starten?</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {[
                                        { id: "gu", label: "Generalunternehmung", icon: <Building size={18} /> },
                                        { id: "pm", label: "Projektmanagement", icon: <Briefcase size={18} /> },
                                        { id: "ee", label: "Energie & Elektro", icon: <Zap size={18} /> }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleOptionSelect("type", opt.id)}
                                            className="inquiry-btn"
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                                <div className="icon-box">{opt.icon}</div>
                                                {opt.label}
                                            </div>
                                            <ChevronRight size={16} opacity={0.3} />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <button
                                    onClick={() => setStep(1)}
                                    style={{ color: "var(--muted-foreground)", fontSize: "12px", background: "none", border: "none", marginBottom: "16px", cursor: "pointer" }}
                                >
                                    ← Zurück
                                </button>
                                <h2 style={{ fontSize: "28px", marginBottom: "32px" }}>Dimension des Vorhabens</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {[
                                        { id: "small", label: "Regional / Mittelstand", sub: "Bis 1 Mio. Volumina" },
                                        { id: "large", label: "Infrastruktur / Industrie", sub: "Über 1 Mio. Volumina" }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleOptionSelect("scope", opt.id)}
                                            className="inquiry-btn"
                                            style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}
                                        >
                                            <div style={{ fontWeight: 400 }}>{opt.label}</div>
                                            <div style={{ fontSize: "12px", opacity: 0.5 }}>{opt.sub}</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>Fast geschafft.</h2>
                                <p style={{ color: "var(--muted-foreground)", marginBottom: "32px", fontSize: "15px" }}>
                                    Hinterlassen Sie uns Ihre E-Mail. Wir analysieren Ihre Anfrage sofort.
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        required
                                        type="email"
                                        placeholder="beispiel@firma.de"
                                        className="inquiry-input"
                                        value={formData.contact}
                                        onChange={(e) => setFormData(d => ({ ...d, contact: e.target.value }))}
                                    />
                                    <button
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                        style={{ width: "100%", marginTop: "24px", padding: "20px" }}
                                    >
                                        {isSubmitting ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Koordiniere Ressourcen...</span>
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
                                                <span>Anfrage absenden</span>
                                                <ArrowRight size={18} />
                                            </div>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: "center", padding: "40px 0" }}
                            >
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "40px",
                                    background: "var(--foreground)",
                                    color: "var(--background)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 24px"
                                }}>
                                    <Check size={40} />
                                </div>
                                <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>Anfrage eingegangen.</h2>
                                <p style={{ color: "var(--muted-foreground)", fontSize: "16px", marginBottom: "32px" }}>
                                    Unsere Automatisierung hat bereits einen Projektleiter reserviert. Sie erhalten in Kürze Rückmeldung.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="btn-secondary"
                                    style={{ padding: "12px 32px" }}
                                >
                                    Fenster schließen
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <style jsx>{`
                .inquiry-btn {
                    width: 100%;
                    padding: 20px 24px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--foreground);
                    text-align: left;
                }
                .inquiry-btn:hover {
                    border-color: var(--muted-foreground);
                    transform: translateY(-2px);
                    background: var(--background);
                }
                .icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: var(--background);
                    border: 1px solid var(--border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.6;
                }
                .inquiry-input {
                    width: 100%;
                    padding: 20px 24px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    font-size: 16px;
                    color: var(--foreground);
                    outline: none;
                    transition: all 0.3s ease;
                }
                .inquiry-input:focus {
                    border-color: var(--foreground);
                    background: var(--background);
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};
