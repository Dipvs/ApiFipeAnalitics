# FIPE Analytics - Frontend

Uma aplicação moderna e elegante para análise e comparação de veículos baseada na tabela FIPE.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápido e moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Framer Motion** - Biblioteca de animações para React
- **React Router DOM** - Roteamento para aplicações React
- **Lucide React** - Ícones modernos e elegantes
- **Axios** - Cliente HTTP para requisições à API
- **Recharts** - Biblioteca de gráficos para React

## ✨ Funcionalidades

### 🏠 Página Inicial
- Hero section com design moderno e gradientes
- Estatísticas em tempo real da plataforma
- Cards de recursos com animações suaves
- Seção de veículos populares
- Call-to-action interativo

### 🔄 Comparação de Veículos
- Interface intuitiva para seleção de veículos
- Suporte a múltiplos tipos (carros, motos, caminhões)
- Carregamento dinâmico de marcas, modelos e anos
- Comparação visual com métricas detalhadas
- Exportação de resultados
- Animações fluidas durante o processo

### 🎨 Design System
- Paleta de cores consistente
- Componentes reutilizáveis
- Animações e transições suaves
- Design responsivo para todos os dispositivos
- Efeitos visuais modernos (glass morphism, gradientes)

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos para executar

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd ApiFipeAnalitics/frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 🔧 Solução de Problemas

### "Cannot GET" ou erro 404

Se você está vendo "Cannot GET" ou erros 404, siga estes passos:

1. **Verifique se o backend está rodando**
   ```bash
   # No diretório raiz do projeto
   npm run dev
   ```
   O backend deve estar rodando em `http://localhost:3000`

2. **Teste a conectividade da API**
   ```bash
   curl http://localhost:3000/health
   ```
   Deve retornar: `{"status":"OK","timestamp":"..."}`

3. **Verifique se o frontend está rodando**
   ```bash
   # No diretório frontend
   cd frontend
   npm run dev
   ```
   O frontend deve estar rodando em `http://localhost:5173`

4. **Limpe o cache e reinstale dependências**
   ```bash
   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   
   # Backend (se necessário)
   cd ..
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

### Problemas de CORS

Se você ver erros de CORS no console:

1. **Verifique a configuração do backend**
   - O arquivo `src/app.js` deve ter CORS configurado para `http://localhost:5173`

2. **Teste com curl**
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: X-Requested-With" \
        -X OPTIONS \
        http://localhost:3000/api/health
   ```

### Dados não carregam

A aplicação tem fallback para dados mock quando a API não está disponível:

1. **Verifique o console do navegador** - deve mostrar logs das requisições
2. **Componente de teste** - no canto inferior direito da tela há um indicador de status da API
3. **Dados mock** - mesmo sem API, a aplicação funciona com dados de exemplo

### Problemas de Build

Se o build falhar:

1. **Verifique as dependências**
   ```bash
   npm install
   ```

2. **Limpe o cache do Vite**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Verifique erros de TypeScript**
   ```bash
   npx tsc --noEmit
   ```

### Performance lenta

1. **Desabilite extensões do navegador** que podem interferir
2. **Use modo de desenvolvimento** com `npm run dev`
3. **Verifique a rede** - requisições para API externa podem ser lentas

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Layout.tsx      # Layout principal com navegação
│   └── ApiTest.tsx     # Componente de teste da API
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Página inicial
│   ├── Compare.tsx     # Página de comparação
│   ├── Search.tsx      # Página de busca
│   └── Stats.tsx       # Página de estatísticas
├── services/           # Serviços e APIs
│   └── api.ts          # Cliente da API com fallbacks
├── types/              # Definições de tipos TypeScript
│   └── index.ts        # Interfaces e tipos
├── utils/              # Utilitários e helpers
│   └── index.ts        # Funções auxiliares
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🎯 Componentes Principais

### Layout
- Sidebar responsiva com navegação
- Header com breadcrumbs
- Animações de transição entre páginas
- Indicador de status da API

### Home
- Hero section animado
- Cards de estatísticas
- Grid de recursos
- Seção de veículos populares

### Compare
- Seletores de veículos dinâmicos
- Carregamento progressivo de dados
- Resultados de comparação visuais
- Exportação de dados

### ApiTest
- Monitora conectividade com backend
- Exibe status em tempo real
- Fallback automático para dados mock

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🌟 Características Técnicas

### Performance
- Lazy loading de componentes
- Otimização de re-renders
- Debounce em buscas
- Cache de requisições

### Acessibilidade
- Navegação por teclado
- Labels semânticos
- Contraste adequado
- Foco visível

### Responsividade
- Mobile-first design
- Breakpoints otimizados
- Layout flexível
- Componentes adaptativos

### Robustez
- Fallback para dados mock
- Tratamento de erros
- Retry automático
- Indicadores de loading

## 🎨 Customização

### Cores
As cores podem ser customizadas no arquivo `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... outras variações
  }
}
```

### Animações
Animações customizadas estão definidas no Tailwind e podem ser estendidas conforme necessário.

## 📱 Compatibilidade

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
