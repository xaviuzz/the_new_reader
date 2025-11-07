import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import type { Article } from '../../domain'
import { Article as ArticleClass, Feed } from '../../domain'
import type { IRssService } from '../rss'
import { CachedRssService } from '../cached-rss'

class MockRssService implements IRssService {
  callCount = 0

  async validateAndFetchFeed(url: string): Promise<Feed> {
    return new Feed('Test Feed', url, 'Test Description')
  }

  async fetchArticles(_feedUrl: string): Promise<Article[]> {
    this.callCount++
    return [
      new ArticleClass('Article 1', 'https://example.com/1', new Date(), 'Description 1', null),
      new ArticleClass('Article 2', 'https://example.com/2', new Date(), 'Description 2', null)
    ]
  }
}

describe('CachedRssService', () => {
  let cacheDir: string
  let mockRssService: MockRssService
  let cachedService: CachedRssService

  beforeEach(() => {
    cacheDir = mkdtempSync(join(tmpdir(), 'cache-test-'))
    mockRssService = new MockRssService()
    cachedService = new CachedRssService(mockRssService, cacheDir, 60)
  })

  afterEach(() => {
    rmSync(cacheDir, { recursive: true, force: true })
  })

  it('should call wrapped service on first fetch', async () => {
    const feedUrl = 'https://example.com/feed.xml'

    const articles = await cachedService.fetchArticles(feedUrl)

    expect(mockRssService.callCount).toBe(1)
    expect(articles.length).toBe(2)
  })

  it('should return cached articles on second fetch', async () => {
    const feedUrl = 'https://example.com/feed.xml'

    await cachedService.fetchArticles(feedUrl)
    const cachedArticles = await cachedService.fetchArticles(feedUrl)

    expect(mockRssService.callCount).toBe(1)
    expect(cachedArticles.length).toBe(2)
  })

  it('should create cache file on disk', async () => {
    const feedUrl = 'https://example.com/feed.xml'

    await cachedService.fetchArticles(feedUrl)

    const files = readdirSync(cacheDir)
    expect(files.length).toBe(1)

    const cacheFile = readFileSync(join(cacheDir, files[0]), 'utf-8')
    const cacheData = JSON.parse(cacheFile)

    expect(cacheData.feedUrl).toBe(feedUrl)
    expect(cacheData.articles.length).toBe(2)
    expect(cacheData.fetchedAt).toBeDefined()
  })

  it('should expire cache after TTL', async () => {
    vi.useFakeTimers()
    const feedUrl = 'https://example.com/feed.xml'

    await cachedService.fetchArticles(feedUrl)
    expect(mockRssService.callCount).toBe(1)

    vi.advanceTimersByTime(61 * 60 * 1000)

    const newCachedService = new CachedRssService(mockRssService, cacheDir, 60)
    await newCachedService.fetchArticles(feedUrl)

    expect(mockRssService.callCount).toBe(2)

    vi.useRealTimers()
  })

  it('should handle multiple feeds independently', async () => {
    const feedUrl1 = 'https://example.com/feed1.xml'
    const feedUrl2 = 'https://example.com/feed2.xml'

    await cachedService.fetchArticles(feedUrl1)
    await cachedService.fetchArticles(feedUrl2)
    await cachedService.fetchArticles(feedUrl1)

    expect(mockRssService.callCount).toBe(2)
  })

  it('should pass through validateAndFetchFeed to wrapped service', async () => {
    const feedUrl = 'https://example.com/feed.xml'

    const feed = await cachedService.validateAndFetchFeed(feedUrl)

    expect(feed.title).toBe('Test Feed')
    expect(feed.feedUrl).toBe(feedUrl)
  })

  it('should cleanup expired cache files on instantiation', async () => {
    const feedUrl = 'https://example.com/feed.xml'
    vi.useFakeTimers()
    const now = new Date()
    vi.setSystemTime(now)

    await cachedService.fetchArticles(feedUrl)

    vi.advanceTimersByTime(61 * 60 * 1000)

    const newCachedService = new CachedRssService(mockRssService, cacheDir, 60)

    const files = readdirSync(cacheDir)
    expect(files.length).toBe(0)

    vi.useRealTimers()
  })
})
