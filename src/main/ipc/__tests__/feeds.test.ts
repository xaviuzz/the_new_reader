import { describe, it, expect, vi, beforeAll } from 'vitest'
import { tmpdir } from 'os'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { setupFeedHandlers } from '../feeds'

vi.mock('electron', () => ({
  ipcMain: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handle: vi.fn((channel: string, _handler: unknown) => {
      console.log(`IPC handler registered: ${channel}`)
    })
  }
}))

describe('IPC Feed Handlers', () => {
  let testDataDir: string
  let cacheDir: string

  beforeAll(() => {
    testDataDir = join(tmpdir(), 'feeds-test-' + Date.now())
    if (!existsSync(testDataDir)) {
      mkdirSync(testDataDir, { recursive: true })
    }
    cacheDir = join(testDataDir, 'cache')
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true })
    }
  })

  describe('setupFeedHandlers', () => {
    it('should initialize without throwing', () => {
      const opmlFilePath = join(testDataDir, 'feeds.opml')
      expect(() => setupFeedHandlers(opmlFilePath, cacheDir)).not.toThrow()
    })

    it('should handle feed operations', async () => {
      const opmlFilePath = join(testDataDir, 'feeds-2.opml')
      expect(() => setupFeedHandlers(opmlFilePath, cacheDir)).not.toThrow()
    })
  })
})
