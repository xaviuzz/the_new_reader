declare module 'opml' {
  interface OpmlHead {
    title?: string
    dateCreated?: string
    dateModified?: string
    ownerName?: string
    ownerEmail?: string
    [key: string]: unknown
  }

  interface OpmlOutline {
    text?: string
    type?: string
    xmlUrl?: string
    htmlUrl?: string
    title?: string
    [key: string]: unknown
    subs?: OpmlOutline[]
  }

  interface OpmlStructure {
    opml: {
      head?: OpmlHead
      body?: {
        subs?: OpmlOutline[]
      }
    }
  }

  export function parse(
    opmlText: string,
    callback: (err: Error | null, result?: OpmlStructure) => void
  ): void
  export function stringify(
    opmlObject: OpmlStructure,
    callback: (err: Error | null, result?: string) => void
  ): void
}
