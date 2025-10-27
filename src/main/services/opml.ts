import * as fs from 'fs'
import * as path from 'path'
import { Feed } from '../types'
import { FeedAlreadyExistsError } from '../types/errors'
import * as opml from 'opml'

interface OpmlStructure {
  opml: {
    head?: {
      title?: string
      dateCreated?: string
      ownerName?: string
    }
    body?: {
      subs?: Array<{
        text?: string
        title?: string
        type?: string
        xmlUrl?: string
        htmlUrl?: string
      }>
    }
  }
}

export function getOpmlFilePath(baseDir: string): string {
  return path.join(baseDir, 'feeds.opml')
}

export class OpmlService {
  private readonly filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }

  private parseOpmlSync(xmlContent: string): OpmlStructure {
    let result: OpmlStructure | undefined
    let error: Error | null = null

    opml.parse(xmlContent, (err, parsed) => {
      error = err
      result = parsed
    })

    if (error) {
      throw error
    }

    return result as OpmlStructure
  }

  private stringifyOpmlSync(opmlObject: OpmlStructure): string {
    return (opml.stringify as unknown as (obj: OpmlStructure) => string)(opmlObject)
  }

  readOpmlFile(): Feed[] {
    if (!fs.existsSync(this.filePath)) {
      return []
    }

    const xmlContent = fs.readFileSync(this.filePath, 'utf-8')
    const feeds: Feed[] = []

    const result = this.parseOpmlSync(xmlContent)
    const outlines = result.opml?.body?.subs || []

    for (const outline of outlines) {
      if (outline.xmlUrl) {
        feeds.push({
          title: outline.title || outline.text || outline.xmlUrl,
          feedUrl: outline.xmlUrl
        })
      }
    }

    return feeds
  }

  writeOpmlFile(feeds: Feed[]): void {
    const opmlStructure = {
      opml: {
        head: {
          title: 'The New Reader Feeds',
          dateCreated: new Date().toUTCString(),
          ownerName: 'The New Reader'
        },
        body: {
          subs: feeds.map((feed) => ({
            text: feed.title,
            title: feed.title,
            type: 'rss',
            xmlUrl: feed.feedUrl,
            htmlUrl: feed.feedUrl
          }))
        }
      }
    }

    const dir = path.dirname(this.filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const xmlOutput = this.stringifyOpmlSync(opmlStructure)
    fs.writeFileSync(this.filePath, xmlOutput, 'utf-8')
  }

  addFeed(feed: Feed): void {
    const existingFeeds = this.readOpmlFile()

    const isDuplicate = existingFeeds.some((f) => f.feedUrl === feed.feedUrl)
    if (isDuplicate) {
      throw new FeedAlreadyExistsError(feed.feedUrl)
    }

    const updatedFeeds = [...existingFeeds, feed]
    this.writeOpmlFile(updatedFeeds)
  }

  getFeeds(): Feed[] {
    return this.readOpmlFile()
  }
}
