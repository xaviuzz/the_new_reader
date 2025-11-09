export class FeedAlreadyExistsError extends Error {
  constructor(feedUrl: string) {
    super(`Feed already exists: ${feedUrl}`)
    this.name = 'FeedAlreadyExistsError'
  }
}

export class FetchFailedError extends Error {
  constructor(url: string, originalError?: Error) {
    const message = originalError
      ? `Failed to fetch from ${url}: ${originalError.message}`
      : `Failed to fetch from ${url}`
    super(message)
    this.name = 'FetchFailedError'
  }
}
