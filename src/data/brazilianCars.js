// Dados completos de carros populares no Brasil - 2024
// Incluindo especificações técnicas, preços, consumo e características

const brazilianCarsData = [
  // Toyota - Líder no Brasil
  { 
    make: 'Toyota', model: 'Corolla', year: 2024, fuel_type: 'flex', transmission: 'automatic', 
    cylinders: 4, city_mpg: 28, highway_mpg: 38, combination_mpg: 32, displacement: 2.0, 
    class: 'sedan', drive: 'fwd', price_brl: 'R$ 145.990', doors: 4, seats: 5, 
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Central multimídia 9"', 'Ar condicionado digital', 'Direção elétrica', 'Freios ABS', 'Toyota Safety Sense 2.0'],
    engine_power: '177 cv', torque: '21,4 kgfm', fuel_tank: '60L', trunk: '470L'
  },
  { 
    make: 'Toyota', model: 'Corolla Cross', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 26, highway_mpg: 34, combination_mpg: 29, displacement: 2.0,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 139.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Toyota Safety Sense', 'Teto solar', 'Rodas 17"', 'Câmera 360°'],
    engine_power: '177 cv', torque: '21,4 kgfm', fuel_tank: '50L', trunk: '440L'
  },
  { 
    make: 'Toyota', model: 'Yaris', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 32, highway_mpg: 42, combination_mpg: 36, displacement: 1.5,
    class: 'hatchback', drive: 'fwd', price_brl: 'R$ 89.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Câmera de ré', 'Sensor de estacionamento', 'Controle de estabilidade', 'Central 7"'],
    engine_power: '111 cv', torque: '14,5 kgfm', fuel_tank: '42L', trunk: '286L'
  },

  // Honda - Segunda maior
  { 
    make: 'Honda', model: 'Civic', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 30, highway_mpg: 40, combination_mpg: 34, displacement: 2.0,
    class: 'sedan', drive: 'fwd', price_brl: 'R$ 159.900', doors: 4, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Honda SENSING', 'Teto solar', 'Bancos em couro', 'Painel digital 10.2"'],
    engine_power: '155 cv', torque: '19,8 kgfm', fuel_tank: '50L', trunk: '519L'
  },
  { 
    make: 'Honda', model: 'HR-V', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 28, highway_mpg: 36, combination_mpg: 31, displacement: 1.5,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 129.900', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Banco traseiro mágico', 'Câmera multi-ângulo', 'Controle de cruzeiro', 'Honda CONNECT'],
    engine_power: '116 cv', torque: '15,3 kgfm', fuel_tank: '50L', trunk: '437L'
  },
  { 
    make: 'Honda', model: 'City', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 32, highway_mpg: 42, combination_mpg: 36, displacement: 1.5,
    class: 'sedan', drive: 'fwd', price_brl: 'R$ 99.900', doors: 4, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Porta-malas 519L', 'Ar digital', 'Chave presencial', 'Central 8"'],
    engine_power: '116 cv', torque: '15,3 kgfm', fuel_tank: '40L', trunk: '519L'
  },

  // Volkswagen - Tradicional
  { 
    make: 'Volkswagen', model: 'Polo', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 34, highway_mpg: 44, combination_mpg: 38, displacement: 1.0,
    class: 'hatchback', drive: 'fwd', price_brl: 'R$ 79.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Motor TSI', 'Ar condicionado', 'Direção elétrica', 'VW Play'],
    engine_power: '128 cv', torque: '20,4 kgfm', fuel_tank: '50L', trunk: '300L'
  },
  { 
    make: 'Volkswagen', model: 'Virtus', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 32, highway_mpg: 42, combination_mpg: 36, displacement: 1.0,
    class: 'sedan', drive: 'fwd', price_brl: 'R$ 89.990', doors: 4, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Porta-malas 521L', 'Central VW Play', 'Freios a disco', 'App Connect'],
    engine_power: '128 cv', torque: '20,4 kgfm', fuel_tank: '50L', trunk: '521L'
  },
  { 
    make: 'Volkswagen', model: 'T-Cross', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 30, highway_mpg: 38, combination_mpg: 33, displacement: 1.0,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 119.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Banco traseiro rebatível', 'Teto solar', 'App Connect', 'Rodas 16"'],
    engine_power: '128 cv', torque: '20,4 kgfm', fuel_tank: '50L', trunk: '420L'
  },

  // Chevrolet - GM
  { 
    make: 'Chevrolet', model: 'Onix', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 35, highway_mpg: 45, combination_mpg: 39, displacement: 1.0,
    class: 'hatchback', drive: 'fwd', price_brl: 'R$ 74.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['MyLink', 'Ar condicionado', 'Vidros elétricos', 'Direção elétrica'],
    engine_power: '82 cv', torque: '10,8 kgfm', fuel_tank: '44L', trunk: '303L'
  },
  { 
    make: 'Chevrolet', model: 'Tracker', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 29, highway_mpg: 37, combination_mpg: 32, displacement: 1.0,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 124.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Teto solar panorâmico', 'OnStar', 'Carregamento wireless', 'MyLink 8"'],
    engine_power: '116 cv', torque: '16,8 kgfm', fuel_tank: '50L', trunk: '363L'
  },

  // Hyundai - Coreana
  { 
    make: 'Hyundai', model: 'HB20', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 34, highway_mpg: 44, combination_mpg: 38, displacement: 1.0,
    class: 'hatchback', drive: 'fwd', price_brl: 'R$ 79.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '5 anos', origin: 'Nacional',
    features: ['Bluelink', 'Ar digital', 'Carregador USB', 'Central 8"'],
    engine_power: '80 cv', torque: '10,5 kgfm', fuel_tank: '50L', trunk: '300L'
  },
  { 
    make: 'Hyundai', model: 'Creta', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 28, highway_mpg: 36, combination_mpg: 31, displacement: 2.0,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 129.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '5 anos', origin: 'Nacional',
    features: ['Teto solar', 'Painel digital 10.25"', 'Hyundai SmartSense', 'Rodas 17"'],
    engine_power: '167 cv', torque: '20,6 kgfm', fuel_tank: '55L', trunk: '431L'
  },

  // Nissan - Japonesa
  { 
    make: 'Nissan', model: 'Versa', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 33, highway_mpg: 43, combination_mpg: 37, displacement: 1.6,
    class: 'sedan', drive: 'fwd', price_brl: 'R$ 94.990', doors: 4, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Nissan Connect', 'Ar digital', 'Câmera de ré', 'Controle de cruzeiro'],
    engine_power: '120 cv', torque: '15,5 kgfm', fuel_tank: '41L', trunk: '510L'
  },
  { 
    make: 'Nissan', model: 'Kicks', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 29, highway_mpg: 37, combination_mpg: 32, displacement: 1.6,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 119.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Nissan Connect', 'Câmera 360°', 'Teto flutuante', 'Rodas 17"'],
    engine_power: '114 cv', torque: '15,5 kgfm', fuel_tank: '41L', trunk: '432L'
  },

  // Fiat - Italiana
  { 
    make: 'Fiat', model: 'Argo', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 34, highway_mpg: 44, combination_mpg: 38, displacement: 1.0,
    class: 'hatchback', drive: 'fwd', price_brl: 'R$ 74.990', doors: 5, seats: 5,
    safety_rating: 4, warranty: '3 anos', origin: 'Nacional',
    features: ['Uconnect', 'Ar condicionado', 'Direção elétrica', 'Rodas 15"'],
    engine_power: '75 cv', torque: '10,4 kgfm', fuel_tank: '48L', trunk: '300L'
  },
  { 
    make: 'Fiat', model: 'Pulse', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 3, city_mpg: 30, highway_mpg: 38, combination_mpg: 33, displacement: 1.0,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 99.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Uconnect 10.1"', 'Teto solar', 'Câmera de ré', 'Controle de estabilidade'],
    engine_power: '130 cv', torque: '20,4 kgfm', fuel_tank: '48L', trunk: '370L'
  },

  // Renault - Francesa
  { 
    make: 'Renault', model: 'Kwid', year: 2024, fuel_type: 'flex', transmission: 'manual',
    cylinders: 3, city_mpg: 38, highway_mpg: 48, combination_mpg: 42, displacement: 1.0,
    class: 'hatchback', drive: 'fwd', price_brl: 'R$ 64.990', doors: 5, seats: 5,
    safety_rating: 4, warranty: '3 anos', origin: 'Nacional',
    features: ['Media Evolution', 'Ar condicionado', 'Direção hidráulica', 'Altura do solo 180mm'],
    engine_power: '70 cv', torque: '9,6 kgfm', fuel_tank: '28L', trunk: '290L'
  },
  { 
    make: 'Renault', model: 'Captur', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 28, highway_mpg: 36, combination_mpg: 31, displacement: 1.6,
    class: 'suv', drive: 'fwd', price_brl: 'R$ 119.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Media Evolution 9.3"', 'Teto panorâmico', 'Câmera de ré', 'Rodas 17"'],
    engine_power: '120 cv', torque: '16,2 kgfm', fuel_tank: '50L', trunk: '377L'
  },

  // Jeep - Americana
  { 
    make: 'Jeep', model: 'Renegade', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 25, highway_mpg: 33, combination_mpg: 28, displacement: 1.8,
    class: 'suv', drive: '4wd', price_brl: 'R$ 149.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Uconnect 8.4"', 'Tração 4x4', 'Controle de descida', 'Rodas 17"'],
    engine_power: '139 cv', torque: '19,3 kgfm', fuel_tank: '48L', trunk: '351L'
  },
  { 
    make: 'Jeep', model: 'Compass', year: 2024, fuel_type: 'flex', transmission: 'automatic',
    cylinders: 4, city_mpg: 23, highway_mpg: 31, combination_mpg: 26, displacement: 2.0,
    class: 'suv', drive: '4wd', price_brl: 'R$ 179.990', doors: 5, seats: 5,
    safety_rating: 5, warranty: '3 anos', origin: 'Nacional',
    features: ['Uconnect 10.1"', 'Tração 4x4', 'Teto solar', 'Bancos em couro'],
    engine_power: '166 cv', torque: '20,6 kgfm', fuel_tank: '60L', trunk: '438L'
  }
];

module.exports = brazilianCarsData; 