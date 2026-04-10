'use client'

import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { UploadedFile, PartnerMonthData, DistributionResult, DashboardView, DATEVBooking } from '../types'
import { aggregateByPartner } from '../engine/PartnerAggregator'
import { allocateOverhead } from '../engine/OverheadAllocator'
import { calculateDistribution, type PriorYearConfig } from '../engine/ProfitDistributor'
import { PARTNERS, DEFAULT_PRIOR_YEAR_BALANCES, DEFAULT_LOSS_CARRYFORWARDS } from '../constants'

const STORAGE_KEY = 'senger-dashboard-v1'
const PRIOR_YEAR_KEY = 'senger-prior-year-config-v1'

interface SengerState {
  files: UploadedFile[]
  allBookings: DATEVBooking[]
  partnerData: Map<string, PartnerMonthData[]>
  overheadData: PartnerMonthData[]
  distribution: DistributionResult | null
  priorYearConfig: PriorYearConfig
  activeView: DashboardView
  selectedPartner: string
  months: { month: number; year: number }[]
  totalRevenue: number
  totalCosts: number
  totalProfit: number
}

interface SengerActions {
  setFiles: (files: UploadedFile[]) => void
  analyze: () => void
  setActiveView: (view: DashboardView) => void
  setSelectedPartner: (partner: string) => void
  setPriorYearConfig: (config: PriorYearConfig) => void
  clearData: () => void
}

const SengerContext = createContext<(SengerState & SengerActions) | null>(null)

export function useSengerData() {
  const ctx = useContext(SengerContext)
  if (!ctx) throw new Error('useSengerData must be used within SengerDataProvider')
  return ctx
}

export function SengerDataProvider({ children }: { children: ReactNode }) {
  const [files, setFilesState] = useState<UploadedFile[]>([])
  const [activeView, setActiveView] = useState<DashboardView>('upload')
  const [selectedPartner, setSelectedPartner] = useState<string>(PARTNERS[0])
  const [priorYearConfig, setPriorYearConfigState] = useState<PriorYearConfig>({
    balances: { ...DEFAULT_PRIOR_YEAR_BALANCES },
    lossCarryforwards: { ...DEFAULT_LOSS_CARRYFORWARDS },
  })
  const [analyzed, setAnalyzed] = useState(false)

  useEffect(() => {
    try {
      const savedPrior = localStorage.getItem(PRIOR_YEAR_KEY)
      if (savedPrior) {
        const parsed = JSON.parse(savedPrior)
        // Merge with defaults to ensure all partners present
        setPriorYearConfigState({
          balances: { ...DEFAULT_PRIOR_YEAR_BALANCES, ...parsed.balances },
          lossCarryforwards: { ...DEFAULT_LOSS_CARRYFORWARDS, ...parsed.lossCarryforwards },
        })
      }
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.files && data.files.length > 0) {
          setFilesState(data.files)
          setAnalyzed(true)
          setActiveView('overview')
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const allBookings = useMemo(
    () => files.flatMap(f => f.bookings),
    [files]
  )

  const { partnerData, overheadData, months, totalRevenue, totalCosts, totalProfit } = useMemo(() => {
    if (!analyzed || allBookings.length === 0) {
      return {
        partnerData: new Map<string, PartnerMonthData[]>(),
        overheadData: [] as PartnerMonthData[],
        months: [] as { month: number; year: number }[],
        totalRevenue: 0,
        totalCosts: 0,
        totalProfit: 0,
      }
    }

    const result = aggregateByPartner(allBookings)
    allocateOverhead(result.partnerData, result.overheadData)

    const monthSet = new Set<string>()
    for (const dataList of result.partnerData.values()) {
      for (const d of dataList) {
        monthSet.add(`${d.month}-${d.year}`)
      }
    }
    const months = Array.from(monthSet)
      .map(key => {
        const [m, y] = key.split('-').map(Number)
        return { month: m, year: y }
      })
      .sort((a, b) => a.year - b.year || a.month - b.month)

    let totalRevenue = 0
    let totalCosts = 0
    for (const dataList of result.partnerData.values()) {
      for (const d of dataList) {
        totalRevenue += d.revenue
        totalCosts += d.totalCosts
      }
    }

    return {
      partnerData: result.partnerData,
      overheadData: result.overheadData,
      months,
      totalRevenue,
      totalCosts,
      totalProfit: totalRevenue - totalCosts,
    }
  }, [allBookings, analyzed])

  const distribution = useMemo(() => {
    if (!analyzed || partnerData.size === 0) return null
    return calculateDistribution(partnerData, priorYearConfig)
  }, [analyzed, partnerData, priorYearConfig])

  const setFiles = useCallback((newFiles: UploadedFile[]) => {
    setFilesState(newFiles)
  }, [])

  const analyze = useCallback(() => {
    setAnalyzed(true)
    setActiveView('overview')
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ files }))
    } catch { /* ignore */ }
  }, [files])

  const setPriorYearConfig = useCallback((config: PriorYearConfig) => {
    setPriorYearConfigState(config)
    try {
      localStorage.setItem(PRIOR_YEAR_KEY, JSON.stringify(config))
    } catch { /* ignore */ }
  }, [])

  const clearData = useCallback(() => {
    setFilesState([])
    setAnalyzed(false)
    setActiveView('upload')
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = {
    files, allBookings, partnerData, overheadData, distribution,
    priorYearConfig, activeView, selectedPartner, months,
    totalRevenue, totalCosts, totalProfit,
    setFiles, analyze, setActiveView, setSelectedPartner,
    setPriorYearConfig, clearData,
  }

  return <SengerContext.Provider value={value}>{children}</SengerContext.Provider>
}
