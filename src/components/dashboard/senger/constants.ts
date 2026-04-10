export const PARTNERS = ['AG', 'FR', 'LG', 'MC', 'MG', 'SR', 'US'] as const
export type PartnerCode = typeof PARTNERS[number]

export const OVERHEAD_COST_CENTER = '9999'

export const MONTH_LABELS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'] as const

// Cost category GROUPS matching the Excel structure exactly
export const COST_GROUPS: Record<string, number[]> = {
  'Personalkosten': [4000, 4120, 4125, 4130, 4138, 4140, 4144, 4165, 4175, 4190, 4194, 4195, 4198, 4199],
  'Raumkosten': [4210, 4220, 4228, 4240, 4250],
  'Versich./Beiträge': [4360, 4380, 4390, 4396],
  'Fahrzeugkosten': [4510, 4520, 4530, 4540, 4570, 4580],
  'Werbe-/Reisekosten': [4600, 4630, 4650, 4653, 4654, 4660, 4663],
  'Abschreibungen': [4805, 4806, 4830, 4832, 4855],
  'Reparatur/Instandh.': [4909],
  'Sonstige Kosten': [4900, 4910, 4920, 4925, 4930, 4940, 4945, 4950, 4955, 4960, 4964, 4969, 4970, 4980],
}

export const COST_GROUP_ORDER = [
  'Personalkosten', 'Raumkosten', 'Versich./Beiträge', 'Fahrzeugkosten',
  'Werbe-/Reisekosten', 'Abschreibungen', 'Reparatur/Instandh.', 'Sonstige Kosten',
]

// Build reverse lookup: account number -> group name
export const ACCOUNT_TO_GROUP: Record<number, string> = {}
for (const [group, accounts] of Object.entries(COST_GROUPS)) {
  for (const account of accounts) {
    ACCOUNT_TO_GROUP[account] = group
  }
}

// Account ranges
export const REVENUE_ACCOUNT_MIN = 8000
export const REVENUE_ACCOUNT_MAX = 8999
export const COST_ACCOUNT_MIN = 4000
export const COST_ACCOUNT_MAX = 4999
export const NEUTRAL_EXPENSE_MIN = 2700 // Zinsaufwand etc
export const NEUTRAL_EXPENSE_MAX = 2799
export const NEUTRAL_INCOME_MIN = 9500 // Sonstige neutrale Erträge
export const NEUTRAL_INCOME_MAX = 9699
export const WITHDRAWAL_ACCOUNT = 1800 // Privatentnahmen
export const DEPOSIT_ACCOUNT = 1890 // Privateinlagen
export const DISTRIBUTION_ACCOUNTS = [1361, 1362, 1363] // Gewinnausschüttung (Gesellschafterkonten)

// Distribution rules
export const HEAD_SHARE_PCT = 0.20
export const PERFORMANCE_SHARE_PCT = 0.80
export const RESERVE_MONTHS = 2

// Prior year defaults from Vorjahre sheet
export const DEFAULT_PRIOR_YEAR_BALANCES: Record<string, number> = {
  AG: 47012.79,
  FR: -8038.50,
  LG: -24916.36,
  MC: -24223.54,
  MG: -44196.57,
  SR: -270.10,
  US: 20345.58,
}

export const DEFAULT_LOSS_CARRYFORWARDS: Record<string, number> = {
  AG: -3152.34,
  FR: -3152.34,
  LG: 11847.66,
  MC: 5157.53,
  MG: -3152.34,
  SR: 0,
  US: -3152.34,
}

export const OPERATING_EXPENSES_2025 = -869495.59 // Total 2025 operating expenses

// Design
export const GOLD = '#c8a97e'
export const COLORS = ['#c8a97e', '#8b7355', '#a0845c', '#6b5b45', '#d4b896', '#9e8c73', '#b8956a', '#7a6950', '#e0c9a6', '#5c4f3d']

export const fmt = (v: number, d = 2) =>
  v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d })

export const fmtK = (v: number) =>
  v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)
