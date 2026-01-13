import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],  // Terminal + HTML report
      exclude: ['node_modules', '*.test.ts', 'index.ts']
    }
  }
})