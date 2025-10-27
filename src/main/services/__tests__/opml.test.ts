import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { getOpmlFilePath, OpmlService } from '../opml'
import { Feed } from '../../types'
import { FeedAlreadyExistsError } from '../../types/errors'

describe('OPML Service', () => {
  let testDir: string
  let testFilePath: string
  let opmlService: OpmlService

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opml-test-'))
    testFilePath = path.join(testDir, 'feeds.opml')
    opmlService = new OpmlService(testFilePath)
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true })
    }
  })

  describe('getOpmlFilePath', () => {
    it('should return correct path with baseDir', () => {
      const result = getOpmlFilePath('/test/dir')
      expect(result).toBe('/test/dir/feeds.opml')
    })

    it('should handle paths with trailing slash', () => {
      const result = getOpmlFilePath('/test/dir/')
      expect(result).toBe('/test/dir/feeds.opml')
    })
  })

  describe('readOpmlFile', () => {
    it('should return empty array when file does not exist', () => {
      const result = opmlService.readOpmlFile()
      expect(result).toEqual([])
    })

    it('should read feeds from existing OPML file', () => {
      const feeds: Feed[] = [
        { title: 'BBC News', feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
        { title: 'NY Times', feedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' }
      ]

      opmlService.writeOpmlFile(feeds)
      const result = opmlService.readOpmlFile()

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('BBC News')
      expect(result[0].feedUrl).toBe('https://feeds.bbci.co.uk/news/rss.xml')
      expect(result[1].title).toBe('NY Times')
      expect(result[1].feedUrl).toBe('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')
    })
  })

  describe('writeOpmlFile', () => {
    it('should create valid OPML file with feeds', () => {
      const feeds: Feed[] = [
        { title: 'Test Feed', feedUrl: 'https://example.com/feed.xml' }
      ]

      opmlService.writeOpmlFile(feeds)

      expect(fs.existsSync(testFilePath)).toBe(true)
      const content = fs.readFileSync(testFilePath, 'utf-8')
      expect(content).toContain('<?xml')
      expect(content).toContain('<opml version="2.0">')
      expect(content).toContain('Test Feed')
      expect(content).toContain('https://example.com/feed.xml')
    })

    it('should create directory if it does not exist', () => {
      const nestedPath = path.join(testDir, 'nested', 'path', 'feeds.opml')
      const nestedService = new OpmlService(nestedPath)
      const feeds: Feed[] = [{ title: 'Test', feedUrl: 'https://example.com/feed.xml' }]

      nestedService.writeOpmlFile(feeds)

      expect(fs.existsSync(nestedPath)).toBe(true)
    })

    it('should handle empty feeds array', () => {
      opmlService.writeOpmlFile([])

      expect(fs.existsSync(testFilePath)).toBe(true)
      const result = opmlService.readOpmlFile()
      expect(result).toEqual([])
    })

    it('should overwrite existing file', () => {
      const feeds1: Feed[] = [{ title: 'Feed 1', feedUrl: 'https://example.com/1.xml' }]
      const feeds2: Feed[] = [{ title: 'Feed 2', feedUrl: 'https://example.com/2.xml' }]

      opmlService.writeOpmlFile(feeds1)
      opmlService.writeOpmlFile(feeds2)

      const result = opmlService.readOpmlFile()
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Feed 2')
    })
  })

  describe('addFeed', () => {
    it('should add feed to empty file', () => {
      const feed: Feed = { title: 'New Feed', feedUrl: 'https://example.com/feed.xml' }
      opmlService.addFeed(feed)

      const feeds = opmlService.readOpmlFile()
      expect(feeds).toHaveLength(1)
      expect(feeds[0]).toEqual(feed)
    })

    it('should add feed to existing feeds', () => {
      const feed1: Feed = { title: 'Feed 1', feedUrl: 'https://example.com/1.xml' }
      const feed2: Feed = { title: 'Feed 2', feedUrl: 'https://example.com/2.xml' }

      opmlService.addFeed(feed1)
      opmlService.addFeed(feed2)

      const feeds = opmlService.readOpmlFile()
      expect(feeds).toHaveLength(2)
      expect(feeds[0]).toEqual(feed1)
      expect(feeds[1]).toEqual(feed2)
    })

    it('should throw FeedAlreadyExistsError for duplicate feeds by URL', () => {
      const feed1: Feed = { title: 'Feed 1', feedUrl: 'https://example.com/feed.xml' }
      const feed2: Feed = { title: 'Feed 1 Different Title', feedUrl: 'https://example.com/feed.xml' }

      opmlService.addFeed(feed1)

      expect(() => opmlService.addFeed(feed2)).toThrow(FeedAlreadyExistsError)
      expect(() => opmlService.addFeed(feed2)).toThrow('Feed already exists: https://example.com/feed.xml')

      const feeds = opmlService.readOpmlFile()
      expect(feeds).toHaveLength(1)
      expect(feeds[0].title).toBe('Feed 1')
    })

    it('should allow feeds with different URLs', () => {
      const feed1: Feed = { title: 'Same Title', feedUrl: 'https://example.com/1.xml' }
      const feed2: Feed = { title: 'Same Title', feedUrl: 'https://example.com/2.xml' }

      opmlService.addFeed(feed1)
      opmlService.addFeed(feed2)

      const feeds = opmlService.readOpmlFile()
      expect(feeds).toHaveLength(2)
    })
  })

  describe('getFeeds', () => {
    it('should return empty array when file does not exist', () => {
      const result = opmlService.getFeeds()
      expect(result).toEqual([])
    })

    it('should return all feeds', () => {
      const feeds: Feed[] = [
        { title: 'Feed 1', feedUrl: 'https://example.com/1.xml' },
        { title: 'Feed 2', feedUrl: 'https://example.com/2.xml' },
        { title: 'Feed 3', feedUrl: 'https://example.com/3.xml' }
      ]

      opmlService.writeOpmlFile(feeds)
      const result = opmlService.getFeeds()

      expect(result).toHaveLength(3)
      expect(result).toEqual(feeds)
    })
  })

  describe('Multiple operations', () => {
    it('should handle multiple add and read operations correctly', () => {
      const feed1: Feed = { title: 'Feed 1', feedUrl: 'https://example.com/1.xml' }
      const feed2: Feed = { title: 'Feed 2', feedUrl: 'https://example.com/2.xml' }
      const feed3: Feed = { title: 'Feed 3', feedUrl: 'https://example.com/3.xml' }

      opmlService.addFeed(feed1)
      let feeds = opmlService.getFeeds()
      expect(feeds).toHaveLength(1)

      opmlService.addFeed(feed2)
      feeds = opmlService.getFeeds()
      expect(feeds).toHaveLength(2)

      opmlService.addFeed(feed3)
      feeds = opmlService.getFeeds()
      expect(feeds).toHaveLength(3)

      expect(() => opmlService.addFeed(feed1)).toThrow(FeedAlreadyExistsError)
      feeds = opmlService.getFeeds()
      expect(feeds).toHaveLength(3)
    })
  })
})
