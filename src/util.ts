export const _global = (() => {
  if (typeof self !== 'undefined') {
    return self
  }
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof global !== 'undefined') {
    return global
  }
  // @ts-ignore
  return Function('return this')() // eslint-disable-line
})()
