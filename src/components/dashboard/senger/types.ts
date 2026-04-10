export type FileType = 'fibu' | 'ra-micro' | 'lohn' | 'umbuchungen' | 'unknown'

export interface DATEVMetadata {
  fileType: FileType
  month: number
  year: number
  description: string
  consultant: string
  client: string
}

export interface DATEVBooking {
  amount: number
  isDebit: boolean
  account: number
  counterAccount: number
  date: string
  description: string
  costCenter: string
  month: number
  year: number
  fileType: FileType
}

export interface UploadedFile {
  name: string
  metadata: DATEVMetadata
  bookings: DATEVBooking[]
  rowCount: number
}

export interface PartnerMonthData {
  partner: string
  month: number
  year: number
  revenue: number
  costs: Record<string, number>
  totalCosts: number
  profit: number
  neutralExpenses: number
  neutralIncome: number
  preliminaryResult: number
  withdrawals: number
  deposits: number
  distributions: number
}

export interface DistributionResult {
  totalRevenue: number
  totalCosts: number
  totalProfit: number
  totalPreliminaryResult: number
  total20: number
  total80: number
  perHeadShare: number
  reserveTotal: number
  reservePerPartner: number
  operatingExpenses2025: number
  partners: PartnerDistribution[]
}

export interface PartnerDistribution {
  partner: string
  revenue: number
  totalCosts: number
  profit: number
  neutralExpenses: number
  neutralIncome: number
  preliminaryResult: number
  deckungsbeitrag: number
  headShare: number
  performanceShare: number
  totalDistribution: number
  withdrawals: number
  deposits: number
  distributions: number
  gesellschafterSum: number
  saldoMid: number
  reservePerPartner: number
  lossCarryforward: number
  priorYearBalance: number
  saldo: number
}

export type AccountType = 'revenue' | 'cost' | 'withdrawal' | 'deposit' | 'distribution' | 'neutral_expense' | 'neutral_income' | 'bank' | 'other'

export type DashboardView = 'upload' | 'overview' | 'partner' | 'costs' | 'distribution'
