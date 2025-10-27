declare module 'opml-generator' {
  interface OpmlHeader {
    title: string
    dateCreated: Date
    ownerName?: string
  }

  interface OpmlOutline {
    text: string
    title?: string
    type: string
    xmlUrl: string
    htmlUrl?: string
  }

  function opmlGenerator(header: OpmlHeader, outlines: OpmlOutline[]): string

  export default opmlGenerator
}
