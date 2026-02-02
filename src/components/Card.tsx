import React from "react";

interface CardProps {
    title: string;
    text: string;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, text, className }) => {
    return (
        <div className={`escher-card ${className}`}>
            <h3 style={{ fontSize: "22px", fontWeight: 300, marginBottom: "20px", letterSpacing: "-0.02em" }}>{title}</h3>
            <p style={{ fontSize: "15px", color: "var(--muted-foreground)", lineHeight: 1.6, fontWeight: 300 }}>{text}</p>
        </div>
    );
};
