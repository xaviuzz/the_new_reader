import React from 'react'
import { NavbarBrand } from './NavbarBrand'
import { NavbarActions } from './NavbarActions'

interface NavbarProps {
  onAddFeed?: () => void
}

export function Navbar({ onAddFeed }: NavbarProps): React.JSX.Element {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <NavbarBrand />
      <NavbarActions onAddFeed={onAddFeed} />
    </div>
  )
}
