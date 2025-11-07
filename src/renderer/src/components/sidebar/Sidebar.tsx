import React from 'react'
import { Feed } from '../../../../main/domain'
import { FeedListItem } from './components/FeedListItem'
import { EmptyFeedState } from './components/EmptyFeedState'

interface SidebarProps {
  feeds: Feed[]
  selectedFeed?: Feed
  onSelectFeed: (feed: Feed) => void
}

export function Sidebar({ feeds, selectedFeed, onSelectFeed }: SidebarProps): React.JSX.Element {
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 overflow-y-auto">
      <nav className="p-4">
        <h2 className="text-lg font-semibold mb-4">Feeds</h2>

        {feeds.length === 0 ? (
          <EmptyFeedState />
        ) : (
          <ul className="menu menu-compact gap-2">
            {feeds.map((feed) => (
              <FeedListItem
                key={feed.feedUrl}
                feed={feed}
                isSelected={selectedFeed?.feedUrl === feed.feedUrl}
                onSelect={onSelectFeed}
              />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  )
}
