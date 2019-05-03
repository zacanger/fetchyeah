/* eslint-env jest */

import { net } from './'

test('net should have all default headers on initialization', (): void => {
  // @ts-ignore
  window.fetch = (url, opts) => Promise.resolve({ url, ...opts })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  net('/').then(({ headers }): void => {})
})
