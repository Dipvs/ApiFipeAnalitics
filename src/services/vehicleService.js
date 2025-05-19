// src/services/vehicleService.js
const fipeRepository = require('../repositories/fipeRepository');
const { validateCompareDTO } = require('../validations/vehicleValidation');
const favoritesRepository = require('../repositories/favoritesRepository');
const comparisonRepository = require('../repositories/comparisonRepository');
const axios = require('axios');
const baseURL = 'https://parallelum.com.br/fipe/api/v1';

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 horas cache
const cache = {
  timestamp: 0,
  marcas: {},      // { carros: [...], motos: [...], caminhoes: [...] }
  modelos: {},     // { carros: { marcaCodigo: [...] }, motos: {}, caminhoes: {} }
  anos: {},        // { carros: { marcaCodigo_modeloCodigo: [...] }, ... }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function populateCache() {
  const tipos = ['carros', 'motos', 'caminhoes'];

  for (const tipo of tipos) {
    try {
      const { data: marcas } = await axios.get(`${baseURL}/${tipo}/marcas`);
      cache.marcas[tipo] = marcas;
      cache.modelos[tipo] = {};
      cache.anos[tipo] = {};

      for (const marca of marcas) {
        try {
          const { data: modelosData } = await axios.get(`${baseURL}/${tipo}/marcas/${marca.codigo}/modelos`);
          cache.modelos[tipo][marca.codigo] = modelosData.modelos;

          for (const modelo of modelosData.modelos) {
            try {
              const { data: anos } = await axios.get(`${baseURL}/${tipo}/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos`);
              cache.anos[tipo][`${marca.codigo}_${modelo.codigo}`] = anos;
              await delay(150); // evitar 429
            } catch (err) {
              console.error(`Erro ao buscar anos para modelo ${modelo.nome} (${tipo}):`, err.message);
            }
          }
          await delay(300);
        } catch (err) {
          console.error(`Erro ao buscar modelos para marca ${marca.nome} (${tipo}):`, err.message);
        }
      }
      await delay(500);
    } catch (err) {
      console.error(`Erro ao buscar marcas para tipo ${tipo}:`, err.message);
    }
  }

  cache.timestamp = Date.now();
}

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

      const vehiclePromises = vehicles.map(vehicle =>
        fipeRepository.fetchVehicle(vehicle.type, vehicle.brandCode, vehicle.modelCode, vehicle.yearCode)
      );

      const results = await Promise.all(vehiclePromises);

      const parseValor = (valor) =>
        parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

      const valores = results.map(v => parseValor(v.Valor));
      const menor = Math.min(...valores);
      const maior = Math.max(...valores);
      const diferenca = maior - menor;

      await comparisonRepository.saveComparison({
        vehicles: results,
        comparedAt: new Date()
      });

      return {
        vehicles: results,
        valorMaisBaixo: `R$ ${menor.toFixed(2).replace('.', ',')}`,
        valorMaisAlto: `R$ ${maior.toFixed(2).replace('.', ',')}`,
        diferenca: `R$ ${diferenca.toFixed(2).replace('.', ',')}`,
      };
    } catch (err) {
      console.error('Erro em compareMultipleVehicles:', err);
      throw new Error('Erro ao comparar múltiplos veículos');
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
  },

searchByPriceRange: async ({ type, minPrice = 0, maxPrice = Infinity, page = 1, limit = 10 }) => {
  const tiposPermitidos = ['carros', 'motos', 'caminhoes'];
  if (!tiposPermitidos.includes(type)) {
    throw new Error(`Tipo inválido. Esperado: ${tiposPermitidos.join(', ')}`);
  }

  const resultados = [];
  const cache = {};
  const parseValor = (valor) =>
    parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.'));

  const { data: marcas } = await axios.get(`${baseURL}/${type}/marcas`);
  cache[type] = { marcas };

  await Promise.all(
    marcas.map(async (marca) => {
      try {
        const { data: modelosData } = await axios.get(`${baseURL}/${type}/marcas/${marca.codigo}/modelos`);
        const modelos = modelosData.modelos;

        for (const modelo of modelos) {
          const { data: anos } = await axios.get(`${baseURL}/${type}/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos`);
          if (!anos.length) continue;

          const ultimoAno = anos[anos.length - 1];
          const { data: detalhes } = await axios.get(
            `${baseURL}/${type}/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos/${ultimoAno.codigo}`
          );

          const valorNumerico = parseValor(detalhes.Valor);
          if (valorNumerico >= minPrice && valorNumerico <= maxPrice) {
            resultados.push(detalhes);
          }
        }
      } catch (err) {
        console.error(`Erro ao processar marca ${marca.nome}:`, err.message);
      }
    })
  );

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



  searchVehicleByName: async ({ name, page = 1, limit = 10 }) => {
    if (!cache.timestamp || (Date.now() - cache.timestamp) > CACHE_TTL) {
      console.log('Cache expirado ou vazio, populando cache...');
      await populateCache();
    }

    const busca = normalize(name);
    const tipos = ['carros', 'motos', 'caminhoes'];
    const resultados = [];

    for (const tipo of tipos) {
      const marcas = cache.marcas[tipo] || [];
      const modelosPorMarca = cache.modelos[tipo] || {};
      const anosPorModelo = cache.anos[tipo] || {};

      for (const marca of marcas) {
        const modelos = modelosPorMarca[marca.codigo] || [];

        const modelosFiltrados = modelos.filter(m => normalize(m.nome).includes(busca));

        for (const modelo of modelosFiltrados) {
          const anos = anosPorModelo[`${marca.codigo}_${modelo.codigo}`] || [];
          if (anos.length === 0) continue;

          const ultimoAno = anos[anos.length - 1];
          try {
            const { data: detalhes } = await axios.get(
              `${baseURL}/${tipo}/marcas/${marca.codigo}/modelos/${modelo.codigo}/anos/${ultimoAno.codigo}`
            );
            resultados.push(detalhes);
            await delay(150); // evita 429
          } catch (err) {
            console.error(`Erro ao buscar detalhes do veículo ${modelo.nome} (${tipo}):`, err.message);
          }
        }
      }
    }

    // Paginação
    const total = resultados.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedResults = resultados.slice(start, end);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      data: paginatedResults,
    };
  },

  getHistory: () => comparisonRepository.getHistory(),
};
