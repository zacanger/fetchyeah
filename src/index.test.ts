/* eslint-env jest */

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
