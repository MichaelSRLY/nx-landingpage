'use client';

import { z } from 'zod';
import { Treemap, ResponsiveContainer } from 'recharts';
import type { WidgetMeta } from '../types';

export const schema = z.object({
  blocks: z
    .array(
      z.object({
        name: z.string(),
        size: z.number().positive(),
        pct: z.number().min(0).max(100).optional(),
        color: z.string().optional(),
      }),
    )
    .min(2)
    .max(20),
});

export const meta: WidgetMeta = {
  id: 'treemap',
  name: 'Treemap',
  description: 'Proportional block visualization of categories by size',
  icon: 'Grid3X3',
};

type TreemapData = z.infer<typeof schema>;

const DEFAULT_COLORS = [
  '#c8a97e', '#8b7355', '#a0845c', '#6b5b45', '#d4b896',
  '#9e8c73', '#b8956a', '#7a6950', '#e0c9a6', '#5c4f3d',
];

function TreemapContent(props: Record<string, unknown>) {
  const { x, y, width, height, name, pct, idx } = props as {
    x: number; y: number; width: number; height: number;
    name: string; pct?: number; idx: number;
  };
  if (width < 30 || height < 25) return null;
  const isDark = [1, 3, 5, 7, 9].includes(idx);
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={10}
        fill={DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
        stroke="rgba(15,13,11,0.7)" strokeWidth={2} />
      {width > 55 && height > 45 && (
        <>
          <text x={x + 14} y={y + 24} fill={isDark ? '#e0d5c4' : '#1a1714'} fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">
            {name}
          </text>
          {pct !== undefined && (
            <text x={x + 14} y={y + 46} fill={isDark ? 'rgba(224,213,196,0.7)' : 'rgba(26,23,20,0.6)'} fontSize={22} fontWeight={800} fontFamily="Inter, sans-serif">
              {pct}%
            </text>
          )}
        </>
      )}
    </g>
  );
}

export default function TreemapWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as TreemapData;
  const total = parsed.blocks.reduce((s, b) => s + b.size, 0);
  const blocks = parsed.blocks.map((b, i) => ({
    ...b,
    idx: i,
    pct: b.pct ?? parseFloat(((b.size / total) * 100).toFixed(1)),
  }));

  return (
    <div style={{ padding: '24px' }}>
      <ResponsiveContainer width="100%" height={320}>
        <Treemap data={blocks} dataKey="size" aspectRatio={4 / 3} content={<TreemapContent />} isAnimationActive={false} />
      </ResponsiveContainer>
    </div>
  );
}
