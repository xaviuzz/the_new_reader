import React from 'react'
import { ThemeSwitcher } from './ThemeSwitcher'

export function Navbar(): React.JSX.Element {
  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-300">
      <div className="flex-1">
        <a className="text-2xl font-bold">The New Reader</a>
      </div>
      <div className="flex items-center gap-4">
        <button className="btn btn-sm btn-primary gap-2">
          <span>+</span>
          Add Feed
        </button>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
