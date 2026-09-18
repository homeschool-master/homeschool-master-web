import { createContext } from 'react'

/**
 * The node under the app section nav that a page can render its own panel into,
 * such as the calendar filters. AppLayout owns the node and publishes it here,
 * so pages portal into it without reaching into the DOM themselves.
 */
export const SidebarSlotContext = createContext<HTMLElement | null>(null)
