import { useEffect, useState, useCallback } from 'react'
import type { Feed, Article } from '../../main/domain'
import { Navbar } from './components/navbar'
import { Sidebar } from './components/sidebar'
import { ArticleList } from './components/article'
import { AddFeedModal } from './components/add-feed-modal'
import { DeleteFeedModal } from './components/delete-feed-modal'
import { ArticleReaderModal } from './components/article-reader-modal'
import { ToastContainer, useToast } from './components/toast'

function AppContent(): React.JSX.Element {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [selectedFeed, setSelectedFeed] = useState<Feed | undefined>()
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false)
  const [feedToDelete, setFeedToDelete] = useState<Feed | null>(null)
  const [isLoadingFeeds, setIsLoadingFeeds] = useState(false)
  const [isLoadingArticles, setIsLoadingArticles] = useState(false)
  const [feedsError, setFeedsError] = useState<string | null>(null)
  const [articlesError, setArticlesError] = useState<string | null>(null)
  const { showToast } = useToast()

  const loadFeeds = useCallback(async (): Promise<void> => {
    setIsLoadingFeeds(true)
    setFeedsError(null)
    try {
      const loadedFeeds = await window.api.listFeeds()
      setFeeds(loadedFeeds)
      if (loadedFeeds.length > 0 && !selectedFeed) {
        setSelectedFeed(loadedFeeds[0])
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load feeds'
      setFeedsError(message)
      console.error('Failed to load feeds:', error)
    } finally {
      setIsLoadingFeeds(false)
    }
  }, [selectedFeed])

  useEffect(() => {
    loadFeeds()
  }, [loadFeeds])

  useEffect(() => {
    if (selectedFeed) {
      loadArticles(selectedFeed.feedUrl)
    } else {
      setArticles([])
      setArticlesError(null)
    }
  }, [selectedFeed])

  const loadArticles = async (feedUrl: string): Promise<void> => {
    setIsLoadingArticles(true)
    setArticlesError(null)
    try {
      const loadedArticles = await window.api.getArticles(feedUrl)
      setArticles(loadedArticles)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load articles'
      setArticlesError(message)
      console.error('Failed to load articles:', error)
      setArticles([])
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const handleAddFeed = async (feedUrl: string): Promise<void> => {
    try {
      await window.api.addFeed(feedUrl)
      await loadFeeds()
      setIsAddFeedModalOpen(false)
      showToast('Feed added successfully', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add feed'
      showToast(message, 'error')
      throw error
    }
  }

  const handleDeleteFeed = async (feed: Feed): Promise<void> => {
    try {
      await window.api.deleteFeed(feed.feedUrl)
      if (selectedFeed?.feedUrl === feed.feedUrl) {
        setSelectedFeed(undefined)
      }
      await loadFeeds()
      setFeedToDelete(null)
      showToast('Feed deleted successfully', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete feed'
      showToast(message, 'error')
      console.error('Failed to delete feed:', error)
    }
  }

  const handleRefreshFeed = async (feedUrl: string): Promise<void> => {
    setIsLoadingArticles(true)
    setArticlesError(null)
    try {
      const freshArticles = await window.api.refreshFeed(feedUrl)
      setArticles(freshArticles)
      showToast('Feed refreshed', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh feed'
      setArticlesError(message)
      showToast(message, 'error')
      console.error('Failed to refresh feed:', error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const handleRefreshAll = async (): Promise<void> => {
    setIsLoadingArticles(true)
    setArticlesError(null)
    try {
      const results = await Promise.allSettled(
        feeds.map((feed) => window.api.refreshFeed(feed.feedUrl))
      )

      const failed = results.filter((r) => r.status === 'rejected').length
      if (failed === 0) {
        showToast('All feeds refreshed', 'success')
        if (selectedFeed) {
          await loadArticles(selectedFeed.feedUrl)
        }
      } else {
        showToast(`Refreshed with ${failed} failures`, 'info')
        if (selectedFeed) {
          await loadArticles(selectedFeed.feedUrl)
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to refresh feeds'
      showToast(message, 'error')
      console.error('Failed to refresh all feeds:', error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-base-100 text-base-content">
      <Navbar onAddFeed={() => setIsAddFeedModalOpen(true)} onRefreshAll={handleRefreshAll} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          feeds={feeds}
          selectedFeed={selectedFeed}
          onSelectFeed={setSelectedFeed}
          onDeleteRequest={setFeedToDelete}
          isLoading={isLoadingFeeds}
          error={feedsError}
        />
        <ArticleList
          articles={articles}
          isLoading={isLoadingArticles}
          error={articlesError}
          onRefresh={selectedFeed ? () => handleRefreshFeed(selectedFeed.feedUrl) : undefined}
          onArticleOpen={setSelectedArticle}
        />
      </div>
      <AddFeedModal
        isOpen={isAddFeedModalOpen}
        onClose={() => setIsAddFeedModalOpen(false)}
        onAddFeed={handleAddFeed}
      />
      <DeleteFeedModal
        isOpen={feedToDelete !== null}
        feed={feedToDelete}
        onClose={() => setFeedToDelete(null)}
        onDelete={handleDeleteFeed}
      />
      <ArticleReaderModal
        isOpen={selectedArticle !== null}
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <ToastContainer>
      <AppContent />
    </ToastContainer>
  )
}

export default App
