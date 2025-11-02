import React, { useState } from 'react'
import { Feed } from '../../../main/domain'

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
          <div className="text-sm text-base-content opacity-60">
            No feeds. Click + to add one.
          </div>
        ) : (
          <ul className="menu menu-compact gap-2">
            {mockFeeds.map((feed) => (
              <li key={feed.feedUrl}>
                <a
                  onClick={() => handleSelectFeed(feed)}
                  className={selectedFeedUrl === feed.feedUrl ? 'active' : ''}
                >
                  <span className="truncate">{feed.title}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
