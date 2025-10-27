export class FeedAlreadyExistsError extends Error {
  constructor(feedUrl: string) {
    super(`Feed already exists: ${feedUrl}`)
    this.name = 'FeedAlreadyExistsError'
  }
}
