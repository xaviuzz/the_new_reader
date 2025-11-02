import React from 'react'
import { AddFeedButton } from './AddFeedButton'
import { ThemeSwitcher } from './ThemeSwitcher'

interface ActionsProps {
  onAddFeed?: () => void
}

export function Actions({ onAddFeed }: ActionsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-4" role="group">
      <AddFeedButton onClick={onAddFeed} />
      <ThemeSwitcher />
    </div>
  )
}
