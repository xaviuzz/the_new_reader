/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import type { MockedFunction } from 'vitest'
import { AddFeedModal } from '../AddFeedModal'

describe('AddFeedModal', () => {
  it('should render the modal dialog when open', () => {
    const sut = new AddFeedModalSUT({ isOpen: true })
    expect(sut.getModalBox()).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    const sut = new AddFeedModalSUT({ isOpen: false })
    expect(sut.getModalBox()).not.toBeInTheDocument()
  })

  it('should render form elements', () => {
    const sut = new AddFeedModalSUT({ isOpen: true })
    expect(sut.getHeading()).toBeInTheDocument()
    expect(sut.getUrlInput()).toBeInTheDocument()
    expect(sut.getAddButton()).toBeInTheDocument()
    expect(sut.getCancelButton()).toBeInTheDocument()
  })

  it('should call onAddFeed with URL when form is submitted', async () => {
    const sut = new AddFeedModalSUT({ isOpen: true })
    const feedUrl = 'https://example.com/feed'

    sut.setUrlInputValue(feedUrl)
    await sut.clickAddButton()

    expect(sut.onAddFeed).toHaveBeenCalledWith(feedUrl)
  })

  it('should call onClose when cancel button is clicked', async () => {
    const sut = new AddFeedModalSUT({ isOpen: true })
    await sut.clickCancelButton()
    expect(sut.onClose).toHaveBeenCalled()
  })

  it('should call onClose after successfully adding feed', async () => {
    const sut = new AddFeedModalSUT({ isOpen: true })
    sut.setUrlInputValue('https://example.com/feed')
    await sut.clickAddButton()
    expect(sut.onClose).toHaveBeenCalled()
  })

  it('should clear input field after adding feed', async () => {
    const sut = new AddFeedModalSUT({ isOpen: true })
    const feedUrl = 'https://example.com/feed'

    sut.setUrlInputValue(feedUrl)
    await sut.clickAddButton()

    expect(sut.getUrlInput().value).toBe('')
  })

  it('should handle errors gracefully', async () => {
    const sut = new AddFeedModalSUT({ isOpen: true, shouldError: true })
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    sut.setUrlInputValue('https://example.com/feed')
    await sut.clickAddButton()

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  class AddFeedModalSUT {
    onAddFeed: MockedFunction<(url: string) => Promise<void>>
    onClose: MockedFunction<() => void>

    constructor(options: { isOpen?: boolean; shouldError?: boolean } = {}) {
      const { isOpen = true, shouldError = false } = options

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.onAddFeed = vi.fn(async (_url: string) => {
        if (shouldError) {
          throw new Error('Failed to add feed')
        }
      })
      this.onClose = vi.fn()
      render(
        <AddFeedModal isOpen={isOpen} onClose={this.onClose} onAddFeed={this.onAddFeed} />
      )
    }

    getModalBox(): HTMLElement | null {
      return screen.queryByRole('heading', { name: 'Add Feed' })?.closest('.modal-box') ?? null
    }

    getHeading(): HTMLElement | null {
      return screen.queryByRole('heading', { name: 'Add Feed' })
    }

    getUrlInput(): HTMLInputElement {
      return screen.getByPlaceholderText('https://example.com/feed') as HTMLInputElement
    }

    getAddButton(): HTMLElement | null {
      return screen.getByRole('button', { name: /add feed/i })
    }

    getCancelButton(): HTMLElement | null {
      return screen.getByRole('button', { name: /cancel/i })
    }

    setUrlInputValue(value: string): void {
      const input = this.getUrlInput()
      input.value = value
    }

    async clickAddButton(): Promise<void> {
      const button = this.getAddButton()
      if (button) await userEvent.click(button)
    }

    async clickCancelButton(): Promise<void> {
      const button = this.getCancelButton()
      if (button) await userEvent.click(button)
    }
  }
})
