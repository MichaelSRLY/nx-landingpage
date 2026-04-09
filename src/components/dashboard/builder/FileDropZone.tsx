'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X } from 'lucide-react';
import { parseFile, type ParsedFile } from '../llm/parseFile';

const GOLD = '#c8a97e';

export function FileDropZone({
  onFileParsed,
  parsedFile,
}: {
  onFileParsed: (file: ParsedFile | null) => void;
  parsedFile: ParsedFile | null;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      try {
        const parsed = await parseFile(file);
        onFileParsed(parsed);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Parse error');
        onFileParsed(null);
      }
    },
    [onFileParsed],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) await handleFile(file);
      }}
      style={{
        padding: '20px',
        borderTop: '1px solid rgba(200,169,126,0.08)',
      }}
    >
      {parsedFile ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'rgba(107,139,92,0.06)',
            border: '1px solid rgba(107,139,92,0.15)',
            borderRadius: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={16} color="#6b8b5c" />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#e0d5c4' }}>
                File loaded ({parsedFile.type.toUpperCase()})
              </div>
              {parsedFile.preview && (
                <div style={{ fontSize: '10px', color: '#6b8b5c', marginTop: '2px' }}>
                  {parsedFile.preview.rows} rows
                  {parsedFile.preview.columns > 0 && ` \u00B7 ${parsedFile.preview.columns} columns`}
                  {parsedFile.preview.headers.length > 0 && (
                    <span style={{ color: '#5c4f3d' }}>
                      {' \u00B7 '}{parsedFile.preview.headers.slice(0, 5).join(', ')}
                      {parsedFile.preview.headers.length > 5 && '...'}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => onFileParsed(null)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#5c4f3d',
              display: 'flex',
            }}
          >
            <X size={14} />
          </button>
        </motion.div>
      ) : (
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '24px',
            border: `2px dashed ${isDragging ? GOLD : 'rgba(200,169,126,0.1)'}`,
            borderRadius: '16px',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            background: isDragging ? 'rgba(200,169,126,0.03)' : 'transparent',
          }}
        >
          <Upload size={20} color={isDragging ? GOLD : '#4a3f32'} />
          <div style={{ fontSize: '12px', color: isDragging ? GOLD : '#5c4f3d' }}>
            Drop CSV, JSON, or text file here
          </div>
          <div style={{ fontSize: '10px', color: '#3d352b' }}>or click to browse</div>
          <input
            type="file"
            accept=".csv,.tsv,.json,.txt,.pdf"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) await handleFile(file);
            }}
          />
        </label>
      )}
      {error && (
        <div style={{ fontSize: '11px', color: '#b85c5c', marginTop: '8px', padding: '0 4px' }}>
          {error}
        </div>
      )}
    </div>
  );
}
