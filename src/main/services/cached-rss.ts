import Parser from 'rss-parser'
import type { Article, Feed } from '../domain'
import type { IRssService } from './rss'
import { CacheStorage } from './cache-storage'

export class CachedRssService implements IRssService {
  private cacheStorage: CacheStorage

  constructor(
    private rssService: IRssService,
    cacheDir: string,
    ttlMinutes: number = 60
  ) {
    this.cacheStorage = new CacheStorage(cacheDir, ttlMinutes)
    this.cacheStorage.cleanupExpired()
  }

  async validateAndFetchFeed(url: string, parser?: Parser): Promise<Feed> {
    return await this.rssService.validateAndFetchFeed(url, parser)
  }

  async fetchArticles(feedUrl: string, parser?: Parser): Promise<Article[]> {
    const cached = this.cacheStorage.get(feedUrl)

    if (cached) {
      return cached
    }

    const articles = await this.rssService.fetchArticles(feedUrl, parser)
    this.cacheStorage.set(feedUrl, articles)

    return articles
  }
}
