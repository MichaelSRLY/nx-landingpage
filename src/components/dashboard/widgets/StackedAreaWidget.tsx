'use client';

import { z } from 'zod';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import type { WidgetMeta } from '../types';
import { ChartTooltip } from '../primitives/ChartTooltip';

export const schema = z.object({
  series: z.array(
    z.object({
      name: z.string(),
      color: z.string().optional(),
    }),
  ).min(1).max(12),
  dataPoints: z.array(z.record(z.string(), z.union([z.string(), z.number()]))).min(2),
  xKey: z.string().default('label'),
  stacked: z.boolean().default(true),
});

export const meta: WidgetMeta = {
  id: 'stacked-area',
  name: 'Stacked Area',
  description: 'Stacked or layered area chart for time-series data',
  icon: 'Calendar',
};

type StackedData = z.infer<typeof schema>;

const STACK_COLORS = [
  '#c8a97e', '#8b7355', '#a0845c', '#6b5b45', '#d4b896',
  '#9e8c73', '#b8956a', '#7a6950', '#e0c9a6', '#5c4f3d',
];

const fmtK = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0));

export default function StackedAreaWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as StackedData;

  return (
    <div style={{ padding: '24px' }}>
      <ResponsiveContainer width="100%" height={380}>
        <AreaChart data={parsed.dataPoints}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
          <XAxis dataKey={parsed.xKey} axisLine={false} tickLine={false} tick={{ fill: '#5c4f3d', fontSize: 11, fontFamily: 'Inter' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10, fontFamily: 'Inter' }} tickFormatter={fmtK} />
          <Tooltip content={<ChartTooltip />} />
          {parsed.series.map((s, i) => (
            <Area
              key={s.name}
              type="monotone"
              dataKey={s.name}
              stackId={parsed.stacked ? '1' : undefined}
              stroke={s.color || STACK_COLORS[i % STACK_COLORS.length]}
              fill={s.color || STACK_COLORS[i % STACK_COLORS.length]}
              fillOpacity={0.55}
              name={s.name}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px', justifyContent: 'center' }}>
        {parsed.series.map((s, i) => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '2px', background: s.color || STACK_COLORS[i % STACK_COLORS.length] }} />
            <span style={{ fontSize: '10px', color: '#5c4f3d' }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
