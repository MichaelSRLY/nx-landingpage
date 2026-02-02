"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const IntroReveal = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Fallback: hide if video doesn't end or fails
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 20000); // Increased fallback to 20s to ensure it doesn't cut off the video or the logo persistence

        return () => clearTimeout(timer);
    }, []);

    const handleVideoEnd = () => {
        // Delay the fade out so the logo persists
        setTimeout(() => {
            setIsVisible(false);
        }, 5000); // 5 second pause on the final frame for better brand impact
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden"
                    }}
                >
                    <video
                        autoPlay
                        muted
                        playsInline
                        onEnded={handleVideoEnd}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    >
                        <source src="/nexora-4k.mp4" type="video/mp4" />
                    </video>

                    {/* Optional: Add a skip button or logo overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3 }}
                        onClick={() => setIsVisible(false)}
                        style={{
                            position: "absolute",
                            bottom: "40px",
                            right: "40px",
                            color: "#fff",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            cursor: "pointer",
                            opacity: 0.5,
                            fontFamily: "var(--font-mono)"
                        }}
                    >
                        SKIP INTRO
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
