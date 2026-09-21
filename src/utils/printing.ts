/**
 * Printing a report card, and the PDF that comes out of the same act.
 *
 * The PDF is not generated anywhere: it is this page, printed, with the
 * browser's own "Save as PDF" destination. That is what keeps the printed
 * sheet and the PDF identical, because they are one layout rather than two,
 * and it is what makes the PDF's text real text a reader can select and
 * search, since the browser lays out type rather than drawing a picture of it.
 */

/** Characters a file system will not take, and runs of spaces. */
const FILE_SAFE = /[\\/:*?"<>|]+/g

/**
 * What the browser will call the file.
 *
 * Print to PDF takes its default filename from the document title, so the
 * title is the filename: there is no Content-Disposition to set when nothing
 * is being downloaded from a server.
 */
export const printFileName = (student: string, title: string, version: number): string =>
  `${student} report card, ${title} (v${version})`.replace(FILE_SAFE, ' ').replace(/\s+/g, ' ').trim()

/**
 * Waits for the web font before opening the print dialog.
 *
 * Without this the sheet can go to the printer in a fallback face, because
 * print() is synchronous and does not wait for anything still loading. The
 * card is the one page in the app where the type is the design.
 */
export const printReportCard = async (): Promise<void> => {
  try {
    await document.fonts.ready
  } catch {
    // An older browser with no font loading API still prints, just without
    // the guarantee: not a reason to refuse to print.
  }

  window.print()
}
