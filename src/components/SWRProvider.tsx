'use client'

import { SWRConfig } from 'swr'

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
        revalidateOnFocus: true, // as requested: ensure data refresh
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  )
}
