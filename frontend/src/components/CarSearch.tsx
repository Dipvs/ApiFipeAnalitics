import React, { useState, useEffect } from 'react';
import './CarSearch.css';
import VehicleCard from './VehicleCard';
import type { CarData, SearchFilters, CarSearchProps } from '../types/CarData';

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

const CarSearch: React.FC<CarSearchProps> = ({
  onAddToComparison,
  onRemoveFromComparison,
  onCompare,
  selectedCars = [],
}) => {
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
    { name: 'Chevrolet', icon: '🏁' },
    { name: 'Fiat', icon: '🚘' },
    { name: 'Ford', icon: '🚐' },
    { name: 'Hyundai', icon: '🚕' },
    { name: 'Nissan', icon: '🚖' }
  ];

  // Carregar marcas disponíveis
  const loadMakes = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando marcas...');
      const makesData = await carApiService.getMakes();
      console.log('✅ Marcas carregadas:', makesData);
      console.log('📊 Total de marcas:', makesData.length);
      
      // Processar marcas - podem vir como objetos ou strings
      let processedMakes: string[] = [];
      if (makesData && Array.isArray(makesData)) {
        processedMakes = makesData.map((make: any) => {
          // Se for objeto com propriedade name, usar name
          if (typeof make === 'object' && make.name) {
            return make.name;
          }
          // Se for string, usar diretamente
          if (typeof make === 'string') {
            return make;
          }
          // Fallback
          return String(make);
        });
      }
      
      setMakes(processedMakes);
      
      if (processedMakes.length === 0) {
        console.warn('⚠️ Nenhuma marca retornada da API, usando fallback');
        setMakes(popularMakes.map(m => m.name));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar marcas:', error);
      setError('Erro ao carregar marcas. Usando dados locais.');
      // Fallback para todas as marcas conhecidas
      const fallbackMakes = [
        'Toyota', 'Honda', 'Volkswagen', 'Chevrolet', 'Fiat', 'Ford', 
        'Hyundai', 'Nissan', 'Renault', 'Jeep', 'Peugeot', 'Citroën',
        'Mitsubishi', 'Kia', 'Chery', 'Caoa Chery', 'JAC'
      ];
      setMakes(fallbackMakes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMakes();
    // Carregar dados iniciais para mostrar carros imediatamente
    loadInitialData();
  }, []);

  // Carregar dados iniciais para exibir carros populares
  const loadInitialData = async () => {
    try {
      console.log('🚗 Carregando dados iniciais...');
      // Buscar carros populares de marcas conhecidas
      const popularMake = 'Toyota';
      const initialResults = await carApiService.getCarsByMake(popularMake, 8);
      if (initialResults.length > 0) {
        setSearchResults(initialResults);
        console.log(`✅ ${initialResults.length} carros iniciais carregados`);
      }
    } catch (error) {
      console.log('ℹ️ Erro ao carregar dados iniciais - normal na primeira carga');
    }
  };

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
      const selectedMake = selected.brand || selected.make || '';
      const carMake = car.brand || car.make || '';
      return selectedMake === carMake && 
             selected.model === car.model && 
             selected.year === car.year;
    });
  };

  // Funções auxiliares para normalizar dados
  const getMake = (car: CarData) => car.brand || car.make || 'Marca';
  const getPower = (car: CarData) => {
    if (car.performance?.power) return car.performance.power;
    if (car.engine?.power_hp) return car.engine.power_hp;
    return 100;
  };
  const getTorque = (car: CarData) => {
    if (car.performance?.torque) return car.performance.torque;
    if (car.engine?.torque_nm) return car.engine.torque_nm;
    return 200;
  };
  const getCylinders = (car: CarData) => car.engine?.cylinders || 4;
  const getDisplacement = (car: CarData) => car.engine?.displacement || 1.6;
  const getMaxSpeed = (car: CarData) => {
    if (car.performance?.maxSpeed) return car.performance.maxSpeed;
    if (car.performance_old?.max_speed_kmh) return car.performance_old.max_speed_kmh;
    return 180;
  };
  const getAcceleration = (car: CarData) => {
    if (car.performance?.acceleration) return car.performance.acceleration;
    if (car.performance_old?.acceleration_0_100_kmh) return car.performance_old.acceleration_0_100_kmh;
    return 10;
  };
  const getCityConsumption = (car: CarData) => {
    if (car.consumption?.city) return car.consumption.city;
    if (car.kmpl_city) return car.kmpl_city;
    return 12;
  };
  const getHighwayConsumption = (car: CarData) => {
    if (car.consumption?.highway) return car.consumption.highway;
    if (car.kmpl_highway) return car.kmpl_highway;
    return 15;
  };
  const getFuel = (car: CarData) => car.fuel || car.fuel_type || 'Flex';
  const getTransmission = (car: CarData) => car.transmission || 'Manual';
  const getFeatures = (car: CarData) => car.features || [];
  const getDoors = (car: CarData) => car.doors || car.specifications?.doors || 4;
  const getSeats = (car: CarData) => car.seats || car.specifications?.seats || 5;
  const getTrunkCapacity = (car: CarData) => car.specifications?.trunk_capacity || 400;

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

      {/* Status de marcas carregadas (simplificado) */}
      {makes.length > 0 && !loading && (
        <div className="status-message success">
          <span className="status-icon">✅</span>
          <span className="status-text">
            {makes.length} marcas carregadas com sucesso da API FIPE
          </span>
        </div>
      )}

      {/* Filtros Avançados */}
      <div className="advanced-filters">
        <h3>Filtros Avançados</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="make">
              Marca {makes.length > 0 && `(${makes.length} disponíveis)`}
            </label>
            <select
              id="make"
              value={filters.make || ''}
              onChange={(e) => handleFilterChange('make', e.target.value)}
              disabled={loading && makes.length === 0}
            >
              <option value="">
                {loading && makes.length === 0 ? 'Carregando marcas...' : 'Todas as marcas'}
              </option>
              {makes.map((make, index) => (
                <option key={`option-${index}-${make}`} value={make}>{make}</option>
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
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year, index) => (
                <option key={`year-${index}-${year}`} value={year}>{year}</option>
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
          <section className="comparison-section">
            <div className="container">
              <h2>⚖️ Comparação de Veículos ({selectedCars.length}/3)</h2>
              
              {selectedCars.length >= 2 && (
                <div className="compare-button-container">
                  <button className="compare-button" onClick={onCompare}>
                    🏆 COMPARAR E DECIDIR VENCEDOR
                  </button>
                </div>
              )}
              
              <div className="comparison-grid">
                {selectedCars.map((car, index) => (
                  <div key={`comparison-${car.id || index}-${getMake(car)}-${car.model}-${car.year}`} className="comparison-card">
                    <button 
                      className="remove-button"
                      onClick={() => onRemoveFromComparison?.(car.id)}
                    >
                      ✕
                    </button>
                    <h3>{getMake(car)} {car.model} {car.year}</h3>
                    <div className="car-price">R$ {car.price.toLocaleString('pt-BR')}</div>
                    
                    <div className="car-details">
                      <div className="detail-section">
                        <h4>🔧 Motor</h4>
                        <p>Potência: {getPower(car)} HP</p>
                        <p>Torque: {getTorque(car)} Nm</p>
                        <p>Cilindros: {getCylinders(car)}</p>
                        <p>Deslocamento: {getDisplacement(car)}L</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>🏁 Performance</h4>
                        <p>Vel. Máxima: {getMaxSpeed(car)} km/h</p>
                        <p>0-100 km/h: {getAcceleration(car)}s</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>⛽ Consumo</h4>
                        <p>Cidade: {getCityConsumption(car)} km/l</p>
                        <p>Estrada: {getHighwayConsumption(car)} km/l</p>
                        <p>Combustível: {getFuel(car)}</p>
                        <p>Transmissão: {getTransmission(car)}</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>🎯 Características</h4>
                        <ul>
                          {getFeatures(car).slice(0, 3).map((feature, index) => (
                            <li key={`feature-${index}-${feature}`}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="detail-section">
                        <h4>📏 Especificações</h4>
                        <p>Portas: {getDoors(car)}</p>
                        <p>Assentos: {getSeats(car)}</p>
                        <p>Porta-malas: {getTrunkCapacity(car)}L</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
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
                key={`search-result-${car.id || index}-${getMake(car)}-${car.model}-${car.year}`}
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