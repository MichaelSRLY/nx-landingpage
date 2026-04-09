'use client';

import { WIDGET_REGISTRY } from '../registry';

const GOLD = '#c8a97e';

function describeSchema(schema: unknown, depth = 0): string[] {
  const lines: string[] = [];
  if (!schema || typeof schema !== 'object') return lines;

  const s = schema as Record<string, unknown>;
  // Try to get the shape from Zod schema
  const shape = (s as { shape?: Record<string, unknown> }).shape
    || (s as { _def?: { shape?: Record<string, unknown> } })._def?.shape;

  if (shape && typeof shape === 'object') {
    for (const [key, val] of Object.entries(shape)) {
      const indent = '  '.repeat(depth);
      const typeName = getTypeName(val);
      lines.push(`${indent}${key}: ${typeName}`);
    }
  }
  return lines;
}

function getTypeName(zodVal: unknown): string {
  if (!zodVal || typeof zodVal !== 'object') return 'unknown';
  const v = zodVal as { _def?: { typeName?: string; innerType?: unknown; type?: unknown } };
  const def = v._def;
  if (!def) return 'unknown';

  const tn = def.typeName;
  if (tn === 'ZodString') return 'string';
  if (tn === 'ZodNumber') return 'number';
  if (tn === 'ZodBoolean') return 'boolean';
  if (tn === 'ZodArray') return `${getTypeName(def.type)}[]`;
  if (tn === 'ZodObject') return 'object';
  if (tn === 'ZodOptional') return `${getTypeName(def.innerType)}?`;
  if (tn === 'ZodDefault') return getTypeName(def.innerType);
  if (tn === 'ZodEnum') return 'enum';
  if (tn === 'ZodUnion') return 'union';
  return tn || 'unknown';
}

export function DataRequirements({ widgetId }: { widgetId: string }) {
  const def = WIDGET_REGISTRY[widgetId];
  if (!def) return null;

  const lines = describeSchema(def.schema);

  return (
    <div style={{ padding: '12px', fontSize: '11px', color: '#7a6950' }}>
      <div style={{ fontSize: '10px', color: GOLD, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Data Requirements
      </div>
      {lines.length > 0 ? (
        <pre style={{ fontFamily: "'SF Mono', Menlo, monospace", fontSize: '10px', lineHeight: 1.6, color: '#9e8c73', margin: 0 }}>
          {lines.join('\n')}
        </pre>
      ) : (
        <div style={{ color: '#5c4f3d' }}>See widget schema for details</div>
      )}
    </div>
  );
}
