import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const account = await prisma.account.findUnique({
      where: { id: params.id }
    })
    
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    
    return NextResponse.json(account)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { kode, nama, tipe, saldoNormal, reportMapping } = body

    const account = await prisma.account.update({
      where: { id: params.id },
      data: { kode, nama, tipe, saldoNormal, reportMapping }
    })

    return NextResponse.json(account)
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.account.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    // Handling foreign key constraint errors
    if ((error as { code?: string }).code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete account because it is used in journal entries' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
