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

## 🎓 **DIVISÃO DAS FUNCIONALIDADES BACKEND - APRESENTAÇÃO**

### 🏗️ **1. THAY - Arquitetura e Configuração do Servidor**

#### **Funcionalidades:**
- **Configuração Express.js** com middlewares personalizados
- **Sistema CORS** para múltiplas portas de desenvolvimento  
- **Estrutura MVC** organizada e modular
- **Scripts de automação** para deploy e inicialização

#### **Localização no Código:**
- **Arquivo**: `src/app.js` (linhas 1-121)
- **CORS**: `src/app.js` (linhas 17-42)
- **Middlewares**: `src/app.js` (linhas 46-49)
- **Scripts**: `start.sh`, `stop.sh`, `test.sh`

#### **Perguntas do Professor:**
- "Por que escolheram o padrão MVC para organizar o código?"
- "Como funciona a configuração de CORS para múltiplas portas?"
- "Explique o processo de inicialização da aplicação"
- "Quais middlewares foram implementados e suas funções?"

---

### 📊 **2. DEBORAH - Base de Dados e Modelos**

#### **Funcionalidades:**
- **Base de dados brasileira** com 1997 linhas de carros
- **Algoritmo de geração de preços** em BRL por marca
- **Enriquecimento automático** de dados técnicos
- **Especificações completas** de motor, performance e consumo

#### **Localização no Código:**
- **Arquivo**: `src/data/expandedBrazilianCars.js` (linhas 1-1997)
- **Algoritmo de preços**: `src/services/carApiServiceBrazil.js` (linhas 66-83)
- **Enriquecimento**: `src/services/carApiServiceBrazil.js` (linhas 85-170)
- **Filtros**: `src/services/carApiServiceBrazil.js` (linhas 16-60)

#### **Perguntas do Professor:**
- "Como geraram os preços realistas para o mercado brasileiro?"
- "Quantos modelos de carros estão na base de dados?"
- "Como garantem a integridade e qualidade dos dados?"
- "Explique o processo de enriquecimento automático de dados"

---

### 🔍 **3. THAIS - API RESTful e Endpoints**

#### **Funcionalidades:**
- **17 endpoints REST** organizados e documentados
- **Sistema de busca avançada** com múltiplos filtros
- **Documentação Swagger** automática
- **Validação robusta** de parâmetros de entrada

#### **Localização no Código:**
- **Arquivo**: `src/routes/carRoutes.js` (linhas 1-98)
- **Endpoints principais**: `src/routes/carRoutes.js` (linhas 25-80)
- **Middleware logging**: `src/routes/carRoutes.js` (linhas 10-16)
- **Controllers**: `src/controllers/carController.js` (linhas 1-685)

#### **Perguntas do Professor:**
- "Quantos endpoints possui a API e suas funcionalidades?"
- "Como implementaram a documentação automática da API?"
- "Explique os diferentes tipos de busca disponíveis"
- "Como tratam a validação de parâmetros nas requisições?"

---

### 🧮 **4. JOÃO VITOR - Algoritmos de Comparação e Lógica**

#### **Funcionalidades:**
- **Sistema de pontuação ponderada** com 4 critérios
- **Algoritmos de comparação** entre múltiplos veículos
- **Cálculos de eficiência** e custo-benefício
- **Conversões automáticas** (MPG→km/l, formatação BRL)

#### **Localização no Código:**
- **Arquivo**: `src/controllers/carController.js` (linhas 400-500)
- **Comparação**: `src/controllers/carController.js` (método `compareCars`)
- **Estatísticas**: `src/controllers/carController.js` (método `getCarStats`)
- **Conversões**: `src/services/carApiServiceBrazil.js` (linhas 95-110)

#### **Perguntas do Professor:**
- "Como funciona o algoritmo de pontuação para comparação?"
- "Quais são os 4 critérios e seus pesos na comparação?"
- "Como calculam custo-benefício de cada veículo?"
- "Explique as conversões de unidades implementadas"

---

### 🛡️ **5. VICTOR - Middlewares, Erros e Performance**

#### **Funcionalidades:**
- **Sistema global de tratamento de erros**
- **Middlewares customizados** de logging e cache
- **Cache inteligente** para imagens de carros
- **Health checks** e monitoramento de performance

#### **Localização no Código:**
- **Arquivo**: `src/middlewares/errorHandler.js` (linhas 1-29)
- **Cache sistema**: `src/services/carImageService.js` (linhas 1-237)
- **Health check**: `src/app.js` (linhas 65-75)
- **Logging**: `src/routes/carRoutes.js` (linhas 10-16)

#### **Perguntas do Professor:**
- "Como implementaram o tratamento global de erros?"
- "Explique o sistema de cache para otimização"
- "Como monitoram a performance da aplicação?"
- "Quais middlewares customizados foram desenvolvidos?"

---

## 🔧 **ENDPOINTS PRINCIPAIS COM LOCALIZAÇÃO**

### **Endpoints de Busca:**
```javascript
// Localização: src/routes/carRoutes.js (linha 26)
GET /api/cars/search?make=Toyota&model=Corolla

// Localização: src/routes/carRoutes.js (linha 32)  
GET /api/cars/make/:make

// Localização: src/routes/carRoutes.js (linha 38)
GET /api/cars/year/:year
```

### **Endpoints de Comparação:**
```javascript
// Localização: src/routes/carRoutes.js (linha 65)
POST /api/cars/compare

// Localização: src/routes/carRoutes.js (linha 59)
GET /api/cars/stats
```

### **Endpoints de Monitoramento:**
```javascript
// Localização: src/app.js (linha 65)
GET /health

// Localização: src/routes/carRoutes.js (linha 23)
GET /api/cars/health
```

---

## 📊 **MÉTRICAS TÉCNICAS DETALHADAS**

### **Distribuição de Código:**
- **Controllers**: `src/controllers/` - 2 arquivos, 850 linhas
- **Services**: `src/services/` - 3 arquivos, 597 linhas
- **Routes**: `src/routes/` - 2 arquivos, 544 linhas  
- **Data**: `src/data/` - 2 arquivos, 2008 linhas
- **Middlewares**: `src/middlewares/` - 1 arquivo, 29 linhas
- **Total Backend**: **4028 linhas de código**

### **Funcionalidades por Arquivo:**
- **app.js**: Configuração servidor, CORS, middlewares (121 linhas)
- **carController.js**: Lógica de negócio, comparações (685 linhas)
- **carApiServiceBrazil.js**: Algoritmos, filtros, preços (350 linhas)
- **expandedBrazilianCars.js**: Base de dados brasileira (1997 linhas)
- **carRoutes.js**: Definição de 17 endpoints REST (98 linhas)

---

## 💡 **PERGUNTAS TÉCNICAS ESPERADAS DO PROFESSOR**

### **Sobre Arquitetura (THAY):**
1. "Justifique a escolha do padrão MVC para este projeto"
2. "Como configuraram CORS para suportar desenvolvimento em múltiplas portas?"
3. "Explique a diferença entre middleware de aplicação e de rota"
4. "Por que separaram rotas em arquivos diferentes?"

### **Sobre Dados (DEBORAH):**
1. "Como garantem que os preços gerados são realistas para o mercado brasileiro?"
2. "Qual a estrutura de dados de um carro na base expandida?"
3. "Como implementaram o enriquecimento automático de dados?"
4. "Explique o processo de filtragem de carros por múltiplos critérios"

### **Sobre API (THAIS):**
1. "Quantos endpoints a API possui e suas responsabilidades?"
2. "Como implementaram a documentação automática com Swagger?"
3. "Explique a diferença entre busca simples e busca avançada"
4. "Como tratam erros de validação nos endpoints?"

### **Sobre Algoritmos (JOÃO VITOR):**
1. "Detalhe o algoritmo de pontuação para comparação de carros"
2. "Por que escolheram esses 4 critérios específicos e seus pesos?"
3. "Como calculam estatísticas agregadas dos carros?"
4. "Explique as conversões de unidades (MPG para km/l)"

### **Sobre Performance (VICTOR):**
1. "Como o middleware de erro global captura todas as exceções?"
2. "Explique a implementação do sistema de cache"
3. "Como monitoram a saúde da aplicação em produção?"
4. "Quais otimizações de performance foram implementadas?"

---

**Comparate** - Desenvolvido com ❤️ para entusiastas automotivos brasileiros 