import type { PartnerMonthData } from '../types'
import { PARTNERS, COST_GROUP_ORDER } from '../constants'

export function allocateOverhead(
  partnerData: Map<string, PartnerMonthData[]>,
  overheadData: PartnerMonthData[]
): void {
  const partnerCount = PARTNERS.length

  for (const overhead of overheadData) {
    for (const partnerCode of PARTNERS) {
      let partnerMonths = partnerData.get(partnerCode)
      if (!partnerMonths) {
        partnerMonths = []
        partnerData.set(partnerCode, partnerMonths)
      }

      let monthData = partnerMonths.find(
        d => d.month === overhead.month && d.year === overhead.year
      )

      if (!monthData) {
        monthData = {
          partner: partnerCode,
          month: overhead.month,
          year: overhead.year,
          revenue: 0,
          costs: {},
          totalCosts: 0,
          profit: 0,
          neutralExpenses: 0,
          neutralIncome: 0,
          preliminaryResult: 0,
          withdrawals: 0,
          deposits: 0,
          distributions: 0,
        }
        for (const group of COST_GROUP_ORDER) {
          monthData.costs[group] = 0
        }
        partnerMonths.push(monthData)
      }

      // Allocate revenue share
      monthData.revenue += overhead.revenue / partnerCount

      // Allocate each cost group
      for (const [group, amount] of Object.entries(overhead.costs)) {
        const share = amount / partnerCount
        monthData.costs[group] = (monthData.costs[group] || 0) + share
        monthData.totalCosts += share
      }

      // Allocate neutral items
      monthData.neutralExpenses += overhead.neutralExpenses / partnerCount
      monthData.neutralIncome += overhead.neutralIncome / partnerCount

      // Recalculate derived values
      monthData.profit = monthData.revenue - monthData.totalCosts
      monthData.preliminaryResult = monthData.profit - monthData.neutralExpenses + monthData.neutralIncome
    }
  }
}
