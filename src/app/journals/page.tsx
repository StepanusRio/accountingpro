'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Plus, FileText } from 'lucide-react'

export default function JournalsPage() {
  const { data: journals, error } = useSWR('/api/journals')

  // Page title
  useEffect(() => { document.title = 'Jurnal Umum · Akuntansi Pro' }, [])

  if (error) return <div className="error-banner">Gagal memuat jurnal.</div>
  if (!journals) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-32 w-full" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Jurnal Umum</h2>
          <p className="page-subtitle">Daftar transaksi jurnal umum.</p>
        </div>
        <Link href="/journals/new" className="btn btn-primary">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Entri Jurnal Baru
        </Link>
      </div>

      <div className="space-y-4">
        {journals.map((journal: { id: string; transactionId: string; tanggal: string; bukti: string; keterangan: string; lines: Array<{ id: string; account: { kode: string; nama: string }; auxiliaryAccount?: { nama: string }; debit: string; kredit: string }> }) => (
          <div key={journal.id} className="card overflow-hidden">
            {/* Journal Header */}
            <div className="flex items-center justify-between gap-4 px-5 py-3 bg-surface-overlay border-b border-border-default">
              <div className="flex items-center gap-5 text-[13px]">
                <span className="font-semibold text-text-primary nums">{journal.transactionId}</span>
                <span className="text-text-muted">
                  {new Date(journal.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-text-muted">Bukti: <span className="text-text-secondary">{journal.bukti}</span></span>
              </div>
              {journal.keterangan && (
                <span className="text-[12px] text-text-muted truncate max-w-xs" title={journal.keterangan}>
                  {journal.keterangan}
                </span>
              )}
            </div>

            {/* Journal Lines */}
            <table className="table">
              <thead>
                <tr>
                  <th>Akun</th>
                  <th className="text-right">Debit</th>
                  <th className="text-right">Kredit</th>
                </tr>
              </thead>
              <tbody>
                {journal.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="text-text-primary">
                      <span className="font-medium nums">{line.account?.kode}</span>
                      <span className="text-text-secondary"> · {line.account?.nama}</span>
                      {line.auxiliaryAccount && (
                        <span className="ml-2 text-[11px] text-text-muted">({line.auxiliaryAccount.nama})</span>
                      )}
                    </td>
                    <td className="text-right text-text-primary nums">
                      {parseFloat(line.debit) > 0 ? parseFloat(line.debit).toLocaleString('id-ID', { minimumFractionDigits: 2 }) : <span className="text-text-muted">0,00</span>}
                    </td>
                    <td className="text-right text-text-primary nums">
                      {parseFloat(line.kredit) > 0 ? parseFloat(line.kredit).toLocaleString('id-ID', { minimumFractionDigits: 2 }) : <span className="text-text-muted">0,00</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {journals.length === 0 && (
          <div className="card empty-state">
            <FileText className="h-12 w-12" strokeWidth={1} />
            <p className="text-[13px]">Belum ada jurnal.</p>
          </div>
        )}
      </div>
    </div>
  )
}
