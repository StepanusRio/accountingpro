import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const accounts = await prisma.account.findMany()
    const journals = await prisma.journalHeader.findMany({
      include: { lines: true }
    })

    // Calculate balances per account
    const accountBalances: Record<string, { account: { id: string; kode: string; nama: string; tipe: string; saldoNormal: string; reportMapping: string }, balance: number, debit: number, kredit: number }> = {}

    accounts.forEach(acc => {
      accountBalances[acc.id] = { account: acc, balance: 0, debit: 0, kredit: 0 }
    })

    journals.forEach(journal => {
      journal.lines.forEach(line => {
        const d = parseFloat(line.debit as unknown as string) || 0
        const k = parseFloat(line.kredit as unknown as string) || 0
        const accId = line.accountId
        
        if (accountBalances[accId]) {
          accountBalances[accId].debit += d
          accountBalances[accId].kredit += k
          
          if (accountBalances[accId].account.saldoNormal === 'Debit') {
            accountBalances[accId].balance += (d - k)
          } else {
            accountBalances[accId].balance += (k - d)
          }
        }
      })
    })

    // Trial Balance (Neraca Lajur)
    const trialBalance = Object.values(accountBalances).filter(ab => ab.balance !== 0 || ab.debit > 0 || ab.kredit > 0)

    // Income Statement (Laba Rugi)
    const revenueAccounts = trialBalance.filter(ab => ab.account.tipe === 'Pendapatan')
    const expenseAccounts = trialBalance.filter(ab => ab.account.tipe === 'Beban')
    
    const totalRevenue = revenueAccounts.reduce((sum, ab) => sum + ab.balance, 0)
    const totalExpense = expenseAccounts.reduce((sum, ab) => sum + ab.balance, 0)
    const netIncome = totalRevenue - totalExpense

    // Balance Sheet (Neraca)
    const assetAccounts = trialBalance.filter(ab => ab.account.tipe === 'Aset')
    const liabilityAccounts = trialBalance.filter(ab => ab.account.tipe === 'Kewajiban')
    const equityAccounts = trialBalance.filter(ab => ab.account.tipe === 'Ekuitas')

    const totalAssets = assetAccounts.reduce((sum, ab) => sum + ab.balance, 0)
    const totalLiabilities = liabilityAccounts.reduce((sum, ab) => sum + ab.balance, 0)
    const totalEquityRaw = equityAccounts.reduce((sum, ab) => sum + ab.balance, 0)
    const totalEquity = totalEquityRaw + netIncome // Add Net Income to Equity

    return NextResponse.json({
      trialBalance,
      incomeStatement: {
        revenue: revenueAccounts,
        expenses: expenseAccounts,
        totalRevenue,
        totalExpense,
        netIncome
      },
      balanceSheet: {
        assets: assetAccounts,
        liabilities: liabilityAccounts,
        equity: equityAccounts,
        totalAssets,
        totalLiabilities,
        totalEquityRaw,
        totalEquity,
        isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
      }
    })
  } catch {
    return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 })
  }
}
