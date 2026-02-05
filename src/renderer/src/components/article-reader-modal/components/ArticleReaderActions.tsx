import React from 'react'

interface ArticleReaderActionsProps {
  link: string
  onClose: () => void
}

export function ArticleReaderActions({ link, onClose }: ArticleReaderActionsProps): React.JSX.Element {
  return (
    <div className="modal-action">
      <button
        className="btn btn-ghost btn-sm link link-primary"
        onClick={() => window.api.openExternalLink(link)}
      >
        Open in browser
      </button>
      <button className="btn btn-ghost" onClick={onClose}>
        Close
      </button>
    </div>
  )
}
