'use client';

import { Reorder } from 'framer-motion';
import type { PlacedWidget } from '../types';
import { WIDGET_REGISTRY } from '../registry';
import { CanvasItem } from './CanvasItem';

const GOLD = '#c8a97e';

export function BuilderCanvas({
  widgets,
  onReorder,
  onRemove,
  onDrop,
  previewMode,
}: {
  widgets: PlacedWidget[];
  onReorder: (newOrder: PlacedWidget[]) => void;
  onRemove: (instanceId: string) => void;
  onDrop: (widgetId: string) => void;
  previewMode: boolean;
}) {
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        const widgetId = e.dataTransfer.getData('widgetId');
        if (widgetId) onDrop(widgetId);
      }}
      style={{
        flex: 1,
        padding: previewMode ? '0' : '20px',
        overflowY: 'auto',
        minHeight: '100%',
      }}
    >
      {widgets.length === 0 ? (
        <div
          style={{
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed rgba(200,169,126,0.1)',
            borderRadius: '20px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#5c4f3d', marginBottom: '4px' }}>
              Drag widgets here
            </div>
            <div style={{ fontSize: '11px', color: '#3d352b' }}>
              from the palette on the left
            </div>
          </div>
        </div>
      ) : (
        <Reorder.Group axis="y" values={widgets} onReorder={onReorder} style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
          {widgets.map((w) => {
            const def = WIDGET_REGISTRY[w.widgetId];
            if (!def) return null;
            return (
              <CanvasItem
                key={w.instanceId}
                widget={w}
                definition={def}
                onRemove={() => onRemove(w.instanceId)}
                previewMode={previewMode}
              />
            );
          })}
        </Reorder.Group>
      )}

      {!previewMode && widgets.length > 0 && (
        <div
          style={{
            marginTop: '14px',
            padding: '20px',
            border: '2px dashed rgba(200,169,126,0.06)',
            borderRadius: '16px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#3d352b',
          }}
        >
          + Drop more widgets
        </div>
      )}
    </div>
  );
}
