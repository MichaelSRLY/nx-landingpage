'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const fmt = (v: number, d = 2) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

export function AnimNum({
  value,
  suffix = '',
  decimals = 2,
  duration = 2200,
  className = '',
  locale = 'de-DE',
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  locale?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay((1 - Math.pow(1 - p, 5)) * value);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);

  const formatted = locale === 'de-DE'
    ? fmt(display, decimals)
    : display.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <span ref={ref} className={className}>
      {formatted}{suffix}
    </span>
  );
}
