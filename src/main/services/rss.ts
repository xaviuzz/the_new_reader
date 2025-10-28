import Parser from 'rss-parser'
import type { Article, FeedInfo } from '../types'
import { FetchFailedError } from '../types/errors'

export class RssService {
  async validateAndFetchFeed(url: string, parser?: Parser): Promise<FeedInfo> {
    const rssParser = parser || new Parser()

    try {
      const feed = await rssParser.parseURL(url)

      return {
        title: feed.title || 'Untitled Feed',
        description: feed.description || '',
        feedUrl: url
      }
    } catch (error) {
      throw new FetchFailedError(url, error as Error)
    }
  }

  async fetchArticles(feedUrl: string, parser?: Parser): Promise<Article[]> {
    const rssParser = parser || new Parser()

    try {
      const feed = await rssParser.parseURL(feedUrl)

      const articles = (feed.items || []).map((item) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate) : null,
        description: item.content || item.description || '',
        thumbnail: this.extractThumbnail(item)
      }))

      return articles.sort((a, b) => {
        if (!a.pubDate || !b.pubDate) return 0
        return b.pubDate.getTime() - a.pubDate.getTime()
      })
    } catch (error) {
      throw new FetchFailedError(feedUrl, error as Error)
    }
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
