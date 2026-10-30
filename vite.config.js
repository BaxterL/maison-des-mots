import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 项目页部署在 /<repo>/ 子路径下，构建时用 VITE_BASE_PATH 注入。
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
