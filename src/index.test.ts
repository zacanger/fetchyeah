/* eslint-env jest */

import { net } from './net'

test('net should have all default headers on initialization', (): void => {
  // @ts-ignore
  window.fetch = (url, opts) => Promise.resolve({ url, ...opts })

  net('/').then(({ headers }): void => {})
})
