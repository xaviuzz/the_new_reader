import React from 'react'
import { Brand } from './components/Brand'
import { Actions } from './components/Actions'

interface NavbarProps {
  onAddFeed?: () => void
}

export function Navbar({ onAddFeed }: NavbarProps): React.JSX.Element {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <Brand />
      <Actions onAddFeed={onAddFeed} />
    </div>
  )
}
