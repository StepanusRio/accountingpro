'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Search } from 'lucide-react'

export default function LedgerPage() {
  const { data: accounts } = useSWR('/api/accounts')
  const { data: journals, error } = useSWR('/api/journals')

  const [selectedAccountId, setSelectedAccountId] = useState('')

  // Page title
  useEffect(() => { document.title = 'Buku Besar · Akuntansi Pro' }, [])

  if (error) return <div className="error-banner">Gagal memuat data buku besar.</div>
  if (!accounts || !journals) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-12 w-96" />
      <div className="skeleton h-48 w-full" />
    </div>
  )

  const selectedAccount = accounts.find((a: { id: string; kode: string; nama: string; saldoNormal: string }) => a.id === selectedAccountId)

  // Filter journal lines for the selected account
  const ledgerEntries = journals
    .slice()
    .reverse()
    .flatMap((journal: { lines: Array<{ accountId: string; debit: string; kredit: string }>; tanggal: string; bukti: string; keterangan: string; transactionId: string }) =>
      journal.lines
        .filter((line: { accountId: string }) => line.accountId === selectedAccountId)
        .map((line: { debit: string; kredit: string }) => ({
          ...line,
          tanggal: journal.tanggal,
          bukti: journal.bukti,
          keterangan: journal.keterangan,
          transactionId: journal.transactionId
        }))
    )
    .sort((a: { tanggal: string }, b: { tanggal: string }) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .reduce((acc: Array<{ debit: string; kredit: string; tanggal: string; bukti: string; keterangan: string; balance: number }>, entry: { debit: string; kredit: string; tanggal: string; bukti: string; keterangan: string }) => {
      const debit = parseFloat(entry.debit) || 0
      const kredit = parseFloat(entry.kredit) || 0
      const previousBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0
      let newBalance = previousBalance

      if (selectedAccount?.saldoNormal === 'Debit') {
        newBalance += (debit - kredit)
      } else {
        newBalance += (kredit - debit)
      }

      acc.push({ ...entry, balance: newBalance })
      return acc
    }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Buku Besar</h2>
        <p className="page-subtitle">Lihat mutasi per akun.</p>
      </div>

      {/* Account Selector */}
      <div className="card p-5">
        <label className="label">Pilih Akun</label>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <select
            value={selectedAccountId}
            onChange={e => setSelectedAccountId(e.target.value)}
            className="input pl-9"
          >
            <option value="">Pilih Akun</option>
            {accounts.map((acc: { id: string; kode: string; nama: string }) => (
              <option key={acc.id} value={acc.id}>{acc.kode} · {acc.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      {selectedAccount && (
        <div className="table-container">
          <div className="px-5 py-3 border-b border-border-default bg-surface-overlay">
            <h3 className="text-sm font-semibold text-text-primary">
              <span className="nums">{selectedAccount.kode}</span> · {selectedAccount.nama}
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Saldo Normal: <span className="text-text-secondary font-medium">{selectedAccount.saldoNormal}</span>
            </p>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>No. Bukti</th>
                <th>Keterangan</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Kredit</th>
                <th className="text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map((entry: { tanggal: string; bukti: string; keterangan: string; debit: string; kredit: string; balance: number }, idx: number) => (
                <tr key={idx}>
                  <td className="whitespace-nowrap nums">{new Date(entry.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="text-text-primary">{entry.bukti}</td>
                  <td>{entry.keterangan || <span className="text-text-muted">Tanpa keterangan</span>}</td>
                  <td className="text-right text-text-primary nums">
                    {parseFloat(entry.debit) > 0 ? parseFloat(entry.debit).toLocaleString('id-ID', { minimumFractionDigits: 2 }) : <span className="text-text-muted">0,00</span>}
                  </td>
                  <td className="text-right text-text-primary nums">
                    {parseFloat(entry.kredit) > 0 ? parseFloat(entry.kredit).toLocaleString('id-ID', { minimumFractionDigits: 2 }) : <span className="text-text-muted">0,00</span>}
                  </td>
                  <td className="text-right font-semibold text-text-primary nums">
                    {entry.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {ledgerEntries.length === 0 && (
                <tr>
                  <td colSpan={6} className="!text-center !py-12 text-text-muted">
                    Belum ada mutasi pada akun ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
