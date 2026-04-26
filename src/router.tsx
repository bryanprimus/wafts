import { createRouter } from '@tanstack/react-router'
import { DefaultErrorComponent } from '@/errors/route-error'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: () => <p>The page you are looking for does not exist.</p>,
  })
}
