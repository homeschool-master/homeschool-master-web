import { useEffect, useId, useRef, useState } from 'react'

interface HintTooltipProps {
  /** The explanation itself. Drawn by the tooltip, and read by screen readers. */
  text: string
  /** What the control is, since the visible glyph is only a question mark. */
  label: string
  /** Anchors the bubble to an edge when the control sits near one. */
  align?: 'center' | 'start' | 'end'
}

/**
 * The instant tooltip on a control that has something to explain.
 *
 * A button rather than a span, for the one reason that decides this component:
 * hover does not exist on a phone, and :focus-visible does not match a tap, so
 * a hover only tooltip is invisible to every touch user. Tapping toggles
 * data-tooltip-open, which the tooltip mixin shows on exactly the same terms
 * as hover. Pointer, keyboard and touch all reach the same text.
 *
 * The text is also in the document rather than only in the pseudo element the
 * mixin draws: generated content is not a DOM node, so it can never be read
 * out. aria-describedby points at a visually hidden copy, which is what a
 * screen reader announces after the button's own name.
 */
const HintTooltip = ({ text, label, align = 'center' }: HintTooltipProps) => {
  const [open, setOpen] = useState(false)
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Only while it is open, and dismissed the same two ways every other
  // transient thing in the app is: Escape, or a tap somewhere else.
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      setOpen(false)
      buttonRef.current?.focus()
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [open])

  return (
    <>
      <button
        type='button'
        ref={buttonRef}
        className={`hint-tooltip hint-tooltip--tooltip-${align}`}
        data-tooltip={text}
        data-tooltip-open={open ? 'true' : 'false'}
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span aria-hidden='true'>?</span>
      </button>
      <span id={id} className='hint-tooltip__text'>
        {text}
      </span>
    </>
  )
}

export default HintTooltip
