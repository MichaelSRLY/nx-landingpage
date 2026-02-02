"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

interface ServiceCardProps {
    title: string;
    text: string;
    image: string;
    index: string;
    className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, text, image, index, className }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            whileHover={{ y: -8 }}
            className={`app-card group relative ${className}`}
            style={{
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
        >
            {/* Spotlight effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[24px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(255,255,255,0.06),
                            transparent 80%
                        )
                    `,
                }}
            />

            <span className="service-index" style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                zIndex: 10,
                fontSize: "12px",
                opacity: 0.4,
                letterSpacing: "0.1em"
            }}>
                [{index}]
            </span>

            <div className="image-wrapper" style={{
                height: "260px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "16px",
                marginBottom: "24px"
            }}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="image-mask"
                    style={{
                        objectFit: "cover",
                        transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                    priority={index === "01"}
                />
            </div>

            <div className="content">
                <h3 style={{
                    fontSize: "24px",
                    fontWeight: 300,
                    marginBottom: "12px",
                    letterSpacing: "-0.02em"
                }}>
                    {title}
                </h3>
                <p style={{
                    fontSize: "15px",
                    color: "var(--muted-foreground)",
                    lineHeight: 1.6,
                    fontWeight: 300
                }}>
                    {text}
                </p>

                <div style={{
                    marginTop: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    opacity: 0,
                    transform: "translateY(10px)",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                }} className="card-cta">
                    <span>Details ansehen</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
            </div>

            <style jsx>{`
                :global(.app-card:hover .card-cta) {
                    opacity: 0.6 !important;
                    transform: translateY(0) !important;
                }
                :global(.app-card:hover .image-mask) {
                    transform: scale(1.05);
                }
            `}</style>
        </motion.div>
    );
};
