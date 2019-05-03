# fylgja

Fetch wrappers.

[![npm version](https://img.shields.io/npm/v/fylgja.svg)](https://npm.im/fylgja) [![CircleCI](https://circleci.com/gh/jane/fylgja.svg?style=svg)](https://circleci.com/gh/jane/fylgja) [![Coverage Status](https://coveralls.io/repos/github/jane/fylgja/badge.svg?branch=master)](https://coveralls.io/github/jane/fylgja?branch=master)

----

# Installation

`npm i fylgja`

# Usage

## Net

Net is an api-compatible wrapper around `fetch`. Just import `net` and use as if it was `fetch`.

```js
import { net } from 'fylgja'
```

## Net Methods

Usually you'll want to use these functions instead of using `net` directly:

* `getJson`
* `postJson`
* `putJson`
* `deleteJson`
* `headJson`

```js
(async () => {
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

[MIT](./LICENSE.md)
