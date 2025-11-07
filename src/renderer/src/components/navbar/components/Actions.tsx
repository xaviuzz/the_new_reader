import React, { useState } from 'react'
import { AddFeedButton } from './AddFeedButton'
import { ThemeSwitcher } from './ThemeSwitcher'

interface ActionsProps {
  onAddFeed?: () => void
  onRefreshAll?: () => Promise<void>
}

export function Actions({ onAddFeed, onRefreshAll }: ActionsProps): React.JSX.Element {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshAll = async (): Promise<void> => {
    if (!onRefreshAll) return
    setIsRefreshing(true)
    try {
      await onRefreshAll()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="flex items-center gap-4" role="group">
      {onRefreshAll && (
        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="btn btn-ghost btn-sm gap-2"
          title="Refresh all feeds"
        >
          {isRefreshing ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Refreshing
            </>
          ) : (
            <>
              <span>🔄</span>
              Refresh All
            </>
          )}
        </button>
      )}
      <AddFeedButton onClick={onAddFeed} />
      <ThemeSwitcher />
    </div>
  )
}
