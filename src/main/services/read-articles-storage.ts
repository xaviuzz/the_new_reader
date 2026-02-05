import { readFileSync, writeFileSync } from 'fs'

export interface ReadArticlesData {
  readArticles: string[]
}

export class ReadArticlesStorage {
  private readonly filePath: string
  private cache: Set<string> | null = null

  constructor(filePath: string) {
    this.filePath = filePath
  }

  private load(): Set<string> {
    if (this.cache !== null) return this.cache

    try {
      const content = readFileSync(this.filePath, 'utf-8')
      const data: ReadArticlesData = JSON.parse(content)
      this.cache = new Set(data.readArticles || [])
      return this.cache
    } catch {
      this.cache = new Set()
      return this.cache
    }
  }

  private save(): void {
    const data: ReadArticlesData = { readArticles: Array.from(this.cache!) }
    writeFileSync(this.filePath, JSON.stringify(data), 'utf-8')
  }

  add(link: string): void {
    const articles = this.load()
    articles.add(link)
    this.save()
  }

  has(link: string): boolean {
    return this.load().has(link)
  }

  getAll(): string[] {
    return Array.from(this.load())
  }

  remove(link: string): void {
    const articles = this.load()
    articles.delete(link)
    this.save()
  }
}
