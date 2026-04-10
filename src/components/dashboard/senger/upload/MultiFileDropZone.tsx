'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { parseDATEVFile } from './DATEVParser'
import type { UploadedFile } from '../types'

const GOLD = '#c8a97e'

const FILE_TYPE_LABELS: Record<string, string> = {
  fibu: 'FiBu',
  'ra-micro': 'RA-Micro',
  lohn: 'Lohn',
  umbuchungen: 'Umbuchungen',
  unknown: 'Unbekannt',
}

const FILE_TYPE_COLORS: Record<string, string> = {
  fibu: '#c8a97e',
  'ra-micro': '#a0845c',
  lohn: '#8b7355',
  umbuchungen: '#d4b896',
  unknown: '#5c4f3d',
}

export function MultiFileDropZone({
  onFilesProcessed,
  existingFiles,
}: {
  onFilesProcessed: (files: UploadedFile[]) => void
  existingFiles: UploadedFile[]
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      setProcessing(true)
      setErrors([])
      const newFiles: UploadedFile[] = []
      const newErrors: string[] = []

      for (const file of Array.from(fileList)) {
        if (!file.name.toLowerCase().endsWith('.csv')) {
          newErrors.push(`${file.name}: Nur CSV-Dateien werden unterstützt`)
          continue
        }
        try {
          const parsed = await parseDATEVFile(file)
          newFiles.push(parsed)
        } catch (e) {
          newErrors.push(`${file.name}: ${e instanceof Error ? e.message : 'Fehler beim Parsen'}`)
        }
      }

      setErrors(newErrors)
      setProcessing(false)
      if (newFiles.length > 0) {
        onFilesProcessed([...existingFiles, ...newFiles])
      }
    },
    [onFilesProcessed, existingFiles]
  )

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={async (e) => {
          e.preventDefault()
          setIsDragging(false)
          await handleFiles(e.dataTransfer.files)
        }}
        onClick={() => {
          const input = document.createElement('input')
          input.type = 'file'
          input.multiple = true
          input.accept = '.csv'
          input.onchange = async () => {
            if (input.files) await handleFiles(input.files)
          }
          input.click()
        }}
        style={{
          padding: '48px 32px',
          borderRadius: '24px',
          border: `2px dashed ${isDragging ? GOLD : 'rgba(200,169,126,0.15)'}`,
          background: isDragging ? 'rgba(200,169,126,0.04)' : 'rgba(200,169,126,0.015)',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        <motion.div
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Upload
            size={32}
            color={isDragging ? GOLD : '#5c4f3d'}
            style={{ margin: '0 auto 16px' }}
          />
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#e0d5c4', marginBottom: '8px' }}>
            {processing ? 'Dateien werden verarbeitet...' : 'DATEV CSV-Dateien hier ablegen'}
          </div>
          <div style={{ fontSize: '11px', color: '#5c4f3d' }}>
            oder klicken zum Auswählen · Mehrfachauswahl möglich
          </div>
        </motion.div>
      </div>

      {/* Error messages */}
      <AnimatePresence>
        {errors.map((err, i) => (
          <motion.div
            key={err}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', marginTop: '8px',
              background: 'rgba(220,80,60,0.08)', border: '1px solid rgba(220,80,60,0.15)',
              borderRadius: '12px', fontSize: '11px', color: '#e08070',
            }}
          >
            <AlertCircle size={12} />
            {err}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* File list */}
      {existingFiles.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {existingFiles.map((file, i) => {
            const color = FILE_TYPE_COLORS[file.metadata.fileType] || '#5c4f3d'
            return (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px',
                  background: 'rgba(200,169,126,0.025)',
                  border: '1px solid rgba(200,169,126,0.06)',
                  borderRadius: '12px',
                }}
              >
                <FileText size={14} color={color} />
                <span style={{ fontSize: '11px', color: '#e0d5c4', flex: 1 }}>{file.name}</span>
                <span style={{
                  fontSize: '9px', fontWeight: 600, color,
                  padding: '2px 8px', borderRadius: '100px',
                  background: `${color}12`, border: `1px solid ${color}20`,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {FILE_TYPE_LABELS[file.metadata.fileType]}
                </span>
                <span style={{
                  fontSize: '9px', color: '#7a6950',
                  padding: '2px 8px', borderRadius: '100px',
                  background: 'rgba(200,169,126,0.05)',
                }}>
                  {file.metadata.month.toString().padStart(2, '0')}/{file.metadata.year}
                </span>
                <span style={{ fontSize: '10px', color: '#5c4f3d' }}>
                  {file.rowCount} Buchungen
                </span>
                <CheckCircle size={12} color="#6b9b6b" />
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
