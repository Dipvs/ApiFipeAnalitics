// src/repositories/comparisonRepository.js
const comparisons = [];

module.exports = {
  saveComparison: (comparison) => {
    comparisons.push(comparison);
    return comparison;
  },

  getStats: () => {
    const stats = {
      totalComparisons: comparisons.length,
      mostComparedBrands: {},
      lastCompared: comparisons.slice(-5).reverse()
    };
    
    comparisons.forEach(comp => {
      if (comp.vehicle1 && comp.vehicle2) {
        [comp.vehicle1, comp.vehicle2].forEach(v => {
          stats.mostComparedBrands[v.Marca] = (stats.mostComparedBrands[v.Marca] || 0) + 1;
        });
      } else if (comp.vehicles) {
        comp.vehicles.forEach(v => {
          stats.mostComparedBrands[v.Marca] = (stats.mostComparedBrands[v.Marca] || 0) + 1;
        });
      }
    });
    
    return stats;
  },

  getHistory: () => [...comparisons].reverse()
};