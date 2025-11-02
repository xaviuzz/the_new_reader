import React from 'react'
import { NavbarActions } from './NavbarActions'

interface NavbarProps {
  onAddFeed?: () => void
}

export function Navbar({ onAddFeed }: NavbarProps): React.JSX.Element {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <div className="flex-1">
        <a className="text-2xl font-bold">The New Reader</a>
      </div>
      <NavbarActions onAddFeed={onAddFeed} />
    </div>
  )
}
