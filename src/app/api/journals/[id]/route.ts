import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const journal = await prisma.journalHeader.findUnique({
      where: { id },
      include: {
        lines: {
          include: {
            account: true,
            auxiliaryAccount: true
          }
        }
      }
    })
    
    if (!journal) {
      return NextResponse.json({ error: 'Journal not found' }, { status: 404 })
    }
    
    return NextResponse.json(journal)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch journal' }, { status: 500 })
  }
}
