function getBasePath(): string {
  if (typeof document === 'undefined') return ''

  const pathname = new URL(document.baseURI).pathname
  if (pathname === '/') return ''

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export function withBasePath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${getBasePath()}${normalizedPath}`
}

export function getDefaultWebSocketUrl(): string {
  const currentUrl = new URL(window.location.href)
  const protocol = currentUrl.protocol === 'https:' ? 'wss:' : 'ws:'
  const port = currentUrl.port === '3000' ? '3001' : currentUrl.port
  const basePath = getBasePath()
  const wsPath = basePath || '/'

  return `${protocol}//${currentUrl.hostname}${port ? `:${port}` : ''}${wsPath}`
}
