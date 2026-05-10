import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const auxAccounts = await prisma.auxiliaryAccount.findMany({
      orderBy: { kode: 'asc' }
    })
    return NextResponse.json(auxAccounts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch auxiliary accounts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { kode, nama, tipe } = body

    if (!kode || !nama || !tipe) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const auxAccount = await prisma.auxiliaryAccount.create({
      data: { kode, nama, tipe }
    })

    return NextResponse.json(auxAccount, { status: 201 })
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Auxiliary Account code already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create auxiliary account' }, { status: 500 })
  }
}
