/* eslint-env jest */
/* eslint-disable @typescript-eslint/ban-ts-ignore */

import * as f from './index'
import * as http from 'http'

const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)

const getRandomPort = () => getRandomNumber(10000, 40000)

const serverHandler = (req, res) => {
  const body = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resBody: any = {}

  if (req.method === 'HEAD') {
    res.writeHead(200)
    res.end()
  } else if (['PUT', 'PATCH', 'POST'].includes(req.method)) {
    res.writeHead(200, { 'content-type': 'application/json' })

    req.on('data', (a) => {
      body.push(a)
    })

    req.on('end', () => {
      resBody = JSON.parse(body.toString())
      resBody.method = req.method
      res.end(JSON.stringify(resBody))
    })
  } else {
    res.writeHead(200, { 'content-type': 'application/json' })
    resBody.method = req.method
    res.end(JSON.stringify(resBody))
  }
}

describe('fetchyeah', (): void => {
  it('deleteJson', (): void => {
    const port = getRandomPort()
    const testServer = http.createServer(serverHandler)
    testServer.listen(port)
    f.deleteJson(`http://localhost:${port}`)
      .then((j) => {
        // @ts-ignore
        expect(j.method).toBe('DELETE')
        testServer.close()
      })
      .catch((e) => {
        testServer.close(() => {
          throw e
        })
      })
  })

  it('getJson', (): void => {
    const port = getRandomPort()
    const testServer = http.createServer(serverHandler)
    testServer.listen(port)
    f.getJson(`http://localhost:${port}`)
      .then((j) => {
        // @ts-ignore
        expect(j.method).toBe('GET')
        testServer.close()
      })
      .catch((e) => {
        testServer.close(() => {
          throw e
        })
      })
  })

  it('headJson', (): void => {
    const port = getRandomPort()
    const testServer = http.createServer(serverHandler)
    testServer.listen(port)
    f.headJson(`http://localhost:${port}`)
      .then((j) => {
        expect(j.ok).toBe(true)
        expect(j.body).toBe(null)
        testServer.close()
      })
      .catch((e) => {
        testServer.close(() => {
          throw e
        })
      })
  })

  it('patchJson', (): void => {
    const port = getRandomPort()
    const testServer = http.createServer(serverHandler)
    testServer.listen(port)
    f.patchJson(`http://localhost:${port}`, { body: { a: 1 } })
      .then((j) => {
        // @ts-ignore
        expect(j.method).toBe('PATCH')
        // @ts-ignore
        expect(j.a).toBe(1)
        testServer.close()
      })
      .catch((e) => {
        testServer.close(() => {
          throw e
        })
      })
  })

  it('postJson', (): void => {
    const port = getRandomPort()
    const testServer = http.createServer(serverHandler)
    testServer.listen(port)
    f.postJson(`http://localhost:${port}`, { body: { a: 1 } })
      .then((j) => {
        // @ts-ignore
        expect(j.method).toBe('POST')
        // @ts-ignore
        expect(j.a).toBe(1)
        testServer.close()
      })
      .catch((e) => {
        testServer.close(() => {
          throw e
        })
      })
  })

  it('putJson', (): void => {
    const port = getRandomPort()
    const testServer = http.createServer(serverHandler)
    testServer.listen(port)
    f.putJson(`http://localhost:${port}`, { body: { a: 1 } })
      .then((j) => {
        // @ts-ignore
        expect(j.method).toBe('PUT')
        // @ts-ignore
        expect(j.a).toBe(1)
        testServer.close()
      })
      .catch((e) => {
        testServer.close(() => {
          throw e
        })
      })
  })
})

describe('utils', (): void => {
  it('trim', (): void => {
    expect(f.trim(' asdf ')).toBe('asdf')
  })

  it('refEquals', (): void => {
    expect(f.refEquals(1)(1)).toBe(true)
    expect(f.refEquals({ a: 1 })({ a: 2 })).toBe(false)
  })

  it('hasAnyBody', (): void => {
    const fakeRes1 = {
      headers: {
        get() {
          return 'foo'
        },
      },
    }

    const fakeRes2 = {
      headers: {
        get() {
          return undefined
        },
      },
    }

    // @ts-ignore
    expect(f.hasAnyBody(fakeRes1)).toBe(true)
    // @ts-ignore
    expect(f.hasAnyBody(fakeRes2)).toBe(false)
  })

  it('hasJsonBody', (): void => {
    const fakeRes1 = {
      headers: {
        get() {
          return 'application/json'
        },
      },
    }

    const fakeRes2 = {
      headers: {
        get() {
          return 'foo'
        },
      },
    }

    // @ts-ignore
    expect(f.hasJsonBody(fakeRes1)).toBe(true)
    // @ts-ignore
    expect(f.hasJsonBody(fakeRes2)).toBe(false)
  })

  it('toSimpleResponse', (): void => {
    const body = {}
    const e = {
      ok: true,
      status: 200,
      headers: { 'content-type': 'foo' },
    }

    // @ts-ignore
    expect(f.toSimpleResponse(e, body)).toStrictEqual({ ...e, body })
  })

  /* eslint-disable jest/valid-expect */
  it('getBodyOrFail', (): void => {
    // @ts-ignore
    expect(f.getBodyOrFail({ ok: true, body: 1 })).resolves.toBe(1)
    // @ts-ignore
    expect(f.getBodyOrFail({ ok: false, body: 1 })).rejects.toBe(1)
  })
  /* eslint-enable jest/valid-expect */
})
