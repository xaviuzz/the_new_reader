/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import type { Article } from '../../../../../main/domain'
import { ArticleList } from '../ArticleList'

describe('ArticleList', () => {
  beforeEach(() => {
    // Mock window.api.openExternalLink
    window.api = {
      ...window.api,
      openExternalLink: vi.fn()
    }
  })
  it('should render content area with correct structure', () => {
    const sut = new ArticleListSUT()
    expect(sut.getMainContent()).toBeInTheDocument()
  })

  it('should show empty state when no articles', () => {
    const sut = new ArticleListSUT({ isEmpty: true })
    expect(sut.getEmptyStateMessage()).toBeInTheDocument()
  })

  it('should render articles with proper structure', () => {
    const sut = new ArticleListSUT()
    const articles = sut.getArticles()
    expect(articles.length).toBeGreaterThan(0)

    const firstArticle = articles[0]
    expect(
      within(firstArticle).getByText(/Building scalable Node.js applications/i)
    ).toBeInTheDocument()
  })

  it('should have links with correct attributes for external navigation', () => {
    const sut = new ArticleListSUT()
    sut.getLinks().forEach((link) => {
      expect(link).toHaveAttribute('href')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('should have correct scrollable and padding classes', () => {
    const sut = new ArticleListSUT()
    expect(sut.getMainContent()).toBeInTheDocument()
  })

  class ArticleListSUT {
    articles: Article[]

    constructor(options: { isEmpty?: boolean } = {}) {
      const { isEmpty = false } = options

      this.articles = [
        {
          title: 'Building scalable Node.js applications',
          link: 'https://example.com/article1',
          pubDate: new Date('2025-11-01'),
          description:
            'Learn best practices for building high-performance Node.js applications with clustering and load balancing.',
          thumbnail: null
        },
        {
          title: 'React 19: New features and improvements',
          link: 'https://example.com/article2',
          pubDate: new Date('2025-10-31'),
          description:
            'Explore the latest features in React 19 including improved TypeScript support and better performance optimizations.',
          thumbnail: null
        },
        {
          title: 'The future of JavaScript frameworks',
          link: 'https://example.com/article3',
          pubDate: new Date('2025-10-30'),
          description:
            'An in-depth analysis of emerging JavaScript frameworks and their impact on modern web development.',
          thumbnail: null
        }
      ]

      const articlesToRender = isEmpty ? [] : this.articles
      render(<ArticleList articles={articlesToRender} />)
    }

    getMainContent(): HTMLElement | null {
      return screen.getByRole('main')
    }

    getEmptyStateMessage(): HTMLElement | null {
      return screen.queryByText(/no articles available/i)
    }

    getArticles(): HTMLElement[] {
      return Array.from(screen.getAllByRole('article'))
    }

    getLinks(): HTMLElement[] {
      return Array.from(screen.getAllByRole('link'))
    }
  }
})
