'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

import { LocaleProvider } from '@/shared/i18n'

import { makeQueryClient } from './makeQueryClient'

import type { ClientDictionary, LocaleContext } from '@/shared/i18n'
import type { ReactNode } from 'react'

interface ProvidersProps {
  locale: LocaleContext
  dictionary: ClientDictionary
  children: ReactNode
}

export const Providers = ({ locale, dictionary, children }: ProvidersProps) => {
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider value={locale} dictionary={dictionary}>
        {children}
      </LocaleProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  )
}
