import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { kode: 'asc' }
    })
    return NextResponse.json(accounts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { kode, nama, tipe, saldoNormal, reportMapping } = body

    // Validation
    if (!kode || !nama || !tipe || !saldoNormal || !reportMapping) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const account = await prisma.account.create({
      data: {
        kode,
        nama,
        tipe,
        saldoNormal,
        reportMapping
      }
    })

    return NextResponse.json(account, { status: 201 })
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Account code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
