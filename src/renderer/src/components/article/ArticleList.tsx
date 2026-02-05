import React, { useState, useEffect } from 'react'
import type { Article } from '../../../../main/domain'
import { ArticleCard } from './components/ArticleCard'

interface ArticleListProps {
  articles: Article[]
  isLoading?: boolean
  error?: string | null
  onRefresh?: () => Promise<void>
}

export function ArticleList({
  articles,
  isLoading = false,
  error = null,
  onRefresh
}: ArticleListProps): React.JSX.Element {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set())

  useEffect(() => {
    window.api.getReadArticles().then((links) => {
      setReadArticles(new Set(links))
    })
  }, [])

  const handleRefresh = async (): Promise<void> => {
    if (!onRefresh) return
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleMarkAsRead = (link: string): void => {
    window.api.markArticleAsRead(link)
    setReadArticles((prev) => new Set(prev).add(link))
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <span>{error}</span>
        </div>
      </main>
    )
  }

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
        {onRefresh && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="btn btn-sm btn-outline gap-2"
            >
              {isRefreshing ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Refreshing...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Refresh
                </>
              )}
            </button>
          </div>
        )}
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard
              key={article.link}
              article={article}
              isRead={readArticles.has(article.link)}
              onMarkAsRead={() => handleMarkAsRead(article.link)}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
