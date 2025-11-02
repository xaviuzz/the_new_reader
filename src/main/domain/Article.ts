import type { RssItem } from '../types/rss'

export class Article {
  constructor(
    readonly title: string,
    readonly link: string,
    readonly pubDate: Date | null,
    readonly description: string,
    readonly thumbnail: string | null
  ) {}

  static fromRssItem(item: RssItem): Article {
    return new Article(
      item.title || 'Untitled',
      item.link || '',
      item.pubDate ? new Date(item.pubDate) : null,
      item.content || item.description || '',
      Article.extractThumbnail(item)
    )
  }

  private static extractThumbnail(item: RssItem): string | null {
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

  static compareByDateDesc(a: Article, b: Article): number {
    if (!a.pubDate || !b.pubDate) return 0
    return b.pubDate.getTime() - a.pubDate.getTime()
  }
}
