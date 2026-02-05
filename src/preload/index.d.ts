import { ElectronAPI } from '@electron-toolkit/preload'
import type { Feed, Article } from '../main/domain'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      addFeed: (url: string) => Promise<Feed>
      listFeeds: () => Promise<Feed[]>
      getArticles: (feedUrl: string) => Promise<Article[]>
      deleteFeed: (feedUrl: string) => Promise<void>
      refreshFeed: (feedUrl: string) => Promise<Article[]>
      refreshTitles: () => Promise<{ successful: number; failed: number; skipped: number }>
      openExternalLink: (url: string) => Promise<void>
      markArticleAsRead: (link: string) => Promise<void>
      getReadArticles: () => Promise<string[]>
    }
  }
}
