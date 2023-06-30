# fetchyeah

Miniscule JSON fetch wrapper library.

~2.4kb minified, ~1kb gzipped.

[![npm version](https://img.shields.io/npm/v/fetchyeah.svg)](https://npm.im/fetchyeah) [![ko-fi](https://img.shields.io/badge/donate-KoFi-yellow.svg)](https://ko-fi.com/zacanger)

----

`fetchyeah` is a small fetch wrapper library that always parses JSON and returns
JS. Smaller than Axios, Request, R2, and the `whatwg-fetch` polyfill itself.

# Installation

`npm i fetchyeah`

# Usage

```javascript
import { get } from 'fetchyeah'

get('/foo')
```

## Methods

**Important** these methods were renamed in 4.x to remove the `Json` suffix.
This library only deals with JSON, so that felt redundant and added a few
useless extra bytes.

* `del`
* `get`
* `patch`
* `post`
* `put`

This only provides functions for these common HTTP methods, but you can easily add
your own. Check out the source for notes on how to use `sendJson` directly.

The return value is always a simple response of type

```typescript
type SimpleResponse<T> = {
  ok: boolean
  status: number
  headers: Headers
  body: T
}
```

## Examples

Node:

```javascript
require('isomorphic-fetch') // brings in fetch for Node

import * as f from 'fetchyeah'

// some koa route
router.get('/foo/:id', async (ctx) => {
  try {
    const thing = await f.get(`/some-service/${id}`)
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
import { post } from 'fetchyeah'

class Foo extends React.Component {
  state = { things: null }

  submitThings = () => {
    post('/stuff', { body: this.state.things })
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

Adding headers:

```javascript
import { post } from 'fetchyeah'

post('/foo', {
  body: someObject,
  headers: {
    'x-foo-bar': 'baz',
  }
})
```

## Environment

This library assumes `fetch` is available. You may need to polyfill it!

[LICENSE](./LICENSE.md)
