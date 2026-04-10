'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, Cell, ReferenceLine,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react'
import { AnimNum } from '@/components/dashboard/primitives/AnimNum'
import { MagneticCard } from '@/components/dashboard/primitives/MagneticCard'
import { GlowOrb } from '@/components/dashboard/primitives/GlowOrb'
import { Reveal } from '@/components/dashboard/primitives/Reveal'
import { ChartTooltip } from '@/components/dashboard/primitives/ChartTooltip'
import { useSengerData } from '../context/SengerDataContext'
import { GOLD, fmt, fmtK } from '../constants'

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
}

export function DistributionView() {
  const { distribution } = useSengerData()

  if (!distribution) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#5c4f3d', fontSize: '13px' }}>
        Keine Daten verfügbar. Bitte laden Sie DATEV-Dateien hoch.
      </div>
    )
  }

  const { totalPreliminaryResult, total20, total80, perHeadShare, reservePerPartner, partners } = distribution
  const eligible = partners.filter(p => p.saldo >= 0).length

  const saldoData = partners.map(p => ({
    label: p.partner,
    value: p.saldo,
    color: p.saldo >= 0 ? '#8bbb8b' : '#e08070',
  }))

  return (
    <div>
      {/* Distribution key figures */}
      <Reveal>
        <div style={{ ...cardStyle, padding: '28px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Percent size={14} color={GOLD} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: GOLD }}>Gewinnverteilung</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {[
              { label: 'Vorl. Ergebnis', value: totalPreliminaryResult },
              { label: '20% pro Kopf (je)', value: perHeadShare },
              { label: '80% Deckungsbeitrag', value: total80 },
              { label: 'Rücklage/Partner', value: reservePerPartner },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: '16px', borderRadius: '16px',
                background: 'rgba(200,169,126,0.03)', border: '1px solid rgba(200,169,126,0.06)',
              }}>
                <div style={{ fontSize: '10px', color: '#6b5b45', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                  <AnimNum value={item.value} suffix=" €" decimals={2} duration={1500 + i * 100} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Saldo Chart */}
      <Reveal delay={0.05}>
        <div style={{ ...cardStyle, padding: '28px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: GOLD }}>Saldo nach Partner</span>
            <span style={{ fontSize: '11px', color: '#5c4f3d', padding: '4px 12px', background: 'rgba(200,169,126,0.05)', borderRadius: '100px' }}>
              {eligible} / {partners.length} ausschüttungsfähig
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={saldoData} barCategoryGap="14%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#7a6950', fontSize: 13, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10 }} tickFormatter={fmtK} />
              <ReferenceLine y={0} stroke="rgba(200,169,126,0.15)" strokeDasharray="3 3" />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(200,169,126,0.03)' }} />
              <Bar dataKey="value" name="Saldo" radius={[8, 8, 8, 8]} isAnimationActive={false}>
                {saldoData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Reveal>

      {/* Partner Detail Cards */}
      <Reveal delay={0.1}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {partners.map((p, i) => (
            <MagneticCard key={p.partner} style={{ ...cardStyle, padding: '22px' }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: GOLD }}>{p.partner}</span>
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '100px',
                    fontSize: '10px', fontWeight: 600,
                    background: p.saldo >= 0 ? 'rgba(107,155,107,0.1)' : 'rgba(220,80,60,0.08)',
                    color: p.saldo >= 0 ? '#8bbb8b' : '#e08070',
                    border: `1px solid ${p.saldo >= 0 ? 'rgba(107,155,107,0.2)' : 'rgba(220,80,60,0.15)'}`,
                  }}>
                    {p.saldo >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {p.saldo >= 0 ? 'Ausschüttungsfähig' : 'Negativ'}
                  </span>
                </div>

                {/* Calculation chain */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px' }}>
                  {[
                    { l: 'Umsatzerlöse', v: p.revenue },
                    { l: 'Gesamtkosten', v: -p.totalCosts, neg: true },
                    { l: 'Betriebsergebnis', v: p.profit, bold: true },
                    { l: 'vorl. Ergebnis', v: p.preliminaryResult, bold: true },
                    null,
                    { l: 'Deckungsbeitrag', v: p.deckungsbeitrag, pct: true },
                    { l: '20% (pro Kopf)', v: p.headShare, indent: true },
                    { l: '80% (Deckungsbeitr.)', v: p.performanceShare, indent: true },
                    { l: 'Gewinnanteil', v: p.totalDistribution, bold: true },
                    null,
                    ...(p.withdrawals > 0 ? [{ l: 'Entnahmen', v: -p.withdrawals, neg: true }] : []),
                    ...(p.deposits > 0 ? [{ l: 'Einlagen', v: p.deposits }] : []),
                    ...(p.distributions > 0 ? [{ l: 'Gewinnausschüttung', v: -p.distributions, neg: true }] : []),
                    ...(p.gesellschafterSum !== 0 ? [{ l: 'Summe Gesellschafter', v: p.gesellschafterSum, bold: true }] : []),
                    null,
                    { l: 'Rücklage (2M)', v: p.reservePerPartner },
                    ...(p.lossCarryforward !== 0 ? [{ l: 'Verlustvortrag 2024', v: p.lossCarryforward }] : []),
                    ...(p.priorYearBalance !== 0 ? [{ l: 'Saldo 2025', v: p.priorYearBalance }] : []),
                  ].map((item, j) => {
                    if (!item) return <div key={`spacer-${j}`} style={{ height: '6px' }} />
                    return (
                      <div key={item.l} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingLeft: item.indent ? '10px' : '0',
                      }}>
                        <span style={{ color: item.bold ? '#e0d5c4' : '#5c4f3d', fontWeight: item.bold ? 600 : 400 }}>
                          {item.l}
                        </span>
                        <span style={{
                          fontVariantNumeric: 'tabular-nums',
                          fontWeight: item.bold ? 700 : 400,
                          color: item.pct ? GOLD : (item.v < 0 ? '#e08070' : '#e0d5c4'),
                        }}>
                          {item.pct ? `${(item.v * 100).toFixed(0)}%` : `${fmt(item.v)} €`}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Final Saldo */}
                <div style={{
                  marginTop: '14px', paddingTop: '14px',
                  borderTop: '2px solid rgba(200,169,126,0.12)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: GOLD }}>SALDO</span>
                  <span style={{
                    fontSize: '20px', fontWeight: 800, fontVariantNumeric: 'tabular-nums',
                    color: p.saldo >= 0 ? '#8bbb8b' : '#e08070',
                  }}>
                    {fmt(p.saldo)} €
                  </span>
                </div>
              </motion.div>
            </MagneticCard>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
