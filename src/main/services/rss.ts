import Parser from 'rss-parser'
import { Article, Feed } from '../domain'
import type { RssFeed, RssItem } from '../types/rss'
import { FetchFailedError } from '../types/errors'

export class RssService {
  async validateAndFetchFeed(url: string, parser?: Parser): Promise<Feed> {
    const rssParser = parser || new Parser()

    try {
      const rssFeed: RssFeed = await rssParser.parseURL(url)
      return Feed.fromRssFeed(url, rssFeed)
    } catch (error) {
      throw new FetchFailedError(url, error as Error)
    }
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
    return items.map((item) => Article.fromRssItem(item))
  }

  private sortArticlesByDate(articles: Article[]): void {
    articles.sort(Article.compareByDateDesc)
  }
}
