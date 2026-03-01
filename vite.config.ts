import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        inject: {
          data: {
            SKETCHLY_API_URL: isProduction
              ? '<%= SKETCHLY_API_URL %>'
              : env.SKETCHLY_API_URL,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@canvas': path.resolve(__dirname, 'src/libs/canvas-engine'),
        '@libs': path.resolve(__dirname, 'src/libs'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@api': path.resolve(__dirname, 'src/api'),
      },
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: env.SKETCHLY_API_URL || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };
});