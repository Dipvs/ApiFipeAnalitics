export interface Brand {
  codigo: string;
  nome: string;
}

export interface Model {
  codigo: string;
  nome: string;
}

export interface Year {
  codigo: string;
  nome: string;
}

export interface Vehicle {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
}

export interface VehicleParams {
  type: 'carros' | 'motos' | 'caminhoes';
  brandCode: string;
  modelCode: string;
  yearCode: string;
}

export interface ComparisonResult {
  vehicle1: Vehicle;
  vehicle2: Vehicle;
  priceDifference: number;
  percentageDifference: number;
  recommendation: string;
}

export interface FavoriteVehicle {
  id: string;
  vehicle: Vehicle;
  addedAt: string;
}

export interface ComparisonStats {
  totalComparisons: number;
  mostComparedBrands: Array<{
    brand: string;
    count: number;
  }>;
  averagePriceDifference: number;
}

export interface PopularVehicle {
  vehicle: Vehicle;
  searchCount: number;
  rank: number;
}

export interface PriceRangeSearch {
  minPrice: number;
  maxPrice: number;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  vehicles: Vehicle[];
  total: number;
  page: number;
  totalPages: number;
} 