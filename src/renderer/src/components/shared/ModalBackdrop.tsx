import React from 'react'

interface ModalBackdropProps {
  onClick: () => void
}

export function ModalBackdrop({ onClick }: ModalBackdropProps): React.JSX.Element {
  return <div className="modal-backdrop" onClick={onClick} />
}
