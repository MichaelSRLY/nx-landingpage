import React from "react";

interface FeatureItemProps {
    title: string;
    text: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, text }) => {
    return (
        <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 400, marginBottom: "12px" }}>{title}</h3>
            <p style={{ fontSize: "14px", color: "var(--muted-foreground)", lineHeight: 1.6, fontWeight: 300 }}>{text}</p>
        </div>
    );
};
