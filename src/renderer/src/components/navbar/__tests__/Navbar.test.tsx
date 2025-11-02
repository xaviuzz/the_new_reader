/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, MockedFunction } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '../Navbar'

describe('Navbar', () => {
  it('should render navbar container with correct structure', () => {
    const sut = new NavbarSUT()

    expect(sut.getNavbar()).toBeInTheDocument()
  })

  it('should have add feed and theme switcher buttons', () => {
    const sut = new NavbarSUT()

    expect(sut.getAddFeedButton()).toBeInTheDocument()
    expect(sut.getThemeSwitcherButton()).toBeInTheDocument()
  })

  it('should call onAddFeed callback when add feed button clicked', async () => {
    const sut = new NavbarSUT()

    await sut.clickAddFeedButton()

    expect(sut.getOnAddFeedMock()).toHaveBeenCalledOnce()
  })

  it('should have flex layout for actions', () => {
    const sut = new NavbarSUT()

    expect(sut.getActionsGroup()).toBeInTheDocument()
  })

  class NavbarSUT {
    onAddFeed: MockedFunction<() => void>

    constructor() {
      this.onAddFeed = vi.fn()
      render(<Navbar onAddFeed={this.onAddFeed} />)
    }

    getNavbar(): HTMLElement | null {
      return screen.getByRole('navigation')
    }

    getAddFeedButton(): HTMLElement | null {
      return screen.getByRole('button', { name: /add feed/i })
    }

    getThemeSwitcherButton(): HTMLElement | null {
      return screen.getByRole('button', { name: /current theme/i })
    }

    async clickAddFeedButton(): Promise<void> {
      const button = this.getAddFeedButton()
      if (button) {
        await userEvent.click(button)
      }
    }

    getActionsGroup(): HTMLElement | null {
      return screen.getByRole('group')
    }

    getOnAddFeedMock(): MockedFunction<() => void> {
      return this.onAddFeed
    }
  }
})
