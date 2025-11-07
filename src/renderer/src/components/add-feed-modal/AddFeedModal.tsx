import React from 'react'
import { ModalHeader, ModalBackdrop } from '../shared'
import { FeedUrlForm } from './components/FeedUrlForm'
import { ModalActions } from './components/ModalActions'

export interface AddFeedModalProps {
  isOpen: boolean
  onClose: () => void
  onAddFeed: (url: string) => Promise<void>
}

export function AddFeedModal({
  isOpen,
  onClose,
  onAddFeed
}: AddFeedModalProps): React.JSX.Element {
  if (!isOpen) {
    return <></>
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <ModalHeader title="Add Feed" />
        <FeedUrlForm onSubmit={onAddFeed} onSuccess={onClose} />
        <ModalActions onCancel={onClose} />
      </div>
      <ModalBackdrop onClick={onClose} />
    </div>
  )
}
