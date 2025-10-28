export interface Feed {
  title: string
  feedUrl: string
}

export interface FeedInfo {
  title: string
  description: string
  feedUrl: string
}

export interface Article {
  title: string
  link: string
  pubDate: Date | null
  description: string
  thumbnail: string | null
}
