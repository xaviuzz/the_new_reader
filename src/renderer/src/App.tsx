import { useEffect, useState } from 'react'
import type { Feed, Article } from '../../main/domain'
import { Navbar } from './components/navbar'
import { Sidebar } from './components/sidebar'
import { ArticleList } from './components/article'
import { AddFeedModal } from './components/add-feed-modal'

function App(): React.JSX.Element {
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [selectedFeed, setSelectedFeed] = useState<Feed | undefined>()
  const [articles, setArticles] = useState<Article[]>([])
  const [isAddFeedModalOpen, setIsAddFeedModalOpen] = useState(false)

  useEffect(() => {
    loadFeeds()
  }, [])

  useEffect(() => {
    if (selectedFeed) {
      loadArticles(selectedFeed.feedUrl)
    } else {
      setArticles([])
    }
  }, [selectedFeed])

  const loadFeeds = async (): Promise<void> => {
    try {
      const loadedFeeds = await window.api.listFeeds()
      setFeeds(loadedFeeds)
      if (loadedFeeds.length > 0 && !selectedFeed) {
        setSelectedFeed(loadedFeeds[0])
      }
    } catch (error) {
      console.error('Failed to load feeds:', error)
    }
  }

  const loadArticles = async (feedUrl: string): Promise<void> => {
    try {
      const loadedArticles = await window.api.getArticles(feedUrl)
      setArticles(loadedArticles)
    } catch (error) {
      console.error('Failed to load articles:', error)
      setArticles([])
    }
  }

  const handleAddFeed = async (feedUrl: string): Promise<void> => {
    try {
      await window.api.addFeed(feedUrl)
      await loadFeeds()
      setIsAddFeedModalOpen(false)
    } catch (error) {
      console.error('Failed to add feed:', error)
      throw error
    }
  }

  return (
    <div className="flex h-screen flex-col bg-base-100 text-base-content">
      <Navbar onAddFeed={() => setIsAddFeedModalOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar feeds={feeds} selectedFeed={selectedFeed} onSelectFeed={setSelectedFeed} />
        <ArticleList articles={articles} />
      </div>
      <AddFeedModal
        isOpen={isAddFeedModalOpen}
        onClose={() => setIsAddFeedModalOpen(false)}
        onAddFeed={handleAddFeed}
      />
    </div>
  )
}

export default App
