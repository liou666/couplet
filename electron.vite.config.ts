import { resolve } from 'path'
import React from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import tailwindcss from 'tailwindcss'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      lib: {
        entry: './apps/main/src/index.ts',
      },
      watch: {
        include: ['apps/main/**/**'],
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('apps/renderer/src'),
        '@main': resolve('apps/main'),
        '@shared': resolve('apps/shared'),
        '@locales': resolve('locales'),
      },
    },
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      lib: {
        entry: './apps/main/preload/index.ts',
      },
    },
  },
  renderer: {
    root: 'apps/renderer',
    plugins: [React()],
    server: {
      port: 1234,
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            config: './apps/renderer/tailwind.config.ts',
          }),
        ],
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('apps/renderer/src'),
        '@': resolve('apps/renderer/src'),
        '@main': resolve('apps/main'),
        '@shared': resolve('apps/shared'),
        '@locales': resolve('locales'),
      },
    },
    build: {
      outDir: 'dist/renderer',
      sourcemap: !!process.env.CI,
      target: 'esnext',
      rollupOptions: {
        input: {
          main: resolve('./apps/renderer/index.html'),
        },
      },
      minify: true,
    },
  },
})
