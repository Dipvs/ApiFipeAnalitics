import React, { useState, useEffect } from 'react';
import './CarSearch.css';
import VehicleCard from './VehicleCard';

interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  engine: {
    type: string;
    power_hp: number;
    torque_nm: number;
    cylinders: number;
    displacement: number;
  };
  performance: {
    max_speed_kmh: number;
    acceleration_0_100_kmh: number;
  };
  kmpl_city: number;
  kmpl_highway: number;
  fuel_type: string;
  transmission: string;
  features: string[];
  specifications: {
    doors: number;
    seats: number;
    trunk_capacity: number;
  };
}

interface SearchFilters {
  make?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  transmission?: string;
  limit?: number;
}

interface CarSearchProps {
  onAddToComparison?: (car: CarData) => void;
  selectedCars?: CarData[];
}

// Serviço de API simulado
const carApiService = {
  async getMakes(): Promise<string[]> {
    const response = await fetch('/api/cars/makes');
    if (!response.ok) throw new Error('Erro ao buscar marcas');
    const result = await response.json();
    return result.data || result;
  },

  async searchCars(filters: SearchFilters): Promise<CarData[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/cars/search?${params}`);
    if (!response.ok) throw new Error('Erro ao buscar carros');
    const result = await response.json();
    return result.data || result;
  },

  async getCarsByMake(make: string, limit: number = 10): Promise<CarData[]> {
    const response = await fetch(`/api/cars/search?make=${make}&limit=${limit}`);
    if (!response.ok) throw new Error('Erro ao buscar carros por marca');
    const result = await response.json();
    return result.data || result;
  }
};

const CarSearch: React.FC<CarSearchProps> = ({ onAddToComparison, selectedCars = [] }) => {
  const [makes, setMakes] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    make: '',
    model: '',
    year: undefined,
    fuel_type: '',
    transmission: '',
    limit: 20
  });

  // Marcas populares para busca rápida
  const popularMakes = [
    { name: 'Toyota', icon: '🚗' },
    { name: 'Honda', icon: '🏎️' },
    { name: 'Volkswagen', icon: '🚙' },
    { name: 'Chevrolet', icon: '🏁' }
  ];

  // Carregar marcas disponíveis
  const loadMakes = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando marcas...');
      const makesData = await carApiService.getMakes();
      console.log('✅ Marcas carregadas:', makesData);
      setMakes(makesData);
    } catch (error) {
      console.error('❌ Erro ao carregar marcas:', error);
      setError('Erro ao carregar marcas. Usando dados locais.');
      setMakes(popularMakes.map(m => m.name));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMakes();
  }, []);

  // Buscar carros com filtros
  const searchCars = async (loadAll = false) => {
    if (!loadAll && !filters.make && !filters.model && !filters.year && !filters.fuel_type && !filters.transmission) {
      setError('Por favor, selecione pelo menos um filtro para buscar.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = loadAll ? { ...filters, limit: 50 } : filters;
      const results = await carApiService.searchCars(searchFilters);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('Nenhum carro encontrado com os filtros selecionados.');
      }
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
      setError('Erro ao buscar carros. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar carros por marca específica
  const searchByMake = async (make: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🚗 Buscando carros da marca: ${make}`);
      const results = await carApiService.getCarsByMake(make, 15);
      console.log(`✅ Carros encontrados para ${make}:`, results);
      setSearchResults(results);
      setFilters(prev => ({ ...prev, make }));
      
      if (results.length === 0) {
        setError(`Nenhum carro encontrado para a marca ${make}.`);
      }
    } catch (error) {
      console.error(`❌ Erro ao buscar carros da marca ${make}:`, error);
      setError(`Erro ao buscar carros da marca ${make}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar filtros
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value === '' ? undefined : value }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      make: '',
      model: '',
      year: undefined,
      fuel_type: '',
      transmission: '',
      limit: 20
    });
    setError(null);
    setSearchResults([]);
  };

  // Verificar se um carro está selecionado
  const isCarSelected = (car: CarData) => {
    return selectedCars.some(selected => {
      if (selected.id && car.id) {
        return selected.id === car.id;
      }
      return selected.make === car.make && 
             selected.model === car.model && 
             selected.year === car.year;
    });
  };

  return (
    <div className="car-search">
      {/* Header da Busca */}
      <div className="search-header">
        <h2 className="search-title">Buscar Veículos</h2>
        <p className="search-subtitle">Encontre o carro ideal para você</p>
      </div>

      {/* Busca Rápida por Marcas Populares */}
      <div className="quick-search">
        <h3>Busca Rápida</h3>
        <div className="popular-brands">
          {popularMakes.map((brand) => (
            <button
              key={brand.name}
              className="brand-button"
              onClick={() => searchByMake(brand.name)}
              disabled={loading}
            >
              <span className="brand-icon">{brand.icon}</span>
              <span className="brand-name">{brand.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtros Avançados */}
      <div className="advanced-filters">
        <h3>Filtros Avançados</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="make">Marca</label>
            <select
              id="make"
              value={filters.make || ''}
              onChange={(e) => handleFilterChange('make', e.target.value)}
            >
              <option value="">Todas as marcas</option>
              {makes.map((make) => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="model">Modelo</label>
            <input
              id="model"
              type="text"
              placeholder="Digite o modelo..."
              value={filters.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="year">Ano</label>
            <select
              id="year"
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">Todos os anos</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="fuel_type">Combustível</label>
            <select
              id="fuel_type"
              value={filters.fuel_type || ''}
              onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
            >
              <option value="">Todos os tipos</option>
              <option value="gas">Gasolina</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Elétrico</option>
              <option value="hybrid">Híbrido</option>
              <option value="flex">Flex</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="transmission">Transmissão</label>
            <select
              id="transmission"
              value={filters.transmission || ''}
              onChange={(e) => handleFilterChange('transmission', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automática</option>
              <option value="cvt">CVT</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => searchCars(false)}
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clearFilters}
            disabled={loading}
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Status/Erro */}
      {error && (
        <div className="status-message error">
          <span className="status-icon">⚠️</span>
          <span className="status-text">{error}</span>
        </div>
      )}

      {loading && (
        <div className="status-message loading">
          <div className="loading-spinner"></div>
          <span className="status-text">Carregando veículos...</span>
        </div>
      )}

      {/* Resultados */}
      {selectedCars.length > 0 ? (
        <div className="results-section">
          <h3 className="results-title">
            Carros Selecionados ({selectedCars.length} veículos)
          </h3>
          <div className="results-grid">
            {selectedCars.map((car, index) => (
              <VehicleCard
                key={`${car.make}-${car.model}-${car.year}-${index}`}
                vehicle={car}
                onAddToComparison={onAddToComparison}
                selected={true}
              />
            ))}
          </div>
        </div>
      ) : !loading && !error && (
        <div className="no-results-message">
          <div className="no-results-icon">🔍</div>
          <h3>Nenhum carro selecionado ainda</h3>
          <p>Use a busca rápida acima ou os filtros avançados para encontrar e selecionar veículos.</p>
          <div className="search-tips">
            <h4>Como usar:</h4>
            <ul>
              <li>🚗 Clique em uma marca popular para ver os modelos disponíveis</li>
              <li>🔧 Use os filtros e clique em "Buscar" para encontrar carros</li>
              <li>✅ Clique nos carros encontrados para selecioná-los</li>
              <li>📊 Compare até 4 carros selecionados</li>
            </ul>
          </div>
        </div>
      )}

      {/* Resultados da Busca (temporários para seleção) */}
      {searchResults.length > 0 && (
        <div className="search-results-section">
          <h3 className="results-title">
            Resultados da Busca ({searchResults.length} veículos encontrados)
          </h3>
          <p className="selection-hint">Clique nos carros abaixo para selecioná-los:</p>
          <div className="results-grid">
            {searchResults.map((car, index) => (
              <VehicleCard
                key={`search-${car.make}-${car.model}-${car.year}-${index}`}
                vehicle={car}
                onAddToComparison={onAddToComparison}
                selected={isCarSelected(car)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarSearch; 