'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Legend,
} from 'recharts'
import { BarChart3 } from 'lucide-react'
import { AnimNum } from '@/components/dashboard/primitives/AnimNum'
import { Reveal } from '@/components/dashboard/primitives/Reveal'
import { ChartTooltip } from '@/components/dashboard/primitives/ChartTooltip'
import { useSengerData } from '../context/SengerDataContext'
import { PARTNERS, MONTH_LABELS, GOLD, COLORS, fmt, fmtK, COST_GROUP_ORDER } from '../constants'

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
}

export function PartnerDetailView() {
  const { partnerData, distribution, selectedPartner, setSelectedPartner, months } = useSengerData()

  const currentData = useMemo(
    () => (partnerData.get(selectedPartner) || []).sort((a, b) => a.year - b.year || a.month - b.month),
    [partnerData, selectedPartner]
  )

  const partnerDist = distribution?.partners.find(p => p.partner === selectedPartner)

  // Monthly chart data
  const chartData = useMemo(() => {
    return currentData.map(d => ({
      month: MONTH_LABELS[d.month - 1],
      Umsatz: d.revenue,
      Kosten: d.totalCosts,
      Gewinn: d.profit,
    }))
  }, [currentData])

  const totalRevenue = currentData.reduce((s, d) => s + d.revenue, 0)
  const totalCosts = currentData.reduce((s, d) => s + d.totalCosts, 0)
  const totalProfit = totalRevenue - totalCosts

  // Grid columns: label + months + total
  const colCount = currentData.length
  const gridCols = `200px repeat(${colCount}, 1fr) 110px`

  return (
    <div>
      {/* Partner Tabs */}
      <Reveal>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', padding: '4px', borderRadius: '100px', background: 'rgba(200,169,126,0.03)', flexWrap: 'wrap' }}>
          {PARTNERS.map(p => {
            const pd = distribution?.partners.find(x => x.partner === p)
            return (
              <motion.button
                key={p}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedPartner(p)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '100px', border: 'none',
                  cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                  background: selectedPartner === p ? 'rgba(200,169,126,0.15)' : 'transparent',
                  color: selectedPartner === p ? '#e0d5c4' : '#7a6950',
                  transition: 'all 0.3s',
                }}
              >
                {p}
                {pd && (
                  <span style={{
                    fontSize: '9px', fontWeight: 500,
                    color: pd.saldo >= 0 ? '#8bbb8b' : '#e08070',
                  }}>
                    {pd.saldo >= 0 ? '●' : '●'}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </Reveal>

      {/* Summary cards */}
      <Reveal delay={0.05}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
          {[
            { label: 'Umsatzerlöse', value: totalRevenue, color: GOLD },
            { label: 'Gesamtkosten', value: totalCosts, color: '#a0845c' },
            { label: 'Betriebsergebnis', value: totalProfit, color: totalProfit >= 0 ? '#8bbb8b' : '#e08070' },
            { label: 'Saldo', value: partnerDist?.saldo || 0, color: (partnerDist?.saldo || 0) >= 0 ? '#8bbb8b' : '#e08070' },
          ].map((kpi, i) => (
            <div key={kpi.label} style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ fontSize: '10px', color: '#6b5b45', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '6px' }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: kpi.color, fontVariantNumeric: 'tabular-nums' }}>
                <AnimNum value={kpi.value} suffix=" €" decimals={2} duration={1200 + i * 150} />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Revenue/Cost Bar Chart */}
      {chartData.length > 0 && (
        <Reveal delay={0.08}>
          <div style={{ ...cardStyle, padding: '24px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <BarChart3 size={14} color={GOLD} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>
                Kostenstelle {selectedPartner} — Monatsentwicklung
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5c4f3d', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10 }} tickFormatter={fmtK} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(200,169,126,0.03)' }} />
                <Bar dataKey="Umsatz" fill={GOLD} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="Kosten" fill="#8b7355" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Reveal>
      )}

      {/* Detail table — Monthly Breakdown matching Excel partner sheet */}
      <Reveal delay={0.12}>
        <div style={{ ...cardStyle, padding: '24px', overflowX: 'auto' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: GOLD, marginBottom: '16px' }}>
            Kostenstelle {selectedPartner} (mit allg. Kosten)
          </div>
          <div style={{ minWidth: '600px' }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: gridCols,
              gap: '6px', padding: '0 8px 8px',
              borderBottom: '2px solid rgba(200,169,126,0.1)',
            }}>
              <span style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bezeichnung
              </span>
              {currentData.map(d => (
                <span key={`${d.month}-${d.year}`} style={{ fontSize: '10px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>
                  {MONTH_LABELS[d.month - 1]} {d.year}
                </span>
              ))}
              <span style={{ fontSize: '10px', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right', fontWeight: 700 }}>
                Gesamt
              </span>
            </div>

            {/* Revenue */}
            <div style={{
              display: 'grid', gridTemplateColumns: gridCols,
              gap: '6px', padding: '8px 8px',
              borderBottom: '1px solid rgba(200,169,126,0.06)',
              background: 'rgba(200,169,126,0.015)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#e0d5c4' }}>Umsatzerlöse</span>
              {currentData.map(d => (
                <span key={`rev-${d.month}`} style={{ fontSize: '11px', fontWeight: 600, color: '#e0d5c4', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(d.revenue)}
                </span>
              ))}
              <span style={{ fontSize: '11px', fontWeight: 700, color: GOLD, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(totalRevenue)}
              </span>
            </div>

            {/* Cost groups */}
            {COST_GROUP_ORDER.map((group, i) => {
              const total = currentData.reduce((s, d) => s + (d.costs[group] || 0), 0)
              if (total === 0 && currentData.every(d => !d.costs[group])) return null
              return (
                <div key={group} style={{
                  display: 'grid', gridTemplateColumns: gridCols,
                  gap: '6px', padding: '5px 8px',
                  borderBottom: '1px solid rgba(200,169,126,0.03)',
                }}>
                  <span style={{ fontSize: '11px', color: '#7a6950' }}>{group}</span>
                  {currentData.map(d => (
                    <span key={`${group}-${d.month}`} style={{ fontSize: '11px', color: '#9e8c73', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      {(d.costs[group] || 0) > 0 ? fmt(d.costs[group] || 0) : '—'}
                    </span>
                  ))}
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#e0d5c4', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {fmt(total)}
                  </span>
                </div>
              )
            })}

            {/* Total Costs */}
            <div style={{
              display: 'grid', gridTemplateColumns: gridCols,
              gap: '6px', padding: '8px 8px',
              borderTop: '1px solid rgba(200,169,126,0.08)',
              background: 'rgba(200,169,126,0.015)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#e0d5c4' }}>Gesamtkosten</span>
              {currentData.map(d => (
                <span key={`tc-${d.month}`} style={{ fontSize: '11px', fontWeight: 600, color: '#e08070', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(d.totalCosts)}
                </span>
              ))}
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e08070', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(totalCosts)}
              </span>
            </div>

            {/* Betriebsergebnis */}
            <div style={{
              display: 'grid', gridTemplateColumns: gridCols,
              gap: '6px', padding: '8px 8px',
              borderBottom: '1px solid rgba(200,169,126,0.06)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e0d5c4' }}>Betriebsergebnis</span>
              {currentData.map(d => (
                <span key={`p-${d.month}`} style={{ fontSize: '11px', fontWeight: 700, color: d.profit >= 0 ? '#8bbb8b' : '#e08070', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(d.profit)}
                </span>
              ))}
              <span style={{ fontSize: '12px', fontWeight: 800, color: totalProfit >= 0 ? '#8bbb8b' : '#e08070', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(totalProfit)}
              </span>
            </div>

            {/* Vorl. Ergebnis */}
            <div style={{
              display: 'grid', gridTemplateColumns: gridCols,
              gap: '6px', padding: '8px 8px',
              background: 'rgba(200,169,126,0.02)',
              borderBottom: '2px solid rgba(200,169,126,0.08)',
            }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#e0d5c4' }}>Vorläufiges Ergebnis</span>
              {currentData.map(d => (
                <span key={`pr-${d.month}`} style={{ fontSize: '11px', fontWeight: 700, color: d.preliminaryResult >= 0 ? '#8bbb8b' : '#e08070', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(d.preliminaryResult)}
                </span>
              ))}
              <span style={{ fontSize: '12px', fontWeight: 800, color: (partnerDist?.preliminaryResult || 0) >= 0 ? '#8bbb8b' : '#e08070', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {fmt(partnerDist?.preliminaryResult || 0)}
              </span>
            </div>

            {/* Saldo summary at bottom */}
            {partnerDist && (
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '14px', background: 'rgba(200,169,126,0.03)', border: '1px solid rgba(200,169,126,0.06)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                  {[
                    { l: 'Deckungsbeitrag', v: `${(partnerDist.deckungsbeitrag * 100).toFixed(1)}%` },
                    { l: '20% (pro Kopf)', v: fmt(partnerDist.headShare) },
                    { l: '80% (Deckungsbeitr.)', v: fmt(partnerDist.performanceShare) },
                    { l: 'Gewinnanteil', v: fmt(partnerDist.totalDistribution), bold: true },
                    { l: 'Summe Gesellschafter', v: fmt(partnerDist.gesellschafterSum), bold: true },
                    { l: 'Rücklage (2M)', v: fmt(partnerDist.reservePerPartner) },
                    { l: 'Verlustvortrag 2024', v: fmt(partnerDist.lossCarryforward) },
                    { l: 'Saldo 2025', v: fmt(partnerDist.priorYearBalance) },
                  ].map(item => (
                    <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#5c4f3d' }}>{item.l}</span>
                      <span style={{ fontWeight: item.bold ? 700 : 400, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                        {item.v} {!item.v.includes('%') ? '€' : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: '12px', paddingTop: '12px',
                  borderTop: '2px solid rgba(200,169,126,0.1)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: GOLD }}>SALDO</span>
                  <span style={{
                    fontSize: '22px', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
                    color: partnerDist.saldo >= 0 ? '#8bbb8b' : '#e08070',
                  }}>
                    {fmt(partnerDist.saldo)} €
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
