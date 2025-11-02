import React from 'react'
import type { Article } from '../../../main/domain'
import type { Feed } from '../../../main/domain'

const mockArticles: Article[] = [
  {
    title: 'Building scalable Node.js applications',
    link: 'https://example.com/article1',
    pubDate: new Date('2025-11-01'),
    description:
      'Learn best practices for building high-performance Node.js applications with clustering and load balancing.',
    thumbnail: null
  },
  {
    title: 'React 19: New features and improvements',
    link: 'https://example.com/article2',
    pubDate: new Date('2025-10-31'),
    description:
      'Explore the latest features in React 19 including improved TypeScript support and better performance optimizations.',
    thumbnail: null
  },
  {
    title: 'The future of JavaScript frameworks',
    link: 'https://example.com/article3',
    pubDate: new Date('2025-10-30'),
    description:
      'An in-depth analysis of emerging JavaScript frameworks and their impact on modern web development.',
    thumbnail: null
  },
  {
    title: 'TypeScript best practices for 2025',
    link: 'https://example.com/article4',
    pubDate: new Date('2025-10-29'),
    description:
      'Master TypeScript with these essential tips and patterns that will improve your code quality and maintainability.',
    thumbnail: null
  },
  {
    title: 'Getting started with Web Components',
    link: 'https://example.com/article5',
    pubDate: new Date('2025-10-28'),
    description:
      'A beginner-friendly guide to building reusable Web Components for modern web applications.',
    thumbnail: null
  }
]

interface ArticleListProps {
  feed?: Feed
}

export function ArticleList({ feed }: ArticleListProps): React.JSX.Element {
  const formatDate = (date: Date | null): string => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl">
        {feed && <h2 className="text-2xl font-bold mb-6">{feed.title}</h2>}

        <div className="space-y-4">
          {mockArticles.map((article) => (
            <article
              key={article.link}
              className="card bg-base-100 border border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body">
                <h3 className="card-title text-lg line-clamp-2">{article.title}</h3>
                <p className="text-sm text-base-content opacity-70 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-base-content opacity-60">
                  <span>{formatDate(article.pubDate)}</span>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read more
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
