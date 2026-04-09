'use client';

import { motion } from 'framer-motion';

const DEFAULT_COLOR = '#c8a97e';

const fmt = (v: number, d = 2) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

export function ChartTooltip({
  active,
  payload,
  label,
  accentColor = DEFAULT_COLOR,
  currencySuffix = ' \u20AC',
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  accentColor?: string;
  currencySuffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        background: 'rgba(15, 13, 11, 0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(200,169,126,0.15)',
        borderRadius: '14px',
        padding: '14px 18px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      <p
        style={{
          color: accentColor,
          fontSize: '11px',
          fontWeight: 600,
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{
            color: '#e0d5c4',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '3px',
          }}
        >
          <span
            style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }}
          />
          <span style={{ color: '#7a6950', minWidth: 80 }}>{p.name}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {fmt(Number(p.value))}{currencySuffix}
          </span>
        </p>
      ))}
    </motion.div>
  );
}

export function PieTooltip({
  active,
  payload,
  total,
  accentColor = DEFAULT_COLOR,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
  total?: number;
  accentColor?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'rgba(15,13,11,0.95)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(200,169,126,0.15)',
        borderRadius: '14px',
        padding: '14px 18px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ color: accentColor, fontSize: '13px', fontWeight: 600 }}>{d.name}</p>
      <p style={{ color: '#e0d5c4', fontSize: '16px', fontWeight: 700, marginTop: 4 }}>
        {fmt(d.value)} \u20AC
      </p>
      {total && (
        <p style={{ color: '#7a6950', fontSize: '12px' }}>
          {((d.value / total) * 100).toFixed(1)}%
        </p>
      )}
    </motion.div>
  );
}
