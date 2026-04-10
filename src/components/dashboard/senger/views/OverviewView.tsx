'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, Activity, Users } from 'lucide-react'
import { AnimNum } from '@/components/dashboard/primitives/AnimNum'
import { MagneticCard } from '@/components/dashboard/primitives/MagneticCard'
import { GlowOrb } from '@/components/dashboard/primitives/GlowOrb'
import { Reveal } from '@/components/dashboard/primitives/Reveal'
import { useSengerData } from '../context/SengerDataContext'
import { GOLD, fmt } from '../constants'

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
}

// Row definition for the Übersicht table
type RowDef = {
  label: string
  key: string
  type: 'value' | 'header' | 'spacer' | 'final'
  getValue?: (p: any) => number
  getTotal?: (d: any) => number
  format?: 'currency' | 'percent'
  highlight?: boolean
  indent?: boolean
}

export function OverviewView() {
  const { distribution } = useSengerData()

  if (!distribution) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#5c4f3d', fontSize: '13px' }}>
        Keine Daten verfügbar.
      </div>
    )
  }

  const { partners } = distribution
  const eligible = partners.filter(p => p.saldo >= 0).length

  const rows: RowDef[] = [
    { label: 'Ergebnis', key: 'h1', type: 'header' },
    { label: 'Umsatzerlöse', key: 'revenue', type: 'value', getValue: p => p.revenue, getTotal: d => d.totalRevenue },
    { label: 'Gesamtkosten', key: 'costs', type: 'value', getValue: p => p.totalCosts, getTotal: d => d.totalCosts },
    { label: 'Betriebsergebnis', key: 'profit', type: 'value', getValue: p => p.profit, getTotal: d => d.totalProfit, highlight: true },
    { label: 'vorl. Ergebnis', key: 'prelim', type: 'value', getValue: p => p.preliminaryResult, getTotal: d => d.totalPreliminaryResult, highlight: true },
    { label: '', key: 's1', type: 'spacer' },
    { label: 'Deckungsbeitrag (%)', key: 'deck', type: 'value', getValue: p => p.deckungsbeitrag, getTotal: () => 1, format: 'percent' },
    { label: '', key: 's2', type: 'spacer' },
    { label: 'Gewinnverteilung', key: 'h2', type: 'header' },
    { label: '20% (pro Kopf)', key: 'head', type: 'value', getValue: p => p.headShare, getTotal: d => d.total20, indent: true },
    { label: '80% (Deckungsbeitrag)', key: 'perf', type: 'value', getValue: p => p.performanceShare, getTotal: d => d.total80, indent: true },
    { label: 'Gesamt', key: 'dist', type: 'value', getValue: p => p.totalDistribution, getTotal: d => d.totalPreliminaryResult, highlight: true },
    { label: '', key: 's3', type: 'spacer' },
    { label: 'Gesellschafter', key: 'h3', type: 'header' },
    { label: 'Entnahmen', key: 'with', type: 'value', getValue: p => p.withdrawals, getTotal: () => partners.reduce((s, p) => s + p.withdrawals, 0) },
    { label: 'Einlagen', key: 'dep', type: 'value', getValue: p => p.deposits, getTotal: () => partners.reduce((s, p) => s + p.deposits, 0) },
    { label: 'Gewinnausschüttung', key: 'gdist', type: 'value', getValue: p => p.distributions, getTotal: () => partners.reduce((s, p) => s + p.distributions, 0) },
    { label: 'Summe Gesellschafter', key: 'gsum', type: 'value', getValue: p => p.gesellschafterSum, getTotal: () => partners.reduce((s, p) => s + p.gesellschafterSum, 0), highlight: true },
    { label: '', key: 's4', type: 'spacer' },
    { label: 'Saldo', key: 'smid', type: 'value', getValue: p => p.saldoMid, getTotal: () => partners.reduce((s, p) => s + p.saldoMid, 0), highlight: true },
    { label: '', key: 's5', type: 'spacer' },
    { label: 'Rücklage / Betriebsausgaben', key: 'h4', type: 'header' },
    { label: 'Rücklage (2M)', key: 'res', type: 'value', getValue: p => p.reservePerPartner, getTotal: d => d.reserveTotal },
    { label: 'Verlustvortrag 2024', key: 'loss', type: 'value', getValue: p => p.lossCarryforward, getTotal: () => partners.reduce((s, p) => s + p.lossCarryforward, 0) },
    { label: 'Saldo 2025', key: 'prior', type: 'value', getValue: p => p.priorYearBalance, getTotal: () => partners.reduce((s, p) => s + p.priorYearBalance, 0) },
    { label: '', key: 's6', type: 'spacer' },
    { label: 'SALDO', key: 'final', type: 'final', getValue: p => p.saldo, getTotal: () => partners.reduce((s, p) => s + p.saldo, 0) },
  ]

  const gridCols = `200px 120px repeat(7, 1fr)`

  return (
    <div>
      {/* KPI Cards */}
      <Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {[
            { label: 'Gesamtumsatz', value: distribution.totalRevenue, icon: DollarSign, color: GOLD },
            { label: 'Gesamtkosten', value: distribution.totalCosts, icon: Activity, color: '#a0845c' },
            { label: 'Gewinn', value: distribution.totalProfit, icon: TrendingUp, color: '#d4b896' },
            { label: 'Ausschüttungsfähig', value: eligible, suffix: ` / ${partners.length}`, decimals: 0, icon: Users, color: '#8b7355' },
          ].map((kpi, i) => (
            <MagneticCard key={kpi.label} style={{ ...cardStyle, padding: '20px' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
              >
                <GlowOrb color={kpi.color} size={100} x="85%" y="20%" opacity={0.05} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '8px',
                    background: `${kpi.color}10`, border: `1px solid ${kpi.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <kpi.icon size={13} color={kpi.color} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#6b5b45', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {kpi.label}
                  </span>
                </div>
                <div style={{ fontSize: 'clamp(16px, 2.2vw, 24px)', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                  <AnimNum value={kpi.value} suffix={('suffix' in kpi ? kpi.suffix : ' €') as string} decimals={('decimals' in kpi ? kpi.decimals : 2) as number} duration={1800 + i * 150} />
                </div>
              </motion.div>
            </MagneticCard>
          ))}
        </div>
      </Reveal>

      {/* Main Übersicht Table */}
      <Reveal delay={0.1}>
        <div style={{ ...cardStyle, padding: '28px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: GOLD }}>Übersicht Gesellschafter-Gewinne</span>
          </div>
          <div style={{ minWidth: '900px' }}>
            {/* Table Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: gridCols,
              gap: '4px', padding: '0 8px 10px',
              borderBottom: '2px solid rgba(200,169,126,0.12)',
            }}>
              <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bezeichnung
              </span>
              <span style={{ fontSize: '10px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right', fontWeight: 700 }}>
                Gesamt
              </span>
              {partners.map(p => (
                <span key={p.partner} style={{
                  fontSize: '10px', color: '#7a6950', textTransform: 'uppercase',
                  letterSpacing: '0.08em', textAlign: 'right', fontWeight: 600,
                }}>
                  {p.partner}
                </span>
              ))}
            </div>

            {/* Table Body */}
            {rows.map((row, idx) => {
              if (row.type === 'spacer') {
                return <div key={row.key} style={{ height: '10px' }} />
              }

              if (row.type === 'header') {
                return (
                  <div key={row.key} style={{
                    padding: '10px 8px 4px',
                    fontSize: '11px', fontWeight: 700, color: GOLD,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                    borderBottom: '1px solid rgba(200,169,126,0.06)',
                  }}>
                    {row.label}
                  </div>
                )
              }

              const isFinal = row.type === 'final'
              const totalVal = row.getTotal ? row.getTotal(distribution) : 0
              const isPercent = row.format === 'percent'

              return (
                <motion.div
                  key={row.key}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.015, 0.4) }}
                  style={{
                    display: 'grid', gridTemplateColumns: gridCols,
                    gap: '4px', padding: isFinal ? '12px 8px' : '6px 8px',
                    borderBottom: isFinal ? '2px solid rgba(200,169,126,0.15)' : '1px solid rgba(200,169,126,0.03)',
                    borderTop: isFinal ? '2px solid rgba(200,169,126,0.15)' : 'none',
                    background: isFinal ? 'rgba(200,169,126,0.04)' : row.highlight ? 'rgba(200,169,126,0.015)' : 'transparent',
                  }}
                >
                  <span style={{
                    fontSize: isFinal ? '13px' : '11px',
                    fontWeight: isFinal ? 800 : row.highlight ? 600 : 400,
                    color: isFinal ? GOLD : row.highlight ? '#e0d5c4' : '#9e8c73',
                    paddingLeft: row.indent ? '12px' : '0',
                  }}>
                    {row.label}
                  </span>

                  {/* Gesamt column */}
                  <span style={{
                    fontSize: isFinal ? '13px' : '11px',
                    fontWeight: isFinal ? 800 : 700,
                    color: isFinal
                      ? (totalVal >= 0 ? '#8bbb8b' : '#e08070')
                      : GOLD,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {isPercent ? `${(totalVal * 100).toFixed(0)}%` : fmt(totalVal)}
                  </span>

                  {/* Partner columns */}
                  {partners.map(p => {
                    const val = row.getValue ? row.getValue(p) : 0
                    const isNeg = val < 0
                    return (
                      <span key={p.partner} style={{
                        fontSize: isFinal ? '12px' : '11px',
                        fontWeight: isFinal ? 800 : row.highlight ? 600 : 400,
                        color: isFinal
                          ? (val >= 0 ? '#8bbb8b' : '#e08070')
                          : isNeg ? '#e08070' : '#e0d5c4',
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {isPercent ? `${(val * 100).toFixed(0)}%` : (val === 0 && !isFinal ? '—' : fmt(val))}
                      </span>
                    )
                  })}
                </motion.div>
              )
            })}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
