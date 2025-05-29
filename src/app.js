const express = require('express');
const cors = require('cors');
const app = express();
const vehicleRoutes = require('./routes/vehicleRoutes');
const carRoutes = require('./routes/carRoutes');
const errorHandler = require('./middlewares/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175', 
    'http://localhost:5176', 
    'http://localhost:5177', 
    'http://localhost:5178', 
    'http://localhost:5179', 
    'http://localhost:5180', 
    'http://localhost:5181', 
    'http://localhost:5182', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
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
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: 'FIPE Analytics API está funcionando!', 
    version: '1.0.0',
    endpoints: {
      api: '/api',
      docs: '/api-docs'
    }
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'FIPE Analytics API',
    version: '2.0.0',
    apis: {
      fipe: 'Legacy FIPE API (deprecated)',
      cars: 'New Car API powered by API-Ninjas'
    }
  });
});

app.use('/api', vehicleRoutes);
app.use('/api/cars', carRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

module.exports = app;
