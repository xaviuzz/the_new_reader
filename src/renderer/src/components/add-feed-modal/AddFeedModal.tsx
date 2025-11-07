import React, { useRef } from 'react'

export interface AddFeedModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFeed: (url: string) => Promise<void>
}

export function AddFeedModal({ isOpen, onClose, onAddFeed }: AddFeedModalProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const url = inputRef.current?.value.trim()

    if (!url) {
      return
    }

    try {
      await onAddFeed(url)
      // Clear input and close modal
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      onClose()
    } catch (error) {
      console.error('Failed to add feed:', error)
    }
  }

  if (!isOpen) {
    return <></>
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Feed</h3>
        <form onSubmit={handleSubmit} className="py-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Feed URL</span>
            </div>
            <input
              ref={inputRef}
              type="url"
              placeholder="https://example.com/feed"
              className="input input-bordered w-full"
              required
            />
          </label>
        </form>
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
            Add Feed
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  )
}
