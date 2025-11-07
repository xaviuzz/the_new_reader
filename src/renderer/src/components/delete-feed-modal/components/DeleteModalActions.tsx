import React from 'react'

interface DeleteModalActionsProps {
  onCancel: () => void
  onDelete: () => Promise<void>
  isDeleting?: boolean
}

export function DeleteModalActions({
  onCancel,
  onDelete,
  isDeleting = false
}: DeleteModalActionsProps): React.JSX.Element {
  const handleDelete = async (): Promise<void> => {
    await onDelete()
  }

  return (
    <div className="modal-action">
      <button onClick={onCancel} disabled={isDeleting} className="btn btn-ghost">
        Cancel
      </button>
      <button onClick={handleDelete} disabled={isDeleting} className="btn btn-error gap-2">
        {isDeleting ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Deleting...
          </>
        ) : (
          'Delete Feed'
        )}
      </button>
    </div>
  )
}
