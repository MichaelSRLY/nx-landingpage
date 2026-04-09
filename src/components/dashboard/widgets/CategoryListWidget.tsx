'use client';

import { z } from 'zod';
import { motion } from 'framer-motion';
import type { WidgetMeta } from '../types';
import { AnimNum } from '../primitives/AnimNum';

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
    .max(50),
  suffix: z.string().default(' \u20AC'),
  locale: z.string().default('de-DE'),
});

export const meta: WidgetMeta = {
  id: 'category-list',
  name: 'Category List',
  description: 'Full ranked list with animated progress bars',
  icon: 'Layers',
};

type ListData = z.infer<typeof schema>;

const DEFAULT_COLORS = [
  '#c8a97e', '#8b7355', '#a0845c', '#6b5b45', '#d4b896',
  '#9e8c73', '#b8956a', '#7a6950', '#e0c9a6', '#5c4f3d',
];

const GOLD = '#c8a97e';

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '16px',
  position: 'relative',
  overflow: 'hidden',
};

export default function CategoryListWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as ListData;
  const maxPct = Math.max(...parsed.items.map((it) => it.pct ?? 0), 1);

  return (
    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {parsed.items.map((item, i) => {
        const color = item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        const pct = item.pct ?? (item.value / parsed.items[0].value) * 100;
        return (
          <motion.div
            key={item.name + i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ x: 6, background: 'rgba(200,169,126,0.04)', transition: { duration: 0.2 } }}
            style={{
              ...cardStyle,
              padding: '16px 22px',
              display: 'grid',
              gridTemplateColumns: '28px 1fr auto 70px 150px',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, color: i < 3 ? GOLD : '#3d352b' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: '#e0d5c4' }}>{item.name}</div>
              {item.subtitle && (
                <div style={{ fontSize: '10px', color: '#4a3f32', marginTop: '1px' }}>{item.subtitle}</div>
              )}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0d5c4', textAlign: 'right', fontVariantNumeric: 'tabular-nums', minWidth: 110 }}>
              <AnimNum value={item.value} suffix={parsed.suffix} duration={1000 + i * 80} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '11px', fontWeight: 600, color: GOLD,
                  padding: '3px 10px', background: 'rgba(200,169,126,0.06)',
                  borderRadius: '100px', display: 'inline-block',
                }}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
            <div style={{ position: 'relative', height: '4px', borderRadius: '2px', background: 'rgba(200,169,126,0.04)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(pct / maxPct) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', borderRadius: '2px', background: `linear-gradient(90deg, ${color}, ${color}88)` }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
