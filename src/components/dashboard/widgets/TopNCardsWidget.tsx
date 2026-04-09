'use client';

import { z } from 'zod';
import { motion } from 'framer-motion';
import type { WidgetMeta } from '../types';
import { AnimNum } from '../primitives/AnimNum';
import { MagneticCard } from '../primitives/MagneticCard';
import { ProgressRing } from '../primitives/ProgressRing';

export const schema = z.object({
  items: z
    .array(
      z.object({
        name: z.string(),
        value: z.number().positive(),
        subtitle: z.string().optional(),
        pct: z.number().min(0).max(100).optional(),
        color: z.string().optional(),
      }),
    )
    .min(1)
    .max(6),
  suffix: z.string().default(' \u20AC'),
  locale: z.string().default('de-DE'),
});

export const meta: WidgetMeta = {
  id: 'top-n-cards',
  name: 'Top N Cards',
  description: 'Ranked highlight cards with circular progress indicators',
  icon: 'Award',
};

type TopNData = z.infer<typeof schema>;

const DEFAULT_COLORS = ['#c8a97e', '#8b7355', '#a0845c', '#6b5b45', '#d4b896', '#9e8c73'];

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
};

export default function TopNCardsWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as TopNData;
  const maxVal = Math.max(...parsed.items.map((it) => it.value));
  const cols = Math.min(parsed.items.length, 3);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px', padding: '14px' }}>
      {parsed.items.map((item, i) => {
        const color = item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const pct = item.pct ?? (item.value / maxVal) * 100;
        return (
          <MagneticCard key={item.name + i} style={{ ...cardStyle, padding: '24px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#c8a97e', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Top {i + 1}
                </span>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProgressRing value={pct} max={100} color={color} />
                  <span style={{ position: 'absolute', fontSize: '10px', fontWeight: 700, color: '#e0d5c4' }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#e0d5c4', marginBottom: '4px' }}>{item.name}</div>
              {item.subtitle && (
                <div style={{ fontSize: '11px', color: '#5c4f3d', marginBottom: '14px' }}>{item.subtitle}</div>
              )}
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                <AnimNum value={item.value} suffix={parsed.suffix} />
              </div>
            </motion.div>
          </MagneticCard>
        );
      })}
    </div>
  );
}
