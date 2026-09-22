import axios from 'axios'
import api from './api'
import type {
  DocumentAttachableType,
  DocumentFilter,
  DocumentUploadTicket,
  TeacherDocument,
} from '../types'
import { md5Base64, shrinkImage } from '../utils/documents'

interface DocumentsResponse {
  data: TeacherDocument[]
}

interface DocumentResponse {
  data: TeacherDocument
}

interface TicketResponse {
  data: DocumentUploadTicket
}

export interface DocumentQuery {
  filter?: DocumentFilter
  attachableType?: DocumentAttachableType
  /** The record's own id. An occurrence date goes in its own field. */
  attachableId?: string
  occurrenceDate?: string | null
}

const queryParams = (query: DocumentQuery | undefined): Record<string, string> => {
  if (!query) return {}

  const params: Record<string, string> = {}
  if (query.filter === 'unattached') params.unattached = 'true'
  if (query.attachableType && query.attachableId) {
    params.attachable_type = query.attachableType
    params.attachable_id = query.attachableId
    if (query.occurrenceDate) params.occurrence_date = query.occurrenceDate
  }
  return params
}

export const fetchDocumentsRequest = async (query?: DocumentQuery): Promise<TeacherDocument[]> => {
  const response = await api.get<DocumentsResponse>('/api/v1/documents', {
    params: queryParams(query),
  })
  return response.data.data
}

/**
 * The three steps of an upload, in order: ask where to put it, put it there,
 * then tell the API about it.
 *
 * The bytes go straight from the browser to storage and never through the API.
 * A 25MB upload relayed through one small dyno would spend the whole of
 * Heroku's 30 second request limit doing nothing but copying, and would still
 * often lose the race on a phone.
 *
 * The photo is shrunk before any of that, so what is measured, checksummed and
 * sent is the file that will actually be stored.
 */
export const uploadDocumentRequest = async (
  file: File,
  title: string,
  onProgress?: (percent: number) => void
): Promise<TeacherDocument> => {
  const prepared = await shrinkImage(file)
  const checksum = await md5Base64(prepared)

  const ticket = await api.post<TicketResponse>('/api/v1/documents/upload_url', {
    filename: prepared.name,
    contentType: prepared.type,
    byteSize: prepared.size,
    checksum,
  })

  const { signedId, url, headers } = ticket.data.data

  // A bare axios call, not the app's client: this goes to storage, not to the
  // API, and must carry none of its cookies, its JSON content type or its
  // inflection header.
  await axios.put(url, prepared, {
    headers: Object.fromEntries(headers.map(({ name, value }) => [name, value])),
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100))
    },
  })

  const created = await api.post<DocumentResponse>('/api/v1/documents', {
    title,
    file: signedId,
  })
  return created.data.data
}

export const renameDocumentRequest = async (
  id: string,
  title: string
): Promise<TeacherDocument> => {
  const response = await api.patch<DocumentResponse>(`/api/v1/documents/${id}`, { title })
  return response.data.data
}

export const removeDocumentRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/documents/${id}`)
}

/**
 * targetId is the id the client already holds. On an occurrence of a series
 * that is "<uuid>:<date>", and the colon is encoded rather than left to
 * chance, the same way the tasks service does it.
 */
export const attachDocumentRequest = async (
  id: string,
  attachableType: DocumentAttachableType,
  targetId: string
): Promise<TeacherDocument> => {
  const response = await api.post<DocumentResponse>(`/api/v1/documents/${id}/attachments`, {
    attachableType,
    targetId,
  })
  return response.data.data
}

export const detachDocumentRequest = async (
  id: string,
  attachmentId: string
): Promise<TeacherDocument> => {
  const response = await api.delete<DocumentResponse>(
    `/api/v1/documents/${id}/attachments/${attachmentId}`
  )
  return response.data.data
}

/**
 * Where the browser should send someone to see the file.
 *
 * Always the API's own path, never a storage URL: the API checks the owner and
 * then redirects to a link that dies in five minutes, and nothing in a
 * response ever contains a link that would work on its own.
 */
export const documentHref = (document: TeacherDocument, download = false): string => {
  const base = api.defaults.baseURL ?? ''
  return `${base}${document.downloadPath}${download ? '?download=true' : ''}`
}
