/**
 * COMPONENTE PRINCIPAL DA APLICAÇÃO REACT
 * Este é o componente App que contém toda a lógica principal do frontend
 * Aqui implementei: interface de busca, comparação de carros, animações e estado global
 */

import React, { useState, useEffect, useRef } from 'react'; // Hooks do React
import './App.css';                    // Estilos CSS da aplicação
import CarSearch from './components/CarSearch'; // Componente de busca de carros

/**
 * INTERFACE PARA DADOS DO CARRO
 * Defino a estrutura dos dados de cada veículo
 * Inclui informações técnicas, performance e especificações
 */
interface CarData {
  id: string;           // Identificador único do carro
  make: string;         // Marca (Toyota, Honda, etc.)
  model: string;        // Modelo (Corolla, Civic, etc.)
  year: number;         // Ano de fabricação
  price: number;        // Preço em reais
  engine: {            // Dados do motor
    type: string;           // Tipo do motor (V6, I4, etc.)
    power_hp: number;       // Potência em cavalos
    torque_nm: number;      // Torque em Newton-metros
    cylinders: number;      // Número de cilindros
    displacement: number;   // Cilindrada em litros
  };
  performance: {       // Dados de performance
    max_speed_kmh: number;          // Velocidade máxima
    acceleration_0_100_kmh: number; // Aceleração 0-100 km/h
  };
  kmpl_city: number;      // Consumo na cidade (km/l)
  kmpl_highway: number;   // Consumo na estrada (km/l)
  fuel_type: string;      // Tipo de combustível
  transmission: string;   // Tipo de transmissão
  features: string[];     // Lista de características
  specifications: {       // Especificações físicas
    doors: number;           // Número de portas
    seats: number;           // Número de assentos
    trunk_capacity: number;  // Capacidade do porta-malas
  };
}

/**
 * INTERFACE PARA RESULTADO DA COMPARAÇÃO
 * Defino a estrutura do resultado quando carros são comparados
 */
interface ComparisonResult {
  winner: CarData;    // Carro vencedor da comparação
  scores: {          // Pontuações detalhadas de cada carro
    [carId: string]: {
      car: CarData;         // Dados do carro
      score: number;        // Pontuação total (0-100)
      breakdown: {          // Breakdown da pontuação
        acceleration: number;  // Pontos por aceleração
        economy: number;       // Pontos por economia
        year: number;          // Pontos por ano
        value: number;         // Pontos por custo-benefício
      };
    };
  };
}

/**
 * COMPONENTE PRINCIPAL APP
 * Gerencio todo o estado da aplicação e renderizo a interface
 */
function App() {
  // ESTADOS DA APLICAÇÃO (REACT HOOKS)
  
  // Lista de carros selecionados para comparação (máximo 3)
  const [selectedCars, setSelectedCars] = useState<CarData[]>([]);
  
  // Horário atual para o relógio gigante no menu
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Estado do menu hambúrguer (aberto/fechado)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Controlo se a tela de resultado está visível
  const [showWinnerScreen, setShowWinnerScreen] = useState(false);
  
  // Armazeno o resultado da comparação de carros
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  
  // Referência para o elemento de vídeo de fundo
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * EFFECT PARA ATUALIZAR O RELÓGIO
   * Atualizo o horário a cada segundo para o relógio gigante
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup: limpo o timer quando o componente for desmontado
    return () => clearInterval(timer);
  }, []);

  /**
   * EFFECT PARA GERENCIAR O VÍDEO DE FUNDO
   * Configuro event listeners para o vídeo do Honda NSX
   */
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Listener para quando o vídeo carrega
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
      });
      
      // Listener para erros no vídeo
      video.addEventListener('error', (e) => {
        console.error('Video error:', e);
      });
    }
  }, []);

  /**
   * FUNÇÃO PARA ADICIONAR CARRO À COMPARAÇÃO
   * Adiciono um carro à lista de comparação (máximo 3 carros)
   * @param car - Dados do carro a ser adicionado
   */
  const handleAddToComparison = (car: CarData) => {
    // Verifico se não excede o limite e se o carro não está já selecionado
    if (selectedCars.length < 3 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  /**
   * FUNÇÃO PARA REMOVER CARRO DA COMPARAÇÃO
   * Removo um carro específico da lista de comparação
   * @param carId - ID do carro a ser removido
   */
  const handleRemoveFromComparison = (carId: string) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  /**
   * FUNÇÃO PARA ALTERNAR O MENU
   * Abro/fecho o menu hambúrguer
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * FUNÇÃO PARA FORMATAR O HORÁRIO
   * Converto o objeto Date em string formatada para o Brasil
   * @param date - Objeto Date a ser formatado
   * @returns String formatada (HH:MM:SS)
   */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  /**
   * ALGORITMO DE PONTUAÇÃO DE CARROS
   * Calculo a pontuação de um carro baseado em critérios ponderados:
   * - Aceleração (30%): Menor tempo = maior pontuação
   * - Economia (25%): Maior consumo = maior pontuação  
   * - Ano (25%): Carros mais novos = maior pontuação
   * - Custo-benefício (20%): Menor preço = maior pontuação
   * 
   * @param car - Dados do carro a ser avaliado
   * @returns Objeto com pontuação total e breakdown detalhado
   */
  const calculateCarScore = (car: CarData) => {
    // Normalizo valores para pontuação (0-100)
    const accelerationScore = Math.max(0, 100 - (car.performance.acceleration_0_100_kmh * 10)); // Menor tempo = maior pontuação
    const economyScore = Math.min(100, ((car.kmpl_city + car.kmpl_highway) / 2) * 5); // Maior consumo = maior pontuação
    const yearScore = Math.min(100, ((car.year - 2000) / 24) * 100); // Carros mais novos = maior pontuação
    const valueScore = Math.max(0, 100 - (car.price / 1000)); // Menor preço = maior pontuação (ajustado)

    // Cálculo da pontuação total com pesos
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

  /**
   * FUNÇÃO PRINCIPAL DE COMPARAÇÃO
   * Comparo todos os carros selecionados e determino o vencedor
   * Calculo pontuações, defino o vencedor e exibo a tela de resultado
   */
  const compareCarss = () => {
    if (selectedCars.length < 2) return; // Preciso de pelo menos 2 carros

    const scores: ComparisonResult['scores'] = {};
    let winner = selectedCars[0];  // Vencedor inicial
    let highestScore = 0;          // Maior pontuação encontrada

    // Calculo a pontuação de cada carro selecionado
    selectedCars.forEach(car => {
      const carScore = calculateCarScore(car);
      scores[car.id] = {
        car,
        ...carScore
      };

      // Verifico se este carro tem a maior pontuação
      if (carScore.score > highestScore) {
        highestScore = carScore.score;
        winner = car;
      }
    });

    // Monto o resultado final da comparação
    const result: ComparisonResult = {
      winner,
      scores
    };

    setComparisonResult(result);
    setShowWinnerScreen(true);

    // Fecho a tela de resultado automaticamente após 8 segundos
    setTimeout(() => {
      setShowWinnerScreen(false);
    }, 8000);
  };

  /**
   * FUNÇÃO PARA OBTER URL DA IMAGEM DO CARRO
   * Retorno a URL da imagem baseada na marca e modelo
   * @param car - Dados do carro
   * @returns URL da imagem do carro
   */
  const getCarImageUrl = (car: CarData) => {
    // Mapeamento de imagens por marca-modelo (usando Unsplash para placeholder)
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

  // RENDERIZAÇÃO DA INTERFACE (JSX)
  return (
    <div className="App">
      {/* VÍDEO DE FUNDO */}
      {/* Vídeo Honda NSX 4K em loop como fundo da aplicação */}
      <video
        ref={videoRef}
        className="background-video"
        muted          // Sem som
        loop           // Reprodução em loop
        autoPlay       // Inicia automaticamente
        playsInline    // Reproduz inline em dispositivos móveis
        preload="auto" // Pré-carrega o vídeo
      >
        <source src="https://res.cloudinary.com/dzwfuzxxw/video/upload/v1748481369/5ENNA_Honda_NSX___4K_dx4xgn.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay escuro sobre o vídeo para melhor legibilidade do texto */}
      <div className="video-overlay"></div>

      {/* MENU HAMBÚRGUER */}
      {/* Ícone de 3 linhas no canto superior direito */}
      <div className="hero-hamburger-lines" onClick={toggleMenu}>
        <div className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></div>
        <div className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></div>
      </div>

      {/* MENU DROPDOWN */}
      {/* Menu que desce do topo quando o hambúrguer é clicado */}
      <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="dropdown-content">
          <div className="menu-left">
            {/* Relógio gigante animado mostrando horário em tempo real */}
            <div className="giant-clock">
              {formatTime(currentTime)}</div>
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
                Estatísticas
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* SEÇÃO HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Comparate</h1>
          <p className="hero-subtitle">Compare veículos com dados brasileiros completos</p>
        </div>
      </section>

      {/* TELA DE RESULTADO ESTILO FORZA */}
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

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content">
        {/* SEÇÃO DE BUSCA */}
        <section className="search-section">
          <div className="container">
            <CarSearch onAddToComparison={handleAddToComparison} />
          </div>
        </section>

        {/* SEÇÃO DE COMPARAÇÃO */}
        {selectedCars.length > 0 && (
          <section className="comparison-section">
            <div className="container">
              <h2>Comparação de Veículos ({selectedCars.length}/3)</h2>
              
              {selectedCars.length >= 2 && (
                <div className="compare-button-container">
                  <button className="compare-button" onClick={compareCarss}>
                    COMPARAR E DECIDIR VENCEDOR
                  </button>
                </div>
              )}
              
              <div className="comparison-grid">
                {selectedCars.map((car) => (
                  <div key={car.id} className="comparison-card">
                    <button 
                      className="remove-button"
                      onClick={() => handleRemoveFromComparison(car.id)}
                    >
                      ✕
                    </button>
                    <h3>{car.make} {car.model} {car.year}</h3>
                    <div className="car-price">R$ {car.price.toLocaleString('pt-BR')}</div>
                    
                    <div className="car-details">
                      <div className="detail-section">
                        <h4>Motor</h4>
                        <p>Potência: {car.engine.power_hp} HP</p>
                        <p>Torque: {car.engine.torque_nm} Nm</p>
                        <p>Cilindros: {car.engine.cylinders}</p>
                        <p>Deslocamento: {car.engine.displacement}L</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Performance</h4>
                        <p>Vel. Máxima: {car.performance.max_speed_kmh} km/h</p>
                        <p>0-100 km/h: {car.performance.acceleration_0_100_kmh}s</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Consumo</h4>
                        <p>Cidade: {car.kmpl_city} km/l</p>
                        <p>Estrada: {car.kmpl_highway} km/l</p>
                        <p>Combustível: {car.fuel_type}</p>
                        <p>Transmissão: {car.transmission}</p>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Características</h4>
                        <ul>
                          {car.features.slice(0, 3).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="detail-section">
                        <h4>Especificações</h4>
                        <p>Portas: {car.specifications.doors}</p>
                        <p>Assentos: {car.specifications.seats}</p>
                        <p>Porta-malas: {car.specifications.trunk_capacity}L</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEÇÃO DE ESTATÍSTICAS */}
        <section className="stats-section">
          <div className="container">
            <h2>Estatísticas do Sistema</h2>
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

      {/* FOOTER */}
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