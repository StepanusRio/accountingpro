import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auxAccount = await prisma.auxiliaryAccount.findUnique({
      where: { id: params.id }
    })
    
    if (!auxAccount) {
      return NextResponse.json({ error: 'Auxiliary Account not found' }, { status: 404 })
    }
    
    return NextResponse.json(auxAccount)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch auxiliary account' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { kode, nama, tipe } = body

    const auxAccount = await prisma.auxiliaryAccount.update({
      where: { id: params.id },
      data: { kode, nama, tipe }
    })

    return NextResponse.json(auxAccount)
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Auxiliary Account not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update auxiliary account' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.auxiliaryAccount.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2003') {
      return NextResponse.json({ error: 'Cannot delete auxiliary account because it is used in journal entries' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to delete auxiliary account' }, { status: 500 })
  }
}
