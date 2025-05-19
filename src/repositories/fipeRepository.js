// src/repositories/fipeRepository.js
const axios = require('axios');

const baseURL = 'https://parallelum.com.br/fipe/api/v1';

module.exports = {
  fetchBrands: async (type) => {
    const { data } = await axios.get(`${baseURL}/${type}/marcas`);
    return data;
  },

  fetchModels: async (type, brandCode) => {
    const { data } = await axios.get(`${baseURL}/${type}/marcas/${brandCode}/modelos`);
    return data;
  },

  fetchYears: async (type, brandCode, modelCode) => {
    const { data } = await axios.get(`${baseURL}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos`);
    return data;
  },

  fetchVehicle: async (type, brandCode, modelCode, yearCode) => {
    const { data } = await axios.get(`${baseURL}/${type}/marcas/${brandCode}/modelos/${modelCode}/anos/${yearCode}`);
    return data;
  },
};