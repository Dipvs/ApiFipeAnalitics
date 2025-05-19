// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Comparação de Veículos (FIPE)',
      version: '1.0.0',
      description: 'Documentação da API para comparar veículos usando a Tabela FIPE',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: [path.join(__dirname, '../routes/vehicleRoutes.js')], // esse é o caminho certo
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
