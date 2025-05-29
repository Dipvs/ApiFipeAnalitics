export default function TestComponent() {
  return (
    <div style={{
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      margin: '2rem auto',
      maxWidth: '600px'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '1rem'
      }}>
        🎉 FIPE Analytics
      </h1>
      
      <p style={{
        fontSize: '1.25rem',
        color: '#4b5563',
        marginBottom: '2rem'
      }}>
        Frontend funcionando perfeitamente!
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: '#eff6ff',
          borderRadius: '0.5rem',
          border: '2px solid #3b82f6'
        }}>
          <h3 style={{ color: '#2563eb', fontWeight: '600' }}>✅ React</h3>
          <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Funcionando</p>
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '0.5rem',
          border: '2px solid #10b981'
        }}>
          <h3 style={{ color: '#059669', fontWeight: '600' }}>✅ CSS</h3>
          <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Carregado</p>
        </div>
        
        <div style={{
          padding: '1rem',
          backgroundColor: '#fefce8',
          borderRadius: '0.5rem',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ color: '#d97706', fontWeight: '600' }}>✅ Vite</h3>
          <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Ativo</p>
        </div>
      </div>
      
      <button 
        onClick={() => alert('Botão funcionando!')}
        style={{
          background: 'linear-gradient(to right, #2563eb, #3b82f6)',
          color: 'white',
          fontWeight: '600',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Testar Interatividade
      </button>
      
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <p>🌐 Frontend: <strong>http://localhost:5173</strong></p>
        <p>🔧 Backend: <strong>http://localhost:3000</strong></p>
        <p>📚 Docs: <strong>http://localhost:3000/api-docs</strong></p>
      </div>
    </div>
  );
} 