/**
 * MIDDLEWARE DE TRATAMENTO DE ERROS GLOBAL
 * Este middleware que criei captura todos os erros que ocorrem na aplicação
 * e retorna uma resposta JSON padronizada para o cliente
 * 
 * É executado sempre que next(error) é chamado ou quando um erro
 * não tratado ocorre em qualquer rota ou middleware
 */

/**
 * FUNÇÃO DE TRATAMENTO DE ERROS
 * @param {Error} err - Objeto de erro que foi capturado
 * @param {Request} req - Objeto de requisição HTTP
 * @param {Response} res - Objeto de resposta HTTP  
 * @param {Function} next - Função para chamar o próximo middleware
 */
module.exports = (err, req, res, next) => {
  // Faço log do erro no console para debugar
  console.error(err);
  
  // Retorno uma resposta JSON padronizada com:
  // - Status HTTP: uso o status do erro ou 500 como padrão
  // - Message: mensagem do erro ou mensagem padrão
  // - Details: detalhes adicionais do erro (se tiver)
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor',
    details: err.details || null,
  });
}; 