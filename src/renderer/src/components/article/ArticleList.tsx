import React from 'react'
import type { Article } from '../../../../main/domain'
import { ArticleCard } from './components/ArticleCard'

interface ArticleListProps {
  articles: Article[]
}

export function ArticleList({ articles }: ArticleListProps): React.JSX.Element {
  if (articles.length === 0) {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <div className="text-center text-base-content/60">
          <p className="text-lg">No articles available</p>
          <p className="text-sm">Select a feed to view articles</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl">
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.link} article={article} />
          ))}
        </div>
      </div>
    </main>
  )
}
