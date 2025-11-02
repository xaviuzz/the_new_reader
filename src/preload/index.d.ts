import { ElectronAPI } from '@electron-toolkit/preload'
import type { Feed, Article } from '../main/domain'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      addFeed: (url: string) => Promise<Feed>
      listFeeds: () => Promise<Feed[]>
      getArticles: (feedUrl: string) => Promise<Article[]>
    }
  }
}
