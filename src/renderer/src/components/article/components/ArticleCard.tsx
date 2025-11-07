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
    <article className="card bg-base-100 border border-base-300 hover:border-primary cursor-pointer transition-colors">
      <div className="card-body">
        <h3 className="card-title text-lg line-clamp-2">{article.title}</h3>
        <div
          className="text-sm text-base-content opacity-70 line-clamp-3 prose prose-sm max-w-none prose-p:m-0 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:h-auto"
          onClick={handleDescriptionClick}
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
        <ArticleCardFooter pubDate={article.pubDate} link={article.link} />
      </div>
    </article>
  )
}
