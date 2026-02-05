import type { RssItem } from '../types/rss'

export class Article {
  constructor(
    readonly title: string,
    readonly link: string,
    readonly pubDate: Date | null,
    readonly description: string
  ) {}

  static fromRssItem(item: RssItem): Article {
    return new Article(
      item.title || 'Untitled',
      item.link || '',
      item.pubDate ? new Date(item.pubDate) : null,
      item['content:encoded'] || item.content || item.description || ''
    )
  }

  static compareByDateDesc(a: Article, b: Article): number {
    if (!a.pubDate || !b.pubDate) return 0
    return b.pubDate.getTime() - a.pubDate.getTime()
  }
}
