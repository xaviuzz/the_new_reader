import React, { useRef, useState } from 'react'

interface FeedUrlFormProps {
  onSubmit: (url: string) => Promise<void>
  onSuccess?: () => void
}

export function FeedUrlForm({ onSubmit, onSuccess }: FeedUrlFormProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const url = inputRef.current?.value.trim()

    if (!url) {
      setError('Please enter a feed URL')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(url)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      onSuccess?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add feed'
      setError(message)
      console.error('Failed to add feed:', error)
    } finally {
      setIsSubmitting(false)
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
          disabled={isSubmitting}
          required
        />
      </label>
      {error && <div className="alert alert-error text-sm mt-2">{error}</div>}
      <div className="pt-4">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full gap-2">
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Adding...
            </>
          ) : (
            'Add Feed'
          )}
        </button>
      </div>
    </form>
  )
}
