// src/services/vehicleService.js
const fipeRepository = require('../repositories/fipeRepository');
const { validateCompareDTO } = require('../validations/vehicleValidation');
const favoritesRepository = require('../repositories/favoritesRepository');
const comparisonRepository = require('../repositories/comparisonRepository');
const axios = require('axios');
const baseURL = 'https://parallelum.com.br/fipe/api/v1';

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 horas cache

// Cache simplificado com dados mock para evitar rate limiting
const cache = {
  timestamp: Date.now(),
  vehicles: [
    // Dados mock para demonstração
    {
      TipoVeiculo: 1,
      Valor: "R$ 45.000,00",
      Marca: "Honda",
      Modelo: "Civic Sedan LX 1.7 16V",
      AnoModelo: 2005,
      Combustivel: "Gasolina",
      CodigoFipe: "001004-9",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "G",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 85.000,00",
      Marca: "Honda",
      Modelo: "Civic Sedan EXL 2.0 16V CVT",
      AnoModelo: 2020,
      Combustivel: "Flex",
      CodigoFipe: "001005-7",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 35.000,00",
      Marca: "Toyota",
      Modelo: "Corolla Sedan XEi 1.8 16V",
      AnoModelo: 2008,
      Combustivel: "Flex",
      CodigoFipe: "002001-1",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 95.000,00",
      Marca: "Toyota",
      Modelo: "Corolla Cross XRE 2.0 16V CVT",
      AnoModelo: 2022,
      Combustivel: "Flex",
      CodigoFipe: "002002-9",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 25.000,00",
      Marca: "Volkswagen",
      Modelo: "Gol 1.0 8V",
      AnoModelo: 2010,
      Combustivel: "Flex",
      CodigoFipe: "003001-5",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 75.000,00",
      Marca: "Volkswagen",
      Modelo: "T-Cross 200 TSI 1.0 12V",
      AnoModelo: 2021,
      Combustivel: "Flex",
      CodigoFipe: "003002-3",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 55.000,00",
      Marca: "Ford",
      Modelo: "Ka Sedan SE 1.5 12V",
      AnoModelo: 2018,
      Combustivel: "Flex",
      CodigoFipe: "004001-8",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "carros"
    },
    {
      TipoVeiculo: 1,
      Valor: "R$ 120.000,00",
      Marca: "BMW",
      Modelo: "320i 2.0 16V Turbo",
      AnoModelo: 2019,
      Combustivel: "Gasolina",
      CodigoFipe: "005001-2",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "G",
      tipo: "carros"
    },
    {
      TipoVeiculo: 2,
      Valor: "R$ 15.000,00",
      Marca: "Honda",
      Modelo: "CG 160 Start",
      AnoModelo: 2020,
      Combustivel: "Flex",
      CodigoFipe: "101001-4",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "motos"
    },
    {
      TipoVeiculo: 2,
      Valor: "R$ 25.000,00",
      Marca: "Yamaha",
      Modelo: "YBR 150 Factor ED",
      AnoModelo: 2021,
      Combustivel: "Flex",
      CodigoFipe: "102001-7",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "F",
      tipo: "motos"
    },
    {
      TipoVeiculo: 3,
      Valor: "R$ 180.000,00",
      Marca: "Mercedes-Benz",
      Modelo: "Accelo 815/37",
      AnoModelo: 2020,
      Combustivel: "Diesel",
      CodigoFipe: "201001-6",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "D",
      tipo: "caminhoes"
    },
    {
      TipoVeiculo: 3,
      Valor: "R$ 220.000,00",
      Marca: "Volvo",
      Modelo: "VM 270 6x2R",
      AnoModelo: 2021,
      Combustivel: "Diesel",
      CodigoFipe: "202001-3",
      MesReferencia: "janeiro de 2025",
      SiglaCombustivel: "D",
      tipo: "caminhoes"
    }
  ]
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting melhorado
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 10; // Reduzido para evitar problemas
const resetRequestCount = () => {
  requestCount = 0;
  setTimeout(resetRequestCount, 60000);
};
resetRequestCount();

const makeRequest = async (url, retries = 2) => {
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    console.log('Rate limit atingido, usando dados do cache...');
    throw new Error('Rate limit atingido');
  }
  
  try {
    requestCount++;
    const response = await axios.get(url, { timeout: 5000 });
    await delay(1000); // Delay maior entre requests
    return response;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.log(`Rate limit atingido, aguardando... (tentativas restantes: ${retries})`);
      await delay(10000); // Delay maior para retry
      return makeRequest(url, retries - 1);
    }
    throw error;
}
};

module.exports = {
  getBrands: (type) => fipeRepository.fetchBrands(type),

  getModels: ({ type, brandCode }) => fipeRepository.fetchModels(type, brandCode),

  getYears: ({ type, brandCode, modelCode }) =>
    fipeRepository.fetchYears(type, brandCode, modelCode),

  getVehicle: ({ type, brandCode, modelCode, yearCode }) =>
    fipeRepository.fetchVehicle(type, brandCode, modelCode, yearCode),

  compareVehicles: async (dto) => {
    if (!dto.vehicle1 || !dto.vehicle2) {
      throw new Error('Ambos os veículos são obrigatórios para comparação');
    }

    validateCompareDTO(dto);
    const { vehicle1, vehicle2 } = dto;

    const [v1, v2] = await Promise.all([
      fipeRepository.fetchVehicle(vehicle1.type, vehicle1.brandCode, vehicle1.modelCode, vehicle1.yearCode),
      fipeRepository.fetchVehicle(vehicle2.type, vehicle2.brandCode, vehicle2.modelCode, vehicle2.yearCode)
    ]);

    if (!v1 || !v2) {
      throw new Error('Um ou ambos os veículos não foram encontrados');
    }

    const parseValor = (valor) =>
      parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

    const formatValor = (valor) =>
      `R$ ${valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    const valor1 = parseValor(v1.Valor);
    const valor2 = parseValor(v2.Valor);
    const diferencaValor = Math.abs(valor1 - valor2);
    const diferencaAno = Math.abs(v1.AnoModelo - v2.AnoModelo);

    await comparisonRepository.saveComparison({
      vehicle1: v1,
      vehicle2: v2,
      comparedAt: new Date()
    });

    return {
      vehicle1: v1,
      vehicle2: v2,
      diferencaValor: formatValor(diferencaValor),
      diferencaAno
    };
  },

  compareMultipleVehicles: async ({ vehicles }) => {
    try {
      if (!Array.isArray(vehicles) || vehicles.length < 2) {
        throw new Error('É necessário pelo menos 2 veículos para comparação');
      }

      console.log('Comparando veículos:', vehicles);

      // Buscar veículos no cache em vez de fazer requisições para a API FIPE
      const results = vehicles.map(vehicleData => {
        // Buscar no cache usando CodigoFipe se disponível
        if (vehicleData.CodigoFipe) {
          const found = cache.vehicles.find(v => v.CodigoFipe === vehicleData.CodigoFipe);
          if (found) {
            console.log(`Veículo encontrado no cache: ${found.Marca} ${found.Modelo}`);
            return found;
          }
        }

        // Buscar por marca e modelo se CodigoFipe não estiver disponível
        if (vehicleData.Marca && vehicleData.Modelo) {
          const found = cache.vehicles.find(v => 
            normalize(v.Marca) === normalize(vehicleData.Marca) && 
            normalize(v.Modelo) === normalize(vehicleData.Modelo) &&
            (!vehicleData.AnoModelo || v.AnoModelo === vehicleData.AnoModelo)
      );
          if (found) {
            console.log(`Veículo encontrado no cache por marca/modelo: ${found.Marca} ${found.Modelo}`);
            return found;
          }
        }

        // Se não encontrar no cache, retornar os dados originais
        console.log('Veículo não encontrado no cache, usando dados originais');
        return vehicleData;
      });

      // Verificar se todos os veículos foram encontrados
      const validResults = results.filter(v => v && v.Valor);
      if (validResults.length < 2) {
        throw new Error('Não foi possível encontrar dados suficientes para comparação');
      }

      const parseValor = (valor) =>
        parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

      const valores = validResults.map(v => parseValor(v.Valor));
      const menor = Math.min(...valores);
      const maior = Math.max(...valores);
      const diferenca = maior - menor;

      console.log(`Comparação realizada: menor=${menor}, maior=${maior}, diferença=${diferenca}`);

      await comparisonRepository.saveComparison({
        vehicles: validResults,
        comparedAt: new Date()
      });

      return {
        vehicles: validResults,
        valorMaisBaixo: `R$ ${menor.toFixed(2).replace('.', ',')}`,
        valorMaisAlto: `R$ ${maior.toFixed(2).replace('.', ',')}`,
        diferenca: `R$ ${diferenca.toFixed(2).replace('.', ',')}`,
      };
    } catch (err) {
      console.error('Erro em compareMultipleVehicles:', err);
      throw new Error(`Erro ao comparar múltiplos veículos: ${err.message}`);
    }
  },

  addFavorite: async (vehicleData) => {
    const vehicle = await fipeRepository.fetchVehicle(
      vehicleData.type,
      vehicleData.brandCode,
      vehicleData.modelCode,
      vehicleData.yearCode
    );
    return favoritesRepository.addFavorite(vehicle);
  },

  getFavorites: () => favoritesRepository.getFavorites(),

  deleteFavorite: (id) => favoritesRepository.deleteFavorite(id),

  getComparisonStats: () => comparisonRepository.getStats(),

  getPopularVehicles: async () => {
    try {
    const { data } = await axios.get('http://localhost:3000/api/stats/comparisons');

    const marcaCount = {};
    const modeloCount = {};

    for (const comparacao of data.lastCompared) {
      let veiculos = [];

      if (Array.isArray(comparacao.vehicles)) {
        veiculos = comparacao.vehicles;
      } else if (comparacao.vehicle1 && comparacao.vehicle2) {
        veiculos = [comparacao.vehicle1, comparacao.vehicle2];
      }

      for (const veiculo of veiculos) {
        const { Marca, Modelo } = veiculo;

        marcaCount[Marca] = (marcaCount[Marca] || 0) + 1;

        const modeloCompleto = `${Marca} ${Modelo}`;
        modeloCount[modeloCompleto] = (modeloCount[modeloCompleto] || 0) + 1;
      }
    }

    const marcasMaisComparadas = Object.entries(marcaCount)
      .sort((a, b) => b[1] - a[1])
      .map(([marca, total]) => ({ marca, total }));

    const modelosMaisComparados = Object.entries(modeloCount)
      .sort((a, b) => b[1] - a[1])
      .map(([modelo, total]) => ({ modelo, total }));

    return {
      totalComparacoes: data.totalComparisons,
      marcasMaisComparadas,
      modelosMaisComparados
    };
    } catch (err) {
      // Retornar dados mock se houver erro
      return {
        totalComparacoes: 150,
        marcasMaisComparadas: [
          { marca: 'Honda', total: 45 },
          { marca: 'Toyota', total: 38 },
          { marca: 'Volkswagen', total: 32 }
        ],
        modelosMaisComparados: [
          { modelo: 'Honda Civic', total: 25 },
          { modelo: 'Toyota Corolla', total: 22 },
          { modelo: 'Volkswagen Gol', total: 18 }
        ]
      };
    }
  },

searchByPriceRange: async ({ type, minPrice = 0, maxPrice = Infinity, page = 1, limit = 10 }) => {
  const tiposPermitidos = ['carros', 'motos', 'caminhoes'];
  if (!tiposPermitidos.includes(type)) {
    throw new Error(`Tipo inválido. Esperado: ${tiposPermitidos.join(', ')}`);
  }

  const parseValor = (valor) =>
    parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

    const resultados = cache.vehicles.filter(vehicle => {
      if (vehicle.tipo !== type) return false;
      const valorNumerico = parseValor(vehicle.Valor);
      return valorNumerico >= minPrice && valorNumerico <= maxPrice;
    });

  // Paginação
  const total = resultados.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedResults = resultados.slice(start, end);

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    data: paginatedResults
  };
},

  // Busca melhorada com filtros usando dados do cache
  searchVehicleByName: async ({ 
    name, 
    page = 1, 
    limit = 10, 
    tipo = null, 
    marca = null, 
    anoMin = null, 
    anoMax = null,
    precoMin = null,
    precoMax = null
  }) => {
    console.log('Realizando busca com parâmetros:', { name, tipo, marca, anoMin, anoMax, precoMin, precoMax });

    const busca = normalize(name || '');
    const parseValor = (valor) =>
      parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

    let resultados = cache.vehicles.filter(vehicle => {
      // Filtro por nome (marca ou modelo)
      if (busca && !normalize(`${vehicle.Marca} ${vehicle.Modelo}`).includes(busca)) {
        return false;
      }

      // Filtro por tipo
      if (tipo && vehicle.tipo !== tipo) {
        return false;
      }

      // Filtro por marca
      if (marca && normalize(vehicle.Marca) !== normalize(marca)) {
        return false;
      }

      // Filtro por ano
      if (anoMin && vehicle.AnoModelo < parseInt(anoMin)) {
        return false;
      }
      if (anoMax && vehicle.AnoModelo > parseInt(anoMax)) {
        return false;
      }

      // Filtro por preço
      if (precoMin || precoMax) {
        const valor = parseValor(vehicle.Valor);
        if (precoMin && valor < parseFloat(precoMin)) {
          return false;
        }
        if (precoMax && valor > parseFloat(precoMax)) {
          return false;
        }
      }

      return true;
    });

    // Ordenar por relevância (marca primeiro, depois modelo)
    resultados.sort((a, b) => {
      if (busca) {
        const aMarca = normalize(a.Marca).includes(busca);
        const bMarca = normalize(b.Marca).includes(busca);
        if (aMarca && !bMarca) return -1;
        if (!aMarca && bMarca) return 1;
      }
      return a.Marca.localeCompare(b.Marca);
    });

    // Paginação
    const total = resultados.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedResults = resultados.slice(start, end);

    console.log(`Busca retornou ${total} resultados, mostrando ${paginatedResults.length} na página ${page}`);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data: paginatedResults,
      filters: {
        tipos: [...new Set(cache.vehicles.map(v => v.tipo))],
        marcas: [...new Set(cache.vehicles.map(v => v.Marca))].sort(),
        anoMin: Math.min(...cache.vehicles.map(v => v.AnoModelo)),
        anoMax: Math.max(...cache.vehicles.map(v => v.AnoModelo))
      }
    };
  },

  // Novo endpoint para obter filtros disponíveis
  getSearchFilters: async () => {
    const parseValor = (valor) =>
      parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

    const precos = cache.vehicles.map(v => parseValor(v.Valor)).filter(p => !isNaN(p));

    return {
      tipos: [...new Set(cache.vehicles.map(v => v.tipo))],
      marcas: [...new Set(cache.vehicles.map(v => v.Marca))].sort(),
      anos: {
        min: Math.min(...cache.vehicles.map(v => v.AnoModelo)),
        max: Math.max(...cache.vehicles.map(v => v.AnoModelo))
      },
      precos: {
        min: Math.min(...precos),
        max: Math.max(...precos)
      }
    };
  },

  getHistory: () => comparisonRepository.getHistory(),
};
