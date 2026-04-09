'use client';

import { z } from 'zod';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { WidgetMeta } from '../types';

export const schema = z.object({
  axes: z
    .array(
      z.object({
        category: z.string(),
        value: z.number().min(0),
      }),
    )
    .min(3)
    .max(12),
  maxValue: z.number().positive().optional(),
  color: z.string().default('#c8a97e'),
});

export const meta: WidgetMeta = {
  id: 'radar-chart',
  name: 'Radar Chart',
  description: 'Spider/radar chart for multi-dimensional comparison',
  icon: 'Eye',
};

type RadarData = z.infer<typeof schema>;

export default function RadarChartWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as RadarData;
  const color = parsed.color || '#c8a97e';

  return (
    <div style={{ padding: '24px' }}>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={parsed.axes} cx="50%" cy="50%" outerRadius="68%">
          <PolarGrid stroke="rgba(200,169,126,0.08)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#6b5b45', fontSize: 10, fontFamily: 'Inter' }} />
          <PolarRadiusAxis tick={false} axisLine={false} domain={parsed.maxValue ? [0, parsed.maxValue] : undefined} />
          <Radar name="Value" dataKey="value" stroke={color} fill={color} fillOpacity={0.1} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
