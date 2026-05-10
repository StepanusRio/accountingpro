import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET() {
  try {
    const journals = await prisma.journalHeader.findMany({
      orderBy: { tanggal: 'desc' },
      include: {
        lines: {
          include: {
            account: true,
            auxiliaryAccount: true
          }
        }
      }
    })
    return NextResponse.json(journals)
  } catch (error) {
    console.error('Failed to fetch journals:', error)
    return NextResponse.json({ error: 'Failed to fetch journals' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactionId, tanggal, bukti, keterangan, lines } = body

    if (!transactionId || !tanggal || !bukti || !lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json({ error: 'Missing required fields or lines' }, { status: 400 })
    }

    // Validation: Debits must equal Credits
    let totalDebit = new Prisma.Decimal(0)
    let totalCredit = new Prisma.Decimal(0)

    for (const line of lines) {
      const debit = new Prisma.Decimal(line.debit || 0)
      const kredit = new Prisma.Decimal(line.kredit || 0)
      
      if (debit.lessThan(0) || kredit.lessThan(0)) {
        return NextResponse.json({ error: 'Amounts cannot be negative' }, { status: 400 })
      }

      totalDebit = totalDebit.plus(debit)
      totalCredit = totalCredit.plus(kredit)
    }

    if (!totalDebit.equals(totalCredit)) {
      return NextResponse.json({ 
        error: 'Double-entry validation failed. Total Debits must equal Total Credits.',
        totalDebit: totalDebit.toString(),
        totalCredit: totalCredit.toString()
      }, { status: 400 })
    }
    
    if (totalDebit.equals(0)) {
      return NextResponse.json({ error: 'Journal entry must have non-zero amounts' }, { status: 400 })
    }

    // Create Journal Header and Lines in a transaction
    const journal = await prisma.journalHeader.create({
      data: {
        transactionId,
        tanggal: new Date(tanggal),
        bukti,
        keterangan,
        lines: {
          create: lines.map((line: { accountId: string; auxiliaryAccountId?: string; debit?: string | number; kredit?: string | number }) => ({
            accountId: line.accountId,
            auxiliaryAccountId: line.auxiliaryAccountId || null,
            debit: line.debit || 0,
            kredit: line.kredit || 0
          }))
        }
      },
      include: {
        lines: true
      }
    })

    // Here we will eventually broadcast socket event
    // socket.emit('journal_posted', journal)

    return NextResponse.json(journal, { status: 201 })
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Transaction ID already exists' }, { status: 400 })
    }
    console.error('Journal Create Error:', error)
    return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 })
  }
}
