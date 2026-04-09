'use client';

import { z } from 'zod';
import { motion } from 'framer-motion';
import type { WidgetMeta } from '../types';

export const schema = z.object({
  columns: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      align: z.enum(['left', 'center', 'right']).default('left'),
      width: z.string().optional(),
    }),
  ).min(1).max(10),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number()]))).min(1).max(200),
});

export const meta: WidgetMeta = {
  id: 'data-table',
  name: 'Data Table',
  description: 'Scrollable table with column headers and row data',
  icon: 'FileText',
};

type TableData = z.infer<typeof schema>;

const fmt = (v: unknown) => {
  if (typeof v === 'number') return v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return String(v ?? '');
};

export default function DataTableWidget({ data }: { data: Record<string, unknown> }) {
  const parsed = data as unknown as TableData;
  const gridCols = parsed.columns.map((c) => c.width || '1fr').join(' ');

  return (
    <div style={{ padding: '14px', overflowX: 'auto' }}>
      <div style={{ minWidth: '600px' }}>
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '10px',
            padding: '0 8px 8px',
            borderBottom: '1px solid rgba(200,169,126,0.08)',
          }}
        >
          {parsed.columns.map((col) => (
            <span
              key={col.key}
              style={{
                fontSize: '10px',
                color: '#5c4f3d',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textAlign: col.align,
              }}
            >
              {col.label}
            </span>
          ))}
        </div>
        {/* Body */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {parsed.rows.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.5) }}
              style={{
                display: 'grid',
                gridTemplateColumns: gridCols,
                gap: '10px',
                padding: '9px 8px',
                borderBottom: '1px solid rgba(200,169,126,0.04)',
              }}
            >
              {parsed.columns.map((col) => (
                <span
                  key={col.key}
                  style={{
                    fontSize: '11px',
                    color: '#e0d5c4',
                    textAlign: col.align,
                    fontVariantNumeric: typeof row[col.key] === 'number' ? 'tabular-nums' : undefined,
                    fontWeight: typeof row[col.key] === 'number' ? 700 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fmt(row[col.key])}
                </span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
