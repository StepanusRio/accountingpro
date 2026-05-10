'use client'

import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'

type Account = {
  id: string
  kode: string
  nama: string
  tipe: string
  saldoNormal: string
  reportMapping: string
}

const tipeBadgeClass: Record<string, string> = {
  Aset: 'badge-info',
  Kewajiban: 'badge-warning',
  Ekuitas: 'badge-accent',
  Pendapatan: 'badge-success',
  Beban: 'badge-danger',
}

export default function AccountsPage() {
  const { data: accounts, error, mutate } = useSWR<Account[]>('/api/accounts')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Account>>({
    kode: '', nama: '', tipe: 'Aset', saldoNormal: 'Debit', reportMapping: 'Neraca'
  })
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nama: string } | null>(null)
  const { showToast } = useToast()
  const firstInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Page title
  useEffect(() => { document.title = 'Bagan Akun · Akuntansi Pro' }, [])

  // Focus first input when modal opens
  useEffect(() => {
    if (isModalOpen) firstInputRef.current?.focus()
  }, [isModalOpen])

  // Modal keyboard handlers (Escape + focus trap)
  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsModalOpen(false)
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  if (error) return <div className="error-banner">Gagal memuat data akun.</div>
  if (!accounts) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-64" />
      <div className="skeleton h-64 w-full" />
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to create account')
      setIsModalOpen(false)
      setFormData({ kode: '', nama: '', tipe: 'Aset', saldoNormal: 'Debit', reportMapping: 'Neraca' })
      mutate()
      showToast('Akun berhasil ditambahkan', 'success')
    } catch {
      showToast('Gagal menyimpan akun', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/accounts/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      mutate()
      showToast('Akun berhasil dihapus', 'success')
    } catch {
      showToast('Gagal menghapus akun. Mungkin akun ini masih digunakan di jurnal.', 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Bagan Akun</h2>
          <p className="page-subtitle">Kelola Chart of Accounts untuk jurnal umum.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah Akun
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Akun</th>
              <th>Tipe</th>
              <th>Saldo Normal</th>
              <th>Laporan</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="font-medium text-text-primary nums">{account.kode}</td>
                <td className="text-text-primary">{account.nama}</td>
                <td>
                  <span className={`badge ${tipeBadgeClass[account.tipe] || 'badge-accent'}`}>
                    {account.tipe}
                  </span>
                </td>
                <td>{account.saldoNormal}</td>
                <td>{account.reportMapping === 'LabaRugi' ? 'Laba/Rugi' : account.reportMapping}</td>
                <td className="text-right">
                  <button
                    onClick={() => setDeleteTarget({ id: account.id, nama: account.nama })}
                    className="btn btn-danger p-1.5"
                    aria-label={`Hapus akun ${account.nama}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr>
                <td colSpan={6} className="!text-center !py-12 text-text-muted">
                  Belum ada data akun.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Akun"
        message={`Apakah Anda yakin ingin menghapus akun "${deleteTarget?.nama}"? Akun yang sudah digunakan di jurnal tidak dapat dihapus.`}
        confirmLabel="Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Create Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-account"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div ref={modalRef} className="modal-content">
            <h3 id="modal-title-account" className="text-base font-semibold text-text-primary mb-5">Tambah Akun Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Kode Akun</label>
                <input ref={firstInputRef} required type="text" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} className="input" placeholder="Contoh: 1101" />
              </div>
              <div>
                <label className="label">Nama Akun</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="input" placeholder="Contoh: Kas" />
              </div>
              <div>
                <label className="label">Tipe</label>
                <select value={formData.tipe} onChange={e => setFormData({...formData, tipe: e.target.value})} className="input">
                  <option value="Aset">Aset</option>
                  <option value="Kewajiban">Kewajiban</option>
                  <option value="Ekuitas">Ekuitas</option>
                  <option value="Pendapatan">Pendapatan</option>
                  <option value="Beban">Beban</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Saldo Normal</label>
                  <select value={formData.saldoNormal} onChange={e => setFormData({...formData, saldoNormal: e.target.value})} className="input">
                    <option value="Debit">Debit</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                </div>
                <div>
                  <label className="label">Laporan</label>
                  <select value={formData.reportMapping} onChange={e => setFormData({...formData, reportMapping: e.target.value})} className="input">
                    <option value="Neraca">Neraca</option>
                    <option value="LabaRugi">Laba/Rugi</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
