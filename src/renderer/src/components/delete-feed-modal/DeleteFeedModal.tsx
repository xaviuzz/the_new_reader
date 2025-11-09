import React, { useState } from 'react'
import type { Feed } from '../../../../main/domain'
import { ModalHeader, ModalBackdrop } from '../shared'
import { DeleteConfirmation } from './components/DeleteConfirmation'
import { DeleteModalActions } from './components/DeleteModalActions'

export interface DeleteFeedModalProps {
  isOpen: boolean
  feed: Feed | null
  onClose: () => void
  onDelete: (feed: Feed) => Promise<void>
}

export function DeleteFeedModal({
  isOpen,
  feed,
  onClose,
  onDelete
}: DeleteFeedModalProps): React.JSX.Element {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !feed) {
    return <></>
  }

  const handleDelete = async (): Promise<void> => {
    setIsDeleting(true)
    try {
      await onDelete(feed)
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <ModalHeader title="Delete Feed" />
        <DeleteConfirmation feed={feed} />
        <DeleteModalActions onCancel={onClose} onDelete={handleDelete} isDeleting={isDeleting} />
      </div>
      <ModalBackdrop onClick={onClose} />
    </div>
  )
}
