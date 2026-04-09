'use client';

import { z } from 'zod';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { WidgetMeta } from '../types';
import { ChartTooltip } from '../primitives/ChartTooltip';

export const schema = z.object({
  bars: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      color: z.string().optional(),
    }),
  ).min(2).max(50),
  highlightAboveAvg: z.boolean().default(true),
  currencySuffix: z.string().default(' \u20AC'),
  locale: z.string().default('de-DE'),
});

export const meta: WidgetMeta = {
  id: 'bar-chart',
  name: 'Bar Chart',
  description: 'Vertical bar chart for monthly or categorical data',
  icon: 'BarChart3',
};

type BarData = z.infer<typeof schema>;

const GOLD = '#c8a97e';
const fmtK = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0));

export default function BarChartWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as BarData;
  const avg = parsed.bars.reduce((s, b) => s + b.value, 0) / parsed.bars.length;

  return (
    <div style={{ padding: '24px' }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={parsed.bars} barCategoryGap="18%" margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#5c4f3d', fontSize: 11, fontFamily: 'Inter' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10, fontFamily: 'Inter' }} tickFormatter={fmtK} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(200,169,126,0.03)' }} />
          <Bar dataKey="value" name="Wert" radius={[8, 8, 0, 0]} isAnimationActive={false}>
            {parsed.bars.map((bar, i) => (
              <Cell
                key={i}
                fill={bar.color || (parsed.highlightAboveAvg && bar.value > avg ? GOLD : '#4a3f32')}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
