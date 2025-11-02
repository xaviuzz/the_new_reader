import React from 'react'
import { formatDate } from '../../../utils/date'

interface ArticleCardFooterProps {
  pubDate: Date | null
  link: string
}

export function ArticleCardFooter({ pubDate, link }: ArticleCardFooterProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-xs text-base-content opacity-60">
      <span>{formatDate(pubDate)}</span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="link link-primary"
        onClick={(e) => e.stopPropagation()}
      >
        Read more
      </a>
    </div>
  )
}
