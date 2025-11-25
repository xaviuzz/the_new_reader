import type { RssFeed } from '../types/rss'
import type { OpmlOutline } from 'opml'

export class Feed {
  constructor(
    readonly title: string,
    readonly feedUrl: string,
    readonly description: string = ''
  ) {}

  equals(other: Feed): boolean {
    return this.feedUrl === other.feedUrl
  }

  toOpmlOutline(): OpmlOutline {
    return {
      text: this.title,
      title: this.title,
      type: 'rss',
      xmlUrl: this.feedUrl,
      htmlUrl: this.feedUrl
    }
  }

  static fromRssFeed(url: string, rssFeed: RssFeed): Feed {
    return new Feed(rssFeed.title || 'Untitled Feed', url, rssFeed.description || '')
  }

  static fromOpmlOutline(outline: OpmlOutline): Feed | null {
    if (!outline.xmlUrl) {
      return null
    }

    return new Feed(outline.title || outline.text || outline.xmlUrl, outline.xmlUrl, '')
  }

  static isTitleMissing(title: string | undefined | null, feedUrl?: string): boolean {
    const trimmed = title?.trim()
    const isEmpty = !trimmed
    const isPlaceholder = trimmed === 'Untitled Feed'
    const isUrl = trimmed === feedUrl
    return isEmpty || isPlaceholder || isUrl
  }
}
