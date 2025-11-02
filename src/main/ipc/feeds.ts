import { ipcMain } from 'electron'
import { OpmlService } from '../services/opml'
import { RssService } from '../services/rss'

export function setupFeedHandlers(opmlFilePath: string): void {
  const opmlService = new OpmlService(opmlFilePath)
  const rssService = new RssService()

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
