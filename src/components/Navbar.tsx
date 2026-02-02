"use client";

import React, { useEffect, useState } from "react";

export const Navbar = ({ onInquiryClick }: { onInquiryClick: () => void }) => {
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    if (theme === null) return <nav className="navbar" style={{ opacity: 0 }} />;

    return (
        <nav className="navbar">
            <div style={{ fontWeight: 400, fontSize: "14px", letterSpacing: "0.2em" }}>NEXORA</div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <a href="#vorteile" className="nav-link">Vorteile</a>
                <a href="#leistungen" className="nav-link">Leistungen</a>
                <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                    {theme === "light" ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                    )}
                </button>
                <button onClick={onInquiryClick} className="nav-cta" style={{ border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    Projekt anfragen
                </button>
            </div>
        </nav>
    );
};
