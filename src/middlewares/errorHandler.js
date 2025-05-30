
// src/middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor',
    details: err.details || null,
  });
};