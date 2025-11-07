import React from 'react'

export interface ModalBackdropProps {
  onClick: () => void
}

export function ModalBackdrop({ onClick }: ModalBackdropProps): React.JSX.Element {
  return <div className="modal-backdrop" onClick={onClick} />
}
