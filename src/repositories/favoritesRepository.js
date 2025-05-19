// src/repositories/favoritesRepository.js
const favorites = [];

module.exports = {
  addFavorite: (vehicle) => {
    const favorite = { id: Date.now().toString(), ...vehicle, addedAt: new Date() };
    favorites.push(favorite);
    return favorite;
  },

  getFavorites: () => [...favorites],

  deleteFavorite: (id) => {
    const index = favorites.findIndex(f => f.id === id);
    if (index !== -1) {
      return favorites.splice(index, 1)[0];
    }
    return null;
  }
};