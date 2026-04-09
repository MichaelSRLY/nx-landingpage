'use client';

import { motion } from 'framer-motion';
import {
  PieChart, BarChart3, TrendingUp, Award, Layers,
  Grid3X3, Eye, Calendar, FileText, Zap,
} from 'lucide-react';
import type { WidgetMeta } from '../types';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  PieChart, BarChart3, TrendingUp, Award, Layers,
  Grid3X3, Eye, Calendar, FileText, Zap,
};

const GOLD = '#c8a97e';

export function BuilderSidebar({
  widgets,
  onDragStart,
}: {
  widgets: (WidgetMeta & { id: string })[];
  onDragStart: (widgetId: string) => void;
}) {
  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        padding: '20px 16px',
        borderRight: '1px solid rgba(200,169,126,0.08)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '10px', color: GOLD, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        Widget-Palette
      </div>
      {widgets.map((w) => {
        const Icon = ICON_MAP[w.icon] || Zap;
        return (
          <motion.div
            key={w.id}
            draggable
            onDragStart={(e) => {
              const evt = e as unknown as React.DragEvent;
              evt.dataTransfer?.setData('widgetId', w.id);
              onDragStart(w.id);
            }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '14px 16px',
              background: 'rgba(200,169,126,0.025)',
              border: '1px solid rgba(200,169,126,0.07)',
              borderRadius: '14px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: '10px',
                background: 'rgba(200,169,126,0.06)',
                border: '1px solid rgba(200,169,126,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={14} color={GOLD} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#e0d5c4' }}>{w.name}</div>
              <div style={{ fontSize: '10px', color: '#5c4f3d', marginTop: '2px', lineHeight: 1.4 }}>{w.description}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
