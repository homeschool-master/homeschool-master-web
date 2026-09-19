import { isAxiosError } from 'axios'

/**
 * The API returns failures as
 * { success: false, error: { code, message, details? } }
 * where details maps a field to its messages. Responses are camelCase because
 * the shared client sends the X-Key-Inflection header, so a rejected
 * student_ids array arrives as studentIds.
 */
interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
    details?: Record<string, string[]>
  }
}

/** True when the API said the record is not there, rather than that it failed. */
export const isNotFoundError = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 404

/**
 * Whether the API rejected a particular field for a particular reason, so a
 * caller can answer a known rule with its own wording rather than surfacing
 * the server's validation phrasing.
 */
export const hasFieldError = (error: unknown, field: string, needle: string): boolean => {
  if (!isAxiosError<ApiErrorBody>(error)) return false

  const messages = error.response?.data?.error?.details?.[field]
  return (messages ?? []).some((message) => message.toLowerCase().includes(needle.toLowerCase()))
}

/** Flattens an API failure into a single sentence suitable for display. */
export const apiErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback

  const body = error.response?.data?.error
  if (!body) return fallback

  const details = body.details
  if (details) {
    const fieldMessages = Object.entries(details).map(
      ([field, messages]) => `${humanizeField(field)} ${messages.join(', ')}`
    )
    if (fieldMessages.length > 0) return fieldMessages.join('. ')
  }

  return body.message ?? fallback
}

const humanizeField = (field: string): string => {
  const spaced = field.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').toLowerCase().trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
