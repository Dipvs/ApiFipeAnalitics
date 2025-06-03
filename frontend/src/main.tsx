/**
 * PONTO DE ENTRADA DA APLICAÇÃO REACT
 * Este arquivo é onde inicializo a aplicação React
 * e renderizo ela no DOM
 */

import { StrictMode } from 'react'      // Modo rigoroso do React para detectar problemas
import { createRoot } from 'react-dom/client'  // API moderna do React 18 para renderização
import App from './App.tsx'            // Componente principal da aplicação

/**
 * INICIALIZAÇÃO DA APLICAÇÃO
 * 1. Encontro o elemento HTML com id="root"
 * 2. Crio uma raiz React usando a nova API do React 18
 * 3. Renderizo o componente App dentro do StrictMode
 * 
 * StrictMode: Ativo verificações adicionais em desenvolvimento
 * - Detecta efeitos colaterais
 * - Avisa sobre APIs descontinuadas
 * - Ajuda a identificar problemas de performance
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
