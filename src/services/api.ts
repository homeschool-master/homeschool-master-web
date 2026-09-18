import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    'X-Key-Inflection': 'camel',
  },
  withCredentials: true,
})

const REFRESH_PATH = '/api/v1/auth/refresh'
const LOGIN_PATH = '/api/v1/auth/login'

/**
 * Endpoints whose own 401 is an answer rather than an expired session: a wrong
 * password at login, and the refresh call itself, which must never try to
 * refresh its way out of its own failure.
 */
const NEVER_REFRESH = [LOGIN_PATH, REFRESH_PATH, '/api/v1/auth/register', '/login']

/** One retry per request, tracked on the request config. */
type RetriableRequest = InternalAxiosRequestConfig & { retriedAfterRefresh?: boolean }

/** The in flight refresh, so a burst of 401s waits on one call rather than many. */
let refreshInFlight: Promise<void> | null = null

/** Set when a refresh is genuinely rejected, so later 401s do not retry it. */
let sessionExpired = false

let onSessionExpired: (() => void) | null = null

/**
 * Called when the refresh token is gone, expired or revoked: a real logout.
 * Registered from main.tsx so this module never imports the store, which would
 * close an import cycle through the slices.
 */
export const setSessionExpiredHandler = (handler: () => void) => {
  onSessionExpired = handler
}

/**
 * The access token cookie lasts an hour, the refresh token thirty days. The
 * server reads the refresh token from its own cookie and sets a fresh access
 * cookie, so this needs no body and no token handling on the client.
 */
const refreshSession = (): Promise<void> => {
  if (sessionExpired) return Promise.reject(new Error('Session expired'))

  refreshInFlight ??= api
    .post(REFRESH_PATH)
    .then(() => undefined)
    .catch((error: unknown) => {
      sessionExpired = true
      throw error
    })
    .finally(() => {
      refreshInFlight = null
    })

  return refreshInFlight
}

const isNeverRefresh = (url: string | undefined): boolean =>
  NEVER_REFRESH.some((path) => (url ?? '').startsWith(path))

api.interceptors.response.use(
  (response) => {
    // A fresh login ends the expired state, so a later 401 may refresh again.
    if (response.config.url?.startsWith(LOGIN_PATH)) sessionExpired = false
    return response
  },
  async (error: AxiosError) => {
    const request = error.config as RetriableRequest | undefined

    const mayBeExpiredSession =
      error.response?.status === 401 &&
      request !== undefined &&
      !request.retriedAfterRefresh &&
      !isNeverRefresh(request.url)

    if (!mayBeExpiredSession) return Promise.reject(error)

    request.retriedAfterRefresh = true

    try {
      await refreshSession()
    } catch {
      // The refresh token is genuinely done: clear auth state and let the route
      // guard send the teacher to login. The caller still hears the original
      // 401, so nothing loops waiting on a second attempt.
      onSessionExpired?.()
      return Promise.reject(error)
    }

    return api(request)
  }
)

export default api
