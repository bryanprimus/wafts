import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

export function getRouter() {
  // IMPORTANT: Always define QueryClient *inside* getRouter. This ensures a new QueryClient
  // instance is created for every server request, preventing cache data from leaking
  // between user sessions and avoiding unpredictable side effects.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      queryClient,
    },
    defaultNotFoundComponent: () => <p>The page you are looking for does not exist.</p>,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
