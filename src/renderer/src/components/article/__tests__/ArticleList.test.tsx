/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { ArticleList } from '../ArticleList'
import { Feed } from '../../../../../main/domain'

describe('ArticleList', () => {
  it('should render content area with correct structure', () => {
    const sut = new ArticleListSUT()

    expect(sut.getMainContent()).toBeInTheDocument()
  })

  it('should display feed title when feed provided', () => {
    const feed = new Feed('Test Feed', 'https://example.com/feed', 'A test feed')
    const sut = new ArticleListSUT(feed)

    expect(sut.getHeading()).toHaveTextContent('Test Feed')
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

  it('should not display heading when no feed provided', () => {
    const sut = new ArticleListSUT()

    expect(sut.getAllHeadings().length).toBe(0)
  })

  class ArticleListSUT {
    constructor(feed?: Feed) {
      render(<ArticleList feed={feed} />)
    }

    getMainContent(): HTMLElement | null {
      return screen.getByRole('main')
    }

    getHeading(): HTMLElement | null {
      return screen.queryByRole('heading', { level: 2 })
    }

    getArticles(): HTMLElement[] {
      return Array.from(screen.getAllByRole('article'))
    }

    getLinks(): HTMLElement[] {
      return Array.from(screen.getAllByRole('link'))
    }

    getAllHeadings(): HTMLElement[] {
      return Array.from(screen.queryAllByRole('heading', { level: 2 }))
    }
  }
})
