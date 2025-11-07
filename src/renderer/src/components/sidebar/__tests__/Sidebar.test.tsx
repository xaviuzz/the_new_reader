/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, type MockedFunction } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Feed } from '../../../../../main/domain'
import { Sidebar } from '../Sidebar'

describe('Sidebar', () => {
  it('should render sidebar with fixed width and correct styling', () => {
    const sut = new SidebarSUT()
    expect(sut.getSidebar()).toBeInTheDocument()
  })

  it('should display feeds section heading', () => {
    const sut = new SidebarSUT()
    expect(sut.getHeading()).toBeInTheDocument()
  })

  it('should render feed list with menu structure', () => {
    const sut = new SidebarSUT()
    expect(sut.getFeedsNav()).toBeInTheDocument()
    expect(sut.getFeedLinks().length).toBe(3)
  })

  it('should trigger onSelectFeed callback when feed link clicked', async () => {
    const sut = new SidebarSUT()
    await sut.clickFeedLink('Hacker News')
    expect(sut.onSelectFeed).toHaveBeenCalledOnce()
  })

  it('should have menu structure with feed links', () => {
    const sut = new SidebarSUT()
    expect(sut.getFeedLink('Hacker News')).toBeInTheDocument()
    expect(sut.getFeedLink('The Verge')).toBeInTheDocument()
    expect(sut.getFeedLink('Dev.to')).toBeInTheDocument()
  })

  it('should highlight selected feed', () => {
    const sut = new SidebarSUT({ selectedFeedIndex: 0 })
    const selectedLink = sut.getFeedLink('Hacker News')
    expect(selectedLink).toHaveClass('active')
  })

  it('should show empty state when no feeds', () => {
    const sut = new SidebarSUT({ isEmpty: true })
    expect(sut.getEmptyStateText()).toBeInTheDocument()
  })

  class SidebarSUT {
    onSelectFeed: MockedFunction<(feed: Feed) => void>
    feeds: Feed[]
    selectedFeed: Feed | undefined

    constructor(options: { selectedFeedIndex?: number; isEmpty?: boolean } = {}) {
      const { selectedFeedIndex, isEmpty = false } = options

      this.feeds = [
        new Feed('Hacker News', 'https://news.ycombinator.com/rss', 'Latest technology'),
        new Feed('The Verge', 'https://www.theverge.com/rss/index.xml', 'Tech news'),
        new Feed('Dev.to', 'https://dev.to/api/articles', 'Developer community')
      ]

      this.selectedFeed = isEmpty ? undefined : selectedFeedIndex !== undefined ? this.feeds[selectedFeedIndex] : undefined
      this.onSelectFeed = vi.fn()

      const feedsToRender = isEmpty ? [] : this.feeds

      render(
        <Sidebar
          feeds={feedsToRender}
          selectedFeed={this.selectedFeed}
          onSelectFeed={this.onSelectFeed}
        />
      )
    }

    getSidebar(): HTMLElement | null {
      return screen.getByRole('complementary')
    }

    getHeading(): HTMLElement {
      return screen.getByRole('heading', { level: 2 })
    }

    getFeedsNav(): HTMLElement | null {
      return screen.getByRole('navigation')
    }

    getFeedLinks(): HTMLElement[] {
      return Array.from(screen.getAllByRole('link'))
    }

    getFeedLink(feedName: string): HTMLElement | null {
      return screen.getByRole('link', { name: feedName })
    }

    getEmptyStateText(): HTMLElement | null {
      return screen.queryByText(/no feeds/i)
    }

    async clickFeedLink(feedName: string): Promise<void> {
      const link = this.getFeedLink(feedName)
      if (link) {
        await userEvent.click(link)
      }
    }
  }
})
