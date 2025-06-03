/**
 * SERVIDOR PRINCIPAL DA APLICAÇÃO
 * Este arquivo é onde inicializo o servidor HTTP
 * e faço a aplicação ficar disponível na porta configurada
 */

// Importo a aplicação Express que configurei no app.js
const app = require('./app');

// Defino a porta do servidor
// Se tiver uma variável de ambiente PORT, uso ela, senão uso a porta 3000
const PORT = process.env.PORT || 3000;

/**
 * INICIALIZAÇÃO DO SERVIDOR
 * Aqui faço o servidor "escutar" na porta que defini
 * Quando estiver pronto, mostro uma mensagem no console
 */
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});