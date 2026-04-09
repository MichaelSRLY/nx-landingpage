'use client';

import { z } from 'zod';
import { motion } from 'framer-motion';
import type { WidgetMeta } from '../types';
import { AnimNum } from '../primitives/AnimNum';
import { MagneticCard } from '../primitives/MagneticCard';
import { Sparkline } from '../primitives/Sparkline';
import { GlowOrb } from '../primitives/GlowOrb';

export const schema = z.object({
  cards: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      suffix: z.string().default(' \u20AC'),
      decimals: z.number().int().min(0).max(4).default(2),
      subtitle: z.string().optional(),
      sparkline: z.array(z.number()).optional(),
      color: z.string().optional(),
    }),
  ).min(1).max(6),
  locale: z.string().default('de-DE'),
});

export const meta: WidgetMeta = {
  id: 'kpi-cards',
  name: 'KPI Cards',
  description: 'Grid of statistic cards with animated numbers and sparklines',
  icon: 'TrendingUp',
};

type KpiData = z.infer<typeof schema>;

const DEFAULT_COLORS = ['#c8a97e', '#a0845c', '#d4b896', '#8b7355', '#b8956a', '#9e8c73'];

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
};

export default function KpiCardWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as KpiData;
  const cols = Math.min(parsed.cards.length, 4);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px', padding: '14px' }}>
      {parsed.cards.map((card, i) => {
        const color = card.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
        return (
          <MagneticCard key={card.label + i} style={{ ...cardStyle, padding: '22px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.06 }}
            >
              <GlowOrb color={color} size={120} x="85%" y="20%" opacity={0.06} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: 30, height: 30, borderRadius: '10px',
                    background: `${color}10`, border: `1px solid ${color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 700, color,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <span style={{ fontSize: '10px', color: '#6b5b45', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {card.label}
                </span>
              </div>
              <div style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, color: '#e0d5c4', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                <AnimNum value={card.value} suffix={card.suffix} decimals={card.decimals} duration={2000 + i * 200} />
              </div>
              {card.subtitle && (
                <div style={{ fontSize: '12px', color: '#7a6950', marginTop: '4px' }}>{card.subtitle}</div>
              )}
              {card.sparkline && card.sparkline.length > 1 && (
                <div style={{ marginTop: '12px' }}>
                  <Sparkline data={card.sparkline} color={color} width={100} height={24} />
                </div>
              )}
            </motion.div>
          </MagneticCard>
        );
      })}
    </div>
  );
}
