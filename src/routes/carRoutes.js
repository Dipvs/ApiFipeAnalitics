/**
 * ROTAS PARA CARROS (NOVA API EXPANDIDA)
 * Aqui defino todas as rotas relacionadas à nova API de carros
 * que utiliza dados expandidos e funcionalidades avançadas que implementei
 */

const express = require('express');                    // Framework web
const router = express.Router();                      // Crio um roteador Express
const carController = require('../controllers/carController'); // Importo o controlador que criei

/**
 * MIDDLEWARE DE LOGGING
 * Registro todas as requisições feitas para essas rotas
 * Útil para debuggar e monitorar o que está acontecendo
 */
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // Chamo o próximo middleware na cadeia
};

// Aplico o middleware de logging a todas as rotas deste arquivo
router.use(logRequest);

/**
 * DEFINIÇÃO DAS ROTAS DA API DE CARROS
 * Organizei por ordem de prioridade para evitar conflitos
 */

// 1. HEALTH CHECK - Verifico se a API está funcionando
// Rota: GET /api/cars/health
router.get('/health', carController.healthCheck);

// 2. BUSCA AVANÇADA - Busco carros com múltiplos filtros
// Rota: GET /api/cars/search?make=Toyota&model=Corolla&year=2022
router.get('/search', carController.searchCars);

// 3. LISTAR MARCAS - Pego todas as marcas disponíveis
// Rota: GET /api/cars/makes
router.get('/makes', carController.getAllMakes);

// 4. BUSCAR POR MARCA - Listo carros de uma marca específica
// Rota: GET /api/cars/make/Toyota
router.get('/make/:make', carController.getCarsByMake);

// 5. BUSCAR POR MODELO - Listo carros de um modelo específico
// Rota: GET /api/cars/model/Corolla
router.get('/model/:model', carController.getCarsByModel);

// 6. BUSCAR POR ANO - Listo carros de um ano específico
// Rota: GET /api/cars/year/2022
router.get('/year/:year', carController.getCarsByYear);

// 7. BUSCAR POR COMBUSTÍVEL - Listo carros por tipo de combustível
// Rota: GET /api/cars/fuel/gasoline
router.get('/fuel/:fuelType', carController.getCarsByFuelType);

// 8. BUSCAR POR TRANSMISSÃO - Listo carros por tipo de transmissão
// Rota: GET /api/cars/transmission/manual
router.get('/transmission/:transmission', carController.getCarsByTransmission);

// 9. CARROS EFICIENTES - Listo carros com melhor consumo de combustível
// Rota: GET /api/cars/efficient
router.get('/efficient', carController.getEfficientCars);

// 10. BUSCAR POR CILINDROS - Listo carros por número de cilindros
// Rota: GET /api/cars/cylinders/4
router.get('/cylinders/:cylinders', carController.getCarsByCylinders);

// 11. ESTATÍSTICAS GERAIS - Forneço estatísticas sobre todos os carros
// Rota: GET /api/cars/stats
router.get('/stats', carController.getCarStats);

// 12. BUSCAR POR FAIXA DE PREÇO - Listo carros dentro de uma faixa de preço
// Rota: GET /api/cars/price-range?min=50000&max=100000
router.get('/price-range', carController.getCarsByPriceRange);

// 13. COMPARAR CARROS - Comparo múltiplos carros (recebo dados via POST)
// Rota: POST /api/cars/compare
router.post('/compare', carController.compareCars);

// 14. BUSCAR IMAGEM DE CARRO - Pego imagem de um carro específico
// Rota: GET /api/cars/image/Toyota/Corolla
router.get('/image/:make/:model', carController.getCarImage);

// 15. BUSCAR MÚLTIPLAS IMAGENS - Pego imagens de vários carros (POST)
// Rota: POST /api/cars/images
router.post('/images', carController.getMultipleCarImages);

// 16. ESTATÍSTICAS DO CACHE - Mostro estatísticas do cache de imagens
// Rota: GET /api/cars/images/cache/stats
router.get('/images/cache/stats', carController.getImageCacheStats);

// 17. LIMPAR CACHE - Removo todas as imagens do cache
// Rota: DELETE /api/cars/images/cache
router.delete('/images/cache', carController.clearImageCache);

// Exporto o roteador para usar no app.js
module.exports = router; 