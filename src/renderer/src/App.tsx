import { useState } from 'react'
import type { Feed } from '../../main/domain'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { ArticleList } from './components/ArticleList'

function App(): React.JSX.Element {
  const [selectedFeed, setSelectedFeed] = useState<Feed | undefined>()

  return (
    <div className="flex h-screen flex-col bg-base-100 text-base-content">
      <Navbar onAddFeed={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectFeed={setSelectedFeed} />
        <ArticleList feed={selectedFeed} />
      </div>
    </div>
  )
}

export default App
