// src/routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicleController');

/**
 * @swagger
 * tags:
 *   name: Veículos
 *   description: Endpoints da API para comparação e gerenciamento de veículos
 */

/**
 * @swagger
 * /brands/{type}:
 *   get:
 *     summary: Lista as marcas de veículos de um determinado tipo
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [carros, motos, caminhões]
 *         description: Tipo do veículo (carros, motos, caminhões)
 *     responses:
 *       200:
 *         description: Lista de marcas retornada com sucesso
 */
router.get('/brands/:type', controller.getBrands);

/**
 * @swagger
 * /models/{type}/{brandCode}:
 *   get:
 *     summary: Lista os modelos disponíveis para uma marca específica
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [carros, motos, caminhões]
 *       - in: path
 *         name: brandCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da marca
 *     responses:
 *       200:
 *         description: Modelos retornados com sucesso
 */
router.get('/models/:type/:brandCode', controller.getModels);

/**
 * @swagger
 * /years/{type}/{brandCode}/{modelCode}:
 *   get:
 *     summary: Lista os anos disponíveis para um modelo específico
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [carros, motos, caminhões]
 *       - in: path
 *         name: brandCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da marca
 *       - in: path
 *         name: modelCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do modelo
 *     responses:
 *       200:
 *         description: Anos retornados com sucesso
 */
router.get('/years/:type/:brandCode/:modelCode', controller.getYears);

/**
 * @swagger
 * /vehicle/{type}/{brandCode}/{modelCode}/{yearCode}:
 *   get:
 *     summary: Retorna os detalhes de um veículo específico
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [carros, motos, caminhões]
 *       - in: path
 *         name: brandCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código da marca
 *       - in: path
 *         name: modelCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do modelo
 *       - in: path
 *         name: yearCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do ano/modelo
 *     responses:
 *       200:
 *         description: Detalhes do veículo retornados com sucesso
 */
router.get('/vehicle/:type/:brandCode/:modelCode/:yearCode', controller.getVehicle);

/**
 * @swagger
 * /compare:
 *   post:
 *     summary: Realiza a comparação entre dois veículos
 *     tags: [Veículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle1:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   brandCode:
 *                     type: string
 *                   modelCode:
 *                     type: string
 *                   yearCode:
 *                     type: string
 *               vehicle2:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   brandCode:
 *                     type: string
 *                   modelCode:
 *                     type: string
 *                   yearCode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Comparação entre os veículos realizada com sucesso
 */
router.post('/compare', controller.compareVehicles);

/**
 * @swagger
 * /compare/multiple:
 *   post:
 *     summary: Realiza a comparação entre múltiplos veículos
 *     tags: [Veículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     brandCode:
 *                       type: string
 *                     modelCode:
 *                       type: string
 *                     yearCode:
 *                       type: string
 *     responses:
 *       200:
 *         description: Comparação múltipla realizada com sucesso
 */
router.post('/compare/multiple', controller.compareMultipleVehicles);

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Adiciona um veículo à lista de favoritos
 *     tags: [Veículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               brandCode:
 *                 type: string
 *               modelCode:
 *                 type: string
 *               yearCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Veículo adicionado aos favoritos com sucesso
 */
router.post('/favorites', controller.addFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Retorna a lista de veículos favoritos
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Lista de veículos favoritos retornada com sucesso
 */
router.get('/favorites', controller.getFavorites);

/**
 * @swagger
 * /favorites/{id}:
 *   delete:
 *     summary: Remove um veículo da lista de favoritos pelo ID
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do veículo favorito
 *     responses:
 *       200:
 *         description: Veículo removido dos favoritos com sucesso
 */
router.delete('/favorites/:id', controller.deleteFavorite);

/**
 * @swagger
 * /stats/comparisons:
 *   get:
 *     summary: Retorna estatísticas sobre as comparações realizadas
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Estatísticas de comparação retornadas com sucesso
 */
router.get('/stats/comparisons', controller.getComparisonStats);

/**
 * @swagger
 * /stats/popular:
 *   get:
 *     summary: Retorna os veículos mais populares da plataforma
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Veículos populares retornados com sucesso
 */
router.get('/stats/popular', controller.getPopularVehicles);
/**
 * @swagger
 * /vehicles/{type}/price-range:
 *   post:
 *     summary: Busca veículos de um tipo específico dentro de um intervalo de preços
 *     tags: [Veículos]
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [carros, motos, caminhoes]
 *         description: Tipo do veículo (carros, motos, caminhoes)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minPrice:
 *                 type: number
 *                 example: 20000
 *               maxPrice:
 *                 type: number
 *                 example: 60000
 *               page:
 *                 type: integer
 *                 example: 1
 *               limit:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Lista de veículos dentro do intervalo de preço especificado
 */
router.post('/vehicles/:type/price-range', controller.searchByPriceRange);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Busca veículos pelo nome
 *     tags: [Veículos]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do veículo para pesquisa
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [carros, motos, caminhoes]
 *         description: Tipo do veículo
 *       - in: query
 *         name: marca
 *         schema:
 *           type: string
 *         description: Marca do veículo
 *       - in: query
 *         name: anoMin
 *         schema:
 *           type: integer
 *         description: Ano mínimo
 *       - in: query
 *         name: anoMax
 *         schema:
 *           type: integer
 *         description: Ano máximo
 *       - in: query
 *         name: precoMin
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: precoMax
 *         schema:
 *           type: number
 *         description: Preço máximo
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Limite por página
 *     responses:
 *       200:
 *         description: Veículos encontrados retornados com sucesso
 */
router.get('/search', controller.searchVehicleByName);

/**
 * @swagger
 * /search/filters:
 *   get:
 *     summary: Retorna filtros disponíveis para busca
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Filtros disponíveis retornados com sucesso
 */
router.get('/search/filters', controller.getSearchFilters);

/**
 * @swagger
 * /history:
 *   get:
 *     summary: Retorna o histórico de comparações realizadas
 *     tags: [Veículos]
 *     responses:
 *       200:
 *         description: Histórico de comparações retornado com sucesso
 */
router.get('/history', controller.getHistory);

/**
 * @swagger
 * /compare/export:
 *   post:
 *     summary: Exporta o resultado de uma comparação em formato JSON
 *     tags: [Veículos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle1:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   brandCode:
 *                     type: string
 *                   modelCode:
 *                     type: string
 *                   yearCode:
 *                     type: string
 *               vehicle2:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                   brandCode:
 *                     type: string
 *                   modelCode:
 *                     type: string
 *                   yearCode:
 *                     type: string
 *     responses:
 *       200:
 *         description: Resultado da comparação exportado com sucesso em JSON
 */
router.post('/compare/export', controller.exportComparison);

module.exports = router;