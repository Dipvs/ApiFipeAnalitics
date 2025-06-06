import React, { useState } from 'react';
import './VehicleCard.css';
import type { CarData, VehicleCardProps } from '../types/CarData';

const VehicleCard: React.FC<VehicleCardProps> = ({ 
  vehicle, 
  onAddToComparison, 
  selected = false 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Funções para normalizar dados do FIPE
  const getMake = () => vehicle.brand || vehicle.make || 'Marca';
  const getModel = () => vehicle.model || 'Modelo';
  const getYear = () => vehicle.year || 2024;
  const getPrice = () => {
    // Priorizar priceNumber (valor numérico da FIPE) se disponível
    if (vehicle.priceNumber) return vehicle.priceNumber;
    if (vehicle.price && typeof vehicle.price === 'number') return vehicle.price;
    if (vehicle.price && typeof vehicle.price === 'string') {
      // Tentar extrair número do preço formatado
      const numericPrice = parseFloat(vehicle.price.replace(/[R$\s.]/g, '').replace(',', '.'));
      if (!isNaN(numericPrice)) return numericPrice;
    }
    return 0;
  };
  const getFuel = () => vehicle.fuel || vehicle.fuel_type || 'flex';
  const getTransmission = () => vehicle.transmission || 'manual';
  const getFeatures = () => vehicle.features || [];
  
  // Performance normalizada
  const getPower = () => {
    if (vehicle.performance?.power) return vehicle.performance.power;
    if (vehicle.engine?.power_hp) return vehicle.engine.power_hp;
    return 100;
  };
  
  const getAcceleration = () => {
    if (vehicle.performance?.acceleration) return parseFloat(vehicle.performance.acceleration);
    if (vehicle.performance_old?.acceleration_0_100_kmh) return vehicle.performance_old.acceleration_0_100_kmh;
    return 10.0;
  };
  
  const getMaxSpeed = () => {
    if (vehicle.performance?.maxSpeed) return vehicle.performance.maxSpeed;
    if (vehicle.performance_old?.max_speed_kmh) return vehicle.performance_old.max_speed_kmh;
    return 180;
  };
  
  const getCityConsumption = () => {
    if (vehicle.consumption?.city) return vehicle.consumption.city;
    if (vehicle.kmpl_city) return vehicle.kmpl_city;
    return 12;
  };
  
  const getHighwayConsumption = () => {
    if (vehicle.consumption?.highway) return vehicle.consumption.highway;
    if (vehicle.kmpl_highway) return vehicle.kmpl_highway;
    return 15;
  };

  const formatFuelType = (fuelType: string) => {
    const fuelMap: { [key: string]: string } = {
      'gas': 'Gasolina',
      'gasoline': 'Gasolina',
      'diesel': 'Diesel',
      'electric': 'Elétrico',
      'hybrid': 'Híbrido',
      'flex': 'Flex',
      'ethanol': 'Etanol'
    };
    return fuelMap[fuelType.toLowerCase()] || fuelType;
  };

  const formatTransmission = (transmission: string) => {
    const transMap: { [key: string]: string } = {
      'automatic': 'Automático',
      'manual': 'Manual',
      'cvt': 'CVT'
    };
    return transMap[transmission.toLowerCase()] || transmission;
  };

  const getCarImageUrl = () => {
    // Se tem imagem do FIPE, usar ela
    if (vehicle.image) return vehicle.image;
    
    // URLs de imagens reais dos carros baseadas na marca e modelo
    const carImages: { [key: string]: string } = {
      // Toyota
      'toyota corolla': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=300&fit=crop&crop=center',
      'toyota hilux': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      'toyota camry': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&h=300&fit=crop&crop=center',
      'toyota rav4': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      'toyota prius': 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=300&fit=crop&crop=center',
      
      // Honda
      'honda civic': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'honda accord': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop&crop=center',
      'honda cr-v': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      'honda fit': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center',
      
      // Chevrolet
      'chevrolet onix': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'chevrolet cruze': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center',
      'chevrolet spin': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      'chevrolet tracker': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      
      // Volkswagen
      'volkswagen gol': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'volkswagen polo': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center',
      'volkswagen jetta': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'volkswagen tiguan': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      
      // Ford
      'ford ka': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'ford focus': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center',
      'ford fusion': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'ford ecosport': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      
      // Hyundai
      'hyundai hb20': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'hyundai elantra': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'hyundai tucson': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      'hyundai creta': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      
      // Nissan
      'nissan march': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'nissan sentra': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'nissan kicks': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      'nissan frontier': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      
      // Fiat
      'fiat uno': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'fiat argo': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center',
      'fiat cronos': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'fiat toro': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      
      // Renault
      'renault kwid': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop&crop=center',
      'renault sandero': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center',
      'renault logan': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop&crop=center',
      'renault duster': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      
      // Jeep
      'jeep renegade': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center',
      'jeep compass': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&h=300&fit=crop&crop=center',
      'jeep wrangler': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&crop=center',
      'jeep grand cherokee': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop&crop=center'
    };

    const carKey = `${getMake().toLowerCase()} ${getModel().toLowerCase()}`;
    return carImages[carKey] || `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop&crop=center&q=80`;
  };

  const getImageAlt = () => {
    return `${getMake()} ${getModel()} ${getYear()}`;
  };

  const formatPrice = () => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(getPrice());
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleAddToComparison = () => {
    if (onAddToComparison) {
      onAddToComparison(vehicle);
    }
  };

  const getFuelIcon = (fuelType: string) => {
    const icons: { [key: string]: string } = {
      'gas': '⛽',
      'gasoline': '⛽',
      'diesel': '🛢️',
      'electric': '🔋',
      'hybrid': '🔋⛽',
      'flex': '🌱',
      'ethanol': '🌽'
    };
    return icons[fuelType.toLowerCase()] || '⛽';
  };

  const getTransmissionIcon = (transmission: string) => {
    const icons: { [key: string]: string } = {
      'automatic': '🔄',
      'manual': '⚙️',
      'cvt': '🔄'
    };
    return icons[transmission.toLowerCase()] || '⚙️';
  };

  return (
    <div className={`modern-vehicle-card ${selected ? 'selected' : ''}`}>
      {/* Badge de seleção */}
      {selected && (
        <div className="selection-badge">
          <span className="check-icon">✓</span>
        </div>
      )}

      {/* Imagem do Carro */}
      <div className="modern-car-image-container">
        {imageLoading && !imageError && (
          <div className="modern-image-loading">
            <div className="modern-loading-spinner"></div>
            <span className="loading-text">Carregando...</span>
          </div>
        )}
        {imageError ? (
          <div className="modern-image-error">
            <div className="error-icon">🚗</div>
            <div className="error-text">Imagem não disponível</div>
          </div>
        ) : (
          <img
            src={getCarImageUrl()}
            alt={getImageAlt()}
            className="modern-car-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageLoading ? 'none' : 'block' }}
          />
        )}
        
        {/* Overlay com ano */}
        <div className="image-overlay">
          <span className="car-year-badge">{getYear()}</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="modern-card-content">
        {/* Header com título e preço */}
        <div className="modern-card-header">
          <div className="car-title-section">
            <h3 className="modern-car-title">{getMake()}</h3>
            <p className="modern-car-model">{getModel()}</p>
          </div>
          <div className="modern-price-section">
            <span className="modern-price">{formatPrice()}</span>
          </div>
        </div>

        {/* Especificações principais */}
        <div className="modern-specs-grid">
          <div className="modern-spec-item">
            <span className="spec-icon">🏎️</span>
            <div className="spec-info">
              <span className="spec-label">Potência</span>
              <span className="spec-value">{getPower()} HP</span>
            </div>
          </div>
          
          <div className="modern-spec-item">
            <span className="spec-icon">{getFuelIcon(getFuel())}</span>
            <div className="spec-info">
              <span className="spec-label">Combustível</span>
              <span className="spec-value">{formatFuelType(getFuel())}</span>
            </div>
          </div>
          
          <div className="modern-spec-item">
            <span className="spec-icon">{getTransmissionIcon(getTransmission())}</span>
            <div className="spec-info">
              <span className="spec-label">Câmbio</span>
              <span className="spec-value">{formatTransmission(getTransmission())}</span>
            </div>
          </div>
          
          <div className="modern-spec-item">
            <span className="spec-icon">📊</span>
            <div className="spec-info">
              <span className="spec-label">Consumo</span>
              <span className="spec-value">{getCityConsumption()} km/l</span>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="modern-performance">
          <div className="performance-item">
            <span className="perf-icon">🏁</span>
            <span className="perf-label">Vel. Máx:</span>
            <span className="perf-value">{getMaxSpeed()} km/h</span>
          </div>
          <div className="performance-item">
            <span className="perf-icon">⚡</span>
            <span className="perf-label">0-100:</span>
            <span className="perf-value">{getAcceleration()}s</span>
          </div>
        </div>

        {/* Características destacadas */}
        {getFeatures().length > 0 && (
          <div className="modern-features">
            <h4 className="features-title">✨ Destaques</h4>
            <div className="features-tags">
              {getFeatures().slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          </div>
        )}

        {/* Botão de ação */}
        <div className="modern-card-actions">
          <button 
            className={`modern-comparison-btn ${selected ? 'selected' : ''}`}
            onClick={handleAddToComparison}
            disabled={selected}
          >
            <span className="btn-icon">
              {selected ? '✓' : '+'}
            </span>
            <span className="btn-text">
              {selected ? 'Selecionado para Comparação' : 'Adicionar à Comparação'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard; 