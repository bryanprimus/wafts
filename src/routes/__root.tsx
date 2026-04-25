/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { Outlet, HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import appCss from '../styles.css?url'
import { THEME_INIT_SCRIPT, ThemeProvider } from 'tanstack-start-themes'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/design-system/ui/sonner'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider enableHotkey>
          {children}
          <Toaster richColors />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
