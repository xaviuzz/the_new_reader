import React from 'react'
import type { Feed } from '../../../../../main/domain'

interface DeleteConfirmationProps {
  feed: Feed
}

export function DeleteConfirmation({ feed }: DeleteConfirmationProps): React.JSX.Element {
  return (
    <div className="py-4">
      <p className="text-sm text-base-content/70 mb-4">
        Are you sure you want to delete this feed? This action cannot be undone.
      </p>
      <div className="bg-base-200 p-3 rounded">
        <p className="font-semibold text-base-content">{feed.title}</p>
        <p className="text-xs text-base-content/60 truncate">{feed.feedUrl}</p>
      </div>
    </div>
  )
}
