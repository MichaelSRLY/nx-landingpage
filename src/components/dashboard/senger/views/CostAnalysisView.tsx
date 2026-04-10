'use client'

import { useMemo, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { motion } from 'framer-motion'
import { Layers, BarChart3 } from 'lucide-react'
import { Reveal } from '@/components/dashboard/primitives/Reveal'
import { ChartTooltip, PieTooltip } from '@/components/dashboard/primitives/ChartTooltip'
import { useSengerData } from '../context/SengerDataContext'
import { PARTNERS, MONTH_LABELS, GOLD, COLORS, fmt, fmtK, COST_GROUP_ORDER } from '../constants'

const cardStyle: React.CSSProperties = {
  background: 'rgba(200,169,126,0.025)',
  border: '1px solid rgba(200,169,126,0.07)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
}

export function CostAnalysisView() {
  const { partnerData, months } = useSengerData()
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  // Aggregate costs by group across all partners
  const costByGroup = useMemo(() => {
    const totals = new Map<string, number>()
    for (const group of COST_GROUP_ORDER) totals.set(group, 0)
    for (const dataList of partnerData.values()) {
      for (const d of dataList) {
        for (const [cat, amount] of Object.entries(d.costs)) {
          totals.set(cat, (totals.get(cat) || 0) + amount)
        }
      }
    }
    return COST_GROUP_ORDER
      .map(name => ({ name, value: totals.get(name) || 0 }))
      .filter(c => c.value > 0)
  }, [partnerData])

  const totalCosts = costByGroup.reduce((s, c) => s + c.value, 0)

  // Costs by partner (for comparison chart)
  const costByPartner = useMemo(() => {
    return PARTNERS.map(p => {
      const data = partnerData.get(p) || []
      const total = data.reduce((s, d) => s + d.totalCosts, 0)
      const revenue = data.reduce((s, d) => s + d.revenue, 0)
      return { label: p, Kosten: total, Umsatz: revenue }
    })
  }, [partnerData])

  // Monthly cost by group
  const monthlyByGroup = useMemo(() => {
    return months.map(m => {
      const row: Record<string, number | string> = { month: MONTH_LABELS[m.month - 1] }
      for (const group of COST_GROUP_ORDER) row[group] = 0

      for (const dataList of partnerData.values()) {
        for (const d of dataList) {
          if (d.month !== m.month || d.year !== m.year) continue
          for (const [cat, amount] of Object.entries(d.costs)) {
            row[cat] = (row[cat] as number || 0) + amount
          }
        }
      }
      return row
    })
  }, [months, partnerData])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        {/* Donut */}
        <Reveal>
          <div style={{ ...cardStyle, padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <Layers size={14} color={GOLD} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Kostenverteilung nach Kategorie</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costByGroup} cx="50%" cy="50%"
                  innerRadius={75} outerRadius={125}
                  paddingAngle={2} dataKey="value" stroke="none"
                  onMouseEnter={(_, i) => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                >
                  {costByGroup.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}
                      opacity={activeIdx === null || activeIdx === i ? 1 : 0.25}
                      style={{ transition: 'all 0.4s', cursor: 'pointer' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip total={totalCosts} />} />
                <text x="50%" y="44%" textAnchor="middle" fill="#e0d5c4" fontSize="22" fontWeight="700" fontFamily="Inter">
                  {fmt(totalCosts, 0)}
                </text>
                <text x="50%" y="56%" textAnchor="middle" fill="#5c4f3d" fontSize="10" fontFamily="Inter" letterSpacing="0.1em">
                  EUR GESAMT
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {costByGroup.map((c, i) => (
                <div key={c.name}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '10px', color: '#7a6950',
                    background: activeIdx === i ? 'rgba(200,169,126,0.08)' : 'transparent',
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '2px', background: COLORS[i % COLORS.length] }} />
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Category list with bars */}
        <Reveal delay={0.05}>
          <div style={{ ...cardStyle, padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Kostenkategorien</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {costByGroup.map((cat, i) => {
                const pct = totalCosts > 0 ? (cat.value / totalCosts * 100) : 0
                return (
                  <motion.div key={cat.name}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#e0d5c4' }}>{cat.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#e0d5c4', fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(cat.value)} · {pct.toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(200,169,126,0.04)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        style={{ height: '100%', borderRadius: '2px', background: COLORS[i % COLORS.length] }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Revenue vs Cost per Partner */}
      <Reveal delay={0.1}>
        <div style={{ ...cardStyle, padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={14} color={GOLD} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>Umsatz vs. Kosten je Partner</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costByPartner} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200,169,126,0.04)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#7a6950', fontSize: 12, fontWeight: 700 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#3d352b', fontSize: 10 }} tickFormatter={fmtK} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(200,169,126,0.03)' }} />
              <Bar dataKey="Umsatz" fill={GOLD} radius={[6, 6, 0, 0]} isAnimationActive={false} />
              <Bar dataKey="Kosten" fill="#8b7355" radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Reveal>
    </div>
  )
}
