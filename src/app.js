/**
 * ARQUIVO PRINCIPAL DA APLICAÇÃO BACKEND
 * Aqui eu configuro o servidor Express com todas as middlewares,
 * rotas e configurações necessárias para a minha API
 */

// Importo as dependências principais que vou usar
const express = require('express');        // Framework web para Node.js
const cors = require('cors');             // Middleware para configurar CORS
const app = express();                    // Crio uma instância da aplicação Express

// Importo as rotas que criei para organizar melhor o código
const vehicleRoutes = require('./routes/vehicleRoutes');  // Rotas para veículos (API FIPE legacy)
const carRoutes = require('./routes/carRoutes');          // Rotas para carros (nova API com dados expandidos)

// Importo os middlewares que desenvolvi
const errorHandler = require('./middlewares/errorHandler'); // Middleware para tratamento de erros

// Importo as dependências para documentação da API
const swaggerUi = require('swagger-ui-express');  // Interface web para documentação da API
const swaggerSpec = require('./docs/swagger');    // Especificação OpenAPI/Swagger

/**
 * CONFIGURAÇÃO DE CORS
 * Preciso permitir que o frontend (rodando em portas diferentes) acesse a API
 * Configurei para múltiplas portas para suportar diferentes ambientes de desenvolvimento
 */
app.use(cors({
  // Lista de origens que permito acessar minha API
  origin: [
    'http://localhost:5173',    // Porta padrão do Vite
    'http://localhost:5174',    // Portas alternativas caso a 5173 esteja ocupada
    'http://localhost:5175', 
    'http://localhost:5176', 
    'http://localhost:5177', 
    'http://localhost:5178', 
    'http://localhost:5179', 
    'http://localhost:5180', 
    'http://localhost:5181', 
    'http://localhost:5182', 
    'http://localhost:3000',    // Porta do próprio backend
    'http://127.0.0.1:5173',   // Mesmo que localhost, mas usando IP
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:5176',
    'http://127.0.0.1:5177',
    'http://127.0.0.1:5178',
    'http://127.0.0.1:5179',
    'http://127.0.0.1:5180',
    'http://127.0.0.1:5181',
    'http://127.0.0.1:5182'
  ],
  credentials: true,  // Permito envio de cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Métodos HTTP que aceito
  allowedHeaders: ['Content-Type', 'Authorization'],     // Headers que permito nas requisições
}));

/**
 * MIDDLEWARES PARA PARSING DE DADOS
 * Configuro o Express para interpretar dados JSON e formulários
 */
app.use(express.json());                          // Interpreto requisições JSON
app.use(express.urlencoded({ extended: true })); // Interpreto dados de formulários

/**
 * ROTA PRINCIPAL DE BOAS-VINDAS
 * Endpoint básico para verificar se minha API está funcionando
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'FIPE Analytics API está funcionando!', 
    version: '1.0.0',
    endpoints: {
      api: '/api',           // Endpoint base para rotas da API
      docs: '/api-docs'      // Endpoint para documentação Swagger
    }
  });
});

/**
 * ROTA DE HEALTH CHECK
 * Endpoint que criei para monitoramento da saúde da aplicação
 * Útil para verificar se o serviço está online e funcionando
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',                                    // Status da aplicação
    timestamp: new Date().toISOString(),            // Timestamp atual
    service: 'FIPE Analytics API',                   // Nome do serviço
    version: '2.0.0',                               // Versão da API
    apis: {
      fipe: 'Legacy FIPE API (deprecated)',         // API antiga que mantive
      cars: 'New Car API powered by API-Ninjas'     // Nova API que desenvolvi
    }
  });
});

/**
 * REGISTRO DAS ROTAS DA API
 * Aqui registro todas as rotas que criei
 */
app.use('/api', vehicleRoutes);              // Rotas para veículos FIPE
app.use('/api/cars', carRoutes);             // Rotas para carros expandidos

/**
 * DOCUMENTAÇÃO SWAGGER
 * Criei uma interface web interativa para testar a API
 * Fica disponível em /api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * MIDDLEWARE DE TRATAMENTO DE ERROS
 * Este deve ser o último middleware registrado
 * Captura e trata todos os erros que possam ocorrer na aplicação
 */
app.use(errorHandler);

// Exporto a aplicação configurada para usar no server.js
module.exports = app;
