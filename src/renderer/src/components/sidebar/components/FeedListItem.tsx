import React from 'react'
import type { Feed } from '../../../../../main/domain'

interface FeedListItemProps {
  feed: Feed
  isSelected: boolean
  onSelect: (feed: Feed) => void
  onDeleteRequest?: (feed: Feed) => void
}

export function FeedListItem({
  feed,
  isSelected,
  onSelect,
  onDeleteRequest
}: FeedListItemProps): React.JSX.Element {
  const handleDelete = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (!onDeleteRequest) return
    onDeleteRequest(feed)
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
        {onDeleteRequest && (
          <button onClick={handleDelete} className="btn btn-ghost btn-xs" title="Delete feed">
            ✕
          </button>
        )}
      </div>
    </li>
  )
}
