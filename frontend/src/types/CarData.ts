/**
 * TIPOS UNIFICADOS PARA DADOS DE CARROS
 * Compatível com API FIPE e estruturas legadas
 */

export interface CarData {
  id: string;
  
  // Dados principais do FIPE
  brand?: string;
  make?: string;
  model: string;
  year: number;
  price: number;
  fipeCode?: string;
  vehicleType?: string;
  fuel?: string;
  transmission?: string;
  doors?: number;
  seats?: number;
  origin?: string;
  warranty?: string;
  features?: string[];
  
  // Performance FIPE
  consumption?: {
    city: number;
    highway: number;
    combined: number;
  };
  
  performance?: {
    power: number;
    torque: number;
    acceleration: string;
    maxSpeed: number;
  };
  
  image?: string;
  
  // Estrutura antiga para compatibilidade
  engine?: {
    type: string;
    power_hp: number;
    torque_nm: number;
    cylinders: number;
    displacement: number;
  };
  
  performance_old?: {
    max_speed_kmh: number;
    acceleration_0_100_kmh: number;
  };
  
  kmpl_city?: number;
  kmpl_highway?: number;
  fuel_type?: string;
  
  specifications?: {
    doors: number;
    seats: number;
    trunk_capacity: number;
  };
}

export interface SearchFilters {
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
  limit?: number;
}

export interface CarSearchProps {
  onAddToComparison?: (car: CarData) => void;
  onRemoveFromComparison?: (carId: string) => void;
  onCompare?: () => void;
  selectedCars?: CarData[];
}

export interface VehicleCardProps {
  vehicle: CarData;
  onAddToComparison?: (vehicle: CarData) => void;
  selected?: boolean;
} 