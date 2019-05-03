# fetchyeah

Tiny (less than 3kb) fetch wrapper library

[![npm version](https://img.shields.io/npm/v/fetchyeah.svg)](https://npm.im/fetchyeah) [![CircleCI](https://circleci.com/gh/jane/fetchyeah.svg?style=svg)](https://circleci.com/gh/jane/fetchyeah) [![Coverage Status](https://coveralls.io/repos/github/jane/fetchyeah/badge.svg?branch=master)](https://coveralls.io/github/jane/fetchyeah?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/081700f7a21958f070df/maintainability)](https://codeclimate.com/github/jane/fetchyeah/maintainability)

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

* `deleteJson`
* `getJson`
* `headJson`
* `patchJson`
* `postJson`
* `putJson`

```javascript
;(async () => {
  const { bar } = await getJson('/foo')
  const quux = await postJson(`/baz/${bar}`)
  return quux
})()
```

We only provide functions for these common HTTP methods, but you can easily add
your own. Check out the source for notes on how to use `sendJson` and
`sendString` directly.

## Environment

This library assumes `Promise` and `fetch` are available. You may need to
polyfill them for older browsers and provide Fetch for Node (I recommend
`isomorphic-fetch`).

[MIT](./LICENSE.md)
