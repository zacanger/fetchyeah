export const globalFetch = (() => {
  if (
    typeof global !== 'undefined' &&
    'fetch' in global &&
    typeof global.fetch === 'function'
  ) {
    return global.fetch
  }

  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    return window.fetch
  }

  // eslint-disable-next-line no-console
  console.error('No fetch found!')
})()
