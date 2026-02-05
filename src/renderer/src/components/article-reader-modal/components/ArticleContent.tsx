import React from 'react'
import { sanitizeHtml } from '../../../utils/html'
import { formatDate } from '../../../utils/date'

interface ArticleContentProps {
  description: string
  pubDate: Date | null
}

export function ArticleContent({ description, pubDate }: ArticleContentProps): React.JSX.Element {
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement
    if (target.tagName === 'A' && target.hasAttribute('data-external-link')) {
      e.preventDefault()
      const href = target.getAttribute('href')
      if (href) {
        window.api.openExternalLink(href)
      }
    }
  }

  const sanitizedHtml = sanitizeHtml(description)

  return (
    <div className="space-y-4">
      {pubDate && <p className="text-xs text-base-content opacity-60">{formatDate(pubDate)}</p>}
      <div
        className="prose max-w-none prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:h-auto"
        onClick={handleContentClick}
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  )
}
