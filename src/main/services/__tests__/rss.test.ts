import { describe, it, expect, beforeEach, vi } from 'vitest'
import Parser from 'rss-parser'
import { RssService } from '../rss'
import { FetchFailedError } from '../../types/errors'

describe('RssService', () => {
  let service: RssService
  let mockParser: Parser

  beforeEach(() => {
    service = new RssService()
    mockParser = new Parser()
  })

  describe('validateAndFetchFeed', () => {
    it('should fetch valid RSS feed metadata', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        description: 'A test feed',
        items: []
      }

      const parseUrlSpy = vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const result = await service.validateAndFetchFeed('https://example.com/feed.xml', mockParser)

      expect(result).toEqual({
        title: 'Test Feed',
        description: 'A test feed',
        feedUrl: 'https://example.com/feed.xml'
      })
      expect(parseUrlSpy).toHaveBeenCalledWith('https://example.com/feed.xml')
    })

    it('should fetch valid Atom feed metadata', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Atom Feed',
        description: 'An atom feed',
        items: []
      }

      const parseUrlSpy = vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const result = await service.validateAndFetchFeed('https://example.com/atom.xml', mockParser)

      expect(result.title).toBe('Atom Feed')
      expect(result.description).toBe('An atom feed')
      expect(result.feedUrl).toBe('https://example.com/atom.xml')
      expect(parseUrlSpy).toHaveBeenCalledWith('https://example.com/atom.xml')
    })

    it('should handle feed with missing title', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: undefined,
        description: 'Feed without title',
        items: []
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const result = await service.validateAndFetchFeed('https://example.com/feed.xml', mockParser)

      expect(result.title).toBe('Untitled Feed')
      expect(result.description).toBe('Feed without title')
    })

    it('should handle feed with missing description', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        description: undefined,
        items: []
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const result = await service.validateAndFetchFeed('https://example.com/feed.xml', mockParser)

      expect(result.title).toBe('Test Feed')
      expect(result.description).toBe('')
    })

    it('should throw error for invalid URL', async () => {
      vi.spyOn(mockParser, 'parseURL').mockRejectedValue(new Error('Network error'))

      await expect(
        service.validateAndFetchFeed(
          'https://invalid-url-that-does-not-exist.com/feed.xml',
          mockParser
        )
      ).rejects.toThrow(FetchFailedError)
    })

    it('should throw error for malformed feed', async () => {
      vi.spyOn(mockParser, 'parseURL').mockRejectedValue(new Error('Invalid XML'))

      await expect(
        service.validateAndFetchFeed('https://example.com/bad.xml', mockParser)
      ).rejects.toThrow(FetchFailedError)
    })
  })

  describe('fetchArticles', () => {
    it('should fetch and parse articles from RSS feed', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: 'Article 1',
            link: 'https://example.com/article1',
            pubDate: '2024-01-15T10:00:00Z',
            description: 'First article',
            content: 'Content 1'
          },
          {
            title: 'Article 2',
            link: 'https://example.com/article2',
            pubDate: '2024-01-14T10:00:00Z',
            description: 'Second article',
            content: 'Content 2'
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles).toHaveLength(2)
      expect(articles[0].title).toBe('Article 1')
      expect(articles[0].link).toBe('https://example.com/article1')
      expect(articles[0].description).toBe('Content 1')
    })

    it('should sort articles newest to oldest by pubDate', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: 'Old Article',
            link: 'https://example.com/old',
            pubDate: '2024-01-10T10:00:00Z'
          },
          {
            title: 'New Article',
            link: 'https://example.com/new',
            pubDate: '2024-01-20T10:00:00Z'
          },
          {
            title: 'Middle Article',
            link: 'https://example.com/middle',
            pubDate: '2024-01-15T10:00:00Z'
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles[0].title).toBe('New Article')
      expect(articles[1].title).toBe('Middle Article')
      expect(articles[2].title).toBe('Old Article')
    })

    it('should handle articles with missing pubDate', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: 'Article with date',
            link: 'https://example.com/1',
            pubDate: '2024-01-15T10:00:00Z'
          },
          {
            title: 'Article without date',
            link: 'https://example.com/2',
            pubDate: undefined
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles).toHaveLength(2)
      expect(articles.find((a) => a.title === 'Article without date')?.pubDate).toBeNull()
    })

    it('should handle articles with missing title', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: undefined,
            link: 'https://example.com/1',
            pubDate: '2024-01-15T10:00:00Z'
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles[0].title).toBe('Untitled')
    })

    it('should handle articles with missing link', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: 'Article',
            link: undefined,
            pubDate: '2024-01-15T10:00:00Z'
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles[0].link).toBe('')
    })

    it('should prefer content over description', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: 'Article',
            link: 'https://example.com/1',
            pubDate: '2024-01-15T10:00:00Z',
            description: 'Short description',
            content: 'Full content'
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles[0].description).toBe('Full content')
    })

    it('should fallback to description when content is missing', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Test Feed',
        items: [
          {
            title: 'Article',
            link: 'https://example.com/1',
            pubDate: '2024-01-15T10:00:00Z',
            description: 'Short description',
            content: undefined
          }
        ]
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles[0].description).toBe('Short description')
    })

    it('should handle empty feed with no items', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mockFeed: any = {
        title: 'Empty Feed',
        items: []
      }

      vi.spyOn(mockParser, 'parseURL').mockResolvedValue(mockFeed)

      const articles = await service.fetchArticles('https://example.com/feed.xml', mockParser)

      expect(articles).toEqual([])
    })

    it('should throw error on fetch failure', async () => {
      vi.spyOn(mockParser, 'parseURL').mockRejectedValue(new Error('Network error'))

      await expect(
        service.fetchArticles('https://example.com/feed.xml', mockParser)
      ).rejects.toThrow(FetchFailedError)
    })
  })
})
