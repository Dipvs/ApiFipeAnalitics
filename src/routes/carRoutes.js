/**
 * ROTAS PARA CARROS (API FIPE)
 * Rotas para acessar dados da tabela FIPE brasileira
 */

const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

/**
 * MIDDLEWARE DE LOGGING
 * Registro todas as requisições feitas para essas rotas
 */
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Aplico o middleware de logging a todas as rotas
router.use(logRequest);

/**
 * ROTAS DA API FIPE
 */

// 1. BUSCA INTELIGENTE - Busco carros com filtros
// Rota: GET /api/cars/search?make=Toyota&model=Corolla&year=2022
router.get('/search', carController.searchCars);

// 2. LISTAR MARCAS FIPE - Pego todas as marcas da FIPE
// Rota: GET /api/cars/makes?type=cars
router.get('/makes', carController.getAllMakes);

// 3. BUSCAR POR MARCA - Listo carros de uma marca específica
// Rota: GET /api/cars/make/Toyota
router.get('/make/:make', carController.getCarsByMake);

// 4. BUSCAR POR MODELO - Listo carros de um modelo específico
// Rota: GET /api/cars/model/Corolla?make=Toyota
router.get('/model/:model', carController.getCarsByModel);

// 5. BUSCAR POR ANO - Listo carros de um ano específico
// Rota: GET /api/cars/year/2022
router.get('/year/:year', carController.getCarsByYear);

// 6. BUSCAR POR COMBUSTÍVEL - Listo carros por tipo de combustível
// Rota: GET /api/cars/fuel/flex
router.get('/fuel/:fuelType', carController.getCarsByFuelType);

// 7. BUSCAR POR TRANSMISSÃO - Listo carros por tipo de transmissão
// Rota: GET /api/cars/transmission/manual
router.get('/transmission/:transmission', carController.getCarsByTransmission);

// 8. BUSCAR POR CÓDIGO FIPE - Busco veículo por código FIPE
// Rota: GET /api/cars/fipe/001234-1?type=cars
router.get('/fipe/:fipeCode', carController.getCarByFipeCode);

// 9. ESTATÍSTICAS FIPE - Forneço estatísticas da FIPE
// Rota: GET /api/cars/stats
router.get('/stats', carController.getCarStats);

// 10. BUSCAR COM MÚLTIPLOS FILTROS - Busco com body JSON
// Rota: POST /api/cars/filters
router.post('/filters', carController.getCarsByMultipleFilters);

// 11. COMPARAR CARROS - Comparo múltiplos carros
// Rota: POST /api/cars/compare
router.post('/compare', carController.compareCars);

// 12. LIMPAR CACHE - Limpo cache da API
// Rota: DELETE /api/cars/cache
router.delete('/cache', carController.clearCache);

// 13. BUSCAR IMAGEM DE CARRO - Pego imagem de um carro específico
// Rota: GET /api/cars/image/Toyota/Corolla
router.get('/image/:make/:model', carController.getCarImage);

// 14. BUSCAR MÚLTIPLAS IMAGENS - Pego imagens de vários carros
// Rota: POST /api/cars/images
router.post('/images', carController.getMultipleCarImages);

// 15. ESTATÍSTICAS DO CACHE DE IMAGENS - Mostro estatísticas do cache
// Rota: GET /api/cars/images/cache/stats
router.get('/images/cache/stats', carController.getImageCacheStats);

// 16. LIMPAR CACHE DE IMAGENS - Removo imagens do cache
// Rota: DELETE /api/cars/images/cache
router.delete('/images/cache', carController.clearImageCache);

// 17. ESTATÍSTICAS DO MERCADO BRASILEIRO - Dados específicos do Brasil
// Rota: GET /api/cars/stats/brazil
router.get('/stats/brazil', carController.getBrazilianMarketStats);

// 18. REFERÊNCIAS HISTÓRICAS FIPE - Obtenho todas as referências/tabelas disponíveis
// Rota: GET /api/cars/references
router.get('/references', carController.getFipeReferences);

// 19. EVOLUÇÃO DE PREÇOS - Obtenho evolução histórica de preços de um veículo
// Rota: GET /api/cars/price-evolution/Toyota/Corolla/2020?max_references=12
router.get('/price-evolution/:make/:model/:year', carController.getVehiclePriceEvolution);

module.exports = router; 