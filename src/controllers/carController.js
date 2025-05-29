const carApiService = require('../services/carApiServiceBrazil');
const carImageService = require('../services/carImageService');

// Função auxiliar para validar parâmetros
const validateParams = (params, required = []) => {
  const missing = required.filter(param => !params[param]);
  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }
};

// Função auxiliar para padronizar respostas
const createResponse = (success, data, message = null, meta = {}) => {
  return {
    success,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  };
};

const carController = {
  // Buscar carros com filtros
  searchCars: async (req, res) => {
    try {
      const filters = req.query;
      console.log(`[${new Date().toISOString()}] GET /api/cars/search`);
      console.log('Search request with filters:', filters);
      
      const result = await carApiService.searchCars(filters);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          total: result.total,
          source: result.source,
          message: result.message || 'Busca realizada com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          data: []
        });
      }
    } catch (error) {
      console.error('Error in searchCars controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: []
      });
    }
  },

  // Obter todas as marcas
  getAllMakes: async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] GET /api/cars/makes`);
      console.log('Getting all car makes');
      
      const result = await carApiService.getAllMakes();
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          total: result.total,
          message: result.message || 'Marcas obtidas com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          data: []
        });
      }
    } catch (error) {
      console.error('Error in getAllMakes controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: []
      });
    }
  },

  // Buscar carros por marca
  getCarsByMake: async (req, res) => {
    try {
      const { make } = req.params;
      const { limit } = req.query;
      
      console.log(`[${new Date().toISOString()}] GET /api/cars/make/${make}`);
      console.log(`Getting cars for make: ${make}`);
      
      const result = await carApiService.getCarsByMake(make, limit);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          total: result.total,
          make: result.make,
          source: result.source,
          message: result.message || `Carros da marca ${make} obtidos com sucesso`
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          data: [],
          make: make
        });
      }
    } catch (error) {
      console.error(`Error in getCarsByMake controller for ${req.params.make}:`, error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: [],
        make: req.params.make
      });
    }
  },

  // 4. Buscar carros por modelo
  getCarsByModel: async (req, res) => {
    try {
      const { model } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ model }, ['model']);

      console.log(`Getting cars for model: ${model}`);

      const result = await carApiService.getCarsByModel(model, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars for model ${model} retrieved successfully`,
          { 
            total: result.total,
            model: result.model,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByModel:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 5. Buscar carros por ano
  getCarsByYear: async (req, res) => {
    try {
      const { year } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ year }, ['year']);

      const yearInt = parseInt(year);
      if (isNaN(yearInt) || yearInt < 1900 || yearInt > new Date().getFullYear() + 1) {
        return res.status(400).json(createResponse(false, [], 'Invalid year provided'));
      }

      console.log(`Getting cars for year: ${year}`);

      const result = await carApiService.getCarsByYear(yearInt, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars for year ${year} retrieved successfully`,
          { 
            total: result.total,
            year: result.year,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByYear:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 6. Buscar carros por tipo de combustível
  getCarsByFuelType: async (req, res) => {
    try {
      const { fuelType } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ fuelType }, ['fuelType']);

      const validFuelTypes = ['gas', 'diesel', 'electricity', 'hybrid'];
      if (!validFuelTypes.includes(fuelType.toLowerCase())) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          `Invalid fuel type. Valid options: ${validFuelTypes.join(', ')}`
        ));
      }

      console.log(`Getting cars for fuel type: ${fuelType}`);

      const result = await carApiService.getCarsByFuelType(fuelType, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars with ${fuelType} fuel type retrieved successfully`,
          { 
            total: result.total,
            fuel_type: result.fuel_type,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByFuelType:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 7. Buscar carros por transmissão
  getCarsByTransmission: async (req, res) => {
    try {
      const { transmission } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ transmission }, ['transmission']);

      const validTransmissions = ['manual', 'automatic'];
      if (!validTransmissions.includes(transmission.toLowerCase())) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          `Invalid transmission type. Valid options: ${validTransmissions.join(', ')}`
        ));
      }

      console.log(`Getting cars for transmission: ${transmission}`);

      const result = await carApiService.getCarsByTransmission(transmission, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars with ${transmission} transmission retrieved successfully`,
          { 
            total: result.total,
            transmission: result.transmission,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByTransmission:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 8. Buscar carros eficientes
  getEfficientCars: async (req, res) => {
    try {
      const minMpg = parseInt(req.query.min_mpg) || 30;
      const limit = parseInt(req.query.limit) || 10;

      if (minMpg < 10 || minMpg > 100) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'min_mpg must be between 10 and 100'
        ));
      }

      console.log(`Getting efficient cars with min MPG: ${minMpg}`);

      const result = await carApiService.getEfficientCars(minMpg, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Efficient cars (${minMpg}+ MPG) retrieved successfully`,
          { 
            total: result.total,
            min_mpg: result.min_mpg,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getEfficientCars:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 9. Buscar carros por número de cilindros
  getCarsByCylinders: async (req, res) => {
    try {
      const { cylinders } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ cylinders }, ['cylinders']);

      const cylindersInt = parseInt(cylinders);
      const validCylinders = [2, 3, 4, 5, 6, 8, 10, 12, 16];
      
      if (!validCylinders.includes(cylindersInt)) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          `Invalid cylinder count. Valid options: ${validCylinders.join(', ')}`
        ));
      }

      console.log(`Getting cars with ${cylinders} cylinders`);

      const result = await carApiService.getCarsByCylinders(cylindersInt, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars with ${cylinders} cylinders retrieved successfully`,
          { 
            total: result.total,
            cylinders: result.cylinders,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByCylinders:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 10. Comparar múltiplos carros
  compareCars: async (req, res) => {
    try {
      const { car_ids } = req.body;

      if (!car_ids || !Array.isArray(car_ids)) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'car_ids must be an array of car IDs'
        ));
      }

      if (car_ids.length < 2) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'At least 2 car IDs are required for comparison'
        ));
      }

      if (car_ids.length > 5) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'Maximum 5 cars can be compared at once'
        ));
      }

      console.log('Comparing cars:', car_ids);

      const result = await carApiService.compareCars(car_ids);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          'Car comparison completed successfully',
          { 
            total: result.total,
            comparison_stats: result.comparison_stats,
            compared_cars: car_ids.length
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in compareCars:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 11. Obter estatísticas gerais
  getCarStats: async (req, res) => {
    try {
      console.log('Getting car statistics');

      const result = await carApiService.getCarStats();

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          'Car statistics retrieved successfully',
          { 
            generated_at: new Date().toISOString(),
            api_source: 'API-Ninjas'
          }
        ));
      } else {
        res.status(400).json(createResponse(false, {}, result.error));
      }
    } catch (error) {
      console.error('Error in getCarStats:', error);
      res.status(500).json(createResponse(false, {}, error.message));
    }
  },

  // 12. Buscar carros por faixa de preço
  getCarsByPriceRange: async (req, res) => {
    try {
      const minPrice = parseInt(req.query.min_price) || 0;
      const maxPrice = parseInt(req.query.max_price) || 1000000;
      const limit = parseInt(req.query.limit) || 10;

      if (minPrice < 0 || maxPrice < 0) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'Price values must be positive'
        ));
      }

      if (minPrice >= maxPrice) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'min_price must be less than max_price'
        ));
      }

      console.log(`Getting cars in price range: $${minPrice} - $${maxPrice}`);

      const result = await carApiService.getCarsByPriceRange(minPrice, maxPrice, limit);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars in price range $${minPrice} - $${maxPrice} retrieved successfully`,
          { 
            total: result.total,
            price_range: result.price_range,
            limit,
            note: 'Prices are estimated based on make, model, and year'
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByPriceRange:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // 13. Health check endpoint
  healthCheck: async (req, res) => {
    try {
      res.json(createResponse(
        true, 
        { 
          status: 'healthy',
          service: 'Car API Service',
          version: '2.0.0',
          api_provider: 'API-Ninjas',
          endpoints_available: 16
        }, 
        'Service is running normally'
      ));
    } catch (error) {
      console.error('Error in healthCheck:', error);
      res.status(500).json(createResponse(false, {}, 'Service health check failed'));
    }
  },

  // 14. Buscar imagem de um carro específico
  getCarImage: async (req, res) => {
    try {
      const { make, model } = req.params;
      
      validateParams({ make, model }, ['make', 'model']);

      console.log(`Getting image for: ${make} ${model}`);

      const options = {
        useUnsplash: req.query.use_unsplash === 'true',
        usePexels: req.query.use_pexels === 'true'
      };

      const result = await carImageService.getCarImage(make, model, options);

      if (result.success) {
        res.json(createResponse(
          true, 
          result, 
          `Image for ${make} ${model} retrieved successfully`,
          { 
            make: result.make,
            model: result.model,
            source: result.source
          }
        ));
      } else {
        res.status(400).json(createResponse(false, result, result.error));
      }
    } catch (error) {
      console.error('Error in getCarImage:', error);
      res.status(500).json(createResponse(false, {}, error.message));
    }
  },

  // 15. Buscar imagens de múltiplos carros
  getMultipleCarImages: async (req, res) => {
    try {
      const { cars } = req.body;

      if (!cars || !Array.isArray(cars)) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'cars must be an array of car objects with make and model'
        ));
      }

      if (cars.length === 0) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'At least one car is required'
        ));
      }

      if (cars.length > 10) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'Maximum 10 cars can be processed at once'
        ));
      }

      // Validar que cada carro tem make e model
      for (const car of cars) {
        if (!car.make || !car.model) {
          return res.status(400).json(createResponse(
            false, 
            [], 
            'Each car must have make and model properties'
          ));
        }
      }

      console.log(`Getting images for ${cars.length} cars`);

      const options = {
        useUnsplash: req.query.use_unsplash === 'true',
        usePexels: req.query.use_pexels === 'true'
      };

      const result = await carImageService.getMultipleCarImages(cars, options);

      if (result.success) {
        res.json(createResponse(
          true, 
          result, 
          `Images for ${cars.length} cars retrieved successfully`,
          { 
            total_requested: cars.length,
            total_retrieved: result.total
          }
        ));
      } else {
        res.status(400).json(createResponse(false, result, result.error));
      }
    } catch (error) {
      console.error('Error in getMultipleCarImages:', error);
      res.status(500).json(createResponse(false, {}, error.message));
    }
  },

  // 16. Obter estatísticas do cache de imagens
  getImageCacheStats: async (req, res) => {
    try {
      console.log('Getting image cache statistics');

      const result = carImageService.getCacheStats();

      res.json(createResponse(
        true, 
        result, 
        'Image cache statistics retrieved successfully',
        { 
          generated_at: new Date().toISOString()
        }
      ));
    } catch (error) {
      console.error('Error in getImageCacheStats:', error);
      res.status(500).json(createResponse(false, {}, error.message));
    }
  },

  // 17. Limpar cache de imagens
  clearImageCache: async (req, res) => {
    try {
      console.log('Clearing image cache');

      const result = carImageService.clearImageCache();

      res.json(createResponse(
        true, 
        result, 
        'Image cache cleared successfully'
      ));
    } catch (error) {
      console.error('Error in clearImageCache:', error);
      res.status(500).json(createResponse(false, {}, error.message));
    }
  },

  // Obter estatísticas do mercado brasileiro
  getBrazilianMarketStats: async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] GET /api/cars/stats/brazil`);
      console.log('Getting Brazilian market statistics');
      
      const result = await carApiService.getBrazilianMarketStats();
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          message: result.message || 'Estatísticas obtidas com sucesso'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          data: {}
        });
      }
    } catch (error) {
      console.error('Error in getBrazilianMarketStats controller:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        data: {}
      });
    }
  }
};

module.exports = carController; 