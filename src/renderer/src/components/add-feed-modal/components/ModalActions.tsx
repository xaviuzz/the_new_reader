import React from 'react'

interface ModalActionsProps {
  onCancel: () => void
}

export function ModalActions({ onCancel }: ModalActionsProps): React.JSX.Element {
  return (
    <div className="modal-action">
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}
