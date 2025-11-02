import Parser from 'rss-parser'
import type { Article, FeedInfo } from '../types'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feed = await rssParser.parseURL(url) as any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feed = await rssParser.parseURL(feedUrl) as any
      articles = this.mapFeedItemsToArticles(feed.items || [])
      this.sortArticlesByDate(articles)
    } catch (error) {
      throw new FetchFailedError(feedUrl, error as Error)
    }

    return articles
  }

  private mapFeedItemsToArticles(items: unknown[]): Article[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
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

  private extractThumbnail(item: Parser.Item): string | null {
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
