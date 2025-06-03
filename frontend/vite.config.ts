/**
 * CONFIGURAÇÃO DO VITE
 * Aqui configuro o bundler Vite para desenvolvimento e build de produção
 * Inclui plugins, servidor de desenvolvimento, proxy para API e otimizações
 */

import { defineConfig } from 'vite'      // Função para definir configuração TypeScript-safe
import react from '@vitejs/plugin-react' // Plugin oficial do React para Vite

// Documentação oficial: https://vite.dev/config/
export default defineConfig({
  /**
   * PLUGINS DO VITE
   * Lista de plugins que processam o código durante build e desenvolvimento
   */
  plugins: [
    react() // Plugin React: transforma JSX, Fast Refresh, otimizações React
  ],
  
  /**
   * CONFIGURAÇÕES DO SERVIDOR DE DESENVOLVIMENTO
   * Defino como o Vite serve a aplicação durante desenvolvimento
   */
  server: {
    port: 5173,        // Porta do servidor de desenvolvimento
    host: true,        // Permito acesso externo (0.0.0.0) - útil para mobile/rede
    open: true,        // Abro automaticamente o navegador ao iniciar

    /**
     * PROXY PARA API
     * Redireciono requisições /api para o backend Node.js
     * Evito problemas de CORS durante desenvolvimento
     */
    proxy: {
      '/api': {
        target: 'http://localhost:3000',    // URL do backend
        changeOrigin: true,                 // Altero o header Origin
        secure: false,                      // Permito HTTPS self-signed
      },
    },
  },
  
  /**
   * CONFIGURAÇÕES DE BUILD PARA PRODUÇÃO
   * Defino como o Vite gera os arquivos finais
   */
  build: {
    outDir: 'dist',        // Diretório de saída dos arquivos build
    sourcemap: true,       // Gero source maps para debugging em produção
  },
  
  /**
   * OTIMIZAÇÃO DE DEPENDÊNCIAS
   * Pré-bundling de dependências para melhor performance
   * Especifico quais packages devem ser incluídos no cache
   */
  optimizeDeps: {
    include: [
      'react',          // Core do React
      'react-dom',      // Renderização DOM
      'framer-motion',  // Biblioteca de animações
      'recharts'        // Biblioteca de gráficos
    ],
  },
})
