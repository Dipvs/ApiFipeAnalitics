const axios = require('axios');
const { getCarImage, formatPriceBRL, formatConsumption, convertMpgToKmL } = require('./carImageService');
const expandedBrazilianCars = require('../data/expandedBrazilianCars');

// Configuração da API principal (API-Ninjas)
const API_KEY = process.env.CAR_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.api-ninjas.com/v1';

// Headers para API
const getApiHeaders = () => {
  return {
    'X-API-Key': API_KEY
  };
};

// Função para filtrar carros mock com base nos filtros fornecidos
function filterMockCars(filters = {}) {
  let filteredCars = [...expandedBrazilianCars];

  // Filtro por marca
  if (filters.make) {
    filteredCars = filteredCars.filter(car => 
      car.make.toLowerCase().includes(filters.make.toLowerCase())
    );
  }

  // Filtro por modelo
  if (filters.model) {
    filteredCars = filteredCars.filter(car => 
      car.model.toLowerCase().includes(filters.model.toLowerCase())
    );
  }

  // Filtro por ano
  if (filters.year) {
    const year = parseInt(filters.year);
    if (!isNaN(year)) {
      filteredCars = filteredCars.filter(car => car.year === year);
    }
  }

  // Filtro por tipo de combustível
  if (filters.fuel_type) {
    filteredCars = filteredCars.filter(car => 
      car.fuel_type.toLowerCase() === filters.fuel_type.toLowerCase()
    );
  }

  // Filtro por transmissão
  if (filters.transmission) {
    filteredCars = filteredCars.filter(car => 
      car.transmission.toLowerCase() === filters.transmission.toLowerCase()
    );
  }

  // Filtro por classe
  if (filters.class) {
    filteredCars = filteredCars.filter(car => 
      car.class.toLowerCase() === filters.class.toLowerCase()
    );
  }

  return filteredCars;
}

// Função para gerar preços realistas baseados na marca
function generateBrazilianPrice(make, model, year = 2024) {
  const basePrices = {
    'Toyota': { min: 85000, max: 300000 },
    'Honda': { min: 80000, max: 280000 },
    'Volkswagen': { min: 75000, max: 250000 },
    'Chevrolet': { min: 70000, max: 400000 },
    'Ford': { min: 75000, max: 200000 },
    'Hyundai': { min: 70000, max: 180000 },
    'Nissan': { min: 80000, max: 220000 },
    'Fiat': { min: 60000, max: 150000 },
    'Renault': { min: 65000, max: 140000 },
    'Jeep': { min: 120000, max: 350000 }
  };

  const brandRange = basePrices[make] || { min: 70000, max: 200000 };
  const basePrice = Math.floor(Math.random() * (brandRange.max - brandRange.min) + brandRange.min);
  
  // Ajuste por ano (carros mais novos são mais caros)
  const yearMultiplier = year >= 2024 ? 1.0 : year >= 2023 ? 0.95 : 0.9;
  
  return Math.floor(basePrice * yearMultiplier);
}

// Função para enriquecer dados dos carros com informações brasileiras
function enrichBrazilianCarData(car) {
  const enrichedCar = { ...car };
  
  // Garantir que o preço está em BRL
  if (!enrichedCar.price || enrichedCar.currency !== 'BRL') {
    enrichedCar.price = generateBrazilianPrice(car.make, car.model, car.year);
    enrichedCar.currency = 'BRL';
  }

  // Formatar preço brasileiro
  enrichedCar.formatted_price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(enrichedCar.price);

  // Converter MPG para km/l (mais comum no Brasil)
  if (enrichedCar.mpg_city) {
    enrichedCar.kmpl_city = Math.round(enrichedCar.mpg_city * 0.425 * 10) / 10;
  }
  if (enrichedCar.mpg_highway) {
    enrichedCar.kmpl_highway = Math.round(enrichedCar.mpg_highway * 0.425 * 10) / 10;
  }

  // Garantir que existe o campo specifications
  if (!enrichedCar.specifications) {
    enrichedCar.specifications = {
      doors: enrichedCar.doors || 4,
      seats: enrichedCar.seats || 5,
      trunk_capacity: enrichedCar.trunk_capacity || 400
    };
  }

  // Garantir que existe o campo engine com a estrutura correta
  if (!enrichedCar.engine) {
    enrichedCar.engine = {
      type: enrichedCar.fuel_type || 'flex',
      power_hp: 120,
      torque_nm: 160,
      cylinders: 4,
      displacement: 1.6
    };
  } else {
    // Garantir que displacement é um número
    if (typeof enrichedCar.engine.displacement === 'string') {
      const displacement = parseFloat(enrichedCar.engine.displacement.replace(/[^0-9.]/g, ''));
      enrichedCar.engine.displacement = displacement || 1.6;
    }
    // Garantir que type existe
    if (!enrichedCar.engine.type) {
      enrichedCar.engine.type = enrichedCar.fuel_type || 'flex';
    }
  }

  // Garantir que existe o campo performance
  if (!enrichedCar.performance) {
    enrichedCar.performance = {
      max_speed_kmh: 180,
      acceleration_0_100_kmh: 10.0
    };
  }

  // Adicionar informações específicas do Brasil se não existirem
  if (!enrichedCar.origin) {
    enrichedCar.origin = ['Toyota', 'Honda', 'Volkswagen', 'Chevrolet', 'Ford', 'Hyundai', 'Fiat'].includes(car.make) ? 'Nacional' : 'Importado';
  }

  if (!enrichedCar.warranty) {
    enrichedCar.warranty = car.make === 'Hyundai' ? '5 anos' : '3 anos';
  }

  if (!enrichedCar.safety_rating) {
    enrichedCar.safety_rating = Math.floor(Math.random() * 2) + 4; // 4 ou 5 estrelas
  }

  // Garantir que há uma imagem
  if (!enrichedCar.image) {
    enrichedCar.image = `https://via.placeholder.com/400x300/333/fff?text=${encodeURIComponent(car.make + ' ' + car.model)}`;
  }

  // Garantir que há features
  if (!enrichedCar.features || !Array.isArray(enrichedCar.features)) {
    enrichedCar.features = ['Ar condicionado', 'Direção hidráulica', 'Vidros elétricos', 'Travas elétricas'];
  }

  return enrichedCar;
}

const carApiServiceBrazil = {
  // Buscar carros com filtros
  searchCars: async (filters = {}) => {
    try {
      console.log('Searching cars with filters:', filters);
      console.log('Using expanded Brazilian data');
      
      let cars = filterMockCars(filters);
      
      // Aplicar limite se especificado
      const limit = parseInt(filters.limit) || 10;
      if (limit > 0) {
        cars = cars.slice(0, limit);
      }

      // Enriquecer dados dos carros
      const enrichedCars = cars.map(enrichBrazilianCarData);

      return {
        success: true,
        data: enrichedCars,
        total: enrichedCars.length,
        source: 'expanded_brazilian_data',
        message: `${enrichedCars.length} veículos encontrados`
      };
    } catch (error) {
      console.error('Error in searchCars:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Obter todas as marcas disponíveis
  getAllMakes: async () => {
    try {
      const makes = [...new Set(expandedBrazilianCars.map(car => car.make))].sort();
      
      return {
        success: true,
        data: makes,
        total: makes.length,
        message: `${makes.length} marcas disponíveis`
      };
    } catch (error) {
      console.error('Error in getAllMakes:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Buscar carros por marca
  getCarsByMake: async (make, limit = 10) => {
    try {
      console.log(`Getting cars for make: ${make}`);
      
      const cars = filterMockCars({ make });
      const limitedCars = cars.slice(0, parseInt(limit));
      const enrichedCars = limitedCars.map(enrichBrazilianCarData);

      return {
        success: true,
        data: enrichedCars,
        total: enrichedCars.length,
        make: make,
        source: 'expanded_brazilian_data',
        message: `${enrichedCars.length} veículos da marca ${make} encontrados`
      };
    } catch (error) {
      console.error('Error in getCarsByMake:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        make: make
      };
    }
  },

  // Buscar carros por modelo
  getCarsByModel: async (model, limit = 10) => {
    try {
      const cars = filterMockCars({ model });
      const limitedCars = cars.slice(0, parseInt(limit));
      const enrichedCars = limitedCars.map(enrichBrazilianCarData);

      return {
        success: true,
        data: enrichedCars,
        total: enrichedCars.length,
        model: model,
        source: 'expanded_brazilian_data'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Buscar carros por ano
  getCarsByYear: async (year, limit = 10) => {
    try {
      const cars = filterMockCars({ year });
      const limitedCars = cars.slice(0, parseInt(limit));
      const enrichedCars = limitedCars.map(enrichBrazilianCarData);

      return {
        success: true,
        data: enrichedCars,
        total: enrichedCars.length,
        year: year,
        source: 'expanded_brazilian_data'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },

  // Obter estatísticas do mercado brasileiro
  getBrazilianMarketStats: async () => {
    try {
      const totalCars = expandedBrazilianCars.length;
      const makes = [...new Set(expandedBrazilianCars.map(car => car.make))];
      const nationalCars = expandedBrazilianCars.filter(car => car.origin === 'Nacional').length;
      const importedCars = expandedBrazilianCars.filter(car => car.origin === 'Importado').length;
      
      const fuelTypes = expandedBrazilianCars.reduce((acc, car) => {
        acc[car.fuel_type] = (acc[car.fuel_type] || 0) + 1;
        return acc;
      }, {});

      const avgPrice = expandedBrazilianCars.reduce((sum, car) => sum + car.price, 0) / totalCars;

      return {
        success: true,
        data: {
          total_vehicles: totalCars,
          total_makes: makes.length,
          makes: makes,
          national_production: nationalCars,
          imported: importedCars,
          fuel_types: fuelTypes,
          average_price: Math.round(avgPrice),
          formatted_avg_price: new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(avgPrice)
        },
        message: 'Estatísticas do mercado brasileiro obtidas com sucesso'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: {}
      };
    }
  }
};

module.exports = carApiServiceBrazil; 