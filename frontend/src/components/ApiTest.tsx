import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ApiTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('http://localhost:3000/health');
        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage(`API conectada! Status: ${data.status}`);
        } else {
          setStatus('error');
          setMessage(`Erro HTTP: ${response.status}`);
        }
      } catch (error) {
        setStatus('error');
        setMessage(`Erro de conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    };

    testApi();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border max-w-sm">
      <div className="flex items-center gap-3">
        {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
        {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
        {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
        
        <div>
          <p className="font-medium text-sm">
            {status === 'loading' && 'Testando API...'}
            {status === 'success' && 'API Conectada'}
            {status === 'error' && 'Erro na API'}
          </p>
          <p className="text-xs text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
} 