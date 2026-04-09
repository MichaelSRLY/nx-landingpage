'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Pencil, Sparkles } from 'lucide-react';
import { getWidgetMetas, WIDGET_REGISTRY } from '@/components/dashboard/registry';
import { BuilderSidebar } from '@/components/dashboard/builder/BuilderSidebar';
import { BuilderCanvas } from '@/components/dashboard/builder/BuilderCanvas';
import { FileDropZone } from '@/components/dashboard/builder/FileDropZone';
import { GenerateButton } from '@/components/dashboard/builder/GenerateButton';
import type { PlacedWidget, GenerateResponse } from '@/components/dashboard/types';
import type { ParsedFile } from '@/components/dashboard/llm/parseFile';

const GOLD = '#c8a97e';

let nextId = 1;
function makeId() {
  return `w_${nextId++}_${Date.now().toString(36)}`;
}

export default function DashboardBuilderPage() {
  const [widgets, setWidgets] = useState<PlacedWidget[]>([]);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const widgetMetas = getWidgetMetas();

  const handleDrop = useCallback((widgetId: string) => {
    if (!WIDGET_REGISTRY[widgetId]) return;
    setWidgets((prev) => [
      ...prev,
      {
        instanceId: makeId(),
        widgetId,
        data: null,
        status: 'empty',
      },
    ]);
  }, []);

  const handleRemove = useCallback((instanceId: string) => {
    setWidgets((prev) => prev.filter((w) => w.instanceId !== instanceId));
  }, []);

  const handleReorder = useCallback((newOrder: PlacedWidget[]) => {
    setWidgets(newOrder);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!parsedFile || widgets.length === 0) return;

    setGenerating(true);
    setWidgets((prev) =>
      prev.map((w) => ({ ...w, status: 'loading' as const, error: undefined })),
    );

    try {
      const requestWidgets = widgets.map((w) => {
        const def = WIDGET_REGISTRY[w.widgetId];
        return {
          instanceId: w.instanceId,
          widgetId: w.widgetId,
          schemaDescription: def?.meta.description || '',
        };
      });

      const res = await fetch('/api/dashboard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileContent: parsedFile.content,
          fileType: parsedFile.type,
          widgets: requestWidgets,
        }),
      });

      const json = (await res.json()) as GenerateResponse;

      setWidgets((prev) =>
        prev.map((w) => {
          const result = json.results?.find((r) => r.instanceId === w.instanceId);
          if (!result) return { ...w, status: 'error' as const, error: 'No result returned' };
          if (result.success && result.data) {
            return { ...w, status: 'filled' as const, data: result.data, error: undefined };
          }
          return { ...w, status: 'error' as const, error: result.error || 'Generation failed' };
        }),
      );
    } catch (err) {
      setWidgets((prev) =>
        prev.map((w) => ({
          ...w,
          status: 'error' as const,
          error: err instanceof Error ? err.message : 'Network error',
        })),
      );
    } finally {
      setGenerating(false);
    }
  }, [parsedFile, widgets]);

  const canGenerate = parsedFile !== null && widgets.length > 0 && !generating;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0a09',
        color: '#e0d5c4',
        fontFamily: "'Inter', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid rgba(200,169,126,0.08)',
          background: 'rgba(15,13,11,0.6)',
          backdropFilter: 'blur(40px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: '8px',
              background: `linear-gradient(135deg, ${GOLD}, #8b7355)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '10px', color: '#0c0a09',
            }}
          >
            NX
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#e0d5c4' }}>Dashboard Builder</span>
          <span style={{ fontSize: '10px', color: '#5c4f3d', padding: '3px 8px', background: 'rgba(200,169,126,0.05)', borderRadius: '100px' }}>
            {widgets.length} widgets
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mode toggle */}
          <div
            style={{
              display: 'flex',
              gap: '2px',
              padding: '3px',
              background: 'rgba(200,169,126,0.04)',
              borderRadius: '100px',
              border: '1px solid rgba(200,169,126,0.06)',
            }}
          >
            {[
              { mode: false, label: 'Build', Icon: Pencil },
              { mode: true, label: 'Preview', Icon: Eye },
            ].map(({ mode, label, Icon }) => (
              <motion.button
                key={label}
                onClick={() => setPreviewMode(mode)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: previewMode === mode ? 'rgba(200,169,126,0.12)' : 'transparent',
                  color: previewMode === mode ? '#e0d5c4' : '#5c4f3d',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={12} />
                {label}
              </motion.button>
            ))}
          </div>

          <GenerateButton onClick={handleGenerate} disabled={!canGenerate} loading={generating} />
        </div>
      </motion.div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <AnimatePresence>
          {!previewMode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden', flexShrink: 0 }}
            >
              <BuilderSidebar widgets={widgetMetas} onDragStart={() => {}} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas + file drop */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <BuilderCanvas
            widgets={widgets}
            onReorder={handleReorder}
            onRemove={handleRemove}
            onDrop={handleDrop}
            previewMode={previewMode}
          />
          <AnimatePresence>
            {!previewMode && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FileDropZone parsedFile={parsedFile} onFileParsed={setParsedFile} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
