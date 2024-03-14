import { defineConfig } from 'vitest/config'
import vitestTsConfigPaths from 'vite-tsconfig-paths'

const maxWorkers = Number(process.env.VITEST_MAX_WORKERS) || 3

export default defineConfig({
  plugins: [vitestTsConfigPaths()],
  test: {
    globals: true,
    include: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
    environment: './vitest/environment.ts',
    // setupFiles: ['./vitest/setup-mocks.ts'],
    minWorkers: 1,
    maxWorkers,
  },
})
