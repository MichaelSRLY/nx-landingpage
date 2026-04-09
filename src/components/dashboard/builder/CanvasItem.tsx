'use client';

import { Suspense } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { GripVertical, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import type { PlacedWidget, WidgetDefinition } from '../types';

const GOLD = '#c8a97e';

const STATUS_BADGE: Record<PlacedWidget['status'], { label: string; color: string; Icon: React.ComponentType<{ size?: number }> }> = {
  empty: { label: 'Needs data', color: '#5c4f3d', Icon: AlertCircle },
  loading: { label: 'Generating...', color: GOLD, Icon: Loader2 },
  filled: { label: 'Ready', color: '#6b8b5c', Icon: Check },
  error: { label: 'Error', color: '#b85c5c', Icon: AlertCircle },
};

export function CanvasItem({
  widget,
  definition,
  onRemove,
  previewMode,
}: {
  widget: PlacedWidget;
  definition: WidgetDefinition;
  onRemove: () => void;
  previewMode: boolean;
}) {
  const controls = useDragControls();
  const badge = STATUS_BADGE[widget.status];
  const WidgetComponent = definition.component;

  return (
    <Reorder.Item
      value={widget}
      dragListener={false}
      dragControls={controls}
      style={{
        background: 'rgba(200,169,126,0.025)',
        border: '1px solid rgba(200,169,126,0.07)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {!previewMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderBottom: '1px solid rgba(200,169,126,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              onPointerDown={(e) => controls.start(e)}
              style={{ cursor: 'grab', color: '#4a3f32', display: 'flex' }}
            >
              <GripVertical size={16} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#e0d5c4' }}>
              {definition.meta.name}
            </span>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '2px 8px', borderRadius: '100px',
                background: `${badge.color}10`, border: `1px solid ${badge.color}20`,
                fontSize: '10px', color: badge.color,
              }}
            >
              <badge.Icon size={10} />
              {badge.label}
            </div>
          </div>
          <button
            onClick={onRemove}
            style={{
              background: 'rgba(200,169,126,0.05)',
              border: '1px solid rgba(200,169,126,0.1)',
              borderRadius: '8px',
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#5c4f3d',
            }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {widget.status === 'filled' && widget.data ? (
        <Suspense
          fallback={
            <div style={{ padding: '40px', textAlign: 'center', color: '#5c4f3d', fontSize: '12px' }}>
              Loading widget...
            </div>
          }
        >
          <WidgetComponent data={widget.data} />
        </Suspense>
      ) : widget.status === 'error' ? (
        <div style={{ padding: '24px', color: '#b85c5c', fontSize: '12px' }}>
          {widget.error || 'Failed to generate data'}
        </div>
      ) : widget.status === 'loading' ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <Loader2 size={24} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ fontSize: '12px', color: '#5c4f3d', marginTop: '8px' }}>Generating with Claude...</div>
        </div>
      ) : (
        <div style={{ padding: '24px', textAlign: 'center', color: '#4a3f32', fontSize: '12px' }}>
          Drop a data file and click Generate to fill this widget
        </div>
      )}
    </Reorder.Item>
  );
}
