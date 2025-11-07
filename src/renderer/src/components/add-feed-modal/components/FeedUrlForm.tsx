import React, { useRef } from 'react'

interface FeedUrlFormProps {
  onSubmit: (url: string) => Promise<void>
  onSuccess?: () => void
}

export function FeedUrlForm({ onSubmit, onSuccess }: FeedUrlFormProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const url = inputRef.current?.value.trim()

    if (!url) {
      return
    }

    try {
      await onSubmit(url)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      onSuccess?.()
    } catch (error) {
      console.error('Failed to add feed:', error)
    }
  }

  return (
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
      <div className="pt-4">
        <button type="submit" className="btn btn-primary w-full">
          Add Feed
        </button>
      </div>
    </form>
  )
}
