import React from "react";

interface StatItemProps {
    value: string;
    label: string;
}

export const StatItem: React.FC<StatItemProps> = ({ value, label }) => {
    return (
        <div className="stat-item">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};
