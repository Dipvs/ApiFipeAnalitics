// src/repositories/searchRepository.js
const fipeRepository = require('./fipeRepository');

module.exports = {
  searchByName: async (name) => {
    // Implementação simplificada - na prática você precisaria de um sistema de busca mais robusto
    const types = ['carros', 'motos', 'caminhões'];
    const results = [];
    
    for (const type of types) {
      const brands = await fipeRepository.fetchBrands(type);
      for (const brand of brands) {
        const models = await fipeRepository.fetchModels(type, brand.codigo);
        for (const model of models) {
          if (model.nome.toLowerCase().includes(name.toLowerCase())) {
            results.push({
              type,
              brand: brand.nome,
              model: model.nome,
              brandCode: brand.codigo,
              modelCode: model.codigo
            });
          }
        }
      }
    }
    
    return results;
  }
};