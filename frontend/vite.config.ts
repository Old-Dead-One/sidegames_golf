import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'analyze' ? [
      visualizer({
        filename: './bundle-analysis.html',
        open: true
      })
    ] : [])
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material', '@headlessui/react'],
          supabase: ['@supabase/supabase-js', '@supabase/auth-ui-react'],
          calendar: ['@fullcalendar/core', '@fullcalendar/react', '@fullcalendar/daygrid'],
        }
      }
    },
    sourcemap: mode === 'development',
    minify: mode === 'production',
  },
  base: '/',
  define: {
    __DEV__: mode === 'development',
  },
}));
