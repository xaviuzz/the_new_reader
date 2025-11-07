import React from 'react'
import { Feed } from '../../../../main/domain'
import { FeedListItem } from './components/FeedListItem'
import { EmptyFeedState } from './components/EmptyFeedState'

interface SidebarProps {
  feeds: Feed[]
  selectedFeed?: Feed
  onSelectFeed: (feed: Feed) => void
  onDeleteRequest?: (feed: Feed) => void
  isLoading?: boolean
  error?: string | null
}

export function Sidebar({
  feeds,
  selectedFeed,
  onSelectFeed,
  onDeleteRequest,
  isLoading = false,
  error = null
}: SidebarProps): React.JSX.Element {
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 overflow-y-auto">
      <nav className="p-4">
        <h2 className="text-lg font-semibold mb-4">Feeds</h2>

        {isLoading && (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}

        {error && <div className="alert alert-error text-sm mb-4">{error}</div>}

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
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </ul>
        )}
      </nav>
    </aside>
  )
}
