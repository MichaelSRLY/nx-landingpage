'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import type { UploadedFile, FileType } from '../types'
import { MONTH_LABELS } from '../constants'

const GOLD = '#c8a97e'

const EXPECTED_TYPES: FileType[] = ['fibu', 'ra-micro', 'lohn', 'umbuchungen']
const TYPE_LABELS: Record<string, string> = {
  fibu: 'FiBu',
  'ra-micro': 'RA-Micro',
  lohn: 'Lohn',
  umbuchungen: 'Umbuchungen',
}

export function UploadManager({
  files,
  onAnalyze,
}: {
  files: UploadedFile[]
  onAnalyze: () => void
}) {
  const groupedByMonth = useMemo(() => {
    const groups = new Map<string, UploadedFile[]>()
    for (const file of files) {
      const key = `${file.metadata.year}-${file.metadata.month}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(file)
    }
    return Array.from(groups.entries())
      .map(([key, files]) => {
        const [year, month] = key.split('-').map(Number)
        const types = new Set(files.map(f => f.metadata.fileType))
        const missing = EXPECTED_TYPES.filter(t => !types.has(t))
        const totalBookings = files.reduce((sum, f) => sum + f.rowCount, 0)
        return { key, year, month, files, types, missing, totalBookings }
      })
      .sort((a, b) => a.year - b.year || a.month - b.month)
  }, [files])

  const totalBookings = files.reduce((sum, f) => sum + f.rowCount, 0)

  if (files.length === 0) return null

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Calendar size={14} color={GOLD} />
        <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>
          Dateien nach Monat
        </span>
        <span style={{
          fontSize: '10px', color: '#5c4f3d',
          padding: '2px 10px', borderRadius: '100px',
          background: 'rgba(200,169,126,0.05)',
        }}>
          {files.length} Dateien · {totalBookings} Buchungen
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
        {groupedByMonth.map((group, i) => {
          const isComplete = group.missing.length === 0
          return (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                padding: '16px',
                background: 'rgba(200,169,126,0.025)',
                border: `1px solid ${isComplete ? 'rgba(107,155,107,0.2)' : 'rgba(200,169,126,0.08)'}`,
                borderRadius: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0d5c4' }}>
                  {MONTH_LABELS[group.month - 1]} {group.year}
                </span>
                {isComplete ? (
                  <CheckCircle size={14} color="#6b9b6b" />
                ) : (
                  <AlertTriangle size={14} color="#c8a060" />
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {EXPECTED_TYPES.map(type => {
                  const present = group.types.has(type)
                  return (
                    <span
                      key={type}
                      style={{
                        fontSize: '9px', fontWeight: 500,
                        padding: '2px 7px', borderRadius: '6px',
                        background: present ? 'rgba(107,155,107,0.1)' : 'rgba(200,169,126,0.04)',
                        color: present ? '#8bbb8b' : '#3d352b',
                        border: `1px solid ${present ? 'rgba(107,155,107,0.2)' : 'rgba(200,169,126,0.06)'}`,
                      }}
                    >
                      {TYPE_LABELS[type]}
                    </span>
                  )
                })}
              </div>
              <div style={{ fontSize: '10px', color: '#5c4f3d' }}>
                {group.totalBookings} Buchungen · {group.files.length}/{EXPECTED_TYPES.length} Dateien
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAnalyze}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', width: '100%', marginTop: '20px',
          padding: '14px 28px', borderRadius: '100px',
          border: 'none', cursor: 'pointer',
          background: `linear-gradient(135deg, ${GOLD}, #8b7355)`,
          color: '#0c0a09', fontSize: '13px', fontWeight: 600,
          fontFamily: 'inherit', letterSpacing: '0.02em',
        }}
      >
        <Zap size={14} />
        Auswerten — {totalBookings} Buchungen analysieren
      </motion.button>
    </div>
  )
}
