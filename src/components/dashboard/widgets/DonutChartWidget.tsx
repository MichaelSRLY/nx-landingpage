'use client';

import { useState } from 'react';
import { z } from 'zod';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { WidgetMeta } from '../types';
import { PieTooltip } from '../primitives/ChartTooltip';

export const schema = z.object({
  segments: z
    .array(
      z.object({
        name: z.string(),
        value: z.number().positive(),
        color: z.string().optional(),
      }),
    )
    .min(2)
    .max(20),
  centerLabel: z.string().optional(),
  currencySuffix: z.string().default(''),
  locale: z.string().default('de-DE'),
});

export const meta: WidgetMeta = {
  id: 'donut-chart',
  name: 'Donut Chart',
  description: 'Pie/donut chart with labeled segments and center total',
  icon: 'PieChart',
};

type DonutData = z.infer<typeof schema>;

const DEFAULT_COLORS = [
  '#c8a97e', '#8b7355', '#a0845c', '#6b5b45', '#d4b896',
  '#9e8c73', '#b8956a', '#7a6950', '#e0c9a6', '#5c4f3d',
];

const fmt = (v: number, d = 2) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function DonutChartWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as DonutData;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const total = parsed.segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div style={{ padding: '24px' }}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={parsed.segments}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={130}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            onMouseEnter={(_, i) => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {parsed.segments.map((seg, i) => (
              <Cell
                key={i}
                fill={seg.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                opacity={activeIdx === null || activeIdx === i ? 1 : 0.25}
                style={{
                  transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip total={total} />} />
          <text x="50%" y="44%" textAnchor="middle" fill="#e0d5c4" fontSize="24" fontWeight="700" fontFamily="Inter">
            {fmt(total, 0)}
          </text>
          <text x="50%" y="55%" textAnchor="middle" fill="#5c4f3d" fontSize="10" fontFamily="Inter" letterSpacing="0.1em">
            {parsed.centerLabel || 'TOTAL'}
          </text>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
        {parsed.segments.slice(0, 8).map((seg, i) => (
          <motion.div
            key={seg.name}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px',
              borderRadius: '6px', cursor: 'pointer', fontSize: '10px', color: '#7a6950',
              background: activeIdx === i ? 'rgba(200,169,126,0.08)' : 'transparent',
              transition: 'background 0.2s',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '2px', background: seg.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} />
            {seg.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
