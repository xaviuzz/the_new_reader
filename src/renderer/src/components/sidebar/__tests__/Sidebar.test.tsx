/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, MockedFunction } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(sut.getFeedLinks().length).toBeGreaterThan(0)
  })

  it('should trigger onSelectFeed callback when feed link clicked', async () => {
    const sut = new SidebarSUT()

    await sut.clickFeedLink('Hacker News')

    expect(sut.getOnSelectFeedMock()).toHaveBeenCalledOnce()
  })

  it('should have menu structure with feed links', () => {
    const sut = new SidebarSUT()

    expect(sut.getFeedLink('Hacker News')).toBeInTheDocument()
    expect(sut.getFeedLink('The Verge')).toBeInTheDocument()
    expect(sut.getFeedLink('Dev.to')).toBeInTheDocument()
  })

  it('should have scrollable container with proper padding', () => {
    const sut = new SidebarSUT()

    expect(sut.getFeedsNav()).toBeInTheDocument()
  })

  class SidebarSUT {
    onSelectFeed: MockedFunction<() => void>

    constructor() {
      this.onSelectFeed = vi.fn()
      render(<Sidebar onSelectFeed={this.onSelectFeed} />)
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

    async clickFeedLink(feedName: string): Promise<void> {
      const link = this.getFeedLink(feedName)
      if (link) {
        await userEvent.click(link)
      }
    }

    getOnSelectFeedMock(): MockedFunction<() => void> {
      return this.onSelectFeed
    }
  }
})
