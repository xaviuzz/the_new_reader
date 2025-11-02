import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/renderer/src/__tests__/setup.ts'],
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    environmentMatchGlobs: [
      ['src/renderer/src/**/*.test.tsx', 'jsdom'],
      ['src/main/**/*.test.ts', 'node']
    ]
  }
})
