import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist', emptyOutDir: false, cssCodeSplit: false,
    lib: { entry: resolve(__dirname, 'src/index.ts'), name: 'RasterGlowTerminal', fileName: 'rasterglow-terminal' },
    rollupOptions: { external: ['vue'], output: { globals: { vue: 'Vue' } } }
  }
})
