'use client';

import { motion } from 'framer-motion';

const DEFAULT_COLOR = '#c8a97e';

export function ParticleField({ color = DEFAULT_COLOR, count = 40 }: { color?: string; count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.15 + 0.03,
  }));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 0 }}
          animate={{
            x: [`${p.x}vw`, `${(p.x + 20) % 100}vw`, `${(p.x + 10) % 100}vw`],
            y: [`${p.y}vh`, `${(p.y + 30) % 100}vh`, `${(p.y + 15) % 100}vh`],
            opacity: [0, p.opacity, 0],
          }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: color,
          }}
        />
      ))}
    </div>
  );
}
