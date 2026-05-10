import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { SWRProvider } from '@/components/SWRProvider'
import { ToastProvider } from '@/components/Toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Akuntansi Pro — Sistem Akuntansi',
  description: 'Sistem Akuntansi Perusahaan Jasa berbasis web',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <SWRProvider>
          <ToastProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-6xl px-6 py-8">
                  {children}
                </div>
              </main>
            </div>
          </ToastProvider>
        </SWRProvider>
      </body>
    </html>
  )
}
