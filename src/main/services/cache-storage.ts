import { createHash } from 'crypto'
import { readFileSync, writeFileSync, unlinkSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import type { Article } from '../domain'

export interface CacheEntry {
  articles: Article[]
  fetchedAt: string
  feedUrl: string
}

export class CacheStorage {
  private readonly cacheDir: string
  private readonly ttlMinutes: number

  constructor(cacheDir: string, ttlMinutes: number = 60) {
    this.cacheDir = cacheDir
    this.ttlMinutes = ttlMinutes
  }

  private getCacheFilePath(feedUrl: string): string {
    const hash = createHash('sha256').update(feedUrl).digest('hex')
    return join(this.cacheDir, `${hash}.json`)
  }

  private isExpired(fetchedAt: string): boolean {
    const now = Date.now()
    const cached = new Date(fetchedAt).getTime()
    const ageMinutes = (now - cached) / (1000 * 60)
    return ageMinutes > this.ttlMinutes
  }

  get(feedUrl: string): Article[] | null {
    const filePath = this.getCacheFilePath(feedUrl)

    try {
      const content = readFileSync(filePath, 'utf-8')
      const entry: CacheEntry = JSON.parse(content)

      if (this.isExpired(entry.fetchedAt)) {
        return null
      }

      return entry.articles
    } catch {
      return null
    }
  }

  set(feedUrl: string, articles: Article[]): void {
    const filePath = this.getCacheFilePath(feedUrl)
    const entry: CacheEntry = {
      articles,
      fetchedAt: new Date().toISOString(),
      feedUrl
    }

    try {
      writeFileSync(filePath, JSON.stringify(entry), 'utf-8')
    } catch (error) {
      console.error(`Failed to write cache for ${feedUrl}:`, error)
    }
  }

  cleanupExpired(): void {
    try {
      const files = readdirSync(this.cacheDir)

      for (const file of files) {
        if (!file.endsWith('.json')) continue

        const filePath = join(this.cacheDir, file)

        try {
          const content = readFileSync(filePath, 'utf-8')
          const entry: CacheEntry = JSON.parse(content)

          if (this.isExpired(entry.fetchedAt)) {
            unlinkSync(filePath)
          }
        } catch {
          unlinkSync(filePath)
        }
      }
    } catch (error) {
      console.error('Failed to cleanup cache:', error)
    }
  }

  clear(): void {
    try {
      const files = readdirSync(this.cacheDir)

      for (const file of files) {
        if (!file.endsWith('.json')) continue
        unlinkSync(join(this.cacheDir, file))
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }
}
