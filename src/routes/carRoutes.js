const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Middleware para log de requisições
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

router.use(logRequest);

// 1. Health check - deve vir primeiro para evitar conflitos
router.get('/health', carController.healthCheck);

// 2. Buscar carros com filtros avançados
router.get('/search', carController.searchCars);

// 3. Obter todas as marcas disponíveis
router.get('/makes', carController.getAllMakes);

// 4. Buscar carros por marca específica
router.get('/make/:make', carController.getCarsByMake);

// 5. Buscar carros por modelo específico
router.get('/model/:model', carController.getCarsByModel);

// 6. Buscar carros por ano
router.get('/year/:year', carController.getCarsByYear);

// 7. Buscar carros por tipo de combustível
router.get('/fuel/:fuelType', carController.getCarsByFuelType);

// 8. Buscar carros por transmissão
router.get('/transmission/:transmission', carController.getCarsByTransmission);

// 9. Buscar carros eficientes
router.get('/efficient', carController.getEfficientCars);

// 10. Buscar carros por número de cilindros
router.get('/cylinders/:cylinders', carController.getCarsByCylinders);

// 11. Obter estatísticas gerais
router.get('/stats', carController.getCarStats);

// 12. Buscar carros por faixa de preço
router.get('/price-range', carController.getCarsByPriceRange);

// 13. Comparar múltiplos carros (POST)
router.post('/compare', carController.compareCars);

// 14. Buscar imagem de um carro específico
router.get('/image/:make/:model', carController.getCarImage);

// 15. Buscar imagens de múltiplos carros (POST)
router.post('/images', carController.getMultipleCarImages);

// 16. Obter estatísticas do cache de imagens
router.get('/images/cache/stats', carController.getImageCacheStats);

// 17. Limpar cache de imagens
router.delete('/images/cache', carController.clearImageCache);

module.exports = router; 