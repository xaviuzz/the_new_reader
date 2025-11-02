import React from 'react'
import { AddFeedButton } from './AddFeedButton'
import { ThemeSwitcher } from './ThemeSwitcher'

interface NavbarActionsProps {
  onAddFeed?: () => void
}

export function NavbarActions({ onAddFeed }: NavbarActionsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <AddFeedButton onClick={onAddFeed} />
      <ThemeSwitcher />
    </div>
  )
}
