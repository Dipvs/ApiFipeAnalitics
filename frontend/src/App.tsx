import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CarSearch from './components/CarSearch';

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

interface ComparisonResult {
  winner: CarData;
  scores: {
    [carId: string]: {
      car: CarData;
      score: number;
      breakdown: {
        acceleration: number;
        economy: number;
        year: number;
        value: number;
      };
    };
  };
}

function App() {
  const [selectedCars, setSelectedCars] = useState<CarData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
      });
      
      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
      });
    }
  }, []);

  const handleAddToComparison = (car: CarData) => {
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const handleRemoveFromComparison = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateCarScore = (car: CarData) => {
    // Normalizar valores para pontuação (0-100)
    const accelerationScore = Math.max(0, 100 - (car.performance.acceleration_0_100_kmh * 10)); // Menor tempo = maior pontuação
    const economyScore = Math.min(100, ((car.kmpl_city + car.kmpl_highway) / 2) * 5); // Maior consumo = maior pontuação
    const yearScore = Math.min(100, ((car.year - 2000) / 24) * 100); // Carros mais novos = maior pontuação
    const valueScore = Math.max(0, 100 - (car.price / 1000)); // Menor preço = maior pontuação (ajustado)

    const totalScore = (accelerationScore * 0.3) + (economyScore * 0.25) + (yearScore * 0.25) + (valueScore * 0.2);

    return {
      score: totalScore,
      breakdown: {
        acceleration: accelerationScore,
        economy: economyScore,
        year: yearScore,
        value: valueScore
      }
    };
  };

  const compareCarss = () => {
    if (selectedCars.length < 2) return;

    const scores: ComparisonResult['scores'] = {};
    let winner = selectedCars[0];
    let highestScore = 0;

    selectedCars.forEach(car => {
      const carScore = calculateCarScore(car);
      scores[car.id] = {
        car,
        ...carScore
      };

      if (carScore.score > highestScore) {
        highestScore = carScore.score;
        winner = car;
      }
    });

    const result: ComparisonResult = {
      winner,
      scores
    };

    setComparisonResult(result);
    setShowWinnerScreen(true);

    // Fechar a tela após 8 segundos
    setTimeout(() => {
      setShowWinnerScreen(false);
    }, 8000);
  };

  const getCarImageUrl = (car: CarData) => {
    // URLs de imagens de carros (placeholder - você pode substituir por URLs reais)
    const carImages: { [key: string]: string } = {
      'toyota-corolla': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
      'toyota-hilux': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
      'honda-civic': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      'volkswagen-golf': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'chevrolet-onix': 'https://images.unsplash.com/photo-1494976688153-ca3ce29d8df4?w=800&h=600&fit=crop',
      'ford-ka': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    };

    const key = `${car.make.toLowerCase()}-${car.model.toLowerCase()}`;
    return carImages[key] || 'https://images.unsplash.com/photo-1494976688153-ca3ce29d8df4?w=800&h=600&fit=crop';
  };

  return (
    <div className="App">
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        className="background-video"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
      >
        <source src="https://res.cloudinary.com/dzwfuzxxw/video/upload/v1748481369/5ENNA_Honda_NSX___4K_dx4xgn.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay do vídeo */}
      <div className="video-overlay"></div>

      {/* Menu hambúrguer - apenas as barrinhas */}
      <div className="hero-hamburger-lines" onClick={toggleMenu}>
        <div className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></div>
      </div>

      {/* Menu dropdown que desce de cima */}
      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="dropdown-content">
          <div className="menu-left">
            <div className="giant-clock">
              {formatTime(currentTime)}
            </div>
          </div>
          <div className="menu-right">
            <nav className="menu-nav">
              <button className="menu-button" onClick={() => setIsMenuOpen(false)}>
                Início
              </button>
              <button className="menu-button" onClick={() => setIsMenuOpen(false)}>
                Comparar
              </button>
              <button className="menu-button" onClick={() => setIsMenuOpen(false)}>
                Buscar
              </button>
              <button className="menu-button" onClick={() => setIsMenuOpen(false)}>
                Estatísticas
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Seção Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Comparate</h1>
          <p className="hero-subtitle">Compare veículos com dados brasileiros completos</p>
        </div>
      </section>

      {/* Tela de resultado estilo Forza */}
      {showWinnerScreen && comparisonResult && (
        <div className="winner-screen">
          <div className="winner-content">
            <div className="winner-left">
              <img 
                src={getCarImageUrl(comparisonResult.winner)} 
                alt={`${comparisonResult.winner.make} ${comparisonResult.winner.model}`}
                className="winner-car-image"
              />
            </div>
            <div className="winner-right">
              <div className="winner-title-container">
                <h1 className="winner-title">
                  {comparisonResult.winner.make} {comparisonResult.winner.model}
                </h1>
                <h1 className="winner-title">
                  {comparisonResult.winner.make} {comparisonResult.winner.model}
                </h1>
                <h1 className="winner-title">
                  {comparisonResult.winner.make} {comparisonResult.winner.model}
                </h1>
              </div>
              
              <div className="winner-stats">
                <div className="winner-stat">
                  <span className="stat-label">POTÊNCIA</span>
                  <span className="stat-value">{comparisonResult.winner.engine.power_hp} HP</span>
                </div>
                <div className="winner-stat">
                  <span className="stat-label">0-100 KM/H</span>
                  <span className="stat-value">{comparisonResult.winner.performance.acceleration_0_100_kmh}s</span>
                </div>
                <div className="winner-stat">
                  <span className="stat-label">CONSUMO</span>
                  <span className="stat-value">{comparisonResult.winner.kmpl_city} km/l</span>
                </div>
                <div className="winner-stat">
                  <span className="stat-label">ANO</span>
                  <span className="stat-value">{comparisonResult.winner.year}</span>
                </div>
                <div className="winner-stat">
                  <span className="stat-label">PREÇO</span>
                  <span className="stat-value">R$ {comparisonResult.winner.price.toLocaleString('pt-BR')}</span>
                </div>
              </div>
              
              <div className="winner-score">
                <span className="score-label">PONTUAÇÃO FINAL</span>
                <span className="score-value">
                  {comparisonResult.scores[comparisonResult.winner.id].score.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="main-content">
        {/* Seção de busca */}
        <section className="search-section">
          <div className="container">
            <h2>🔍 Buscar Veículos</h2>
            <CarSearch
              onAddToComparison={handleAddToComparison}
              onRemoveFromComparison={handleRemoveFromComparison}
              onCompare={compareCarss}
              selectedCars={selectedCars}
            />
          </div>
        </section>

        {/* Seção de comparação */}
        {selectedCars.length > 0 && (
          <section className="comparison-section"> ... </section>
        )}

        {/* Seção de estatísticas */}
        <section className="stats-section">
          <div className="container">
            <h2>📊 Estatísticas do Sistema</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">32+</div>
                <div className="stat-label">Modelos Disponíveis</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">9</div>
                <div className="stat-label">Marcas Principais</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Dados Brasileiros</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{selectedCars.length}</div>
                <div className="stat-label">Carros Selecionados</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Comparate - Sistema de Análise Automotiva</p>
          <p>Dados brasileiros completos e atualizados</p>
        </div>
      </footer>
    </div>
  );
}

export default App;