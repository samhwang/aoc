import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      clean: true,
      exclude: [...coverageConfigDefaults.exclude, 'bin'],
    },
  },
});
