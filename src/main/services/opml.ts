import * as fs from 'fs'
import * as path from 'path'
import { Feed } from '../types'
import opml from 'opml-generator'

interface OpmlOutline {
  text: string
  title?: string
  type: string
  xmlUrl: string
  htmlUrl?: string
}

interface OpmlData {
  title: string
  dateCreated: Date
  ownerName?: string
  feeds: OpmlOutline[]
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

  const outlinePattern = /<outline[^>]*xmlUrl="([^"]+)"[^>]*>/g
  let match: RegExpExecArray | null

  while ((match = outlinePattern.exec(xmlContent)) !== null) {
    const outlineTag = match[0]
    const feedUrl = match[1]

    const titleMatch = /title="([^"]+)"/.exec(outlineTag)
    const textMatch = /text="([^"]+)"/.exec(outlineTag)
    const title = titleMatch ? titleMatch[1] : textMatch ? textMatch[1] : feedUrl

    feeds.push({ title, feedUrl })
  }

  return feeds
}

export function writeOpmlFile(filePath: string, feeds: Feed[]): void {
  const opmlData: OpmlData = {
    title: 'The New Reader Feeds',
    dateCreated: new Date(),
    ownerName: 'The New Reader',
    feeds: feeds.map((feed) => ({
      text: feed.title,
      title: feed.title,
      type: 'rss',
      xmlUrl: feed.feedUrl,
      htmlUrl: feed.feedUrl
    }))
  }

  const header = {
    title: opmlData.title,
    dateCreated: opmlData.dateCreated,
    ownerName: opmlData.ownerName
  }

  const outlines = opmlData.feeds

  const xmlOutput = opml(header, outlines)

  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

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
