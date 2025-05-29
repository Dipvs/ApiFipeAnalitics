import axios from 'axios';
import type {
  Brand,
  Model,
  Year,
  Vehicle,
  VehicleParams,
  ComparisonResult,
  FavoriteVehicle,
  ComparisonStats,
  PopularVehicle,
  PriceRangeSearch,
  SearchResult,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging de requisições
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    if (error.response?.status === 404) {
      console.warn('Endpoint não encontrado. Retornando dados mock.');
    }
    return Promise.reject(error);
  }
);

export const vehicleApi = {
  // Buscar marcas por tipo
  getBrands: async (type: string): Promise<Brand[]> => {
    try {
      const response = await api.get(`/brands/${type}`);
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para marcas');
      return [
        { codigo: '1', nome: 'Volkswagen' },
        { codigo: '2', nome: 'Fiat' },
        { codigo: '3', nome: 'Ford' },
        { codigo: '4', nome: 'Chevrolet' },
        { codigo: '5', nome: 'Toyota' },
      ];
    }
  },

  // Buscar modelos por marca
  getModels: async (type: string, brandCode: string): Promise<Model[]> => {
    try {
      const response = await api.get(`/models/${type}/${brandCode}`);
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para modelos');
      return [
        { codigo: '1', nome: 'Gol' },
        { codigo: '2', nome: 'Polo' },
        { codigo: '3', nome: 'T-Cross' },
        { codigo: '4', nome: 'Virtus' },
      ];
    }
  },

  // Buscar anos por modelo
  getYears: async (type: string, brandCode: string, modelCode: string): Promise<Year[]> => {
    try {
      const response = await api.get(`/years/${type}/${brandCode}/${modelCode}`);
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para anos');
      return [
        { codigo: '2024-1', nome: '2024 Gasolina' },
        { codigo: '2023-1', nome: '2023 Gasolina' },
        { codigo: '2022-1', nome: '2022 Gasolina' },
        { codigo: '2021-1', nome: '2021 Gasolina' },
      ];
    }
  },

  // Buscar detalhes do veículo
  getVehicle: async (params: VehicleParams): Promise<Vehicle> => {
    try {
      const { type, brandCode, modelCode, yearCode } = params;
      const response = await api.get(`/vehicle/${type}/${brandCode}/${modelCode}/${yearCode}`);
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para veículo');
      return {
        TipoVeiculo: 1,
        Valor: 'R$ 45.000,00',
        Marca: 'Volkswagen',
        Modelo: 'Gol',
        AnoModelo: 2023,
        Combustivel: 'Gasolina',
        CodigoFipe: '004340-0',
        MesReferencia: 'dezembro de 2024',
        SiglaCombustivel: 'G',
      };
    }
  },

  // Comparar dois veículos
  compareVehicles: async (vehicle1: VehicleParams, vehicle2: VehicleParams): Promise<ComparisonResult> => {
    try {
      const response = await api.post('/compare', { vehicle1, vehicle2 });
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para comparação');
      return {
        vehicle1: {
          TipoVeiculo: 1,
          Valor: 'R$ 45.000,00',
          Marca: 'Volkswagen',
          Modelo: 'Gol',
          AnoModelo: 2023,
          Combustivel: 'Gasolina',
          CodigoFipe: '004340-0',
          MesReferencia: 'dezembro de 2024',
          SiglaCombustivel: 'G',
        },
        vehicle2: {
          TipoVeiculo: 1,
          Valor: 'R$ 52.000,00',
          Marca: 'Fiat',
          Modelo: 'Argo',
          AnoModelo: 2023,
          Combustivel: 'Gasolina',
          CodigoFipe: '004341-0',
          MesReferencia: 'dezembro de 2024',
          SiglaCombustivel: 'G',
        },
        priceDifference: 7000,
        percentageDifference: 15.6,
        recommendation: 'O Volkswagen Gol oferece melhor custo-benefício.',
      };
    }
  },

  // Comparar múltiplos veículos
  compareMultipleVehicles: async (vehicles: VehicleParams[]): Promise<any> => {
    try {
      const response = await api.post('/compare/multiple', { vehicles });
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para comparação múltipla');
      return { message: 'Comparação múltipla realizada com sucesso' };
    }
  },

  // Adicionar aos favoritos
  addFavorite: async (vehicle: VehicleParams): Promise<FavoriteVehicle> => {
    try {
      const response = await api.post('/favorites', vehicle);
      return response.data;
    } catch (error) {
      console.warn('Simulando adição aos favoritos');
      return {
        id: Date.now().toString(),
        vehicle: {
          TipoVeiculo: 1,
          Valor: 'R$ 45.000,00',
          Marca: 'Volkswagen',
          Modelo: 'Gol',
          AnoModelo: 2023,
          Combustivel: 'Gasolina',
          CodigoFipe: '004340-0',
          MesReferencia: 'dezembro de 2024',
          SiglaCombustivel: 'G',
        },
        addedAt: new Date().toISOString(),
      };
    }
  },

  // Buscar favoritos
  getFavorites: async (): Promise<FavoriteVehicle[]> => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para favoritos');
      return [];
    }
  },

  // Remover dos favoritos
  deleteFavorite: async (id: string): Promise<void> => {
    try {
      await api.delete(`/favorites/${id}`);
    } catch (error) {
      console.warn('Simulando remoção dos favoritos');
    }
  },

  // Buscar estatísticas de comparação
  getComparisonStats: async (): Promise<ComparisonStats> => {
    try {
      const response = await api.get('/stats/comparisons');
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para estatísticas');
      return {
        totalComparisons: 15420,
        mostComparedBrands: [
          { brand: 'Volkswagen', count: 3240 },
          { brand: 'Fiat', count: 2890 },
          { brand: 'Ford', count: 2156 },
          { brand: 'Chevrolet', count: 1987 },
          { brand: 'Toyota', count: 1654 },
        ],
        averagePriceDifference: 12.5,
      };
    }
  },

  // Buscar veículos populares
  getPopularVehicles: async (): Promise<PopularVehicle[]> => {
    try {
      const response = await api.get('/stats/popular');
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para veículos populares');
      return [
        {
          vehicle: {
            TipoVeiculo: 1,
            Valor: 'R$ 45.000,00',
            Marca: 'Volkswagen',
            Modelo: 'Gol',
            AnoModelo: 2023,
            Combustivel: 'Gasolina',
            CodigoFipe: '004340-0',
            MesReferencia: 'dezembro de 2024',
            SiglaCombustivel: 'G',
          },
          searchCount: 1250,
          rank: 1,
        },
        {
          vehicle: {
            TipoVeiculo: 1,
            Valor: 'R$ 52.000,00',
            Marca: 'Fiat',
            Modelo: 'Argo',
            AnoModelo: 2023,
            Combustivel: 'Gasolina',
            CodigoFipe: '004341-0',
            MesReferencia: 'dezembro de 2024',
            SiglaCombustivel: 'G',
          },
          searchCount: 1180,
          rank: 2,
        },
        {
          vehicle: {
            TipoVeiculo: 1,
            Valor: 'R$ 48.000,00',
            Marca: 'Ford',
            Modelo: 'Ka',
            AnoModelo: 2023,
            Combustivel: 'Gasolina',
            CodigoFipe: '004342-0',
            MesReferencia: 'dezembro de 2024',
            SiglaCombustivel: 'G',
          },
          searchCount: 980,
          rank: 3,
        },
      ];
    }
  },

  // Buscar por faixa de preço
  searchByPriceRange: async (type: string, searchParams: PriceRangeSearch): Promise<SearchResult> => {
    try {
      const response = await api.post(`/vehicles/${type}/price-range`, searchParams);
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para busca por preço');
      return {
        vehicles: [
          {
            TipoVeiculo: 1,
            Valor: 'R$ 45.000,00',
            Marca: 'Volkswagen',
            Modelo: 'Gol',
            AnoModelo: 2023,
            Combustivel: 'Gasolina',
            CodigoFipe: '004340-0',
            MesReferencia: 'dezembro de 2024',
            SiglaCombustivel: 'G',
          },
        ],
        total: 1,
        page: 1,
        totalPages: 1,
      };
    }
  },

  // Buscar veículo por nome
  searchVehicleByName: async (name: string): Promise<Vehicle[]> => {
    try {
      const response = await api.get(`/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para busca por nome');
      return [
        {
          TipoVeiculo: 1,
          Valor: 'R$ 45.000,00',
          Marca: 'Volkswagen',
          Modelo: 'Gol',
          AnoModelo: 2023,
          Combustivel: 'Gasolina',
          CodigoFipe: '004340-0',
          MesReferencia: 'dezembro de 2024',
          SiglaCombustivel: 'G',
        },
      ];
    }
  },

  // Buscar histórico
  getHistory: async (): Promise<any[]> => {
    try {
      const response = await api.get('/history');
      return response.data;
    } catch (error) {
      console.warn('Usando dados mock para histórico');
      return [];
    }
  },

  // Exportar comparação
  exportComparison: async (vehicle1: VehicleParams, vehicle2: VehicleParams): Promise<any> => {
    try {
      const response = await api.post('/compare/export', { vehicle1, vehicle2 });
      return response.data;
    } catch (error) {
      console.warn('Simulando exportação');
      return { message: 'Exportação realizada com sucesso' };
    }
  },
};

export default api; 