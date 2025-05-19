// src/controllers/vehicleController.js
const vehicleService = require('../services/vehicleService');
const CompareRequestDTO = require('../dtos/compareRequestDTO');
const axios = require('axios');

module.exports = {
  async getBrands(req, res, next) {
    try {
      const data = await vehicleService.getBrands(req.params.type);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getModels(req, res, next) {
    try {
      const data = await vehicleService.getModels(req.params);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getYears(req, res, next) {
    try {
      const data = await vehicleService.getYears(req.params);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getVehicle(req, res, next) {
    try {
      const data = await vehicleService.getVehicle(req.params);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

async compareVehicles(req, res, next) {
  try {
    const dto = new CompareRequestDTO(req.body.vehicle1, req.body.vehicle2);
    dto.validate(); 
    const data = await vehicleService.compareVehicles(dto);
    res.json(data);
  } catch (err) {
    next(err);
  }
},

  async compareMultipleVehicles(req, res, next) {
    try {
      const data = await vehicleService.compareMultipleVehicles(req.body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async addFavorite(req, res, next) {
    try {
      const data = await vehicleService.addFavorite(req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  },

  async getFavorites(req, res, next) {
    try {
      const data = await vehicleService.getFavorites();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async deleteFavorite(req, res, next) {
    try {
      const data = await vehicleService.deleteFavorite(req.params.id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getComparisonStats(req, res, next) {
    try {
      const data = await vehicleService.getComparisonStats();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getPopularVehicles(req, res, next) {
    try {
      const data = await vehicleService.getPopularVehicles();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

async searchByPriceRange(req, res, next) {
  try {
    const { type } = req.params;
    const result = await vehicleService.searchByPriceRange({ ...req.body, type });
    res.json(result);
  } catch (err) {
    next(err);
  }
},


  async searchVehicleByName(req, res, next) {
    try {
      const data = await vehicleService.searchVehicleByName(req.query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const data = await vehicleService.getHistory();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async exportComparison(req, res, next) {
    try {
      const jsonData = await vehicleService.compareVehicles(req.body);
      res.setHeader('Content-Disposition', 'attachment; filename=comparacao.json');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(jsonData, null, 2));
    } catch (err) {
      next(err);
    }
  },
};