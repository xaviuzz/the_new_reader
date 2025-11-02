import React from 'react'
import type { Feed } from '../../../../../main/domain'

interface FeedListItemProps {
  feed: Feed
  isSelected: boolean
  onSelect: (feed: Feed) => void
}

export function FeedListItem({ feed, isSelected, onSelect }: FeedListItemProps): React.JSX.Element {
  return (
    <li>
      <a
        onClick={() => onSelect(feed)}
        className={isSelected ? 'active' : ''}
      >
        <span className="truncate">{feed.title}</span>
      </a>
    </li>
  )
}
