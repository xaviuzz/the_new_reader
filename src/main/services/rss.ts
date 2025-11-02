import Parser from 'rss-parser'
import type { Article, FeedInfo } from '../types'
import type { RssFeed, RssItem } from '../types/rss'
import { FetchFailedError } from '../types/errors'

export class RssService {
  async validateAndFetchFeed(url: string, parser?: Parser): Promise<FeedInfo> {
    const rssParser = parser || new Parser()

    const result: FeedInfo = {
      title: 'Untitled Feed',
      description: '',
      feedUrl: url
    }

    try {
      const feed: RssFeed = await rssParser.parseURL(url)
      if (feed.title) {
        result.title = feed.title
      }
      if (feed.description) {
        result.description = feed.description
      }
    } catch (error) {
      throw new FetchFailedError(url, error as Error)
    }

    return result
  }

  async fetchArticles(feedUrl: string, parser?: Parser): Promise<Article[]> {
    const rssParser = parser || new Parser()

    let articles: Article[] = []

    try {
      const feed: RssFeed = await rssParser.parseURL(feedUrl)
      articles = this.mapFeedItemsToArticles(feed.items || [])
      this.sortArticlesByDate(articles)
    } catch (error) {
      throw new FetchFailedError(feedUrl, error as Error)
    }

    return articles
  }

  private mapFeedItemsToArticles(items: RssItem[]): Article[] {
    return items.map((item) => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      pubDate: item.pubDate ? new Date(item.pubDate) : null,
      description: item.content || item.description || '',
      thumbnail: this.extractThumbnail(item)
    }))
  }

  private sortArticlesByDate(articles: Article[]): void {
    articles.sort((a, b) => {
      if (!a.pubDate || !b.pubDate) return 0
      return b.pubDate.getTime() - a.pubDate.getTime()
    })
  }

  private extractThumbnail(item: RssItem): string | null {
    if (item.enclosure?.url) {
      return item.enclosure.url
    }

    if (item.content?.includes('<img')) {
      const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/)
      if (imgMatch) {
        return imgMatch[1]
      }
    }

    return null
  }
}
