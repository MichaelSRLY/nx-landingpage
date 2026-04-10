'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Upload, BarChart3, Users, Layers, PieChart, RotateCcw } from 'lucide-react'
import { SengerDataProvider, useSengerData } from '@/components/dashboard/senger/context/SengerDataContext'
import { MultiFileDropZone } from '@/components/dashboard/senger/upload/MultiFileDropZone'
import { UploadManager } from '@/components/dashboard/senger/upload/UploadManager'
import { PriorYearConfig } from '@/components/dashboard/senger/views/PriorYearConfig'
import { OverviewView } from '@/components/dashboard/senger/views/OverviewView'
import { PartnerDetailView } from '@/components/dashboard/senger/views/PartnerDetailView'
import { CostAnalysisView } from '@/components/dashboard/senger/views/CostAnalysisView'
import { DistributionView } from '@/components/dashboard/senger/views/DistributionView'
import { GlowOrb } from '@/components/dashboard/primitives/GlowOrb'
import { ParticleField } from '@/components/dashboard/primitives/ParticleField'
import type { DashboardView } from '@/components/dashboard/senger/types'

const GOLD = '#c8a97e'

const TABS: { id: DashboardView; label: string; icon: typeof Upload }[] = [
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'overview', label: 'Übersicht', icon: BarChart3 },
  { id: 'partner', label: 'Partner', icon: Users },
  { id: 'costs', label: 'Kosten', icon: Layers },
  { id: 'distribution', label: 'Ausschüttung', icon: PieChart },
]

function DashboardContent() {
  const {
    files, setFiles, analyze, activeView, setActiveView,
    clearData, setPriorYearConfig, allBookings,
  } = useSengerData()

  const hasData = allBookings.length > 0

  return (
    <>
      {/* Floating Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: '12px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px',
          padding: '8px 8px 8px 20px',
          background: 'rgba(15, 13, 11, 0.6)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          borderRadius: '100px',
          border: '1px solid rgba(200,169,126,0.1)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(200,169,126,0.05) inset',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '8px' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '8px',
            background: 'linear-gradient(135deg, #c8a97e 0%, #8b7355 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '10px', color: '#0c0a09', letterSpacing: '0.02em',
          }}>R&P</div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#e0d5c4', whiteSpace: 'nowrap' }}>
            Mandantenportal
          </span>
        </div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(200,169,126,0.12)' }} />
        <div style={{ display: 'flex', gap: '2px', padding: '2px', borderRadius: '100px' }}>
          {TABS.map((tab) => {
            const disabled = tab.id !== 'upload' && !hasData
            return (
              <motion.button
                key={tab.id}
                onClick={() => !disabled && setActiveView(tab.id)}
                whileHover={disabled ? {} : { scale: 1.02 }}
                whileTap={disabled ? {} : { scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', borderRadius: '100px', border: 'none',
                  cursor: disabled ? 'default' : 'pointer',
                  fontSize: '12px', fontWeight: 500, fontFamily: 'inherit',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: activeView === tab.id ? 'rgba(200,169,126,0.15)' : 'transparent',
                  color: disabled ? '#3d352b' : activeView === tab.id ? '#e0d5c4' : '#7a6950',
                  opacity: disabled ? 0.5 : 1,
                  boxShadow: activeView === tab.id ? '0 2px 8px rgba(200,169,126,0.08)' : 'none',
                }}
              >
                <tab.icon size={12} />
                {tab.label}
              </motion.button>
            )
          })}
        </div>
        {hasData && (
          <>
            <div style={{ width: '1px', height: '20px', background: 'rgba(200,169,126,0.12)' }} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearData}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 12px', borderRadius: '100px', border: 'none',
                cursor: 'pointer', background: 'rgba(200,169,126,0.06)',
                color: '#7a6950', fontSize: '10px', fontFamily: 'inherit',
              }}
            >
              <RotateCcw size={10} />
              Reset
            </motion.button>
          </>
        )}
      </motion.nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 120px', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ marginBottom: '40px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '100px',
            background: 'rgba(200,169,126,0.06)', border: '1px solid rgba(200,169,126,0.1)',
            fontSize: '11px', color: GOLD, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px',
          }}>
            <Sparkles size={11} />
            Gewinnermittlung · Gesellschafterausschüttung
          </div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 200, lineHeight: 1.1, color: '#e0d5c4', letterSpacing: '-0.04em', margin: 0 }}>
            Ramser & Partner
            <br />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${GOLD}, #e0c9a6, ${GOLD})`,
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Finanzübersicht
            </motion.span>
          </h1>
          {!hasData && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ fontSize: '14px', color: '#7a6950', marginTop: '14px', maxWidth: '500px', lineHeight: 1.7 }}
            >
              Laden Sie Ihre monatlichen DATEV-Buchungsstapel hoch, um automatisch
              die Gewinnverteilung und Gesellschaftersalden zu berechnen.
            </motion.p>
          )}
          {hasData && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '14px', color: '#7a6950', marginTop: '14px' }}
            >
              <span style={{ color: '#9e8c73' }}>{allBookings.length} Buchungen</span> aus{' '}
              <span style={{ color: '#9e8c73' }}>{files.length} Dateien</span> verarbeitet.
            </motion.p>
          )}
        </motion.div>

        {/* View Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeView === 'upload' && (
              <div>
                <MultiFileDropZone
                  onFilesProcessed={setFiles}
                  existingFiles={files}
                />
                <UploadManager
                  files={files}
                  onAnalyze={analyze}
                />
                <PriorYearConfig onChange={setPriorYearConfig} />
              </div>
            )}
            {activeView === 'overview' && <OverviewView />}
            {activeView === 'partner' && <PartnerDetailView />}
            {activeView === 'costs' && <CostAnalysisView />}
            {activeView === 'distribution' && <DistributionView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  )
}

export default function MandantenportalSenger() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  if (!mounted) return null

  return (
    <SengerDataProvider>
      <div style={{
        minHeight: '100vh', background: '#0c0a09', color: '#e0d5c4',
        fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden', position: 'relative',
      }}>
        <ParticleField />
        <GlowOrb x="20%" y="10%" size={600} opacity={0.03} />
        <GlowOrb x="80%" y="60%" size={500} opacity={0.02} color="#8b7355" />
        <GlowOrb x="50%" y="90%" size={400} opacity={0.02} color="#a0845c" />
        <DashboardContent />
      </div>
    </SengerDataProvider>
  )
}
