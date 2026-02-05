import React from 'react'
import type { Article } from '../../../../main/domain'
import { ModalHeader, ModalBackdrop } from '../shared'
import { ArticleContent } from './components/ArticleContent'
import { ArticleReaderActions } from './components/ArticleReaderActions'

export interface ArticleReaderModalProps {
  isOpen: boolean
  article: Article | null
  onClose: () => void
}

export function ArticleReaderModal({ isOpen, article, onClose }: ArticleReaderModalProps): React.JSX.Element {
  if (!isOpen || !article) {
    return <></>
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto">
        <ModalHeader title={article.title} />
        <ArticleContent description={article.description} pubDate={article.pubDate} />
        <ArticleReaderActions link={article.link} onClose={onClose} />
      </div>
      <ModalBackdrop onClick={onClose} />
    </div>
  )
}
