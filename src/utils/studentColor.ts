/**
 * Text colors for anything sitting on a student color. A parent can pick any
 * swatch, so a pill has to choose its own text color rather than assume the
 * fill is light.
 */
export const DARK_TEXT_COLOR = '#231f20'
export const LIGHT_TEXT_COLOR = '#ffffff'

/** Expands #abc to #aabbcc and drops the hash. Returns null for anything else. */
const normalizeHex = (color: string): string | null => {
  const value = color.trim().replace(/^#/, '')

  if (/^[0-9a-f]{3}$/i.test(value)) {
    return value
      .split('')
      .map((character) => character + character)
      .join('')
  }

  return /^[0-9a-f]{6}$/i.test(value) ? value : null
}

/** One sRGB channel, 0 to 255, linearized per WCAG 2.1. */
const linearize = (channel: number): number => {
  const ratio = channel / 255
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
}

/**
 * WCAG 2.1 relative luminance, 0 for black through 1 for white. An
 * unparseable color is treated as white so the text falls back to dark.
 */
export const relativeLuminance = (color: string): number => {
  const hex = normalizeHex(color)
  if (!hex) return 1

  const red = linearize(parseInt(hex.slice(0, 2), 16))
  const green = linearize(parseInt(hex.slice(2, 4), 16))
  const blue = linearize(parseInt(hex.slice(4, 6), 16))

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

/** WCAG contrast ratio between two luminances, 1 through 21. */
const contrastRatio = (first: number, second: number): number => {
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * The legible text color for a background: whichever of the two app text
 * colors contrasts more with it. Dark wins ties, which keeps the pale swatches
 * reading the way they do today.
 */
export const readableTextColor = (background: string): string => {
  const backgroundLuminance = relativeLuminance(background)
  const darkContrast = contrastRatio(backgroundLuminance, relativeLuminance(DARK_TEXT_COLOR))
  const lightContrast = contrastRatio(backgroundLuminance, relativeLuminance(LIGHT_TEXT_COLOR))

  return lightContrast > darkContrast ? LIGHT_TEXT_COLOR : DARK_TEXT_COLOR
}
