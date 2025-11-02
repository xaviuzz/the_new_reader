import React, { useState } from 'react'
import { Feed } from '../../../../main/domain'
import { FeedListItem } from './components/FeedListItem'
import { EmptyFeedState } from './components/EmptyFeedState'

const mockFeeds: Feed[] = [
  new Feed('Hacker News', 'https://news.ycombinator.com/rss', 'Latest technology and startup news'),
  new Feed('The Verge', 'https://www.theverge.com/rss/index.xml', 'Tech, science, and culture'),
  new Feed('Dev.to', 'https://dev.to/api/articles?top=7&tag=devops', 'Developer community')
]

interface SidebarProps {
  onSelectFeed?: (feed: Feed) => void
}

export function Sidebar({ onSelectFeed }: SidebarProps): React.JSX.Element {
  const [selectedFeedUrl, setSelectedFeedUrl] = useState<string | null>(
    mockFeeds.length > 0 ? mockFeeds[0].feedUrl : null
  )

  const handleSelectFeed = (feed: Feed): void => {
    setSelectedFeedUrl(feed.feedUrl)
    onSelectFeed?.(feed)
  }

  return (
    <div className="w-64 bg-base-200 border-r border-base-300 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Feeds</h2>

        {mockFeeds.length === 0 ? (
          <EmptyFeedState />
        ) : (
          <ul className="menu menu-compact gap-2">
            {mockFeeds.map((feed) => (
              <FeedListItem
                key={feed.feedUrl}
                feed={feed}
                isSelected={selectedFeedUrl === feed.feedUrl}
                onSelect={handleSelectFeed}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
