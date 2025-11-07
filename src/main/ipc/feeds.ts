import { ipcMain } from 'electron'
import { OpmlService } from '../services/opml'
import { RssService } from '../services/rss'
import { CachedRssService } from '../services/cached-rss'

export function setupFeedHandlers(opmlFilePath: string, cacheDir: string): void {
  const opmlService = new OpmlService(opmlFilePath)
  const baseRssService = new RssService()
  const rssService = new CachedRssService(baseRssService, cacheDir, 60)

  ipcMain.handle('feeds:add', async (_event, url: string) => {
    const feed = await rssService.validateAndFetchFeed(url)
    opmlService.addFeed(feed)
    return feed
  })

  ipcMain.handle('feeds:list', () => {
    return opmlService.getFeeds()
  })

  ipcMain.handle('feeds:getArticles', async (_event, feedUrl: string) => {
    return await rssService.fetchArticles(feedUrl)
  })
}
