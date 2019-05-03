# fetchyeah

Tiny (less than 3kb) fetch wrapper library

[![npm version](https://img.shields.io/npm/v/fetchyeah.svg)](https://npm.im/fetchyeah) [![CircleCI](https://circleci.com/gh/jane/fetchyeah.svg?style=svg)](https://circleci.com/gh/jane/fetchyeah) [![Coverage Status](https://coveralls.io/repos/github/jane/fetchyeah/badge.svg?branch=master)](https://coveralls.io/github/jane/fetchyeah?branch=master)

----

# Installation

`npm i fetchyeah`

# Usage

## Net

Net is an api-compatible wrapper around `fetch`. Just import `net` and use as if it was `fetch`.

```javascript
import { net } from 'fetchyeah'
```

## Net Methods

Usually you'll want to use these functions instead of using `net` directly:

* `getJson`
* `postJson`
* `putJson`
* `deleteJson`
* `headJson`

```javascript
;(async () => {
  const { bar } = await getJson('/foo')
  const quux = await postJson(`/baz/${bar}`)
  return quux
})()
```

Or slightly lower-level:

* `sendJson`
* `sendJsonR`
* `sendString`
* `sendStringR`

## Environment

This library assumes `Promise` and `fetch` are available. You may need to
polyfill them for older browsers and provide Fetch for Node (I recommend
`isomorphic-fetch`).

## Todo

Tests

[MIT](./LICENSE.md)
