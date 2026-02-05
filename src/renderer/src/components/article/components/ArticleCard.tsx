import React, { useRef } from 'react'
import type { Article } from '../../../../../main/domain'
import { sanitizeHtml } from '../../../utils/html'
import { ArticleCardFooter } from './ArticleCardFooter'
import { useArticleRead } from '../hooks/useArticleRead'

interface ArticleCardProps {
  article: Article
  isRead: boolean
  onMarkAsRead: () => void
}

export function ArticleCard({ article, isRead, onMarkAsRead }: ArticleCardProps): React.JSX.Element {
  const sentinelRef = useRef<HTMLDivElement>(null)
  useArticleRead(sentinelRef, onMarkAsRead)
  const handleDescriptionClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' && target.hasAttribute('data-external-link')) {
      e.preventDefault()
      e.stopPropagation()
      const href = target.getAttribute('href')
      if (href) {
        window.api.openExternalLink(href)
      }
    }
  }

  const sanitizedHtml = sanitizeHtml(article.description)

  return (
    <article
      className={`card bg-base-100 border transition-colors overflow-hidden ${
        isRead ? 'border-green-700' : 'border-base-300 hover:border-primary'
      }`}
    >
      <div className="card-body p-6">
        <h3 className="card-title text-lg">{article.title}</h3>
        <div
          className="article-content text-base-content"
          onClick={handleDescriptionClick}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
        <ArticleCardFooter pubDate={article.pubDate} link={article.link} />
        <div ref={sentinelRef} className="h-px" />
      </div>
    </article>
  )
}
