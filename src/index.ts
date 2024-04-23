/* eslint-disable @typescript-eslint/no-invalid-void-type */

import { globalFetch as f } from './util'

interface _Headers { [key: string]: string }
type Diff<T, U> = T extends U ? {} : T
type Opts<T> = Diff<RequestInit, { body?: BodyInit }> & {
  body?: T
  headers?: _Headers
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

export const eq = <T>(expected: T): ((a: T) => boolean) => (actual) =>
  expected === actual

export const hasJsonBody = (res: Response): boolean => {
  const contentType = res.headers.get('content-type')
  return (
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    contentType != null &&
    contentType.split(';').map(trim).some(eq('application/json'))
  )
}

export interface SimpleResponse<T> {
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
    body
  })

export const getBodyOrFail = async <T>(res: SimpleResponse<T>): Promise<T> =>
  res.ok ? await Promise.resolve(res.body) : await Promise.reject(res.body)

const decodeJsonOrNull = async <T>(res): Promise<T | void> =>
  res.json().catch((e): null => {
    // eslint-disable-next-line no-console
    console.warn('Malformed JSON response received.', res, e)
    return null
  })

/**
 * Performs an ajax call with headers and
 * includes full response object. If given, the request
 * body will be JSON stringified and any response body
 * will be parsed as JSON.
 */
export const sendJsonR = async <ReqT extends {}, ResT>(
  method: Method,
  url: string,
  options: Opts<ReqT> = {}
): Promise<SimpleResponse<ResT | void>> =>
  await Promise.resolve().then(
    async (): Promise<SimpleResponse<ResT | void>> => {
      const { body, headers, ...innerOptions } = options
      const innerHeaders = (headers != null) ? new Headers(headers) : new Headers()
      innerHeaders.append('accept', 'application/json; charset=utf-8')
      let innerBody: string | void
      if (body != null) {
        innerHeaders.append('content-type', 'application/json; charset=utf-8')
        innerBody = JSON.stringify(body)
      }
      const credentials = 'include'
      /* eslint-disable @typescript-eslint/return-await */
      // @ts-expect-error fetch should exist and if not the dev will check their
      // console
      return f(url, {
        method,
        credentials,
        // @ts-expect-error body
        body: innerBody,
        headers: innerHeaders,
        ...innerOptions
      }).then(
        async (res): Promise<SimpleResponse<ResT | void>> => {
          /* eslint-enable @typescript-eslint/return-await */
          // @ts-expect-error i'll figure it out later
          const bodyP: Promise<ResT | void> = hasJsonBody(res)
            ? decodeJsonOrNull(res)
            : Promise.resolve(null)
          return await bodyP.then((body) => toSimpleResponse(res, body))
        }
      )
    }
  )

/**
 * Performs an ajax call with headers, returning
 * only the response body. If given, the request
 * body will be JSON stringified and any response body
 * will be parsed as JSON.
 */
export const sendJson = async <ReqT extends {}, ResT>(
  method: Method,
  url: string,
  options?: Opts<ReqT>
  // @ts-expect-error
): Promise<ResT | void> => await sendJsonR(method, url, options).then(getBodyOrFail)

// Helpers for sendJson which apply a method.
export const del = async <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => await sendJson('DELETE', url, options)

export const get = async <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => await sendJson('GET', url, options)

export const head = async <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<SimpleResponse<ResT | void>> => await sendJsonR('HEAD', url, options)

export const patch = async <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => await sendJson('PATCH', url, options)

export const post = async <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => await sendJson('POST', url, options)

export const put = async <ReqT extends {}, ResT>(
  url: string,
  options?: Opts<ReqT>
): Promise<ResT | void> => await sendJson('PUT', url, options)
