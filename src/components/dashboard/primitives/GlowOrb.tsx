'use client';

import { motion } from 'framer-motion';

const DEFAULT_COLOR = '#c8a97e';

export function GlowOrb({
  color = DEFAULT_COLOR,
  size = 400,
  x = '50%',
  y = '0%',
  opacity = 0.04,
}: {
  color?: string;
  size?: number;
  x?: string;
  y?: string;
  opacity?: number;
}) {
  return (
    <motion.div
      animate={{ scale: [1, 1.1, 1], opacity: [opacity, opacity * 1.5, opacity] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}, transparent 70%)`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        filter: 'blur(40px)',
      }}
    />
  );
}
