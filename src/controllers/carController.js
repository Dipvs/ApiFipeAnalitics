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
      
      const result = await carApiService.smartCarSearch(filters);
      
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

  // Obter todas as marcas FIPE
  getAllMakes: async (req, res) => {
    try {
      console.log(`[${new Date().toISOString()}] GET /api/cars/makes`);
      console.log('Getting all car makes from FIPE');
      
      const vehicleType = req.query.type || 'cars';
      const result = await carApiService.getFipeBrands(vehicleType);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          total: result.total,
          source: result.source,
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
      const filters = { 
        make: make,
        limit: req.query.limit || 10,
        type: req.query.type || 'cars'
      };
      
      console.log(`[${new Date().toISOString()}] GET /api/cars/make/${make}`);
      console.log(`Getting cars for make: ${make}`);
      
      const result = await carApiService.searchVehiclesByMake(make, filters.type, filters);
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data,
          total: result.total,
          make: make,
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

  // Buscar carros por modelo
  getCarsByModel: async (req, res) => {
    try {
      const { model } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const make = req.query.make;

      validateParams({ model }, ['model']);

      console.log(`Getting cars for model: ${model}`);

      let result;
      if (make) {
        // Se tem marca, buscar por marca e modelo
        result = await carApiService.searchVehiclesByMakeModel(make, model, 'cars', { limit });
      } else {
        // Buscar apenas por modelo
        result = await carApiService.smartCarSearch({ model, limit });
      }

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars for model ${model} retrieved successfully`,
          { 
            total: result.total,
            model: model,
            make: make,
            source: result.source,
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

  // Buscar carros por ano
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

      const result = await carApiService.smartCarSearch({ year: yearInt, limit });

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars for year ${year} retrieved successfully`,
          { 
            total: result.total,
            year: yearInt,
            source: result.source,
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

  // Buscar carros por tipo de combustível
  getCarsByFuelType: async (req, res) => {
    try {
      const { fuelType } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ fuelType }, ['fuelType']);

      const validFuelTypes = ['gasolina', 'diesel', 'flex', 'etanol', 'eletrico'];
      if (!validFuelTypes.includes(fuelType.toLowerCase())) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          `Invalid fuel type. Valid options: ${validFuelTypes.join(', ')}`
        ));
      }

      console.log(`Getting cars for fuel type: ${fuelType}`);

      const result = await carApiService.smartCarSearch({ fuel_type: fuelType, limit });

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars with ${fuelType} fuel type retrieved successfully`,
          { 
            total: result.total,
            fuel_type: fuelType,
            source: result.source,
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

  // Buscar carros por transmissão
  getCarsByTransmission: async (req, res) => {
    try {
      const { transmission } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      validateParams({ transmission }, ['transmission']);

      const validTransmissions = ['manual', 'automatic', 'automático'];
      if (!validTransmissions.includes(transmission.toLowerCase())) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          `Invalid transmission type. Valid options: ${validTransmissions.join(', ')}`
        ));
      }

      console.log(`Getting cars for transmission: ${transmission}`);

      const result = await carApiService.smartCarSearch({ transmission, limit });

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Cars with ${transmission} transmission retrieved successfully`,
          { 
            total: result.total,
            transmission: transmission,
            source: result.source,
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

  // Buscar por código FIPE
  getCarByFipeCode: async (req, res) => {
    try {
      const { fipeCode } = req.params;
      const vehicleType = req.query.type || 'cars';

      validateParams({ fipeCode }, ['fipeCode']);

      console.log(`Getting car details for FIPE code: ${fipeCode}`);

      const result = await carApiService.getFipeByCode(fipeCode, vehicleType);

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          `Car details for FIPE code ${fipeCode} retrieved successfully`,
          { 
            fipeCode: fipeCode,
            vehicleType: vehicleType,
            source: result.source
          }
        ));
      } else {
        res.status(404).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarByFipeCode:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // Obter estatísticas de carros
  getCarStats: async (req, res) => {
    try {
      console.log('Getting car statistics from FIPE');

      // Buscar estatísticas das marcas populares
      const popularBrandsResult = await carApiService.getPopularBrands('cars');
      
      const stats = {
        totalBrands: popularBrandsResult.total || 0,
        popularBrands: popularBrandsResult.data?.slice(0, 5).map(brand => brand.name) || [],
        lastUpdated: new Date().toISOString(),
        dataSource: 'fipe_api',
        vehicleTypes: ['cars', 'motorcycles', 'trucks']
      };

      res.json(createResponse(
        true, 
        stats, 
        'Car statistics retrieved successfully',
        { 
          source: 'fipe_api',
          cached: false
        }
      ));
    } catch (error) {
      console.error('Error in getCarStats:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // Buscar veículos por múltiplos filtros
  getCarsByMultipleFilters: async (req, res) => {
    try {
      const filters = req.body;
      const limit = parseInt(req.query.limit) || 10;

      console.log('Getting cars with multiple filters:', filters);

      const result = await carApiService.smartCarSearch({ ...filters, limit });

      if (result.success) {
        res.json(createResponse(
          true, 
          result.data, 
          'Cars with multiple filters retrieved successfully',
          { 
            total: result.total,
            filters: filters,
            source: result.source,
            limit
          }
        ));
      } else {
        res.status(400).json(createResponse(false, [], result.error));
      }
    } catch (error) {
      console.error('Error in getCarsByMultipleFilters:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // Comparar carros
  compareCars: async (req, res) => {
    try {
      const { cars } = req.body;

      if (!cars || !Array.isArray(cars) || cars.length < 2) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'At least 2 cars are required for comparison'
        ));
      }

      if (cars.length > 3) {
        return res.status(400).json(createResponse(
          false, 
          [], 
          'Maximum 3 cars can be compared at once'
        ));
      }

      console.log('Comparing cars:', cars.map(car => `${car.brand} ${car.model}`));

      // Calcular pontuações
      const scoredCars = cars.map(car => {
        const scores = {
          acceleration: calculateAccelerationScore(car.performance?.acceleration || 10),
          fuelEfficiency: calculateFuelEfficiencyScore(car.consumption?.combined || 10),
          year: calculateYearScore(car.year || 2020),
          costBenefit: calculateCostBenefitScore(car.priceNumber || 50000, car.performance?.power || 100)
        };

        const totalScore = (
          scores.acceleration * 0.30 +
          scores.fuelEfficiency * 0.25 +
          scores.year * 0.25 +
          scores.costBenefit * 0.20
        );

        return {
          ...car,
          scores,
          totalScore: Math.round(totalScore * 100) / 100
        };
      });

      // Encontrar vencedor
      const winner = scoredCars.reduce((prev, current) => 
        current.totalScore > prev.totalScore ? current : prev
      );

        res.json(createResponse(
          true, 
        {
          cars: scoredCars,
          winner: winner,
          comparison: {
            criteria: {
              acceleration: { weight: 30, description: 'Aceleração 0-100 km/h' },
              fuelEfficiency: { weight: 25, description: 'Economia de combustível' },
              year: { weight: 25, description: 'Ano do veículo' },
              costBenefit: { weight: 20, description: 'Relação custo-benefício' }
            },
            timestamp: new Date().toISOString()
          }
        },
        'Car comparison completed successfully'
      ));
    } catch (error) {
      console.error('Error in compareCars:', error);
      res.status(500).json(createResponse(false, [], error.message));
    }
  },

  // Limpar cache
  clearCache: async (req, res) => {
    try {
      console.log('Clearing cache');
      
      carApiService.cache.clear();
      
      res.json(createResponse(
        true, 
        { message: 'Cache cleared successfully' }, 
        'Cache limpo com sucesso'
      ));
    } catch (error) {
      console.error('Error in clearCache:', error);
      res.status(500).json(createResponse(false, [], error.message));
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

// Funções auxiliares para cálculo de pontuação
function calculateAccelerationScore(acceleration) {
  // Menor aceleração = maior pontuação (0-100 em menos tempo é melhor)
  if (acceleration <= 6) return 10;
  if (acceleration <= 8) return 8;
  if (acceleration <= 10) return 6;
  if (acceleration <= 12) return 4;
  if (acceleration <= 15) return 2;
  return 1;
}

function calculateFuelEfficiencyScore(efficiency) {
  // Maior eficiência = maior pontuação
  if (efficiency >= 16) return 10;
  if (efficiency >= 14) return 8;
  if (efficiency >= 12) return 6;
  if (efficiency >= 10) return 4;
  if (efficiency >= 8) return 2;
  return 1;
}

function calculateYearScore(year) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Carros mais novos = maior pontuação
  if (age <= 1) return 10;
  if (age <= 3) return 8;
  if (age <= 5) return 6;
  if (age <= 8) return 4;
  if (age <= 12) return 2;
  return 1;
}

function calculateCostBenefitScore(price, power) {
  const costPerHp = price / power;
  
  // Menor custo por HP = maior pontuação
  if (costPerHp <= 300) return 10;
  if (costPerHp <= 500) return 8;
  if (costPerHp <= 700) return 6;
  if (costPerHp <= 1000) return 4;
  if (costPerHp <= 1500) return 2;
  return 1;
}

module.exports = carController; 