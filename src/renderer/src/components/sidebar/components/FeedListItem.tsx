import React, { useState } from 'react'
import type { Feed } from '../../../../../main/domain'

interface FeedListItemProps {
  feed: Feed
  isSelected: boolean
  onSelect: (feed: Feed) => void
  onDelete?: (feed: Feed) => Promise<void>
}

export function FeedListItem({ feed, isSelected, onSelect, onDelete }: FeedListItemProps): React.JSX.Element {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()
    if (!onDelete) return

    if (!window.confirm(`Delete feed "${feed.title}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(feed)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li>
      <div className="flex items-center gap-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onSelect(feed)
          }}
          className={`flex-1 ${isSelected ? 'active' : ''}`}
        >
          <span className="truncate">{feed.title}</span>
        </a>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-ghost btn-xs"
            title="Delete feed"
          >
            {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : '✕'}
          </button>
        )}
      </div>
    </li>
  )
}
