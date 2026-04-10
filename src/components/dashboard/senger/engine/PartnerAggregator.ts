import type { DATEVBooking, PartnerMonthData } from '../types'
import { getSignedAmount } from './AccountClassifier'
import { PARTNERS, OVERHEAD_COST_CENTER, ACCOUNT_TO_GROUP, COST_GROUP_ORDER } from '../constants'

export function aggregateByPartner(bookings: DATEVBooking[]): {
  partnerData: Map<string, PartnerMonthData[]>
  overheadData: PartnerMonthData[]
  allData: PartnerMonthData[]
} {
  const aggregation = new Map<string, PartnerMonthData>()

  function getKey(partner: string, month: number, year: number) {
    return `${partner}-${month}-${year}`
  }

  function getOrCreate(partner: string, month: number, year: number): PartnerMonthData {
    const key = getKey(partner, month, year)
    let data = aggregation.get(key)
    if (!data) {
      data = {
        partner,
        month,
        year,
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
      // Initialize all cost groups to 0
      for (const group of COST_GROUP_ORDER) {
        data.costs[group] = 0
      }
      aggregation.set(key, data)
    }
    return data
  }

  for (const booking of bookings) {
    const costCenter = booking.costCenter || ''

    const { value, type } = getSignedAmount(
      booking.amount,
      booking.isDebit,
      booking.account,
      booking.counterAccount
    )

    // Handle partner transactions (withdrawals, deposits, distributions)
    if (type === 'withdrawal' || type === 'deposit' || type === 'distribution') {
      const partner = costCenter || 'UNKNOWN'
      if (partner === 'UNKNOWN') continue
      const data = getOrCreate(partner, booking.month, booking.year)
      if (type === 'withdrawal') {
        data.withdrawals += Math.abs(value)
      } else if (type === 'deposit') {
        data.deposits += Math.abs(value)
      } else {
        data.distributions += Math.abs(value)
      }
      continue
    }

    if (!costCenter) continue

    const data = getOrCreate(costCenter, booking.month, booking.year)

    if (type === 'revenue') {
      data.revenue += value
    } else if (type === 'cost') {
      // Map to cost group
      const costAccount = booking.account >= 4000 && booking.account <= 4999
        ? booking.account
        : booking.counterAccount
      const group = ACCOUNT_TO_GROUP[costAccount] || 'Sonstige Kosten'
      data.costs[group] = (data.costs[group] || 0) + Math.abs(value)
      data.totalCosts += Math.abs(value)
    } else if (type === 'neutral_expense') {
      data.neutralExpenses += Math.abs(value)
    } else if (type === 'neutral_income') {
      data.neutralIncome += Math.abs(value)
    }
  }

  // Calculate derived values
  for (const data of aggregation.values()) {
    data.profit = data.revenue - data.totalCosts
    data.preliminaryResult = data.profit - data.neutralExpenses + data.neutralIncome
  }

  const partnerData = new Map<string, PartnerMonthData[]>()
  const overheadData: PartnerMonthData[] = []
  const allData: PartnerMonthData[] = []

  for (const data of aggregation.values()) {
    allData.push(data)
    if (data.partner === OVERHEAD_COST_CENTER) {
      overheadData.push(data)
    } else if ((PARTNERS as readonly string[]).includes(data.partner)) {
      if (!partnerData.has(data.partner)) {
        partnerData.set(data.partner, [])
      }
      partnerData.get(data.partner)!.push(data)
    }
  }

  return { partnerData, overheadData, allData }
}
