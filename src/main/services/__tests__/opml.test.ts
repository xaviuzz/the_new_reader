import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { getOpmlFilePath, readOpmlFile, writeOpmlFile, addFeed, getFeeds } from '../opml'
import { Feed } from '../../types'

describe('OPML Service', () => {
  let testDir: string
  let testFilePath: string

  beforeEach(() => {
    // Create a temporary directory for each test
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opml-test-'))
    testFilePath = path.join(testDir, 'feeds.opml')
  })

  afterEach(() => {
    // Clean up temporary directory
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
      const result = readOpmlFile(testFilePath)
      expect(result).toEqual([])
    })

    it('should read feeds from existing OPML file', () => {
      const feeds: Feed[] = [
        { title: 'BBC News', feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml' },
        { title: 'NY Times', feedUrl: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml' }
      ]

      writeOpmlFile(testFilePath, feeds)
      const result = readOpmlFile(testFilePath)

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

      writeOpmlFile(testFilePath, feeds)

      expect(fs.existsSync(testFilePath)).toBe(true)
      const content = fs.readFileSync(testFilePath, 'utf-8')
      expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(content).toContain('<opml version="2.0">')
      expect(content).toContain('Test Feed')
      expect(content).toContain('https://example.com/feed.xml')
    })

    it('should create directory if it does not exist', () => {
      const nestedPath = path.join(testDir, 'nested', 'path', 'feeds.opml')
      const feeds: Feed[] = [{ title: 'Test', feedUrl: 'https://example.com/feed.xml' }]

      writeOpmlFile(nestedPath, feeds)

      expect(fs.existsSync(nestedPath)).toBe(true)
    })

    it('should handle empty feeds array', () => {
      writeOpmlFile(testFilePath, [])

      expect(fs.existsSync(testFilePath)).toBe(true)
      const result = readOpmlFile(testFilePath)
      expect(result).toEqual([])
    })

    it('should overwrite existing file', () => {
      const feeds1: Feed[] = [{ title: 'Feed 1', feedUrl: 'https://example.com/1.xml' }]
      const feeds2: Feed[] = [{ title: 'Feed 2', feedUrl: 'https://example.com/2.xml' }]

      writeOpmlFile(testFilePath, feeds1)
      writeOpmlFile(testFilePath, feeds2)

      const result = readOpmlFile(testFilePath)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Feed 2')
    })
  })

  describe('addFeed', () => {
    it('should add feed to empty file', () => {
      const feed: Feed = { title: 'New Feed', feedUrl: 'https://example.com/feed.xml' }
      const result = addFeed(testFilePath, feed)

      expect(result).toBe(true)
      const feeds = readOpmlFile(testFilePath)
      expect(feeds).toHaveLength(1)
      expect(feeds[0]).toEqual(feed)
    })

    it('should add feed to existing feeds', () => {
      const feed1: Feed = { title: 'Feed 1', feedUrl: 'https://example.com/1.xml' }
      const feed2: Feed = { title: 'Feed 2', feedUrl: 'https://example.com/2.xml' }

      addFeed(testFilePath, feed1)
      addFeed(testFilePath, feed2)

      const feeds = readOpmlFile(testFilePath)
      expect(feeds).toHaveLength(2)
      expect(feeds[0]).toEqual(feed1)
      expect(feeds[1]).toEqual(feed2)
    })

    it('should prevent duplicate feeds by URL', () => {
      const feed1: Feed = { title: 'Feed 1', feedUrl: 'https://example.com/feed.xml' }
      const feed2: Feed = { title: 'Feed 1 Different Title', feedUrl: 'https://example.com/feed.xml' }

      const result1 = addFeed(testFilePath, feed1)
      const result2 = addFeed(testFilePath, feed2)

      expect(result1).toBe(true)
      expect(result2).toBe(false)

      const feeds = readOpmlFile(testFilePath)
      expect(feeds).toHaveLength(1)
      expect(feeds[0].title).toBe('Feed 1')
    })

    it('should allow feeds with different URLs', () => {
      const feed1: Feed = { title: 'Same Title', feedUrl: 'https://example.com/1.xml' }
      const feed2: Feed = { title: 'Same Title', feedUrl: 'https://example.com/2.xml' }

      const result1 = addFeed(testFilePath, feed1)
      const result2 = addFeed(testFilePath, feed2)

      expect(result1).toBe(true)
      expect(result2).toBe(true)

      const feeds = readOpmlFile(testFilePath)
      expect(feeds).toHaveLength(2)
    })
  })

  describe('getFeeds', () => {
    it('should return empty array when file does not exist', () => {
      const result = getFeeds(testFilePath)
      expect(result).toEqual([])
    })

    it('should return all feeds', () => {
      const feeds: Feed[] = [
        { title: 'Feed 1', feedUrl: 'https://example.com/1.xml' },
        { title: 'Feed 2', feedUrl: 'https://example.com/2.xml' },
        { title: 'Feed 3', feedUrl: 'https://example.com/3.xml' }
      ]

      writeOpmlFile(testFilePath, feeds)
      const result = getFeeds(testFilePath)

      expect(result).toHaveLength(3)
      expect(result).toEqual(feeds)
    })
  })

  describe('Multiple operations', () => {
    it('should handle multiple add and read operations correctly', () => {
      const feed1: Feed = { title: 'Feed 1', feedUrl: 'https://example.com/1.xml' }
      const feed2: Feed = { title: 'Feed 2', feedUrl: 'https://example.com/2.xml' }
      const feed3: Feed = { title: 'Feed 3', feedUrl: 'https://example.com/3.xml' }

      addFeed(testFilePath, feed1)
      let feeds = getFeeds(testFilePath)
      expect(feeds).toHaveLength(1)

      addFeed(testFilePath, feed2)
      feeds = getFeeds(testFilePath)
      expect(feeds).toHaveLength(2)

      addFeed(testFilePath, feed3)
      feeds = getFeeds(testFilePath)
      expect(feeds).toHaveLength(3)

      // Try to add duplicate
      addFeed(testFilePath, feed1)
      feeds = getFeeds(testFilePath)
      expect(feeds).toHaveLength(3)
    })
  })
})
