import type { AccountType } from '../types'
import {
  REVENUE_ACCOUNT_MIN, REVENUE_ACCOUNT_MAX,
  COST_ACCOUNT_MIN, COST_ACCOUNT_MAX,
  WITHDRAWAL_ACCOUNT, DEPOSIT_ACCOUNT,
  NEUTRAL_EXPENSE_MIN, NEUTRAL_EXPENSE_MAX,
  NEUTRAL_INCOME_MIN, NEUTRAL_INCOME_MAX,
} from '../constants'

export function classifyAccount(account: number): AccountType {
  if (account >= REVENUE_ACCOUNT_MIN && account <= REVENUE_ACCOUNT_MAX) return 'revenue'
  if (account >= COST_ACCOUNT_MIN && account <= COST_ACCOUNT_MAX) return 'cost'
  if (account === WITHDRAWAL_ACCOUNT) return 'withdrawal'
  if (account === DEPOSIT_ACCOUNT) return 'deposit'
  if (account >= NEUTRAL_EXPENSE_MIN && account <= NEUTRAL_EXPENSE_MAX) return 'neutral_expense'
  if (account >= NEUTRAL_INCOME_MIN && account <= NEUTRAL_INCOME_MAX) return 'neutral_income'
  if (account >= 1200 && account <= 1399) return 'bank'
  return 'other'
}

export function getSignedAmount(
  amount: number,
  isDebit: boolean,
  account: number,
  counterAccount: number
): { value: number; type: AccountType } {
  const accountType = classifyAccount(account)
  const counterType = classifyAccount(counterAccount)

  // Direct account classification
  if (accountType === 'revenue') {
    return { value: isDebit ? -amount : amount, type: 'revenue' }
  }
  if (accountType === 'cost') {
    return { value: isDebit ? amount : -amount, type: 'cost' }
  }
  if (accountType === 'withdrawal') {
    return { value: isDebit ? amount : -amount, type: 'withdrawal' }
  }
  if (accountType === 'deposit') {
    return { value: isDebit ? -amount : amount, type: 'deposit' }
  }
  if (accountType === 'neutral_expense') {
    return { value: isDebit ? amount : -amount, type: 'neutral_expense' }
  }
  if (accountType === 'neutral_income') {
    return { value: isDebit ? -amount : amount, type: 'neutral_income' }
  }

  // Counter-account classification
  if (counterType === 'revenue') {
    return { value: isDebit ? amount : -amount, type: 'revenue' }
  }
  if (counterType === 'cost') {
    return { value: isDebit ? -amount : amount, type: 'cost' }
  }
  if (counterType === 'withdrawal') {
    return { value: isDebit ? -amount : amount, type: 'withdrawal' }
  }
  if (counterType === 'deposit') {
    return { value: isDebit ? amount : -amount, type: 'deposit' }
  }
  if (counterType === 'neutral_expense') {
    return { value: isDebit ? -amount : amount, type: 'neutral_expense' }
  }
  if (counterType === 'neutral_income') {
    return { value: isDebit ? amount : -amount, type: 'neutral_income' }
  }

  return { value: amount, type: 'other' }
}
