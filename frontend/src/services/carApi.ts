import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Interface para os dados de carros (compatível com dados brasileiros expandidos)
export interface CarData {
  id?: number;
  make: string;
  model: string;
  year: number;
  price?: number;
  currency?: string;
  formatted_price?: string;
  fuel_type: string;
  transmission: string;
  class: string;
  mpg_city?: number;
  mpg_highway?: number;
  kmpl_city?: number;
  kmpl_highway?: number;
  engine?: {
    power_hp: number;
    torque_nm: number;
    cylinders: number;
    displacement: string;
  };
  features?: string[];
  doors?: number;
  seats?: number;
  trunk_capacity?: number;
  fuel_tank?: number;
  origin?: string;
  warranty?: string;
  safety_rating?: number;
  image?: string;
  
  // Compatibilidade com formato antigo
  cylinders?: number;
  city_mpg?: number;
  highway_mpg?: number;
  combination_mpg?: number;
  displacement?: number;
  drive?: string;
  price_usd?: number;
  price_brl?: string;
  consumption_kmL?: string;
  city_kmL?: number;
  highway_kmL?: number;
  image_url?: string;
  image_thumb?: string;
  image_source?: string;
  image_alt?: string;
}

// Interface para filtros de busca
export interface SearchFilters {
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
  class?: string;
  limit?: number;
}

// Interface para resposta da API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
  source?: string;
  meta?: {
    timestamp: string;
    total: number;
    filters_applied?: any;
    api_source?: string;
  };
  error?: string;
}

// Criar instância do axios
const carApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para logging
carApi.interceptors.request.use(
  (config) => {
    console.log(`🚗 Car API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Car API Request Error:', error);
    return Promise.reject(error);
  }
);

carApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Car API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Car API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Serviços da Car API
export const carApiService = {
  // Buscar todas as marcas disponíveis
  getMakes: async (): Promise<string[]> => {
    try {
      const response = await carApi.get<ApiResponse<string[]>>('/cars/makes');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      // Fallback para marcas brasileiras populares
      return [
        'Toyota', 'Honda', 'Volkswagen', 'Chevrolet', 'Ford', 'Hyundai',
        'Nissan', 'Fiat', 'Renault', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi'
      ];
    }
  },

  // Buscar carros com filtros
  searchCars: async (filters: SearchFilters = {}): Promise<CarData[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.make) params.append('make', filters.make);
      if (filters.model) params.append('model', filters.model);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.fuel_type) params.append('fuel_type', filters.fuel_type);
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.class) params.append('class', filters.class);
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
      throw error;
    }
  },

  // Buscar carros por marca específica
  getCarsByMake: async (make: string, limit: number = 10): Promise<CarData[]> => {
    try {
      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?make=${encodeURIComponent(make)}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar carros da marca ${make}:`, error);
      throw error;
    }
  },

  // Buscar carros por modelo
  getCarsByModel: async (model: string, limit: number = 10): Promise<CarData[]> => {
    try {
      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?model=${encodeURIComponent(model)}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar carros do modelo ${model}:`, error);
      throw error;
    }
  },

  // Buscar carros por ano
  getCarsByYear: async (year: number, limit: number = 10): Promise<CarData[]> => {
    try {
      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?year=${year}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar carros do ano ${year}:`, error);
      throw error;
    }
  },

  // Buscar carros por tipo de combustível
  getCarsByFuelType: async (fuelType: string, limit: number = 10): Promise<CarData[]> => {
    try {
      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?fuel_type=${encodeURIComponent(fuelType)}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar carros com combustível ${fuelType}:`, error);
      throw error;
    }
  },

  // Buscar carros por transmissão
  getCarsByTransmission: async (transmission: string, limit: number = 10): Promise<CarData[]> => {
    try {
      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?transmission=${encodeURIComponent(transmission)}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar carros com transmissão ${transmission}:`, error);
      throw error;
    }
  },

  // Buscar carros por classe
  getCarsByClass: async (carClass: string, limit: number = 10): Promise<CarData[]> => {
    try {
      const response = await carApi.get<ApiResponse<CarData[]>>(`/cars/search?class=${encodeURIComponent(carClass)}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar carros da classe ${carClass}:`, error);
      throw error;
    }
  },

  // Buscar carros com múltiplos filtros
  searchCarsAdvanced: async (filters: SearchFilters): Promise<CarData[]> => {
    try {
      return await carApiService.searchCars(filters);
    } catch (error) {
      console.error('Erro na busca avançada:', error);
      throw error;
    }
  },

  // Verificar status da API
  checkApiStatus: async (): Promise<boolean> => {
    try {
      const response = await carApi.get('/cars/makes');
      return response.status === 200;
    } catch (error) {
      console.error('API não está disponível:', error);
      return false;
    }
  },

  // Obter estatísticas do mercado brasileiro
  getBrazilianMarketStats: async (): Promise<any> => {
    try {
      const response = await carApi.get<ApiResponse<any>>('/cars/stats/brazilian-market');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do mercado brasileiro:', error);
      throw error;
    }
  }
};

export default carApiService; 