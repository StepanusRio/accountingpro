'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ReportsPage() {
  const { data: reports, error } = useSWR('/api/reports')
  const [activeTab, setActiveTab] = useState('tb')

  // Page title
  useEffect(() => { document.title = 'Laporan Keuangan · Akuntansi Pro' }, [])

  if (error) return <div className="error-banner">Gagal memuat laporan.</div>
  if (!reports) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-10 w-96" />
      <div className="skeleton h-64 w-full" />
    </div>
  )

  const { trialBalance, incomeStatement, balanceSheet } = reports

  const tabs = [
    { key: 'tb', label: 'Neraca Lajur' },
    { key: 'is', label: 'Laba Rugi' },
    { key: 'bs', label: 'Neraca' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Laporan Keuangan</h2>
        <p className="page-subtitle">Neraca Lajur, Laba/Rugi, dan Neraca.</p>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Trial Balance ═══ */}
      {activeTab === 'tb' && (
        <div className="table-container">
          <div className="px-5 py-3 border-b border-border-default bg-surface-overlay">
            <h3 className="text-sm font-semibold text-text-primary">Neraca Lajur (Trial Balance)</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Akun</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance.map((item: { account: { id: string; kode: string; nama: string; saldoNormal: string }; balance: number }) => (
                <tr key={item.account.id}>
                  <td className="font-medium text-text-primary nums">{item.account.kode}</td>
                  <td className="text-text-primary">{item.account.nama}</td>
                  <td className="text-right nums text-text-primary">
                    {item.account.saldoNormal === 'Debit'
                      ? item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })
                      : <span className="text-text-muted">—</span>
                    }
                  </td>
                  <td className="text-right nums text-text-primary">
                    {item.account.saldoNormal === 'Kredit'
                      ? item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })
                      : <span className="text-text-muted">—</span>
                    }
                  </td>
                </tr>
              ))}
              {trialBalance.length === 0 && (
                <tr><td colSpan={4} className="!text-center !py-12 text-text-muted">Belum ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ Income Statement ═══ */}
      {activeTab === 'is' && (
        <div className="card max-w-2xl mx-auto">
          <div className="px-6 py-4 border-b border-border-default bg-surface-overlay rounded-t-[14px]">
            <h3 className="text-sm font-semibold text-text-primary text-center">Laporan Laba Rugi</h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Revenue */}
            <div>
              <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Pendapatan</h4>
              <div className="space-y-2">
                {incomeStatement.revenue.map((item: { account: { id: string; nama: string }; balance: number }) => (
                  <div key={item.account.id} className="flex justify-between text-[13px]">
                    <span className="text-text-secondary">{item.account.nama}</span>
                    <span className="text-text-primary nums">{item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {incomeStatement.revenue.length === 0 && <p className="text-[13px] text-text-muted">—</p>}
              </div>
              <div className="flex justify-between text-[13px] font-semibold text-text-primary mt-3 pt-2 border-t border-border-subtle">
                <span>Total Pendapatan</span>
                <span className="nums">{incomeStatement.totalRevenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Expenses */}
            <div>
              <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Beban</h4>
              <div className="space-y-2">
                {incomeStatement.expenses.map((item: { account: { id: string; nama: string }; balance: number }) => (
                  <div key={item.account.id} className="flex justify-between text-[13px]">
                    <span className="text-text-secondary">{item.account.nama}</span>
                    <span className="text-text-primary nums">{item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {incomeStatement.expenses.length === 0 && <p className="text-[13px] text-text-muted">—</p>}
              </div>
              <div className="flex justify-between text-[13px] font-semibold text-text-primary mt-3 pt-2 border-t border-border-subtle">
                <span>Total Beban</span>
                <span className="nums">{incomeStatement.totalExpense.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Net Income */}
            <div className={`flex justify-between items-center p-4 rounded-lg text-base font-bold ${
              incomeStatement.netIncome >= 0
                ? 'bg-success-muted text-success'
                : 'bg-danger-muted text-danger'
            }`}>
              <span>{incomeStatement.netIncome >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}</span>
              <span className="nums">Rp {incomeStatement.netIncome.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Balance Sheet ═══ */}
      {activeTab === 'bs' && (
        <div className="card max-w-4xl mx-auto">
          <div className="px-6 py-4 border-b border-border-default bg-surface-overlay rounded-t-[14px]">
            <h3 className="text-sm font-semibold text-text-primary text-center">Neraca (Balance Sheet)</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-8">
              {/* Assets */}
              <div>
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Aset</h4>
                <div className="space-y-2 mb-4">
                  {balanceSheet.assets.map((item: { account: { id: string; nama: string }; balance: number }) => (
                    <div key={item.account.id} className="flex justify-between text-[13px]">
                      <span className="text-text-secondary">{item.account.nama}</span>
                      <span className="text-text-primary nums">{item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {balanceSheet.assets.length === 0 && <p className="text-[13px] text-text-muted">—</p>}
                </div>
                <div className="flex justify-between text-[13px] font-bold text-text-primary pt-3 border-t border-border-default">
                  <span>Total Aset</span>
                  <span className="nums">{balanceSheet.totalAssets.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Liabilities & Equity */}
              <div>
                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Kewajiban</h4>
                <div className="space-y-2 mb-4">
                  {balanceSheet.liabilities.map((item: { account: { id: string; nama: string }; balance: number }) => (
                    <div key={item.account.id} className="flex justify-between text-[13px]">
                      <span className="text-text-secondary">{item.account.nama}</span>
                      <span className="text-text-primary nums">{item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {balanceSheet.liabilities.length === 0 && <p className="text-[13px] text-text-muted">—</p>}
                </div>
                <div className="flex justify-between text-[13px] font-semibold text-text-primary pt-2 border-t border-border-subtle mb-6">
                  <span>Total Kewajiban</span>
                  <span className="nums">{balanceSheet.totalLiabilities.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                </div>

                <h4 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Ekuitas</h4>
                <div className="space-y-2 mb-2">
                  {balanceSheet.equity.map((item: { account: { id: string; nama: string }; balance: number }) => (
                    <div key={item.account.id} className="flex justify-between text-[13px]">
                      <span className="text-text-secondary">{item.account.nama}</span>
                      <span className="text-text-primary nums">{item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                  {balanceSheet.equity.length === 0 && <p className="text-[13px] text-text-muted">—</p>}
                  <div className="flex justify-between text-[13px] text-text-muted italic">
                    <span>Laba/Rugi Berjalan</span>
                    <span className="nums">{incomeStatement.netIncome.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="flex justify-between text-[13px] font-bold text-text-primary pt-3 border-t border-border-default">
                  <span>Total Ekuitas</span>
                  <span className="nums">{balanceSheet.totalEquity.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Balance Check */}
            <div className={`mt-8 flex items-center justify-between p-4 rounded-lg text-sm font-bold ${
              balanceSheet.isBalanced
                ? 'bg-success-muted text-success'
                : 'bg-danger-muted text-danger'
            }`}>
              <div className="flex items-center gap-2">
                {balanceSheet.isBalanced
                  ? <CheckCircle2 className="h-4 w-4" />
                  : <AlertTriangle className="h-4 w-4" />
                }
                <span>Aset: <span className="nums">Rp {balanceSheet.totalAssets.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span></span>
              </div>
              <span>Kewajiban + Ekuitas: <span className="nums">Rp {(balanceSheet.totalLiabilities + balanceSheet.totalEquity).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span></span>
            </div>
            {!balanceSheet.isBalanced && (
              <p className="text-danger text-[12px] mt-2 text-center font-medium">Neraca tidak seimbang!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
