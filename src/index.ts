import { _global } from './util'

const f = _global.fetch

type Diff<T, U> = T extends U ? {} : T
type Opts<T> = Diff<RequestInit, { body?: BodyInit }> & {
  body?: T
}

type Method =
  | 'ACL'
  | 'BIND'
  | 'CHECKOUT'
  | 'CONNECT'
  | 'COPY'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'LINK'
  | 'LOCK'
  | 'M-SEARCH'
  | 'MERGE'
  | 'MKACTIVITY'
  | 'MKCALENDAR'
  | 'MKCOL'
  | 'MOVE'
  | 'NOTIFY'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PROPFIND'
  | 'PROPPATCH'
  | 'PURGE'
  | 'PUT'
  | 'REBIND'
  | 'REPORT'
  | 'SEARCH'
  | 'SOURCE'
  | 'SUBSCRIBE'
  | 'TRACE'
  | 'UNBIND'
  | 'UNLINK'
  | 'UNLOCK'
  | 'UNSUBSCRIBE'

export const trim = (s: string): string => s.trim()

export const refEquals = <T>(expected: T): ((a: T) => boolean) => (actual) =>
  expected === actual

export const hasAnyBody = (res: Response): boolean =>
  !!res.headers.get('content-type')

export const hasJsonBody = (res: Response): boolean => {
  const contentType = res.headers.get('content-type')
  return (
    contentType != null &&
    contentType
      .split(';')
      .map(trim)
      .some(refEquals('application/json'))
  )
}

export type SimpleResponse<T> = {
  ok: boolean
  status: number
  headers: Headers
  body: T
}

export const toSimpleResponse = <T>(
  res: Response,
  body: T
): SimpleResponse<T> => ({
  ok: res.ok,
  status: res.status,
  headers: res.headers,
  body,
})

export const getBodyOrFail = <T>(res: SimpleResponse<T>): Promise<T> =>
  res.ok ? Promise.resolve(res.body) : Promise.reject(res.body)

// Performs an ajax call with tracking headers and
// includes full response object. The request body must
// be a string if specified. Response will also be a
// string, or null.
export const sendStringR = (
  method: Method,
  url: string,
  options?: RequestInit | void
): Promise<SimpleResponse<string | void>> =>
  Promise.resolve().then(
    (): Promise<SimpleResponse<string | void>> => {
      const credentials = 'include'
      return f(url, {
        method,
        credentials,
        ...options,
      }).then(
        (res): Promise<SimpleResponse<string | void>> => {
          const bodyP = hasAnyBody(res) ? res.text() : Promise.resolve(null)
          return bodyP.then((body) => toSimpleResponse(res, body))
        }
      )
    }
  )

const decodeJsonOrNull = <T>(res): Promise<T | void> =>
  res.json().catch(
    (e): null => {
      // eslint-disable-next-line no-console
      console.warn('Malformed JSON response received.', res, e)
      return null
    }
  )

// Performs an ajax call with tracking headers and
// includes full response object. If given, the request
// body will be JSON stringified and any response body
// will be parsed as JSON.
export const sendJsonR = <ReqT extends {}, ResT>(
  method: Method,
  url: string,
  options: Opts<ReqT> = {}
): Promise<SimpleResponse<ResT | void>> =>
  Promise.resolve().then(
    (): Promise<SimpleResponse<ResT | void>> => {
      // @ts-ignore headers
      const { body, headers, ...innerOptions } = options
      const innerHeaders = headers ? new Headers(headers) : new Headers()
      innerHeaders.append('accept', 'application/json; charset=utf-8')
      let innerBody: string | void
      if (body) {
        innerHeaders.append('content-type', 'application/json; charset=utf-8')
        innerBody = JSON.stringify(body)
      }
      const credentials = 'include'
      return f(url, {
        method,
        credentials,
        // @ts-ignore body
        body: innerBody,
        headers: innerHeaders,
        ...innerOptions,
      }).then(
        (res): Promise<SimpleResponse<ResT | void>> => {
          const bodyP: Promise<ResT | void> = hasJsonBody(res)
            ? decodeJsonOrNull(res)
            : Promise.resolve(null)
          return bodyP.then((body) => toSimpleResponse(res, body))
        }
      )
    }
  )

// Performs an ajax call with tracking headers, returning
// only the response body. The request body must be a string
// if specified. Response will also be a string, or null.
export const sendString = (
  method: Method,
  url: string,
  options?: RequestInit | void
): Promise<string | void> =>
  sendStringR(method, url, options).then(getBodyOrFail)

// Performs an ajax call with tracking headers, returning
// only the response body. If given, the request
// body will be JSON stringified and any response body
// will be parsed as JSON.
export const sendJson = <ReqT extends {}, ResT>(
  method: Method,
  url: string,
  options?: Opts<ReqT>
  // @ts-ignore
): Promise<ResT | void> => sendJsonR(method, url, options).then(getBodyOrFail)

// Helpers for sendJson which apply a method.
export const deleteJson = <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => sendJson('DELETE', url, options)

export const getJson = <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => sendJson('GET', url, options)

export const headJson = <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<SimpleResponse<ResT | void>> => sendJsonR('HEAD', url, options)

export const patchJson = <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => sendJson('PATCH', url, options)

export const postJson = <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => sendJson('POST', url, options)

export const putJson = <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => sendJson('PUT', url, options)
