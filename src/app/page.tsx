'use client'

import { useEffect, useState, useMemo } from 'react'
import useSWR from 'swr'
import { io } from 'socket.io-client'
import { Activity, DollarSign, FileText, Plus, CheckCircle2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

/* ── Types ── */
type AccountBalance = {
  account: { id: string; kode: string; nama: string; tipe: string; saldoNormal: string; reportMapping: string }
  balance: number
  debit: number
  kredit: number
}

type Reports = {
  trialBalance: AccountBalance[]
  incomeStatement: {
    revenue: AccountBalance[]
    expenses: AccountBalance[]
    totalRevenue: number
    totalExpense: number
    netIncome: number
  }
  balanceSheet: {
    assets: AccountBalance[]
    liabilities: AccountBalance[]
    equity: AccountBalance[]
    totalAssets: number
    totalLiabilities: number
    totalEquityRaw: number
    totalEquity: number
    isBalanced: boolean
  }
}

type Journal = {
  id: string
  transactionId: string
  tanggal: string
  keterangan: string
  lines: Array<{ debit: string; kredit: string }>
}

type Account = { id: string; kode: string; nama: string }

/* ── Format Helpers ── */
const fmt = (n: number) => n.toLocaleString('id-ID', { minimumFractionDigits: 2 })
const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}Rb`
  return n.toFixed(0)
}

/* ── SVG Bar Chart Component ── */
function AccountTypeChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const maxValue = Math.max(...data.map(d => Math.abs(d.value)), 1)
  const chartHeight = data.length * 40
  const leftPad = 90
  const rightPad = 60
  const chartWidth = 400

  // Generate grid lines
  const gridSteps = 4
  const gridLines = Array.from({ length: gridSteps + 1 }, (_, i) => {
    const val = (maxValue / gridSteps) * i
    const x = leftPad + (val / maxValue) * (chartWidth - leftPad - rightPad)
    return { x, label: fmtShort(val) }
  })

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
      className="w-full"
      role="img"
      aria-label="Grafik komposisi per tipe akun"
    >
      {/* Grid lines */}
      {gridLines.map((g, i) => (
        <g key={i}>
          <line
            x1={g.x} y1={4} x2={g.x} y2={chartHeight}
            stroke="var(--color-border-subtle)" strokeWidth={1}
          />
          <text
            x={g.x} y={chartHeight + 18}
            fill="var(--color-text-muted)" fontSize={10}
            textAnchor="middle" fontFamily="Inter, sans-serif"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {g.label}
          </text>
        </g>
      ))}

      {/* Bars */}
      {data.map((item, i) => {
        const barWidth = (Math.abs(item.value) / maxValue) * (chartWidth - leftPad - rightPad)
        const y = i * 40 + 8

        return (
          <g key={item.label}>
            {/* Label */}
            <text
              x={leftPad - 8} y={y + 14}
              fill="var(--color-text-secondary)" fontSize={11}
              textAnchor="end" fontFamily="Inter, sans-serif"
              fontWeight={500}
            >
              {item.label}
            </text>
            {/* Bar background */}
            <rect
              x={leftPad} y={y}
              width={chartWidth - leftPad - rightPad} height={24}
              rx={4}
              fill="var(--color-surface-overlay)"
            />
            {/* Bar fill */}
            <rect
              x={leftPad} y={y}
              width={Math.max(barWidth, 2)} height={24}
              rx={4}
              fill={item.color}
              opacity={0.85}
            >
              <title>{`${item.label}: Rp ${fmt(item.value)}`}</title>
            </rect>
            {/* Value label */}
            {barWidth > 40 && (
              <text
                x={leftPad + barWidth - 6} y={y + 15}
                fill="var(--color-text-primary)" fontSize={10}
                textAnchor="end" fontFamily="Inter, sans-serif"
                fontWeight={600}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmtShort(item.value)}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

/* ── Balance Comparison Component ── */
function NeracaComparison({
  totalAssets,
  totalLiabilitiesEquity,
  isBalanced,
}: {
  totalAssets: number
  totalLiabilitiesEquity: number
  isBalanced: boolean
}) {
  const maxVal = Math.max(totalAssets, totalLiabilitiesEquity, 1)
  const assetWidth = (totalAssets / maxVal) * 100
  const leWidth = (totalLiabilitiesEquity / maxVal) * 100

  return (
    <div className="space-y-4">
      {/* Asset bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-text-secondary">Aset</span>
          <span className="text-[12px] font-semibold text-text-primary nums">
            Rp {fmt(totalAssets)}
          </span>
        </div>
        <div className="h-3 rounded-full bg-surface-overlay overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${assetWidth}%`,
              backgroundColor: 'var(--color-info)',
            }}
          />
        </div>
      </div>

      {/* Divider with balance status */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border-default" />
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
          isBalanced
            ? 'bg-success-muted text-success'
            : 'bg-danger-muted text-danger'
        }`}>
          {isBalanced ? (
            <><CheckCircle2 className="h-3 w-3" /> Seimbang</>
          ) : (
            <><AlertTriangle className="h-3 w-3" /> Selisih</>
          )}
        </div>
        <div className="flex-1 h-px bg-border-default" />
      </div>

      {/* Liabilities + Equity bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-text-secondary">Kewajiban + Ekuitas</span>
          <span className="text-[12px] font-semibold text-text-primary nums">
            Rp {fmt(totalLiabilitiesEquity)}
          </span>
        </div>
        <div className="h-3 rounded-full bg-surface-overlay overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${leWidth}%`,
              backgroundColor: isBalanced
                ? 'var(--color-success)'
                : 'var(--color-danger)',
            }}
          />
        </div>
      </div>

      {/* Difference */}
      {!isBalanced && (
        <p className="text-[11px] text-danger text-center font-medium nums">
          Selisih: Rp {fmt(Math.abs(totalAssets - totalLiabilitiesEquity))}
        </p>
      )}
    </div>
  )
}

/* ── Income vs Expense Mini Chart ── */
function IncomeExpenseChart({
  revenue,
  expense,
  netIncome,
}: {
  revenue: number
  expense: number
  netIncome: number
}) {
  const maxVal = Math.max(revenue, expense, 1)
  const revWidth = (revenue / maxVal) * 100
  const expWidth = (expense / maxVal) * 100

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-text-secondary">Pendapatan</span>
          <span className="text-[12px] font-semibold text-success nums">
            Rp {fmt(revenue)}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-surface-overlay overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${revWidth}%`, backgroundColor: 'var(--color-success)' }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-text-secondary">Beban</span>
          <span className="text-[12px] font-semibold text-danger nums">
            Rp {fmt(expense)}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-surface-overlay overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${expWidth}%`, backgroundColor: 'var(--color-danger)' }}
          />
        </div>
      </div>
      {/* Net result */}
      <div className={`flex items-center justify-between pt-2 border-t border-border-subtle text-[12px] font-bold ${
        netIncome >= 0 ? 'text-success' : 'text-danger'
      }`}>
        <span>{netIncome >= 0 ? 'Laba Bersih' : 'Rugi Bersih'}</span>
        <span className="nums">Rp {fmt(netIncome)}</span>
      </div>
    </div>
  )
}

/* ── Main Dashboard ── */
export default function DashboardPage() {
  const { data: reports, mutate: mutateReports } = useSWR<Reports>('/api/reports')
  const { data: journals, mutate: mutateJournals } = useSWR<Journal[]>('/api/journals')
  const { data: accounts } = useSWR<Account[]>('/api/accounts')

  const [connected, setConnected] = useState(false)

  // Page title
  useEffect(() => { document.title = 'Dashboard · Akuntansi Pro' }, [])

  // WebSocket
  useEffect(() => {
    const socket = io(window.location.origin)
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('journal_posted', () => {
      mutateReports()
      mutateJournals()
    })
    return () => { socket.disconnect() }
  }, [mutateReports, mutateJournals])

  // Derived data
  const hasAccounts = Array.isArray(accounts) && accounts.length > 0
  const hasJournals = Array.isArray(journals) && journals.length > 0
  const hasData = !!reports && hasJournals

  const netIncome = reports?.incomeStatement?.netIncome ?? 0
  const totalAssets = reports?.balanceSheet?.totalAssets ?? 0
  const transactionCount = Array.isArray(journals) ? journals.length : 0

  // Chart data: account type breakdown
  const accountTypeData = useMemo(() => {
    if (!reports?.trialBalance) return []
    const byType: Record<string, number> = {}
    reports.trialBalance.forEach(ab => {
      byType[ab.account.tipe] = (byType[ab.account.tipe] || 0) + Math.abs(ab.balance)
    })

    const colorMap: Record<string, string> = {
      Aset: 'var(--color-info)',
      Kewajiban: 'var(--color-warning)',
      Ekuitas: 'var(--color-accent-500)',
      Pendapatan: 'var(--color-success)',
      Beban: 'var(--color-danger)',
    }
    const order = ['Aset', 'Kewajiban', 'Ekuitas', 'Pendapatan', 'Beban']

    return order
      .filter(t => byType[t] && byType[t] > 0)
      .map(t => ({ label: t, value: byType[t], color: colorMap[t] || 'var(--color-accent-500)' }))
  }, [reports])

  const stats = [
    {
      label: 'Laba Bersih',
      value: netIncome,
      icon: DollarSign,
      color: netIncome >= 0 ? 'text-success' : 'text-danger',
    },
    {
      label: 'Total Aset',
      value: totalAssets,
      icon: Activity,
      color: 'text-accent-400',
    },
    {
      label: 'Total Transaksi',
      value: null,
      count: transactionCount,
      icon: FileText,
      color: 'text-info',
    },
  ]

  /* ── Loading State ── */
  if (!reports && !journals) {
    return (
      <div className="space-y-8">
        <div>
          <div className="skeleton h-7 w-40 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-24 w-full rounded-[14px]" />
          <div className="skeleton h-24 w-full rounded-[14px]" />
          <div className="skeleton h-24 w-full rounded-[14px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="skeleton h-64 w-full rounded-[14px] lg:col-span-3" />
          <div className="skeleton h-64 w-full rounded-[14px] lg:col-span-2" />
        </div>
        <div className="skeleton h-48 w-full rounded-[14px]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* ═══ Page Header ═══ */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Ringkasan sistem akuntansi
            {connected && (
              <span className="inline-flex items-center gap-1.5 ml-3">
                <span className="status-dot status-dot-live" />
                <span className="text-success text-[11px]">Real-time</span>
              </span>
            )}
          </p>
        </div>
        {hasAccounts && (
          <Link href="/journals/new" className="btn btn-primary">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Entri Jurnal
          </Link>
        )}
      </div>

      {/* ═══ KPI Row ═══ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">{stat.label}</p>
                {stat.count !== undefined && stat.count !== null ? (
                  <p className="stat-value">{stat.count} <span className="text-base font-normal text-text-muted">Jurnal</span></p>
                ) : (
                  <p className={`stat-value nums ${stat.color}`}>
                    Rp {fmt(stat.value ?? 0)}
                  </p>
                )}
              </div>
              <div className={`flex items-center justify-center h-9 w-9 rounded-lg ${stat.color} bg-surface-overlay`}>
                <stat.icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Charts Row ═══ */}
      {hasData && accountTypeData.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Account Type Breakdown */}
          <div className="card p-5 lg:col-span-3">
            <h3 className="text-sm font-semibold text-text-primary mb-4">
              Komposisi per Tipe Akun
            </h3>
            <AccountTypeChart data={accountTypeData} />
          </div>

          {/* Right column: Neraca + Laba/Rugi */}
          <div className="lg:col-span-2 space-y-6">
            {/* Neraca Status */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Status Neraca
              </h3>
              <NeracaComparison
                totalAssets={reports!.balanceSheet.totalAssets}
                totalLiabilitiesEquity={reports!.balanceSheet.totalLiabilities + reports!.balanceSheet.totalEquity}
                isBalanced={reports!.balanceSheet.isBalanced}
              />
            </div>

            {/* Laba/Rugi Summary */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">
                Ringkasan Laba Rugi
              </h3>
              <IncomeExpenseChart
                revenue={reports!.incomeStatement.totalRevenue}
                expense={reports!.incomeStatement.totalExpense}
                netIncome={reports!.incomeStatement.netIncome}
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ Transaksi Terbaru ═══ */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Activity className="h-4 w-4 text-text-muted" strokeWidth={1.8} />
            Transaksi Terbaru
          </h3>
          {hasJournals && (
            <Link href="/journals" className="text-[12px] text-accent-400 hover:text-accent-300 font-medium transition-colors">
              Lihat Semua
            </Link>
          )}
        </div>
        <div className="space-y-1">
          {(Array.isArray(journals) ? journals : []).slice(0, 7).map((journal) => (
            <div key={journal.id} className="flex justify-between items-center rounded-lg px-3 py-2.5 -mx-3 hover:bg-surface-hover transition-colors">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate">{journal.transactionId}</p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {new Date(journal.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {journal.keterangan && <> · {journal.keterangan}</>}
                </p>
              </div>
              <p className="text-[13px] font-semibold text-text-primary nums ml-4 flex-shrink-0">
                Rp {journal.lines.reduce((sum, line) => sum + parseFloat(line.debit), 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
              </p>
            </div>
          ))}
          {!journals && (
            <div className="space-y-3 py-2">
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-full" />
              <div className="skeleton h-10 w-3/4" />
            </div>
          )}
          {Array.isArray(journals) && journals.length === 0 && (
            <p className="text-[13px] text-text-muted py-4 text-center">Belum ada transaksi.</p>
          )}
          {journals && !Array.isArray(journals) && (
            <p className="text-[13px] text-danger py-4 text-center">Gagal memuat transaksi.</p>
          )}
        </div>
      </div>

      {/* ═══ Getting Started (contextual) ═══ */}
      {(!hasAccounts || !hasJournals) && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Langkah Selanjutnya</h3>
          <div className="flex flex-wrap gap-3">
            {!hasAccounts && (
              <Link
                href="/accounts"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] bg-surface-overlay hover:bg-surface-hover border border-border-default transition-colors group"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent-500/10 group-hover:bg-accent-500/15 transition-colors">
                  <Plus className="h-4 w-4 text-accent-400" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Tambah Bagan Akun</p>
                  <p className="text-[11px] text-text-muted">Buat chart of accounts untuk memulai</p>
                </div>
              </Link>
            )}
            {hasAccounts && !hasJournals && (
              <Link
                href="/journals/new"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] bg-surface-overlay hover:bg-surface-hover border border-border-default transition-colors group"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-accent-500/10 group-hover:bg-accent-500/15 transition-colors">
                  <Plus className="h-4 w-4 text-accent-400" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">Buat Jurnal Pertama</p>
                  <p className="text-[11px] text-text-muted">Catat transaksi pertama Anda</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
