import React from 'react'
import type { Article } from '../../../../../main/domain'
import { ArticleCardFooter } from './ArticleCardFooter'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps): React.JSX.Element {
  return (
    <article className="card bg-base-100 border border-base-300 hover:border-primary cursor-pointer transition-colors">
      <div className="card-body">
        <h3 className="card-title text-lg line-clamp-2">{article.title}</h3>
        <p className="text-sm text-base-content opacity-70 line-clamp-2">
          {article.description}
        </p>
        <ArticleCardFooter pubDate={article.pubDate} link={article.link} />
      </div>
    </article>
  )
}
