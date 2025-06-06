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
    console.log(`🔍 Buscando veículos da marca: ${makeName}`);
    
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
    
    console.log(`✅ Marca encontrada: ${brand.name} (código: ${brand.code})`);
    
    // Buscar modelos da marca
    const modelsResult = await getFipeModels(vehicleType, brand.code);
    if (!modelsResult.success) throw new Error('Erro ao buscar modelos');
    
    console.log(`📋 ${modelsResult.data.length} modelos encontrados para ${brand.name}`);
    
    // Converter modelos para formato padrão
    const limit = parseInt(filters.limit) || 10;
    const selectedModels = modelsResult.data.slice(0, limit);
    
    console.log(`🚗 Processando ${selectedModels.length} modelos...`);
    
    // Aguardar todas as promises de criação de veículos
    const vehicles = [];
    for (const model of selectedModels) {
      try {
        const vehicle = await createVehicleFromFipeModel(brand, model, vehicleType);
        if (vehicle && Object.keys(vehicle).length > 0) {
          vehicles.push(vehicle);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar modelo ${model.name}:`, error.message);
      }
    }
    
    console.log(`✅ ${vehicles.length} veículos processados com sucesso`);

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
    console.log(`🔍 Buscando marca/modelo: ${makeName} ${modelName}`);
    
    // Buscar marca
    const brandsResult = await getFipeBrands(vehicleType);
    const brand = brandsResult.data.find(b => 
      b.name.toLowerCase().includes(makeName.toLowerCase())
    );
    
    if (!brand) throw new Error(`Marca ${makeName} não encontrada`);
    console.log(`✅ Marca encontrada: ${brand.name} (código: ${brand.code})`);
    
    // Buscar modelos
    const modelsResult = await getFipeModels(vehicleType, brand.code);
    const model = modelsResult.data.find(m => 
      m.name.toLowerCase().includes(modelName.toLowerCase())
    );
    
    if (!model) throw new Error(`Modelo ${modelName} não encontrado`);
    console.log(`✅ Modelo encontrado: ${model.name} (código: ${model.code})`);
    
    // Buscar detalhes de múltiplos anos para extrair máximo de informações
    const limit = parseInt(filters.limit) || 5;
    const allYearDetailsResult = await getFipeVehicleDetailsAllYears(vehicleType, brand.code, model.code, limit);
    
    if (!allYearDetailsResult.success || allYearDetailsResult.data.length === 0) {
      throw new Error('Nenhum detalhe encontrado para este modelo');
    }
    
    console.log(`✅ ${allYearDetailsResult.data.length} versões encontradas com informações completas`);
    
    // Adicionar informações extras sobre a busca
    const enrichedVehicles = allYearDetailsResult.data.map(vehicle => ({
      ...vehicle,
      searchInfo: {
        searchedMake: makeName,
        searchedModel: modelName,
        foundBrand: brand,
        foundModel: model,
        searchTimestamp: new Date().toISOString()
      },
      detailedAnalysis: {
        totalAvailableYears: allYearDetailsResult.availableYears.length,
        yearsRange: {
          newest: allYearDetailsResult.availableYears[0]?.name,
          oldest: allYearDetailsResult.availableYears[allYearDetailsResult.availableYears.length - 1]?.name
        },
        priceAnalysis: calculatePriceAnalysis(allYearDetailsResult.data)
      }
    }));
      
    return {
      success: true,
      data: enrichedVehicles,
      total: enrichedVehicles.length,
      source: 'fipe_api',
      searchResults: {
        brandInfo: brand,
        modelInfo: model,
        availableYears: allYearDetailsResult.availableYears,
        totalYearsAvailable: allYearDetailsResult.availableYears.length
      },
      message: `${enrichedVehicles.length} versões detalhadas encontradas para ${brand.name} ${model.name}`
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
async function createVehicleFromFipeModel(brand, model, vehicleType) {
  console.log(`🔍 Criando veículo: ${brand.name} ${model.name}`);
  
  try {
    // Buscar anos disponíveis para o modelo
    const yearsResult = await getFipeYears(vehicleType, brand.code, model.code);
    
    if (yearsResult.success && yearsResult.data.length > 0) {
      // Pegar o primeiro ano disponível (mais recente)
      const mostRecentYear = yearsResult.data[0];
      console.log(`📅 Ano mais recente encontrado: ${mostRecentYear.name}`);
      
      // Buscar detalhes completos com preços reais da FIPE
      const detailsResult = await getFipeVehicleDetails(vehicleType, brand.code, model.code, mostRecentYear.code);
      
      if (detailsResult.success) {
        console.log(`✅ Dados reais FIPE obtidos para ${brand.name} ${model.name}`);
        // Retornar dados reais da FIPE
        return detailsResult.data;
      } else {
        console.log(`⚠️ Falha ao obter detalhes FIPE para ${brand.name} ${model.name}`);
      }
    } else {
      console.log(`⚠️ Nenhum ano encontrado para ${brand.name} ${model.name}`);
    }
  } catch (error) {
    console.log(`⚠️ Erro ao buscar dados reais FIPE para ${brand.name} ${model.name}:`, error.message);
  }
  
  // Fallback com dados estimados apenas se não conseguir buscar dados reais
  console.log(`🛡️ Usando dados estimados para ${brand.name} ${model.name}`);
  const currentYear = new Date().getFullYear();
  const estimatedYear = currentYear - Math.floor(Math.random() * 10);
  const estimatedPrice = generateBrazilianPrice(brand.name, model.name, estimatedYear);
  
  return {
    id: `${brand.code}_${model.code}`,
    brand: brand.name,
    model: model.name,
    year: estimatedYear,
    price: formatPriceBRL(estimatedPrice),
    priceNumber: estimatedPrice,
    fipeCode: `${brand.code}${model.code}`,
    vehicleType: vehicleType,
    fuel: 'Flex',
    transmission: 'Manual',
    doors: estimateDoorsFromType(vehicleType),
    seats: estimateSeatsFromType(vehicleType),
    origin: getBrandOrigin(brand.name),
    warranty: getBrandWarranty(brand.name),
    features: getBrazilianFeatures(vehicleType, estimatedPrice),
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
    image: getCarImage(brand.name, model.name),
    dataSource: 'estimated' // Indicar que são dados estimados
  };
}

// Enriquecer dados do veículo FIPE com todas as informações possíveis
function enrichFipeVehicleData(fipeData) {
  console.log('🔍 Dados brutos da FIPE:', JSON.stringify(fipeData, null, 2));
  
  // Converter preço FIPE para número
  const priceString = fipeData.price || fipeData.valor || 'R$ 0,00';
  const priceNumber = parseFloat(priceString.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
  
  // Extrair ano do modelo
  const modelYear = fipeData.modelYear || fipeData.anoModelo || new Date().getFullYear();
  
  // Normalizar combustível
  const fuel = normalizeFuelType(fipeData.fuel || fipeData.combustivel || 'Gasolina');
  
  // Extrair marca e modelo
  const brand = fipeData.brand || fipeData.marca || 'Marca não informada';
  const model = fipeData.model || fipeData.modelo || 'Modelo não informado';
  
  // Extrair código FIPE
  const fipeCode = fipeData.codeFipe || fipeData.codigoFipe || fipeData.code || '';
  
  // Extrair mês de referência
  const referenceMonth = fipeData.referenceMonth || fipeData.mesReferencia || 'Atual';
  
  // Extrair tipo de veículo
  const vehicleType = getVehicleTypeFromFipe(fipeData.vehicleType || fipeData.tipoVeiculo);
  
  // Extrair sigla do combustível
  const fuelAcronym = getFuelAcronym(fuel);
  
  // Extrair histórico de preços se disponível
  const priceHistory = fipeData.priceHistory || fipeData.historicoPrecos || [];
  
  // Extrair informações adicionais da FIPE
  const fipeAdditionalInfo = {
    authentication: fipeData.autenticacao || null,
    dataConsultation: fipeData.dataConsulta || new Date().toISOString(),
    fipeTable: fipeData.tabelaFipe || null,
    referenceCode: fipeData.codigoReferencia || null,
    searchedTerm: fipeData.termoPesquisado || null,
    queryDate: fipeData.dataConsulta || new Date().toISOString()
  };
  
  return {
    // IDs e códigos
    id: fipeCode || Math.random().toString(36).substr(2, 9),
    fipeCode: fipeCode,
    
    // Informações básicas
    brand: brand,
    make: brand, // Compatibilidade
    model: model,
    year: modelYear,
    modelYear: modelYear,
    
    // Preços
    price: formatPriceBRL(priceNumber),
    priceNumber: priceNumber,
    originalPrice: priceString,
    
    // Combustível
    fuel: fuel,
    fuelAcronym: fuelAcronym,
    originalFuel: fipeData.fuel || fipeData.combustivel,
    
    // Tipo de veículo
    vehicleType: vehicleType,
    originalVehicleType: fipeData.vehicleType || fipeData.tipoVeiculo,
    
    // Transmissão estimada
    transmission: estimateTransmission(fuel),
    
    // Especificações estimadas
    doors: estimateDoorsFromModel(model),
    seats: estimateSeatsFromModel(model),
    
    // Características do mercado brasileiro
    origin: getBrandOrigin(brand),
    warranty: getBrandWarranty(brand),
    features: getBrazilianFeatures(model, priceNumber),
    
    // Performance estimada
    consumption: estimateConsumption(fuel, modelYear),
    performance: estimatePerformance(model, modelYear, fuel),
    
    // Imagem
    image: getCarImage(brand, model),
    
    // Dados da FIPE
    referenceMonth: referenceMonth,
    priceHistory: priceHistory,
    dataSource: 'fipe_api',
    
    // Informações adicionais da FIPE
    fipeInfo: fipeAdditionalInfo,
    
    // Dados brutos originais da FIPE (para debugging/análise completa)
    rawFipeData: fipeData,
    
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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

function getFuelAcronym(fuel) {
  const acronymMap = {
    'Gasolina': 'G',
    'Etanol': 'E',
    'Álcool': 'E',
    'Diesel': 'D',
    'Flex': 'F',
    'Elétrico': 'EL',
    'Híbrido': 'H'
  };
  return acronymMap[fuel] || 'F';
}

function getVehicleTypeFromFipe(vehicleType) {
  const typeMap = {
    1: 'Carro',
    2: 'Moto', 
    3: 'Caminhão',
    'cars': 'Carro',
    'motorcycles': 'Moto',
    'trucks': 'Caminhão'
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

// Buscar detalhes completos de múltiplos anos de um modelo
async function getFipeVehicleDetailsAllYears(vehicleType = 'cars', brandId, modelId, maxYears = 5) {
  try {
    console.log(`🔍 Buscando detalhes de múltiplos anos para modelo ${modelId}...`);
    
    // Buscar anos disponíveis
    const yearsResult = await getFipeYears(vehicleType, brandId, modelId);
    if (!yearsResult.success || yearsResult.data.length === 0) {
      throw new Error('Nenhum ano encontrado');
    }

    console.log(`📅 ${yearsResult.data.length} anos disponíveis`);
    
    // Limitar aos anos mais recentes
    const selectedYears = yearsResult.data.slice(0, maxYears);
    const allYearDetails = [];
    
    // Buscar detalhes para cada ano
    for (const year of selectedYears) {
      try {
        const detailsResult = await getFipeVehicleDetails(vehicleType, brandId, modelId, year.code);
        if (detailsResult.success) {
          allYearDetails.push({
            ...detailsResult.data,
            yearInfo: year, // Informações adicionais do ano
            detailsTimestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar detalhes do ano ${year.name}:`, error.message);
      }
    }

    return {
      success: true,
      data: allYearDetails,
      total: allYearDetails.length,
      source: 'fipe_api',
      availableYears: yearsResult.data,
      message: `${allYearDetails.length} versões encontradas com detalhes completos`
    };

  } catch (error) {
    console.error('❌ Erro ao buscar detalhes de múltiplos anos:', error.message);
    throw error;
  }
}

// Função para calcular análise de preços
function calculatePriceAnalysis(vehicles) {
  if (!vehicles || vehicles.length === 0) return null;
  
  const prices = vehicles.map(v => v.priceNumber || 0).filter(p => p > 0);
  
  if (prices.length === 0) return null;
  
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  
  return {
    minPrice: {
      value: minPrice,
      formatted: formatPriceBRL(minPrice)
    },
    maxPrice: {
      value: maxPrice,
      formatted: formatPriceBRL(maxPrice)
    },
    avgPrice: {
      value: Math.round(avgPrice),
      formatted: formatPriceBRL(Math.round(avgPrice))
    },
    priceRange: {
      value: maxPrice - minPrice,
      formatted: formatPriceBRL(maxPrice - minPrice)
    },
    totalVariations: prices.length,
    priceDistribution: prices.sort((a, b) => a - b)
  };
}

// Explorar informações adicionais da API FIPE
async function exploreFipeAdditionalInfo() {
  try {
    console.log('🔍 Explorando informações adicionais da API FIPE...');
    
    const explorationResults = {
      baseUrl: FIPE_BASE_URL,
      timestamp: new Date().toISOString(),
      exploredEndpoints: []
    };

    // Testar endpoints para obter mais informações
    const endpointsToTest = [
      { path: '/cars/brands', description: 'Marcas de carros' },
      { path: '/motorcycles/brands', description: 'Marcas de motos' },
      { path: '/trucks/brands', description: 'Marcas de caminhões' },
      { path: '/references', description: 'Tabelas de referência' },
      { path: '/info', description: 'Informações da API' },
      { path: '/tables', description: 'Tabelas disponíveis' }
    ];

    for (const endpoint of endpointsToTest) {
      try {
        console.log(`🧪 Testando endpoint: ${endpoint.path}`);
        const response = await axios.get(`${FIPE_BASE_URL}${endpoint.path}`, {
          timeout: 5000
        });
        
        explorationResults.exploredEndpoints.push({
          path: endpoint.path,
          description: endpoint.description,
          status: 'success',
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          sampleData: Array.isArray(response.data) ? 
            response.data.slice(0, 2) : 
            response.data,
          totalItems: Array.isArray(response.data) ? response.data.length : 1
        });
        
        console.log(`✅ ${endpoint.path}: ${response.status} - ${Array.isArray(response.data) ? response.data.length : 1} items`);
        
      } catch (error) {
        explorationResults.exploredEndpoints.push({
          path: endpoint.path,
          description: endpoint.description,
          status: 'error',
          error: error.message
        });
        console.log(`❌ ${endpoint.path}: ${error.message}`);
      }
    }

    return {
      success: true,
      data: explorationResults,
      source: 'fipe_exploration',
      message: `Exploração concluída: ${explorationResults.exploredEndpoints.length} endpoints testados`
    };

  } catch (error) {
    console.error('❌ Erro na exploração da FIPE:', error.message);
    throw error;
  }
}

// Buscar informações completas sobre as tabelas FIPE disponíveis
async function getFipeTablesInfo() {
  try {
    console.log('📋 Buscando informações das tabelas FIPE...');
    
    const tablesInfo = {
      timestamp: new Date().toISOString(),
      vehicleTypes: {},
      totalStats: {}
    };

    // Buscar informações para cada tipo de veículo
    for (const [key, value] of Object.entries(VEHICLE_TYPES)) {
      try {
        console.log(`📊 Coletando estatísticas para ${value}...`);
        
        const brandsResult = await getFipeBrands(value);
        if (brandsResult.success) {
          tablesInfo.vehicleTypes[key] = {
            type: value,
            totalBrands: brandsResult.total,
            sampleBrands: brandsResult.data.slice(0, 5),
            popularBrands: brandsResult.data.filter(brand => 
              ['Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 'Toyota', 'Honda', 'Hyundai', 'Yamaha', 'Honda', 'Volvo'].some(popular =>
                brand.name.toLowerCase().includes(popular.toLowerCase())
              )
            ).slice(0, 10)
          };
        }
        
      } catch (error) {
        console.log(`⚠️ Erro ao coletar dados de ${value}:`, error.message);
        tablesInfo.vehicleTypes[key] = {
          type: value,
          error: error.message
        };
      }
    }

    // Calcular estatísticas totais
    const totalBrands = Object.values(tablesInfo.vehicleTypes)
      .reduce((sum, type) => sum + (type.totalBrands || 0), 0);

    tablesInfo.totalStats = {
      totalVehicleTypes: Object.keys(tablesInfo.vehicleTypes).length,
      totalBrands: totalBrands,
      lastUpdated: new Date().toISOString(),
      dataSource: 'fipe_api'
    };

    return {
      success: true,
      data: tablesInfo,
      source: 'fipe_api',
      message: `Informações coletadas de ${Object.keys(tablesInfo.vehicleTypes).length} tipos de veículos`
    };

  } catch (error) {
    console.error('❌ Erro ao buscar informações das tabelas:', error.message);
    throw error;
  }
}

// Buscar referências históricas da FIPE
async function getFipeReferences() {
  try {
    console.log('📅 Buscando referências históricas da FIPE...');
    
    const cacheKey = 'fipe_references';
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Referências encontradas no cache');
      return cached;
    }

    const response = await axios.get(`${FIPE_BASE_URL}/references`, {
      timeout: 10000
    });

    console.log(`✅ FIPE retornou ${response.data.length} referências históricas`);
    
    const result = {
      success: true,
      data: response.data,
      source: 'fipe_api',
      total: response.data.length,
      analysis: {
        mostRecent: response.data[0],
        oldest: response.data[response.data.length - 1],
        totalMonths: response.data.length,
        yearRange: {
          from: response.data[response.data.length - 1]?.month?.match(/\d{4}/)?.[0],
          to: response.data[0]?.month?.match(/\d{4}/)?.[0]
        }
      }
    };

    // Cache por 24 horas (referências mudam mensalmente)
    cache.set(cacheKey, result, 86400000);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar referências FIPE:', error.message);
    throw error;
  }
}

// Buscar preço histórico de um veículo específico
async function getFipeVehicleHistoricalPrice(vehicleType = 'cars', brandId, modelId, yearId, referenceId) {
  try {
    console.log(`📊 Buscando preço histórico para referência ${referenceId}...`);
    
    const cacheKey = `fipe_historical_${vehicleType}_${brandId}_${modelId}_${yearId}_${referenceId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Preço histórico encontrado no cache');
      return cached;
    }

    // Construir URL com referência específica
    const url = `${FIPE_BASE_URL}/${vehicleType}/brands/${brandId}/models/${modelId}/years/${yearId}`;
    const response = await axios.get(url, {
      params: { reference: referenceId },
      timeout: 10000
    });

    const historicalData = response.data;
    console.log(`✅ Preço histórico obtido: ${historicalData.price} (${referenceId})`);
    
    const result = {
      success: true,
      data: {
        ...historicalData,
        referenceId: referenceId,
        historicalQuery: true,
        queryTimestamp: new Date().toISOString()
      },
      source: 'fipe_api'
    };

    // Cache por 1 hora
    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    console.error('❌ Erro ao buscar preço histórico:', error.message);
    return {
      success: false,
      error: error.message,
      referenceId: referenceId
    };
  }
}

// Buscar evolução completa de preços de um veículo
async function getFipeVehiclePriceEvolution(vehicleType = 'cars', brandId, modelId, yearId, maxReferences = 12) {
  try {
    console.log(`📈 Buscando evolução de preços para veículo...`);
    
    // Buscar referências disponíveis
    const referencesResult = await getFipeReferences();
    if (!referencesResult.success) {
      throw new Error('Não foi possível obter referências');
    }

    console.log(`📅 ${referencesResult.data.length} referências disponíveis`);
    
    // Limitar número de referências para análise
    const selectedReferences = referencesResult.data.slice(0, maxReferences);
    const priceEvolution = [];

    // Buscar preço para cada referência
    for (const reference of selectedReferences) {
      try {
        const historicalResult = await getFipeVehicleHistoricalPrice(
          vehicleType, brandId, modelId, yearId, reference.code
        );
        
        if (historicalResult.success) {
          priceEvolution.push({
            reference: reference,
            price: historicalResult.data.price,
            priceNumber: parseFloat(historicalResult.data.price.replace(/[R$\s.]/g, '').replace(',', '.')) || 0,
            month: reference.month,
            vehicleData: historicalResult.data
          });
        }
        
        // Pequeno delay para não sobrecarregar a API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`⚠️ Erro ao buscar preço para ${reference.month}:`, error.message);
      }
    }

    // Calcular análise da evolução
    const priceAnalysis = calculatePriceEvolutionAnalysis(priceEvolution);

    return {
      success: true,
      data: {
        priceEvolution: priceEvolution,
        analysis: priceAnalysis,
        totalReferences: priceEvolution.length,
        requestedReferences: maxReferences,
        availableReferences: referencesResult.data.length
      },
      source: 'fipe_api',
      message: `Evolução de preços coletada para ${priceEvolution.length} períodos`
    };

  } catch (error) {
    console.error('❌ Erro ao buscar evolução de preços:', error.message);
    throw error;
  }
}

// Calcular análise da evolução de preços
function calculatePriceEvolutionAnalysis(priceEvolution) {
  if (!priceEvolution || priceEvolution.length === 0) return null;

  const prices = priceEvolution.map(p => p.priceNumber).filter(p => p > 0);
  if (prices.length === 0) return null;

  const oldestPrice = prices[prices.length - 1];
  const newestPrice = prices[0];
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  
  const percentualChange = ((newestPrice - oldestPrice) / oldestPrice) * 100;
  const absoluteChange = newestPrice - oldestPrice;

  return {
    oldestPrice: {
      value: oldestPrice,
      formatted: formatPriceBRL(oldestPrice),
      period: priceEvolution[priceEvolution.length - 1]?.month
    },
    newestPrice: {
      value: newestPrice,
      formatted: formatPriceBRL(newestPrice),
      period: priceEvolution[0]?.month
    },
    maxPrice: {
      value: maxPrice,
      formatted: formatPriceBRL(maxPrice)
    },
    minPrice: {
      value: minPrice,
      formatted: formatPriceBRL(minPrice)
    },
    change: {
      absolute: {
        value: absoluteChange,
        formatted: formatPriceBRL(Math.abs(absoluteChange))
      },
      percentual: {
        value: percentualChange,
        formatted: `${percentualChange.toFixed(2)}%`,
        direction: percentualChange >= 0 ? 'increase' : 'decrease'
      }
    },
    volatility: {
      range: maxPrice - minPrice,
      rangeFormatted: formatPriceBRL(maxPrice - minPrice),
      coefficient: ((maxPrice - minPrice) / ((maxPrice + minPrice) / 2)) * 100
    },
    trends: {
      isAppreciating: percentualChange > 0,
      isDepreciating: percentualChange < 0,
      isStable: Math.abs(percentualChange) < 5
    }
  };
}

// Exportar funções principais
module.exports = {
  smartCarSearch,
  getFipeBrands,
  getFipeModels,
  getFipeYears,
  getFipeVehicleDetails,
  getFipeVehicleDetailsAllYears,
  getFipeByCode,
  searchVehiclesByMake,
  searchVehiclesByMakeModel,
  getPopularBrands,
  getBrazilianMarketStats,
  calculatePriceAnalysis,
  cache,
  exploreFipeAdditionalInfo,
  getFipeTablesInfo,
  getFipeReferences,
  getFipeVehicleHistoricalPrice,
  getFipeVehiclePriceEvolution,
  calculatePriceEvolutionAnalysis
}; 