import SparkMD5 from 'spark-md5'
import type { DocumentAttachableType, TeacherDocument } from '../types'
import {
  IMAGE_LONG_EDGE,
  SHRINKABLE_TYPES,
  SHRINK_ABOVE_BYTES,
  SHRINK_QUALITY,
} from '../constants/documents'

/** Bytes as something a person reads, rounded the way a file listing does. */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** The filename without its extension, which is a better first title than nothing. */
export const titleFromFilename = (filename: string): string =>
  filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()

/**
 * The base64 MD5 that S3 checks the upload against, so a truncated upload is
 * refused by the bucket rather than kept as a broken file.
 *
 * Read in slices rather than all at once: a 25MB photo held twice over on a
 * three year old phone is how a tab gets killed mid upload. MD5 is not one of
 * the digests SubtleCrypto offers, which is why this is the one thing here
 * that needs a library, and it is the same one Active Storage's own uploader
 * uses.
 */
const CHUNK_BYTES = 2 * 1024 * 1024

export const md5Base64 = async (file: File): Promise<string> => {
  const hash = new SparkMD5.ArrayBuffer()

  for (let start = 0; start < file.size; start += CHUNK_BYTES) {
    hash.append(await file.slice(start, start + CHUNK_BYTES).arrayBuffer())
  }

  // SparkMD5 gives hex; S3 wants the same 16 bytes base64 encoded.
  const hex = hash.end()
  const bytes = hex.match(/.{2}/g) ?? []
  return btoa(String.fromCharCode(...bytes.map((pair) => parseInt(pair, 16))))
}

const readAsImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('This image could not be read'))
    }
    image.src = url
  })

const toBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', SHRINK_QUALITY))

export const worthShrinking = (file: File): boolean =>
  SHRINKABLE_TYPES.includes(file.type) && file.size > SHRINK_ABOVE_BYTES

/**
 * Shrinks a photo to IMAGE_LONG_EDGE on its long edge, in the browser, before
 * it is sent.
 *
 * On this side rather than on the server for three reasons: with a direct
 * upload the server never sees the bytes, so shrinking there would mean
 * downloading, processing and re-uploading; it saves the teacher's own upload,
 * which on a phone in a co-op hall is the slow part; and it keeps libvips off
 * the dyno.
 *
 * Returns the original file whenever shrinking would not help or cannot be
 * done. HEIC is the case that matters: Safari decodes it and Chrome does not,
 * so on Chrome this throws inside and the original goes up untouched, which is
 * allowed and is under the limit in every ordinary case.
 */
export const shrinkImage = async (file: File): Promise<File> => {
  if (!worthShrinking(file)) return file

  try {
    const image = await readAsImage(file)
    const longEdge = Math.max(image.width, image.height)
    if (longEdge <= IMAGE_LONG_EDGE) return file

    const scale = IMAGE_LONG_EDGE / longEdge
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * scale)
    canvas.height = Math.round(image.height * scale)

    const context = canvas.getContext('2d')
    if (!context) return file

    // White underneath, because a png with transparency re-encoded as jpeg
    // would otherwise come out on black.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await toBlob(canvas)
    if (!blob || blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    })
  } catch {
    return file
  }
}

/**
 * Whether to offer a camera button at all.
 *
 * A coarse pointer is the standard signal for a touch device, and it is the
 * one case where `capture` opens the camera rather than a second file dialog
 * that does the same thing as the first.
 */
export const hasCamera = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches

/**
 * How many documents are filed against each record of one kind, keyed by the
 * id a list already holds. So a row can say it has files without every row
 * asking the server.
 */
export const countsByTarget = (
  documents: TeacherDocument[],
  attachableType: DocumentAttachableType
): Record<string, number> => {
  const counts: Record<string, number> = {}

  documents.forEach((document) => {
    document.attachments
      .filter((attachment) => attachment.attachableType === attachableType)
      .forEach((attachment) => {
        counts[attachment.targetId] = (counts[attachment.targetId] ?? 0) + 1
      })
  })

  return counts
}
