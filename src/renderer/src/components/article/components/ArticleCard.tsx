import React from 'react'
import type { Article } from '../../../../../main/domain'
import { sanitizeHtml } from '../../../utils/html'
import { ArticleCardFooter } from './ArticleCardFooter'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps): React.JSX.Element {
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
      className="card bg-base-100 border border-base-300 hover:border-primary transition-colors overflow-hidden"
    >
      <div className="card-body p-6">
        <h3 className="card-title text-lg">{article.title}</h3>
        <div
          className="article-content text-base-content"
          onClick={handleDescriptionClick}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
        <ArticleCardFooter pubDate={article.pubDate} link={article.link} />
      </div>
    </article>
  )
}
