import React from 'react'

interface AddFeedButtonProps {
  onClick?: () => void
}

export function AddFeedButton({ onClick }: AddFeedButtonProps): React.JSX.Element {
  return (
    <button className="btn btn-sm btn-primary gap-2" onClick={onClick}>
      <span>+</span>
      Add Feed
    </button>
  )
}
