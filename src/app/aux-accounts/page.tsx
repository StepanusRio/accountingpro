'use client'

import { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { Plus, Trash2 } from 'lucide-react'
import { useToast } from '@/components/Toast'
import { ConfirmDialog } from '@/components/ConfirmDialog'

type AuxAccount = {
  id: string
  kode: string
  nama: string
  tipe: string
}

const tipeBadge: Record<string, string> = {
  Piutang: 'badge-success',
  Hutang: 'badge-warning',
  Lainnya: 'badge-accent',
}

export default function AuxAccountsPage() {
  const { data: auxAccounts, error, mutate } = useSWR<AuxAccount[]>('/api/aux-accounts')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<AuxAccount>>({
    kode: '', nama: '', tipe: 'Piutang'
  })
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nama: string } | null>(null)
  const { showToast } = useToast()
  const firstInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Page title
  useEffect(() => { document.title = 'Buku Pembantu · Akuntansi Pro' }, [])

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

  if (error) return <div className="error-banner">Gagal memuat data buku pembantu.</div>
  if (!auxAccounts) return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48" />
      <div className="skeleton h-48 w-full" />
    </div>
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/aux-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to create')
      setIsModalOpen(false)
      setFormData({ kode: '', nama: '', tipe: 'Piutang' })
      mutate()
      showToast('Buku pembantu berhasil ditambahkan', 'success')
    } catch {
      showToast('Gagal menyimpan buku pembantu', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`/api/aux-accounts/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      mutate()
      showToast('Data berhasil dihapus', 'success')
    } catch {
      showToast('Gagal menghapus data', 'error')
    }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Buku Pembantu</h2>
          <p className="page-subtitle">Kelola data pelanggan (piutang) atau pemasok (hutang).</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah Data
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama Lengkap</th>
              <th>Tipe</th>
              <th className="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {auxAccounts.map((acc) => (
              <tr key={acc.id}>
                <td className="font-medium text-text-primary nums">{acc.kode}</td>
                <td className="text-text-primary">{acc.nama}</td>
                <td>
                  <span className={`badge ${tipeBadge[acc.tipe] || 'badge-accent'}`}>
                    {acc.tipe}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => setDeleteTarget({ id: acc.id, nama: acc.nama })}
                    className="btn btn-danger p-1.5"
                    aria-label={`Hapus ${acc.nama}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {auxAccounts.length === 0 && (
              <tr>
                <td colSpan={4} className="!text-center !py-12 text-text-muted">
                  Belum ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Data"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.nama}"?`}
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
          aria-labelledby="modal-title-aux"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div ref={modalRef} className="modal-content">
            <h3 id="modal-title-aux" className="text-base font-semibold text-text-primary mb-5">Tambah Buku Pembantu</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Kode</label>
                <input ref={firstInputRef} required type="text" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} className="input" placeholder="Contoh: CUST-01" />
              </div>
              <div>
                <label className="label">Nama Lengkap</label>
                <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="input" placeholder="Nama Pelanggan/Supplier" />
              </div>
              <div>
                <label className="label">Tipe</label>
                <select value={formData.tipe} onChange={e => setFormData({...formData, tipe: e.target.value})} className="input">
                  <option value="Piutang">Pelanggan (Piutang)</option>
                  <option value="Hutang">Pemasok (Hutang)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
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
