const axios = require('axios');
const { getCarImage, formatPriceBRL, formatConsumption, convertMpgToKmL } = require('./carImageService');

// Configuração da API FIPE
const FIPE_BASE_URL = 'https://parallelum.com.br/fipe/api/v2';

// Cache simples em memória (em produção usar Redis)
const cache = {
  data: new Map(),
  set: (key, value, ttl = 3600000) => { // TTL padrão: 1 hora
    cache.data.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  },
  get: (key) => {
    const item = cache.data.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cache.data.delete(key);
      return null;
    }
    return item.value;
  },
  clear: () => cache.data.clear()
};

// Tipos de veículos FIPE
const VEHICLE_TYPES = {
  'carros': 'cars',
  'motos': 'motorcycles', 
  'caminhoes': 'trucks'
};

// Função para buscar marcas da FIPE
async function getFipeBrands(vehicleType = 'cars') {
  try {
    console.log(`🔍 Buscando marcas FIPE para ${vehicleType}...`);
    
    const cacheKey = `fipe_brands_${vehicleType}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Marcas encontradas no cache');
      return cached;
    }

    const response = await axios.get(`${FIPE_BASE_URL}/${vehicleType}/brands`, {
      timeout: 10000
    });

    console.log(`✅ FIPE retornou ${response.data.length} marcas para ${vehicleType}`);
    
    const result = {
      success: true,
      data: response.data,
      source: 'fipe_api',
      total: response.data.length
    };

    // Cache por 2 horas (marcas mudam pouco)
    cache.set(cacheKey, result, 7200000);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar marcas FIPE:', error.message);
    throw error;
  }
}

// Função para buscar modelos por marca
async function getFipeModels(vehicleType = 'cars', brandId) {
  try {
    console.log(`🔍 Buscando modelos FIPE para marca ${brandId}...`);
    
    const cacheKey = `fipe_models_${vehicleType}_${brandId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Modelos encontrados no cache');
      return cached;
    }

    const response = await axios.get(`${FIPE_BASE_URL}/${vehicleType}/brands/${brandId}/models`, {
      timeout: 10000
    });

    console.log(`✅ FIPE retornou ${response.data.length} modelos`);
    
    const result = {
      success: true,
      data: response.data,
      source: 'fipe_api',
      total: response.data.length
    };

    // Cache por 1 hora
    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar modelos FIPE:', error.message);
    throw error;
  }
}

// Função para buscar anos por modelo
async function getFipeYears(vehicleType = 'cars', brandId, modelId) {
  try {
    console.log(`🔍 Buscando anos FIPE para modelo ${modelId}...`);
    
    const cacheKey = `fipe_years_${vehicleType}_${brandId}_${modelId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Anos encontrados no cache');
      return cached;
    }

    const response = await axios.get(`${FIPE_BASE_URL}/${vehicleType}/brands/${brandId}/models/${modelId}/years`, {
      timeout: 10000
    });

    console.log(`✅ FIPE retornou ${response.data.length} anos`);
    
    const result = {
      success: true,
      data: response.data,
      source: 'fipe_api',
      total: response.data.length
    };

    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar anos FIPE:', error.message);
    throw error;
  }
}

// Função para buscar detalhes completos do veículo
async function getFipeVehicleDetails(vehicleType = 'cars', brandId, modelId, yearId) {
  try {
    console.log(`🔍 Buscando detalhes FIPE completos...`);
    
    const cacheKey = `fipe_details_${vehicleType}_${brandId}_${modelId}_${yearId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Detalhes encontrados no cache');
      return cached;
    }

    const response = await axios.get(`${FIPE_BASE_URL}/${vehicleType}/brands/${brandId}/models/${modelId}/years/${yearId}`, {
      timeout: 10000
    });

    const vehicleData = response.data;
    console.log(`✅ FIPE retornou dados do veículo: ${vehicleData.brand} ${vehicleData.model}`);
    
    // Enriquecer dados com informações brasileiras
    const enrichedData = enrichFipeVehicleData(vehicleData);
    
    const result = {
      success: true,
      data: enrichedData,
      source: 'fipe_api'
    };

    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar detalhes FIPE:', error.message);
    throw error;
  }
}

// Função para buscar veículos por código FIPE
async function getFipeByCode(fipeCode, vehicleType = 'cars') {
  try {
    console.log(`🔍 Buscando veículo por código FIPE: ${fipeCode}...`);
    
    const cacheKey = `fipe_code_${fipeCode}_${vehicleType}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Veículo encontrado no cache');
      return cached;
    }

    // Buscar anos disponíveis para o código FIPE
    const yearsResponse = await axios.get(`${FIPE_BASE_URL}/${vehicleType}/${fipeCode}/years`, {
      timeout: 10000
    });

    if (yearsResponse.data.length === 0) {
      throw new Error('Código FIPE não encontrado');
    }

    // Pegar o primeiro ano disponível (mais recente geralmente)
    const yearId = yearsResponse.data[0].code;
    
    // Buscar detalhes do veículo
    const detailsResponse = await axios.get(`${FIPE_BASE_URL}/${vehicleType}/${fipeCode}/years/${yearId}`, {
      timeout: 10000
    });

    const vehicleData = detailsResponse.data;
    console.log(`✅ FIPE retornou dados por código: ${vehicleData.brand} ${vehicleData.model}`);
    
    const enrichedData = enrichFipeVehicleData(vehicleData);
    
    const result = {
      success: true,
      data: enrichedData,
      source: 'fipe_api'
    };

    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar por código FIPE:', error.message);
    throw error;
  }
}

// Função principal de busca inteligente
async function smartCarSearch(filters = {}) {
  try {
    console.log('🔍 Iniciando busca inteligente FIPE com filtros:', filters);
    
    const vehicleType = filters.type || 'cars';
    
    // Se tem código FIPE, buscar diretamente
    if (filters.fipeCode) {
      return await getFipeByCode(filters.fipeCode, vehicleType);
    }
    
    // Busca por marca específica
    if (filters.make && !filters.model) {
      return await searchVehiclesByMake(filters.make, vehicleType, filters);
    }
    
    // Busca por marca e modelo
    if (filters.make && filters.model) {
      return await searchVehiclesByMakeModel(filters.make, filters.model, vehicleType, filters);
    }
    
    // Busca geral - retornar algumas marcas populares
    return await getPopularBrands(vehicleType);

  } catch (error) {
    console.error('❌ Erro na busca FIPE:', error.message);
    
    // Fallback com dados gerados
    return generateFallbackCars(filters);
  }
}

// Buscar veículos por marca
async function searchVehiclesByMake(makeName, vehicleType = 'cars', filters = {}) {
  try {
    // Buscar todas as marcas
    const brandsResult = await getFipeBrands(vehicleType);
    if (!brandsResult.success) throw new Error('Erro ao buscar marcas');
    
    // Encontrar marca correspondente
    const brand = brandsResult.data.find(b => 
      b.name.toLowerCase().includes(makeName.toLowerCase()) ||
      makeName.toLowerCase().includes(b.name.toLowerCase())
    );
    
    if (!brand) {
      throw new Error(`Marca ${makeName} não encontrada`);
    }
    
    // Buscar modelos da marca
    const modelsResult = await getFipeModels(vehicleType, brand.code);
    if (!modelsResult.success) throw new Error('Erro ao buscar modelos');
    
    // Converter modelos para formato padrão
    const limit = parseInt(filters.limit) || 10;
    const vehicles = modelsResult.data.slice(0, limit).map(model => 
      createVehicleFromFipeModel(brand, model, vehicleType)
    );

      return {
        success: true,
      data: vehicles,
      total: vehicles.length,
      source: 'fipe_api',
      message: `${vehicles.length} veículos encontrados para ${brand.name}`
    };
    
    } catch (error) {
    console.error('❌ Erro ao buscar por marca:', error.message);
    throw error;
  }
}

// Buscar veículos por marca e modelo
async function searchVehiclesByMakeModel(makeName, modelName, vehicleType = 'cars', filters = {}) {
  try {
    // Buscar marca
    const brandsResult = await getFipeBrands(vehicleType);
    const brand = brandsResult.data.find(b => 
      b.name.toLowerCase().includes(makeName.toLowerCase())
    );
    
    if (!brand) throw new Error(`Marca ${makeName} não encontrada`);
    
    // Buscar modelos
    const modelsResult = await getFipeModels(vehicleType, brand.code);
    const model = modelsResult.data.find(m => 
      m.name.toLowerCase().includes(modelName.toLowerCase())
    );
    
    if (!model) throw new Error(`Modelo ${modelName} não encontrado`);
    
    // Buscar anos disponíveis
    const yearsResult = await getFipeYears(vehicleType, brand.code, model.code);
    
    if (!yearsResult.success || yearsResult.data.length === 0) {
      throw new Error('Nenhum ano encontrado para este modelo');
    }
    
    // Buscar detalhes dos anos mais recentes
    const limit = parseInt(filters.limit) || 5;
    const recentYears = yearsResult.data.slice(0, limit);
    
    const vehicles = [];
    for (const year of recentYears) {
      try {
        const detailsResult = await getFipeVehicleDetails(vehicleType, brand.code, model.code, year.code);
        if (detailsResult.success) {
          vehicles.push(detailsResult.data);
        }
      } catch (err) {
        console.log(`⚠️ Erro ao buscar detalhes do ano ${year.name}:`, err.message);
      }
    }
      
      return {
        success: true,
      data: vehicles,
      total: vehicles.length,
      source: 'fipe_api',
      message: `${vehicles.length} versões encontradas para ${brand.name} ${model.name}`
    };
    
    } catch (error) {
    console.error('❌ Erro ao buscar por marca/modelo:', error.message);
    throw error;
  }
}

// Obter marcas populares
async function getPopularBrands(vehicleType = 'cars') {
  try {
    const brandsResult = await getFipeBrands(vehicleType);
    if (!brandsResult.success) throw new Error('Erro ao buscar marcas');
    
    // Marcas brasileiras populares
    const popularBrandNames = [
      'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Toyota', 
      'Honda', 'Hyundai', 'Nissan', 'Renault', 'Peugeot'
    ];
    
    const popularBrands = brandsResult.data.filter(brand =>
      popularBrandNames.some(popular => 
        brand.name.toLowerCase().includes(popular.toLowerCase())
      )
    );

      return {
        success: true,
      data: popularBrands.slice(0, 10),
      total: popularBrands.length,
      source: 'fipe_api',
      message: 'Marcas populares no Brasil'
    };
    
    } catch (error) {
    console.error('❌ Erro ao buscar marcas populares:', error.message);
    throw error;
  }
}

// Criar veículo a partir de modelo FIPE
function createVehicleFromFipeModel(brand, model, vehicleType) {
  const currentYear = new Date().getFullYear();
  const estimatedYear = currentYear - Math.floor(Math.random() * 10); // Estimar ano
  
  return {
    id: `${brand.code}_${model.code}`,
    brand: brand.name,
    model: model.name,
    year: estimatedYear,
    price: generateBrazilianPrice(brand.name, model.name, estimatedYear),
    fipeCode: `${brand.code}${model.code}`,
    vehicleType: vehicleType,
    fuel: 'Flex',
    transmission: 'Manual',
    doors: estimateDoorsFromType(vehicleType),
    seats: estimateSeatsFromType(vehicleType),
    origin: getBrandOrigin(brand.name),
    warranty: getBrandWarranty(brand.name),
    features: getBrazilianFeatures(vehicleType, 50000),
    consumption: {
      city: Math.floor(Math.random() * 5) + 8,
      highway: Math.floor(Math.random() * 5) + 12,
      combined: Math.floor(Math.random() * 5) + 10
    },
    performance: {
      power: Math.floor(Math.random() * 100) + 80,
      torque: Math.floor(Math.random() * 100) + 120,
      acceleration: (Math.random() * 5 + 8).toFixed(1),
      maxSpeed: Math.floor(Math.random() * 50) + 160
    },
    image: getCarImage(brand.name, model.name)
  };
}

// Enriquecer dados do veículo FIPE
function enrichFipeVehicleData(fipeData) {
  // Converter preço FIPE para número
  const priceString = fipeData.price || 'R$ 0,00';
  const priceNumber = parseFloat(priceString.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
  
  // Extrair ano do modelo
  const modelYear = fipeData.modelYear || new Date().getFullYear();
  
  // Normalizar combustível
  const fuel = normalizeFuelType(fipeData.fuel || 'Gasolina');
  
      return {
    id: fipeData.codeFipe || Math.random().toString(36).substr(2, 9),
    brand: fipeData.brand || 'Marca não informada',
    model: fipeData.model || 'Modelo não informado',
    year: modelYear,
    price: formatPriceBRL(priceNumber),
    priceNumber: priceNumber,
    fipeCode: fipeData.codeFipe,
    vehicleType: getVehicleTypeFromFipe(fipeData.vehicleType),
    fuel: fuel,
    fuelAcronym: fipeData.fuelAcronym || 'G',
    transmission: estimateTransmission(fuel),
    doors: estimateDoorsFromModel(fipeData.model),
    seats: estimateSeatsFromModel(fipeData.model),
    origin: getBrandOrigin(fipeData.brand),
    warranty: getBrandWarranty(fipeData.brand),
    features: getBrazilianFeatures(fipeData.model, priceNumber),
    consumption: estimateConsumption(fuel, modelYear),
    performance: estimatePerformance(fipeData.model, modelYear, fuel),
    image: getCarImage(fipeData.brand, fipeData.model),
    referenceMonth: fipeData.referenceMonth || 'Atual',
    priceHistory: fipeData.priceHistory || []
  };
}

// Funções auxiliares
function normalizeFuelType(fipeFuel) {
  const fuelMap = {
    'Gasolina': 'Gasolina',
    'Álcool': 'Etanol', 
    'Diesel': 'Diesel',
    'Flex': 'Flex',
    'Gas': 'Gasolina'
  };
  return fuelMap[fipeFuel] || 'Flex';
}

function getVehicleTypeFromFipe(vehicleType) {
  const typeMap = {
    1: 'Carro',
    2: 'Moto', 
    3: 'Caminhão'
  };
  return typeMap[vehicleType] || 'Carro';
}

function estimateTransmission(fuel) {
  // Carros mais novos e flex tendem a ser automáticos
  return Math.random() > 0.6 ? 'Automático' : 'Manual';
}

function estimateDoorsFromModel(model) {
  if (model.toLowerCase().includes('2p') || model.toLowerCase().includes('conversivel')) return 2;
  if (model.toLowerCase().includes('4p') || model.toLowerCase().includes('sedan')) return 4;
  return Math.random() > 0.7 ? 2 : 4;
}

function estimateSeatsFromModel(model) {
  if (model.toLowerCase().includes('van') || model.toLowerCase().includes('kombi')) return 7;
  if (model.toLowerCase().includes('pickup') || model.toLowerCase().includes('suv')) return 5;
  return 5;
}

function estimateDoorsFromType(vehicleType) {
  if (vehicleType === 'motorcycles') return 0;
  if (vehicleType === 'trucks') return 2;
  return Math.random() > 0.7 ? 2 : 4;
}

function estimateSeatsFromType(vehicleType) {
  if (vehicleType === 'motorcycles') return 2;
  if (vehicleType === 'trucks') return 3;
  return 5;
}

function estimateConsumption(fuel, year) {
  const baseFactor = year > 2015 ? 1.2 : 1.0; // Carros mais novos são mais eficientes
  const fuelFactor = fuel === 'Flex' ? 1.1 : fuel === 'Diesel' ? 1.3 : 1.0;
  
  const base = 10 * baseFactor * fuelFactor;

      return {
    city: Math.floor(base + Math.random() * 3),
    highway: Math.floor(base + Math.random() * 5 + 2),
    combined: Math.floor(base + Math.random() * 3 + 1)
  };
}

function estimatePerformance(model, year, fuel) {
  // Estimativas baseadas no modelo e ano
  const ageFactor = Math.max(0.8, 1 - (new Date().getFullYear() - year) * 0.02);
  const fuelFactor = fuel === 'Diesel' ? 1.3 : fuel === 'Flex' ? 1.1 : 1.0;
  
  let basePower = 100;
  if (model.toLowerCase().includes('sport')) basePower = 150;
  if (model.toLowerCase().includes('turbo')) basePower = 130;
  if (model.toLowerCase().includes('1.0')) basePower = 80;
  if (model.toLowerCase().includes('2.0')) basePower = 130;
  
  const power = Math.floor(basePower * ageFactor * fuelFactor);
  const torque = Math.floor(power * 1.3);
  const acceleration = (15 - (power / 20) + Math.random() * 2).toFixed(1);
  const maxSpeed = Math.floor(power * 1.8 + 100);
  
      return {
    power,
    torque, 
    acceleration: parseFloat(acceleration),
    maxSpeed
  };
}

function getBrandOrigin(brand) {
  const nationalBrands = ['Volkswagen', 'Chevrolet', 'Fiat', 'Ford'];
  const importedBrands = ['Toyota', 'Honda', 'Hyundai', 'Nissan'];
  
  if (nationalBrands.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
    return 'Nacional';
  }
  if (importedBrands.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
    return 'Importado';
  }
  return 'Nacional';
}

function getBrandWarranty(brand) {
  const warranties = {
    'Volkswagen': '3 anos',
    'Chevrolet': '3 anos', 
    'Fiat': '3 anos',
    'Ford': '3 anos',
    'Toyota': '3 anos',
    'Honda': '3 anos',
    'Hyundai': '5 anos'
  };
  
  for (const [b, warranty] of Object.entries(warranties)) {
    if (brand.toLowerCase().includes(b.toLowerCase())) {
      return warranty;
    }
  }
  return '3 anos';
}

function getBrazilianFeatures(model, price) {
  const basicFeatures = ['Direção hidráulica', 'Vidros elétricos', 'Trava elétrica'];
  const midFeatures = [...basicFeatures, 'Ar condicionado', 'Som MP3', 'Airbag duplo'];
  const premiumFeatures = [...midFeatures, 'Central multimídia', 'Câmera de ré', 'Sensores de estacionamento', 'Controle de estabilidade'];
  
  if (price > 80000) return premiumFeatures;
  if (price > 40000) return midFeatures;
  return basicFeatures;
}

function generateBrazilianPrice(make, model, year = 2024) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  
  // Preço base por marca
  const basePrices = {
    'Volkswagen': 55000,
    'Chevrolet': 50000,
    'Fiat': 45000,
    'Ford': 48000,
    'Toyota': 65000,
    'Honda': 60000,
    'Hyundai': 55000,
    'Nissan': 58000
  };
  
  let basePrice = 45000; // Preço padrão
  
  // Encontrar preço base por marca
  for (const [brand, price] of Object.entries(basePrices)) {
    if (make.toLowerCase().includes(brand.toLowerCase())) {
      basePrice = price;
      break;
    }
  }
  
  // Ajustes por modelo
  if (model.toLowerCase().includes('sport')) basePrice *= 1.3;
  if (model.toLowerCase().includes('premium')) basePrice *= 1.4;
  if (model.toLowerCase().includes('basic')) basePrice *= 0.8;
  
  // Depreciação por ano
  const depreciationFactor = Math.max(0.3, 1 - (age * 0.08));
  const finalPrice = basePrice * depreciationFactor;
  
  // Adicionar variação aleatória
  const variation = 1 + (Math.random() - 0.5) * 0.2;
  
  return Math.floor(finalPrice * variation);
}

// Função de fallback para casos de erro
function generateFallbackCars(filters = {}) {
  console.log('🛡️ Gerando dados de fallback...');
  
  const fallbackCars = [
    {
      id: 'fallback_1',
      brand: 'Volkswagen',
      model: 'Gol 1.0',
      year: 2023,
      price: formatPriceBRL(45000),
      priceNumber: 45000,
      fipeCode: 'FALLBACK001',
      vehicleType: 'Carro',
      fuel: 'Flex',
      transmission: 'Manual',
      doors: 4,
      seats: 5,
      origin: 'Nacional',
      warranty: '3 anos',
      features: ['Direção hidráulica', 'Vidros elétricos'],
      consumption: { city: 12, highway: 15, combined: 13 },
      performance: { power: 80, torque: 110, acceleration: 12.5, maxSpeed: 170 },
      image: getCarImage('Volkswagen', 'Gol')
    },
    {
      id: 'fallback_2', 
      brand: 'Chevrolet',
      model: 'Onix 1.0',
      year: 2023,
      price: formatPriceBRL(48000),
      priceNumber: 48000,
      fipeCode: 'FALLBACK002',
      vehicleType: 'Carro',
      fuel: 'Flex',
      transmission: 'Manual',
      doors: 4,
      seats: 5,
      origin: 'Nacional',
      warranty: '3 anos', 
      features: ['Ar condicionado', 'Central multimídia'],
      consumption: { city: 13, highway: 16, combined: 14 },
      performance: { power: 82, torque: 112, acceleration: 12.8, maxSpeed: 175 },
      image: getCarImage('Chevrolet', 'Onix')
    }
  ];
  
  const limit = parseInt(filters.limit) || 10;

      return {
        success: true,
    data: fallbackCars.slice(0, limit),
    total: fallbackCars.length,
    source: 'fallback',
    message: 'Dados de exemplo (fallback)'
  };
}

  // Obter estatísticas do mercado brasileiro
async function getBrazilianMarketStats() {
  try {
    console.log('📊 Gerando estatísticas do mercado brasileiro...');
    
    const cacheKey = 'brazilian_market_stats';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Estatísticas encontradas no cache');
      return cached;
    }

    // Buscar marcas populares
    const brandsResult = await getFipeBrands('cars');
    const totalBrands = brandsResult.total || 0;
    
    // Marcas nacionais vs importadas
    const nationalBrands = ['Volkswagen', 'Chevrolet', 'Fiat', 'Ford'];
    const importedBrands = ['Toyota', 'Honda', 'Hyundai', 'Nissan', 'Renault'];
    
    const stats = {
      totalBrands: totalBrands,
      marketSegments: {
        nacional: nationalBrands.length,
        importado: importedBrands.length
      },
      popularBrands: brandsResult.data?.slice(0, 10).map(brand => ({
        name: brand.name,
        code: brand.code,
        category: nationalBrands.includes(brand.name) ? 'Nacional' : 'Importado'
      })) || [],
      vehicleTypes: {
        carros: 'Automóveis de passeio',
        motos: 'Motocicletas',
        caminhoes: 'Caminhões e utilitários'
      },
      priceRanges: {
        economico: 'R$ 20.000 - R$ 50.000',
        medio: 'R$ 50.000 - R$ 100.000',
        premium: 'R$ 100.000 - R$ 200.000',
        luxury: 'R$ 200.000+'
      },
      fuelTypes: {
        flex: 'Flexível (Gasolina/Etanol)',
        gasolina: 'Gasolina',
        diesel: 'Diesel',
        eletrico: 'Elétrico/Híbrido'
      },
      marketTrends: {
        mostPopularFuel: 'Flex',
        averageAge: '8 anos',
        topSegment: 'Compactos',
        growthSector: 'SUVs'
      },
      dataSource: 'fipe_api',
      lastUpdated: new Date().toISOString(),
      coverage: 'Brasil - Tabela FIPE oficial'
    };

    const result = {
      success: true,
      data: stats,
      source: 'fipe_api',
      message: 'Estatísticas do mercado brasileiro obtidas com sucesso'
    };

    // Cache por 6 horas
    cache.set(cacheKey, result, 21600000);
    return result;

  } catch (error) {
    console.error('❌ Erro ao gerar estatísticas brasileiras:', error.message);
    
    // Retornar estatísticas básicas como fallback
      return {
        success: true,
        data: {
        totalBrands: 50,
        marketSegments: { nacional: 4, importado: 10 },
        dataSource: 'fallback',
        lastUpdated: new Date().toISOString(),
        message: 'Estatísticas básicas (dados de exemplo)'
      },
      source: 'fallback'
    };
  }
}

// Exportar funções principais
module.exports = {
  smartCarSearch,
  getFipeBrands,
  getFipeModels,
  getFipeYears,
  getFipeVehicleDetails,
  getFipeByCode,
  searchVehiclesByMake,
  searchVehiclesByMakeModel,
  getPopularBrands,
  getBrazilianMarketStats,
  cache
}; 