# 🏎️ Comparate - Sistema de Análise Automotiva

Sistema completo de comparação e análise de veículos com dados brasileiros, interface moderna e funcionalidades avançadas de comparação.

## ✨ Funcionalidades Principais

### 🎯 Seção Hero Gigante
- **Título "Comparate"** em fonte Orbitron com gradiente animado
- **Menu hambúrguer** integrado na seção hero (lado direito)
- **Vídeo de fundo** Honda NSX 4K em loop
- **Design responsivo** que se adapta a todos os dispositivos

### 🔍 Sistema de Busca Avançada
- Busca por marca, modelo, ano e especificações
- **32+ modelos** de veículos brasileiros
- **9 marcas principais**: Toyota, Honda, Volkswagen, Chevrolet, Ford, Hyundai, Nissan, Fiat, Renault, Jeep
- Dados completos com preços em BRL

### ⚖️ Comparação Inteligente de Veículos
- Compare até **3 veículos** simultaneamente
- **Sistema de pontuação** baseado em:
  - **Aceleração 0-100 km/h** (30% do peso)
  - **Economia de combustível** (25% do peso)
  - **Ano do veículo** (25% do peso)
  - **Relação custo-benefício** (20% do peso)

### 🏆 Tela de Resultado Estilo Forza
- **Animação de entrada** dramática
- **Fundo vermelho** com gradiente
- **Nome do carro repetindo** em animação contínua
- **Imagem do veículo** do lado esquerdo
- **Estatísticas detalhadas** do lado direito:
  - Potência (HP)
  - Aceleração 0-100 km/h
  - Consumo de combustível
  - Ano de fabricação
  - Preço
  - **Pontuação final** calculada

### 🎨 Interface Moderna
- **Paleta neon**: Verde (#00ff88), Azul (#00c8ff), Rosa (#ff0080)
- **Fontes especializadas**: Orbitron para títulos, Rajdhani para textos
- **Animações fluidas**: Gradientes, pulsação, hover effects
- **Menu lateral** com relógio gigante animado
- **Scrollbar personalizada** com tema neon

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **CSS3** com animações avançadas
- **Responsive Design** mobile-first

### Backend
- **Node.js** com Express
- **API RESTful** com endpoints organizados
- **Dados brasileiros** expandidos e validados
- **Sistema de cache** para performance

### Design e UX
- **Gradientes animados** com keyframes CSS
- **Backdrop filters** para efeitos de vidro
- **Transições suaves** com cubic-bezier
- **Tipografia moderna** com Google Fonts

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Backend
```bash
# Na raiz do projeto
npm install
npm run dev
# Servidor rodando em http://localhost:3000
```

### Frontend
```bash
# Na pasta frontend
cd frontend
npm install
npm run dev
# Interface rodando em http://localhost:5173
```

## 📊 Dados Disponíveis

### Marcas e Modelos
- **Toyota**: Corolla, Corolla Cross, Yaris, Hilux, SW4, Prius, Camry, RAV4
- **Honda**: Civic, HR-V, City, Fit, CR-V, Accord
- **Volkswagen**: Golf, Jetta, Tiguan, Polo, T-Cross, Passat
- **Chevrolet**: Onix, Cruze, Tracker, S10, Spin, Equinox
- **Ford**: Ka, EcoSport, Ranger, Territory, Mustang
- **Hyundai**: HB20, Creta, Tucson, Elantra
- **Nissan**: Versa, Kicks, Frontier, Sentra
- **Fiat**: Argo, Toro, Cronos, Pulse
- **Renault**: Sandero, Duster, Oroch, Captur
- **Jeep**: Renegade, Compass, Commander

### Especificações Técnicas
- **Motor**: Potência (HP), Torque (Nm), Cilindros, Deslocamento
- **Performance**: Velocidade máxima, Aceleração 0-100 km/h
- **Consumo**: Cidade e estrada (km/l)
- **Características**: Portas, assentos, porta-malas
- **Preços**: Valores em BRL atualizados

## 🎮 Funcionalidades Especiais

### Sistema de Comparação
1. **Selecione** até 3 veículos na busca
2. **Clique** no botão "COMPARAR E DECIDIR VENCEDOR"
3. **Veja** a tela animada com o resultado
4. **Analise** as pontuações detalhadas

### Menu Interativo
- **Relógio gigante** com horário em tempo real
- **Navegação fluida** entre seções
- **Animações** de hover e transição
- **Design responsivo** para mobile

### Vídeo de Fundo
- **Honda NSX 4K** em loop contínuo
- **Overlay escuro** para legibilidade
- **Carregamento otimizado** com preload
- **Fallback** para dispositivos com limitações

## 🎨 Paleta de Cores

```css
/* Cores principais */
--neon-green: #00ff88;
--neon-blue: #00c8ff;
--neon-pink: #ff0080;
--dark-red: #8B0000;
--crimson: #DC143C;
--fire-red: #B22222;

/* Gradientes */
background: linear-gradient(45deg, #00ff88, #00c8ff, #ff0080);
background: linear-gradient(135deg, #8B0000, #DC143C, #B22222);
```

## 📱 Responsividade

### Desktop (1200px+)
- Layout completo com todas as funcionalidades
- Vídeo de fundo em alta qualidade
- Menu lateral expansivo

### Tablet (768px - 1199px)
- Grid adaptativo para comparação
- Menu lateral otimizado
- Fontes redimensionadas

### Mobile (< 768px)
- Layout em coluna única
- Menu hambúrguer compacto
- Tela de resultado adaptada

## 🔧 API Endpoints

```javascript
// Buscar todas as marcas
GET /api/cars/makes

// Buscar veículos com filtros
GET /api/cars/search?make=Toyota&model=Corolla&limit=10

// Buscar por marca específica
GET /api/cars/make/:make

// Buscar por modelo
GET /api/cars/model/:model

// Buscar por ano
GET /api/cars/year/:year
```

## 🏁 Performance

### Otimizações Implementadas
- **Lazy loading** de componentes
- **Memoização** de cálculos pesados
- **Debounce** em buscas
- **Cache** de resultados da API
- **Compressão** de assets

### Métricas
- **Tempo de carregamento**: < 2s
- **First Contentful Paint**: < 1s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🎯 Roadmap Futuro

### Funcionalidades Planejadas
- [ ] **Favoritos** persistentes
- [ ] **Histórico** de comparações
- [ ] **Filtros avançados** (preço, consumo, potência)
- [ ] **Gráficos** de comparação
- [ ] **Exportação** de relatórios
- [ ] **Modo escuro/claro**
- [ ] **PWA** com offline support
- [ ] **Notificações** de novos modelos

### Melhorias Técnicas
- [ ] **Testes unitários** com Jest
- [ ] **E2E testing** com Cypress
- [ ] **Docker** containerization
- [ ] **CI/CD** pipeline
- [ ] **Monitoring** com analytics
- [ ] **SEO** optimization

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e processo de submissão de pull requests.

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@carcomparator.com.br
- 💬 Discord: [Comparate Community](https://discord.gg/carcomparator)
- 📱 WhatsApp: +55 11 99999-9999

---

**Comparate** - Desenvolvido com ❤️ para entusiastas automotivos brasileiros 