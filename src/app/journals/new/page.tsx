'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { Plus, Trash2, ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { io } from 'socket.io-client'
import { useToast } from '@/components/Toast'

export default function NewJournalPage() {
  const router = useRouter()
  const { data: accounts } = useSWR('/api/accounts')
  const { data: auxAccounts } = useSWR('/api/aux-accounts')
  const { showToast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  // Page title
  useEffect(() => { document.title = 'Entri Jurnal Baru · Akuntansi Pro' }, [])

  const [formData, setFormData] = useState(() => ({
    transactionId: `TRX-${Date.now()}`,
    tanggal: new Date().toISOString().split('T')[0],
    bukti: '',
    keterangan: ''
  }))

  const [lines, setLines] = useState([
    { accountId: '', auxiliaryAccountId: '', debit: 0, kredit: 0 },
    { accountId: '', auxiliaryAccountId: '', debit: 0, kredit: 0 }
  ])

  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Ctrl+S / Cmd+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAddLine = () => {
    setLines([...lines, { accountId: '', auxiliaryAccountId: '', debit: 0, kredit: 0 }])
  }

  const handleRemoveLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index))
  }

  const handleLineChange = (index: number, field: 'accountId' | 'auxiliaryAccountId' | 'debit' | 'kredit', value: string | number) => {
    const newLines = [...lines]
    newLines[index] = { ...newLines[index], [field]: value }

    // Auto-balance logic: if typing debit, zero out credit and vice versa
    if (field === 'debit') newLines[index].kredit = 0
    if (field === 'kredit') newLines[index].debit = 0

    setLines(newLines)
  }

  const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0)
  const totalCredit = lines.reduce((sum, line) => sum + Number(line.kredit || 0), 0)
  const isBalanced = totalDebit === totalCredit && totalDebit > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!isBalanced) {
      setErrorMsg('Total Debit dan Kredit harus sama dan tidak boleh nol.')
      return
    }

    // Filter empty lines
    const validLines = lines.filter(l => l.accountId && (Number(l.debit) > 0 || Number(l.kredit) > 0))
    if (validLines.length < 2) {
      setErrorMsg('Minimal harus ada dua baris jurnal yang valid.')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        lines: validLines
      }

      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan jurnal')

      // Emit socket event then disconnect
      const socket = io(window.location.origin)
      socket.emit('new_journal_entry', data)
      socket.disconnect()

      showToast('Jurnal berhasil disimpan', 'success')
      router.push('/journals')
    } catch (err: unknown) {
      setErrorMsg((err as Error).message)
      showToast((err as Error).message, 'error')
      setIsSubmitting(false)
    }
  }

  if (!accounts) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-48 w-full" />
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/journals" className="btn btn-ghost p-2" aria-label="Kembali ke daftar jurnal">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="page-title">Entri Jurnal Baru</h2>
          <p className="page-subtitle">Buat transaksi jurnal umum.</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Fields */}
        <div className="card p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">ID Transaksi</label>
              <input required type="text" value={formData.transactionId} onChange={e => setFormData({...formData, transactionId: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Tanggal</label>
              <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">No. Bukti</label>
              <input required type="text" value={formData.bukti} onChange={e => setFormData({...formData, bukti: e.target.value})} className="input" placeholder="BKK-001" />
            </div>
            <div>
              <label className="label">Keterangan</label>
              <input type="text" value={formData.keterangan} onChange={e => setFormData({...formData, keterangan: e.target.value})} className="input" placeholder="Opsional" />
            </div>
          </div>
        </div>

        {/* Lines Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="w-[30%]">Akun</th>
                <th className="w-[22%]">Buku Pembantu</th>
                <th className="w-[18%] text-right">Debit</th>
                <th className="w-[18%] text-right">Kredit</th>
                <th className="w-[48px]"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, index) => (
                <tr key={index}>
                  <td>
                    <select
                      required={line.debit > 0 || line.kredit > 0}
                      value={line.accountId}
                      onChange={e => handleLineChange(index, 'accountId', e.target.value)}
                      className="input"
                    >
                      <option value="">Pilih Akun</option>
                      {accounts.map((acc: { id: string; kode: string; nama: string }) => (
                        <option key={acc.id} value={acc.id}>{acc.kode} · {acc.nama}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={line.auxiliaryAccountId}
                      onChange={e => handleLineChange(index, 'auxiliaryAccountId', e.target.value)}
                      className="input"
                    >
                      <option value="">Kosong</option>
                      {auxAccounts?.map((aux: { id: string; kode: string; nama: string }) => (
                        <option key={aux.id} value={aux.id}>{aux.kode} · {aux.nama}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.debit === 0 ? '' : line.debit}
                      onChange={e => handleLineChange(index, 'debit', parseFloat(e.target.value) || 0)}
                      className="input text-right nums"
                      placeholder="0.00"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={line.kredit === 0 ? '' : line.kredit}
                      onChange={e => handleLineChange(index, 'kredit', parseFloat(e.target.value) || 0)}
                      className="input text-right nums"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(index)}
                      className="btn btn-danger p-1.5"
                      aria-label={`Hapus baris ${index + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <button type="button" onClick={handleAddLine} className="text-[13px] text-accent-400 hover:text-accent-300 font-medium inline-flex items-center gap-1 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Baris
                  </button>
                </td>
                <td className="text-right nums">{totalDebit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                <td className="text-right nums">{totalCredit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Balance Indicator */}
        <div className={`flex items-center gap-2 text-[13px] font-medium ${isBalanced ? 'text-success' : totalDebit > 0 || totalCredit > 0 ? 'text-danger' : 'text-text-muted'}`}>
          {isBalanced ? (
            <><CheckCircle2 className="h-4 w-4" /> Seimbang. Siap disimpan</>
          ) : (totalDebit > 0 || totalCredit > 0) ? (
            <><AlertCircle className="h-4 w-4" /> Selisih: Rp {Math.abs(totalDebit - totalCredit).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</>
          ) : (
            'Masukkan baris jurnal untuk memulai'
          )}
        </div>

        {/* Error */}
        {errorMsg && <div className="error-banner flex items-center gap-2"><AlertCircle className="h-4 w-4 flex-shrink-0" />{errorMsg}</div>}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-text-muted">Ctrl+S untuk menyimpan</p>
          <div className="flex gap-3">
            <Link href="/journals" className="btn btn-ghost">Batal</Link>
            <button
              type="submit"
              disabled={!isBalanced || isSubmitting}
              className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
