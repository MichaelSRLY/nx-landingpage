import type { PartnerMonthData, DistributionResult, PartnerDistribution } from '../types'
import {
  PARTNERS, HEAD_SHARE_PCT, PERFORMANCE_SHARE_PCT,
  OPERATING_EXPENSES_2025,
} from '../constants'

export interface PriorYearConfig {
  balances: Record<string, number>       // Saldo 2025 per partner
  lossCarryforwards: Record<string, number>  // Verlustvortrag 2024 per partner
}

export function calculateDistribution(
  partnerData: Map<string, PartnerMonthData[]>,
  config: PriorYearConfig
): DistributionResult {
  const partnerCount = PARTNERS.length

  // Aggregate per partner across all months
  const partnerTotals = new Map<string, {
    revenue: number
    totalCosts: number
    profit: number
    neutralExpenses: number
    neutralIncome: number
    preliminaryResult: number
    withdrawals: number
    deposits: number
    distributions: number
  }>()

  for (const partnerCode of PARTNERS) {
    const monthlyData = partnerData.get(partnerCode) || []
    const totals = {
      revenue: 0,
      totalCosts: 0,
      profit: 0,
      neutralExpenses: 0,
      neutralIncome: 0,
      preliminaryResult: 0,
      withdrawals: 0,
      deposits: 0,
      distributions: 0,
    }
    for (const d of monthlyData) {
      totals.revenue += d.revenue
      totals.totalCosts += d.totalCosts
      totals.profit += d.profit
      totals.neutralExpenses += d.neutralExpenses
      totals.neutralIncome += d.neutralIncome
      totals.preliminaryResult += d.preliminaryResult
      totals.withdrawals += d.withdrawals
      totals.deposits += d.deposits
      totals.distributions += d.distributions
    }
    partnerTotals.set(partnerCode, totals)
  }

  // Total preliminary result across all partners
  const totalPreliminaryResult = Array.from(partnerTotals.values())
    .reduce((sum, t) => sum + t.preliminaryResult, 0)

  const totalRevenue = Array.from(partnerTotals.values())
    .reduce((sum, t) => sum + t.revenue, 0)

  const totalCosts = Array.from(partnerTotals.values())
    .reduce((sum, t) => sum + t.totalCosts, 0)

  // 20% per-head allocation (from total preliminary result)
  const total20 = totalPreliminaryResult * HEAD_SHARE_PCT
  const perHeadShare = total20 / partnerCount

  // 80% performance allocation
  const total80 = totalPreliminaryResult * PERFORMANCE_SHARE_PCT

  // Reserve: 2 months of 2025 operating expenses / 7
  // OPERATING_EXPENSES_2025 is negative (costs), so reserve is negative (withheld)
  const monthlyOpex = OPERATING_EXPENSES_2025 / 12
  const reserveTotal = monthlyOpex * 2 // negative
  const reservePerPartner = reserveTotal / partnerCount // negative

  const partners: PartnerDistribution[] = PARTNERS.map(code => {
    const t = partnerTotals.get(code)!
    const priorBalance = config.balances[code] || 0
    const lossCarry = config.lossCarryforwards[code] || 0

    // Deckungsbeitrag: partner's share of total result
    const deckungsbeitrag = totalPreliminaryResult !== 0
      ? t.preliminaryResult / totalPreliminaryResult
      : 0

    // 80% share based on Deckungsbeitrag
    const performanceShare = total80 * deckungsbeitrag

    // Total profit allocation
    const totalDistribution = perHeadShare + performanceShare

    // Summe Gesellschafter = Einlagen - Entnahmen - Gewinnausschüttung
    const gesellschafterSum = t.deposits - t.withdrawals - t.distributions

    // Mid-period Saldo = profit allocation + partner transactions
    const saldoMid = totalDistribution + gesellschafterSum

    // FINAL Saldo = saldoMid + reserve + loss carryforward + prior year balance
    const saldo = totalDistribution + gesellschafterSum + reservePerPartner + lossCarry + priorBalance

    return {
      partner: code,
      revenue: t.revenue,
      totalCosts: t.totalCosts,
      profit: t.profit,
      neutralExpenses: t.neutralExpenses,
      neutralIncome: t.neutralIncome,
      preliminaryResult: t.preliminaryResult,
      deckungsbeitrag,
      headShare: perHeadShare,
      performanceShare,
      totalDistribution,
      withdrawals: t.withdrawals,
      deposits: t.deposits,
      distributions: t.distributions,
      gesellschafterSum,
      saldoMid,
      reservePerPartner,
      lossCarryforward: lossCarry,
      priorYearBalance: priorBalance,
      saldo,
    }
  })

  return {
    totalRevenue,
    totalCosts,
    totalProfit: totalRevenue - totalCosts,
    totalPreliminaryResult,
    total20,
    total80,
    perHeadShare,
    reserveTotal,
    reservePerPartner,
    operatingExpenses2025: OPERATING_EXPENSES_2025,
    partners,
  }
}
