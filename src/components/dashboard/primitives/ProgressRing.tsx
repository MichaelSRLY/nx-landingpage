'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const DEFAULT_COLOR = '#c8a97e';

export function ProgressRing({
  value,
  max,
  size = 56,
  strokeWidth = 3,
  color = DEFAULT_COLOR,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const ref = useRef<SVGCircleElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / max;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(200,169,126,0.08)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        ref={ref}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
        animate={isInView ? { strokeDashoffset: circ * (1 - pct) } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </svg>
  );
}
