import api from './api'
import type { ReportCard, ReportCardInput } from '../types'

interface ReportCardsResponse {
  data: ReportCard[]
}

interface ReportCardResponse {
  data: ReportCard
}

/**
 * One row per card rather than one per version: the endpoint returns the
 * highest version of each, and the rest are reached from it.
 */
export const fetchReportCardsRequest = async (studentId?: string): Promise<ReportCard[]> => {
  const response = await api.get<ReportCardsResponse>('/api/v1/report_cards', {
    params: studentId ? { student_id: studentId } : {},
  })
  return response.data.data
}

/** One card in full, including the work behind every subject line. */
export const fetchReportCardRequest = async (id: string): Promise<ReportCard> => {
  const response = await api.get<ReportCardResponse>(`/api/v1/report_cards/${id}`)
  return response.data.data
}

/** Every version of one card, oldest first. Headings only. */
export const fetchReportCardVersionsRequest = async (id: string): Promise<ReportCard[]> => {
  const response = await api.get<ReportCardsResponse>(`/api/v1/report_cards/${id}/versions`)
  return response.data.data
}

export const createReportCardRequest = async (input: ReportCardInput): Promise<ReportCard> => {
  const response = await api.post<ReportCardResponse>('/api/v1/report_cards', input)
  return response.data.data
}

/**
 * On a draft this edits in place. On an issued card the server makes the next
 * version and edits that instead, so what comes back may be a different card
 * from the one that was sent: the caller reads the id off the response rather
 * than assuming it still holds the one it edited.
 */
export const updateReportCardRequest = async (
  id: string,
  input: ReportCardInput
): Promise<ReportCard> => {
  const response = await api.patch<ReportCardResponse>(`/api/v1/report_cards/${id}`, input)
  return response.data.data
}

/** Freezes the card. Everything it needs to render is copied onto it. */
export const issueReportCardRequest = async (id: string): Promise<ReportCard> => {
  const response = await api.post<ReportCardResponse>(`/api/v1/report_cards/${id}/issue`)
  return response.data.data
}

/** Puts an unissued version's inherited figures back to current grades. */
export const refreshReportCardRequest = async (id: string): Promise<ReportCard> => {
  const response = await api.post<ReportCardResponse>(`/api/v1/report_cards/${id}/refresh`)
  return response.data.data
}

/** Drafts only: the server refuses to delete a card that was issued. */
export const removeReportCardRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/report_cards/${id}`)
}
