import { describe, it, expect, vi, beforeAll } from 'vitest'
import { tmpdir } from 'os'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { setupFeedHandlers } from '../feeds'

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn((channel: string, _handler: any) => {
      console.log(`IPC handler registered: ${channel}`)
    })
  }
}))

describe('IPC Feed Handlers', () => {
  let testDataDir: string

  beforeAll(() => {
    testDataDir = join(tmpdir(), 'feeds-test-' + Date.now())
    if (!existsSync(testDataDir)) {
      mkdirSync(testDataDir, { recursive: true })
    }
  })

  describe('setupFeedHandlers', () => {
    it('should initialize without throwing', () => {
      const opmlFilePath = join(testDataDir, 'feeds.opml')
      expect(() => setupFeedHandlers(opmlFilePath)).not.toThrow()
    })

    it('should handle feed operations', async () => {
      const opmlFilePath = join(testDataDir, 'feeds-2.opml')
      expect(() => setupFeedHandlers(opmlFilePath)).not.toThrow()
    })
  })
})
