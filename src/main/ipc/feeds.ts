import { ipcMain } from 'electron'
import { OpmlService } from '../services/opml'
import { RssService } from '../services/rss'
import { CachedRssService } from '../services/cached-rss'
import { FeedTitleUpdater } from '../services/feed-title-updater'
import { ReadArticlesStorage } from '../services/read-articles-storage'

export function setupFeedHandlers(opmlFilePath: string, cacheDir: string, readArticlesPath: string): void {
  const opmlService = new OpmlService(opmlFilePath)
  const baseRssService = new RssService()
  const rssService = new CachedRssService(baseRssService, cacheDir, 60)
  const readArticlesStorage = new ReadArticlesStorage(readArticlesPath)

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

  ipcMain.handle('feeds:delete', async (_event, feedUrl: string) => {
    opmlService.deleteFeed(feedUrl)
    rssService.clearCache(feedUrl)
  })

  ipcMain.handle('feeds:refresh', async (_event, feedUrl: string) => {
    rssService.clearCache(feedUrl)
    return await rssService.fetchArticles(feedUrl)
  })

  ipcMain.handle('feeds:refreshTitles', async () => {
    const updater = new FeedTitleUpdater(opmlService, baseRssService)
    return await updater.checkAndUpdateMissingTitles()
  })

  ipcMain.handle('articles:markAsRead', async (_event, link: string) => {
    readArticlesStorage.add(link)
  })

  ipcMain.handle('articles:getReadArticles', async () => {
    return readArticlesStorage.getAll()
  })
}
