import React from 'react'
import { AddFeedButton } from './AddFeedButton'
import { ThemeSwitcher } from './ThemeSwitcher'

interface NavbarProps {
  onAddFeed?: () => void
}

export function Navbar({ onAddFeed }: NavbarProps): React.JSX.Element {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <div className="flex-1">
        <a className="text-2xl font-bold">The New Reader</a>
      </div>
      <div className="flex items-center gap-4">
        <AddFeedButton onClick={onAddFeed} />
        <ThemeSwitcher />
      </div>
    </div>
  )
}
