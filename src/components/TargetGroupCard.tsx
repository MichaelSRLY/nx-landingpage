import React from "react";

interface TargetGroupCardProps {
    title: string;
    subtitle: string;
}

export const TargetGroupCard: React.FC<TargetGroupCardProps> = ({ title, subtitle }) => {
    return (
        <div style={{ textAlign: "center", padding: "40px 20px", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 500, marginBottom: "8px" }}>{title}</h3>
            <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>{subtitle}</p>
        </div>
    );
};
