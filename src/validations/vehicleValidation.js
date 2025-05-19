// src/validations/vehicleValidation.js
const validateCompareDTO = (dto) => {
  if (!dto) throw new Error('Objeto de comparação é obrigatório');
  if (!dto.vehicle1 || !dto.vehicle2) throw new Error('Dois veículos são necessários para comparação');

  const requiredFields = ['type', 'brandCode', 'modelCode', 'yearCode'];
  const validTypes = ['carros', 'motos', 'caminhões'];

  [dto.vehicle1, dto.vehicle2].forEach((vehicle, index) => {
    if (!vehicle || typeof vehicle !== 'object') {
      throw new Error(`Veículo ${index + 1} deve ser um objeto válido`);
    }

    requiredFields.forEach(field => {
      if (!vehicle[field]) {
        throw new Error(`Veículo ${index + 1} está faltando o campo: ${field}`);
      }
    });

    if (!validTypes.includes(vehicle.type)) {
      throw new Error(`Tipo inválido para veículo ${index + 1}. Deve ser um dos: ${validTypes.join(', ')}`);
    }
  });
};

module.exports = { validateCompareDTO };