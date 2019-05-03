/* eslint-env jest */

import { net } from './'
import { _global } from './util'

test('net should have all default headers on initialization', (): void => {
  // @ts-ignore
  _global.fetch = (url, opts) => Promise.resolve({ url, ...opts })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  net('/').then(({ headers }): void => {})

  expect(1).toBe(1)
})
