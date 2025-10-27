import * as fs from 'fs'
import * as path from 'path'
import { Feed } from '../types'
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

function parseOpmlSync(xmlContent: string): OpmlStructure {
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

function stringifyOpmlSync(opmlObject: OpmlStructure): string {
  return (opml.stringify as unknown as (obj: OpmlStructure) => string)(opmlObject)
}

export function getOpmlFilePath(baseDir: string): string {
  return path.join(baseDir, 'feeds.opml')
}

export function readOpmlFile(filePath: string): Feed[] {
  if (!fs.existsSync(filePath)) {
    return []
  }

  const xmlContent = fs.readFileSync(filePath, 'utf-8')
  const feeds: Feed[] = []

  const result = parseOpmlSync(xmlContent)
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

export function writeOpmlFile(filePath: string, feeds: Feed[]): void {
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

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const xmlOutput = stringifyOpmlSync(opmlStructure)
  fs.writeFileSync(filePath, xmlOutput, 'utf-8')
}

export function addFeed(filePath: string, feed: Feed): boolean {
  const existingFeeds = readOpmlFile(filePath)

  const isDuplicate = existingFeeds.some((f) => f.feedUrl === feed.feedUrl)
  if (isDuplicate) {
    return false
  }

  const updatedFeeds = [...existingFeeds, feed]
  writeOpmlFile(filePath, updatedFeeds)
  return true
}

export function getFeeds(filePath: string): Feed[] {
  return readOpmlFile(filePath)
}
