'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { PARTNERS, GOLD, DEFAULT_PRIOR_YEAR_BALANCES, DEFAULT_LOSS_CARRYFORWARDS, fmt } from '../constants'

const STORAGE_KEY = 'senger-prior-year-config-v1'

export interface PriorYearValues {
  balances: Record<string, number>
  lossCarryforwards: Record<string, number>
}

export function PriorYearConfig({
  onChange,
}: {
  onChange: (values: PriorYearValues) => void
}) {
  const [values, setValues] = useState<PriorYearValues>({
    balances: { ...DEFAULT_PRIOR_YEAR_BALANCES },
    lossCarryforwards: { ...DEFAULT_LOSS_CARRYFORWARDS },
  })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const merged = {
          balances: { ...DEFAULT_PRIOR_YEAR_BALANCES, ...parsed.balances },
          lossCarryforwards: { ...DEFAULT_LOSS_CARRYFORWARDS, ...parsed.lossCarryforwards },
        }
        setValues(merged)
        onChange(merged)
      } catch { /* ignore */ }
    } else {
      onChange(values)
    }
  }, [])

  const updateBalance = (partner: string, value: number) => {
    setValues(prev => {
      const next = { ...prev, balances: { ...prev.balances, [partner]: value } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      onChange(next)
      return next
    })
  }

  const updateLossCarryforward = (partner: string, value: number) => {
    setValues(prev => {
      const next = { ...prev, lossCarryforwards: { ...prev.lossCarryforwards, [partner]: value } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      onChange(next)
      return next
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    background: 'rgba(200,169,126,0.04)',
    border: '1px solid rgba(200,169,126,0.1)',
    borderRadius: '8px',
    color: '#e0d5c4',
    fontSize: '12px',
    fontFamily: 'inherit',
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'right',
    outline: 'none',
  }

  return (
    <div style={{
      marginTop: '16px',
      background: 'rgba(200,169,126,0.025)',
      border: '1px solid rgba(200,169,126,0.07)',
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', padding: '14px 20px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#7a6950', fontSize: '12px', fontFamily: 'inherit',
        }}
      >
        <Settings size={14} color={GOLD} />
        <span style={{ fontWeight: 500 }}>Vorjahreswerte & Verlustvorträge (vorbelegt)</span>
        <span style={{
          marginLeft: 'auto', fontSize: '10px',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}>▼</span>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ padding: '0 20px 20px' }}
        >
          <div style={{ fontSize: '10px', color: '#5c4f3d', marginBottom: '12px' }}>
            Werte aus der Vorjahresübersicht vorbelegt. Bei Bedarf anpassen.
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 1fr 1fr',
            gap: '8px',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '9px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Partner
            </div>
            <div style={{ fontSize: '9px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Saldo 2025
            </div>
            <div style={{ fontSize: '9px', color: '#5c4f3d', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verlustvortrag 2024
            </div>

            {PARTNERS.map(partner => (
              <React.Fragment key={partner}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: GOLD }}>
                  {partner}
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={values.balances[partner] || 0}
                  onChange={(e) => updateBalance(partner, parseFloat(e.target.value) || 0)}
                  style={{
                    ...inputStyle,
                    color: (values.balances[partner] || 0) < 0 ? '#e08070' : '#e0d5c4',
                  }}
                />
                <input
                  type="number"
                  step="0.01"
                  value={values.lossCarryforwards[partner] || 0}
                  onChange={(e) => updateLossCarryforward(partner, parseFloat(e.target.value) || 0)}
                  style={{
                    ...inputStyle,
                    color: (values.lossCarryforwards[partner] || 0) < 0 ? '#e08070' : '#e0d5c4',
                  }}
                />
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
