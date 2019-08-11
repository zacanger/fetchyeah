# fetchyeah

Miniscule JSON fetch wrapper library.

~2.5kb minified, ~1kb gzipped.

[![npm version](https://img.shields.io/npm/v/fetchyeah.svg)](https://npm.im/fetchyeah) [![CircleCI](https://circleci.com/gh/zacanger/fetchyeah.svg?style=svg)](https://circleci.com/gh/zacanger/fetchyeah) [![codecov](https://codecov.io/gh/zacanger/fetchyeah/branch/master/graph/badge.svg)](https://codecov.io/gh/zacanger/fetchyeah) [![Maintainability](https://api.codeclimate.com/v1/badges/081700f7a21958f070df/maintainability)](https://codeclimate.com/github/zacanger/fetchyeah/maintainability) [![Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://www.patreon.com/zacanger) [![ko-fi](https://img.shields.io/badge/donate-KoFi-yellow.svg)](https://ko-fi.com/U7U2110VB)

----

`fetchyeah` is a small fetch wrapper library that always parses JSON and returns
JS. Smaller than Axios, Request, R2, and the `whatwg-fetch` polyfill itself.

# Installation

`npm i fetchyeah`

# Usage

```javascript
import { fetchJson } from 'fetchyeah'

fetchJson('/foo')
```

## Methods

* `deleteJson`
* `getJson`
* `headJson`
* `patchJson`
* `postJson`
* `putJson`

We only provide functions for these common HTTP methods, but you can easily add
your own. Check out the source for notes on how to use `sendJson` and
`sendString` directly.

## Examples

Node:

```javascript
require('isomorphic-fetch') // brings in fetch for Node

import { getJson } from 'fetchyeah'

// some koa route
router.get('/foo/:id', async (ctx) => {
  try {
    const thing = await getJson(`/some-service/${id}`)
    ctx.type = 'application/json'
    ctx.body = thing
  } catch (e) {
    someLogger.error(e)
    ctx.status = 500
    ctx.body = e
  }
})
```

Browser:

```javascript
import * as React from 'react'
import { postJson } from 'fetchyeah'

class Foo extends React.Component {
  state = { things: null }

  submitThings = () => {
    postJson('/stuff', { body: this.state.things })
    .then((res) => {
      if (res) {
        alert(res)
      }
    })
    .catch((err) => {
      someErrorHandler(err)
    })
  }

  setThings = (e) => {
    this.setState({ things: e.target.value })
  }

  render () {
    return (
      <React.Fragment>
        <input
          type="text"
          onChange={this.setThings}
          value={this.state.things}
        />
        <button onClick={submitThings}>
          Send the things!
        </button>
      </React.Fragment>
    )
  }
}
```

## Environment

This library assumes `Promise` and `fetch` are available. You may need to
polyfill them for older browsers and provide Fetch for Node (I recommend
`isomorphic-fetch`).

[MIT](./LICENSE.md)
