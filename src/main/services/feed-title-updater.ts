import { Feed } from '../domain'
import { OpmlService } from './opml'
import { RssService } from './rss'

export interface UpdateResult {
  successful: number
  failed: number
  skipped: number
}

export class FeedTitleUpdater {
  private opmlService: OpmlService
  private rssService: RssService

  constructor(opmlService: OpmlService, rssService: RssService) {
    this.opmlService = opmlService
    this.rssService = rssService
  }

  async checkAndUpdateMissingTitles(): Promise<UpdateResult> {
    const result: UpdateResult = {
      successful: 0,
      failed: 0,
      skipped: 0
    }

    const feeds = this.opmlService.getFeeds()
    const feedsWithMissingTitles = feeds.filter((f) => Feed.isTitleMissing(f.title, f.feedUrl))

    for (const feed of feedsWithMissingTitles) {
      try {
        const fetchedFeed = await this.rssService.validateAndFetchFeed(feed.feedUrl)
        this.opmlService.updateFeedTitle(feed.feedUrl, fetchedFeed.title)
        result.successful++
      } catch (error) {
        result.failed++
      }
    }

    result.skipped = feeds.length - feedsWithMissingTitles.length

    return result
  }
}
