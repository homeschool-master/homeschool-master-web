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
