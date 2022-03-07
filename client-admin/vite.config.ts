import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '~antd': 'node_modules/antd' },
  },
  css: { preprocessorOptions: { less: { javascriptEnabled: true } } },
});
