import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

interface Env {
  SKETCHLY_API_URL: string;
}

interface ConfigEnv {
  mode: string;
  command: 'build' | 'serve';
  ssrBuild: boolean;
}

export default defineConfig((configEnv: ConfigEnv) => {
  const { mode } = configEnv;

  const rawEnv = loadEnv(mode, process.cwd(), '') as Record<string, string>;

  const env: Env = {
    SKETCHLY_API_URL: rawEnv.SKETCHLY_API_URL || '',
  };

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
