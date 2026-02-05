import * as fs from 'fs'
import * as path from 'path'
import { Feed } from '../domain'
import { FeedAlreadyExistsError } from '../types/errors'
import type { OpmlOutline } from '../types/opml'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

const ATTR = '@_'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ATTR,
  isArray: (name: string) => name === 'outline'
})

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: ATTR,
  format: true
})

function toOutline(node: Record<string, string>): OpmlOutline {
  return {
    text: node[`${ATTR}text`],
    title: node[`${ATTR}title`],
    type: node[`${ATTR}type`],
    xmlUrl: node[`${ATTR}xmlUrl`],
    htmlUrl: node[`${ATTR}htmlUrl`]
  }
}

function toNode(outline: OpmlOutline): Record<string, string | undefined> {
  return {
    [`${ATTR}text`]: outline.text,
    [`${ATTR}title`]: outline.title,
    [`${ATTR}type`]: outline.type,
    [`${ATTR}xmlUrl`]: outline.xmlUrl,
    [`${ATTR}htmlUrl`]: outline.htmlUrl
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

  readOpmlFile(): Feed[] {
    if (!fs.existsSync(this.filePath)) {
      return []
    }

    const xmlContent = fs.readFileSync(this.filePath, 'utf-8')
    const parsed = parser.parse(xmlContent)
    const outlines: Record<string, string>[] = parsed?.opml?.body?.outline || []

    return outlines
      .map((node) => Feed.fromOpmlOutline(toOutline(node)))
      .filter((feed): feed is Feed => feed !== null)
  }

  writeOpmlFile(feeds: Feed[]): void {
    const opmlDocument = {
      '?xml': { [`${ATTR}version`]: '1.0', [`${ATTR}encoding`]: 'UTF-8' },
      opml: {
        [`${ATTR}version`]: '2.0',
        head: {
          title: 'The New Reader Feeds',
          dateCreated: new Date().toUTCString(),
          ownerName: 'The New Reader'
        },
        body: {
          outline: feeds.map((feed) => toNode(feed.toOpmlOutline()))
        }
      }
    }

    const dir = path.dirname(this.filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const xmlOutput = builder.build(opmlDocument)
    fs.writeFileSync(this.filePath, xmlOutput, 'utf-8')
  }

  addFeed(feed: Feed): void {
    const existingFeeds = this.readOpmlFile()

    const isDuplicate = existingFeeds.some((f) => f.equals(feed))
    if (isDuplicate) {
      throw new FeedAlreadyExistsError(feed.feedUrl)
    }

    const updatedFeeds = [...existingFeeds, feed]
    this.writeOpmlFile(updatedFeeds)
  }

  getFeeds(): Feed[] {
    return this.readOpmlFile()
  }

  deleteFeed(feedUrl: string): void {
    const existingFeeds = this.readOpmlFile()
    const updatedFeeds = existingFeeds.filter((feed) => feed.feedUrl !== feedUrl)

    if (updatedFeeds.length === existingFeeds.length) {
      throw new Error(`Feed with URL ${feedUrl} not found`)
    }

    this.writeOpmlFile(updatedFeeds)
  }

  updateFeedTitle(feedUrl: string, newTitle: string): void {
    if (Feed.isTitleMissing(newTitle)) {
      return
    }

    const existingFeeds = this.readOpmlFile()
    const feedIndex = existingFeeds.findIndex((f) => f.feedUrl === feedUrl)

    if (feedIndex === -1) {
      throw new Error(`Feed with URL ${feedUrl} not found`)
    }

    const feed = existingFeeds[feedIndex]
    const updatedFeed = new Feed(newTitle, feed.feedUrl, feed.description)
    existingFeeds[feedIndex] = updatedFeed

    this.writeOpmlFile(existingFeeds)
  }
}
