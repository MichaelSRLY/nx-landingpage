'use client';

import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { WidgetMeta } from '../types';
import { MagneticCard } from '../primitives/MagneticCard';
import { Sparkline } from '../primitives/Sparkline';

export const schema = z.object({
  periods: z
    .array(
      z.object({
        label: z.string(),
        value: z.number(),
        color: z.string().optional(),
      }),
    )
    .min(2)
    .max(24),
  suffix: z.string().default(' \u20AC'),
  locale: z.string().default('de-DE'),
});

export const meta: WidgetMeta = {
  id: 'month-cards',
  name: 'Month Cards',
  description: 'Period comparison grid with deviation indicators and sparklines',
  icon: 'Zap',
};

type MonthData = z.infer<typeof schema>;

const GOLD = '#c8a97e';

const fmt = (v: number, d = 0) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
};

export default function MonthCardsWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as MonthData;
  const avg = parsed.periods.reduce((s, p) => s + p.value, 0) / parsed.periods.length;
  const allValues = parsed.periods.map((p) => p.value);
  const cols = Math.min(parsed.periods.length, 4);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px', padding: '14px' }}>
      {parsed.periods.map((period, i) => {
        const dev = ((period.value - avg) / avg) * 100;
        const up = dev > 0;
        return (
          <MagneticCard key={period.label + i} style={{ ...cardStyle, padding: '18px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
            >
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, ${up ? GOLD : '#4a3f32'}, transparent)`,
                  opacity: 0.7,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#5c4f3d', fontWeight: 600 }}>{period.label}</span>
                <div
                  style={{
                    fontSize: '10px', fontWeight: 600,
                    color: up ? GOLD : '#6b8b5c',
                    display: 'flex', alignItems: 'center', gap: '2px',
                    padding: '2px 7px', borderRadius: '100px',
                    background: up ? 'rgba(200,169,126,0.06)' : 'rgba(107,139,92,0.06)',
                  }}
                >
                  {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {up ? '+' : ''}{dev.toFixed(0)}%
                </div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums', marginBottom: '8px' }}>
                {fmt(period.value)}{parsed.suffix}
              </div>
              <Sparkline
                data={allValues.map((v, j) => (j === i ? period.value : v * 0.3))}
                color={up ? GOLD : '#6b8b5c'}
                width={120}
                height={20}
              />
            </motion.div>
          </MagneticCard>
        );
      })}
    </div>
  );
}
