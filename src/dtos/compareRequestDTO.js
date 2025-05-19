// src/dtos/compareRequestDTO.js
class VehicleDTO {
  constructor(type, brandCode, modelCode, yearCode) {
    this.type = type;
    this.brandCode = brandCode;
    this.modelCode = modelCode;
    this.yearCode = yearCode;
  }
}

module.exports = class CompareRequestDTO {
  constructor(vehicle1Data, vehicle2Data) {
    this.vehicle1 = new VehicleDTO(
      vehicle1Data.type,
      vehicle1Data.brandCode,
      vehicle1Data.modelCode,
      vehicle1Data.yearCode
    );
    
    this.vehicle2 = new VehicleDTO(
      vehicle2Data.type,
      vehicle2Data.brandCode,
      vehicle2Data.modelCode,
      vehicle2Data.yearCode
    );
  }

  // Método para validação básica
  validate() {
    if (!this.vehicle1 || !this.vehicle2) {
      throw new Error('Dois veículos são necessários para comparação');
    }
    return true;
  }
};