import React, { useState, useEffect } from 'react';

const TestConnection: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('Testando...');
  const [searchStatus, setSearchStatus] = useState<string>('Aguardando...');
  const [filtersStatus, setFiltersStatus] = useState<string>('Aguardando...');

  useEffect(() => {
    testHealth();
  }, []);

  const testHealth = async () => {
    try {
      console.log('Testando health check...');
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      setHealthStatus(`✅ Sucesso! Status: ${response.status}, Data: ${JSON.stringify(data)}`);
      console.log('Health check sucesso:', data);
    } catch (error) {
      const errorMsg = `❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      setHealthStatus(errorMsg);
      console.error('Health check erro:', error);
    }
  };

  const testSearch = async () => {
    setSearchStatus('Testando...');
    try {
      console.log('Testando busca...');
      const response = await fetch('http://localhost:3000/api/search?name=honda');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSearchStatus(`✅ Sucesso! Encontrados: ${data.data.length} veículos`);
      console.log('Busca sucesso:', data);
    } catch (error) {
      const errorMsg = `❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      setSearchStatus(errorMsg);
      console.error('Busca erro:', error);
    }
  };

  const testFilters = async () => {
    setFiltersStatus('Testando...');
    try {
      console.log('Testando filtros...');
      const response = await fetch('http://localhost:3000/api/search/filters');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFiltersStatus(`✅ Sucesso! Tipos: ${data.tipos.length}, Marcas: ${data.marcas.length}`);
      console.log('Filtros sucesso:', data);
    } catch (error) {
      const errorMsg = `❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      setFiltersStatus(errorMsg);
      console.error('Filtros erro:', error);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: '#1a1a1a', 
      color: '#fff', 
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#ff0000' }}>🏎️ FIPE Analytics - Teste de Conexão React</h1>
      
      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        margin: '20px 0', 
        borderRadius: '8px',
        border: '1px solid #ff0000'
      }}>
        <h2>Health Check</h2>
        <p>{healthStatus}</p>
        <button 
          onClick={testHealth}
          style={{
            background: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Testar Novamente
        </button>
      </div>

      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        margin: '20px 0', 
        borderRadius: '8px',
        border: '1px solid #ff0000'
      }}>
        <h2>Busca de Veículos</h2>
        <p>{searchStatus}</p>
        <button 
          onClick={testSearch}
          style={{
            background: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Buscar Honda
        </button>
      </div>

      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        margin: '20px 0', 
        borderRadius: '8px',
        border: '1px solid #ff0000'
      }}>
        <h2>Filtros</h2>
        <p>{filtersStatus}</p>
        <button 
          onClick={testFilters}
          style={{
            background: '#ff0000',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Carregar Filtros
        </button>
      </div>
    </div>
  );
};

export default TestConnection; 