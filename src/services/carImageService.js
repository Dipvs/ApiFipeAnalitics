const axios = require('axios');

// Mapeamento de carros para URLs de imagens reais
const carImageMap = {
  // Toyota
  'toyota corolla': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/corolla/2024/gallery/exterior/corolla-2024-exterior-01.jpg',
  'toyota corolla cross': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/corolla-cross/2024/gallery/exterior/corolla-cross-2024-exterior-01.jpg',
  'toyota yaris': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/yaris/2024/gallery/exterior/yaris-2024-exterior-01.jpg',
  'toyota hilux': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/hilux/2024/gallery/exterior/hilux-2024-exterior-01.jpg',
  'toyota sw4': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/sw4/2024/gallery/exterior/sw4-2024-exterior-01.jpg',
  'toyota prius': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/prius/2024/gallery/exterior/prius-2024-exterior-01.jpg',
  'toyota rav4': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/rav4/2024/gallery/exterior/rav4-2024-exterior-01.jpg',
  'toyota camry': 'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/camry/2024/gallery/exterior/camry-2024-exterior-01.jpg',

  // Honda
  'honda civic': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/civic/2024/gallery/exterior/civic-2024-exterior-01.jpg',
  'honda hr-v': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/hr-v/2024/gallery/exterior/hr-v-2024-exterior-01.jpg',
  'honda city': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/city/2024/gallery/exterior/city-2024-exterior-01.jpg',
  'honda accord': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/accord/2024/gallery/exterior/accord-2024-exterior-01.jpg',
  'honda cr-v': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/cr-v/2024/gallery/exterior/cr-v-2024-exterior-01.jpg',
  'honda pilot': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/pilot/2024/gallery/exterior/pilot-2024-exterior-01.jpg',
  'honda ridgeline': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/ridgeline/2024/gallery/exterior/ridgeline-2024-exterior-01.jpg',
  'honda fit': 'https://www.honda.com.br/content/dam/honda/brazil/vehicles/fit/2024/gallery/exterior/fit-2024-exterior-01.jpg',

  // Volkswagen
  'volkswagen polo': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/polo/2024/gallery/exterior/polo-2024-exterior-01.jpg',
  'volkswagen virtus': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/virtus/2024/gallery/exterior/virtus-2024-exterior-01.jpg',
  'volkswagen t-cross': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/t-cross/2024/gallery/exterior/t-cross-2024-exterior-01.jpg',
  'volkswagen nivus': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/nivus/2024/gallery/exterior/nivus-2024-exterior-01.jpg',
  'volkswagen jetta': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/jetta/2024/gallery/exterior/jetta-2024-exterior-01.jpg',
  'volkswagen tiguan': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/tiguan/2024/gallery/exterior/tiguan-2024-exterior-01.jpg',
  'volkswagen amarok': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/amarok/2024/gallery/exterior/amarok-2024-exterior-01.jpg',
  'volkswagen golf': 'https://www.vw.com.br/content/dam/vw/brazil/vehicles/golf/2024/gallery/exterior/golf-2024-exterior-01.jpg',

  // Chevrolet
  'chevrolet onix': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/onix/2024/gallery/exterior/onix-2024-exterior-01.jpg',
  'chevrolet tracker': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/tracker/2024/gallery/exterior/tracker-2024-exterior-01.jpg',
  'chevrolet cruze': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/cruze/2024/gallery/exterior/cruze-2024-exterior-01.jpg',
  'chevrolet equinox': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/equinox/2024/gallery/exterior/equinox-2024-exterior-01.jpg',
  'chevrolet s10': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/s10/2024/gallery/exterior/s10-2024-exterior-01.jpg',
  'chevrolet trailblazer': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/trailblazer/2024/gallery/exterior/trailblazer-2024-exterior-01.jpg',
  'chevrolet spin': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/spin/2024/gallery/exterior/spin-2024-exterior-01.jpg',
  'chevrolet camaro': 'https://www.chevrolet.com.br/content/dam/chevrolet/brazil/vehicles/camaro/2024/gallery/exterior/camaro-2024-exterior-01.jpg',

  // Hyundai
  'hyundai hb20': 'https://www.hyundai.com.br/content/dam/hyundai/brazil/vehicles/hb20/2024/gallery/exterior/hb20-2024-exterior-01.jpg',
  'hyundai creta': 'https://www.hyundai.com.br/content/dam/hyundai/brazil/vehicles/creta/2024/gallery/exterior/creta-2024-exterior-01.jpg',
  'hyundai tucson': 'https://www.hyundai.com.br/content/dam/hyundai/brazil/vehicles/tucson/2024/gallery/exterior/tucson-2024-exterior-01.jpg',
  'hyundai elantra': 'https://www.hyundai.com.br/content/dam/hyundai/brazil/vehicles/elantra/2024/gallery/exterior/elantra-2024-exterior-01.jpg',

  // Nissan
  'nissan kicks': 'https://www.nissan.com.br/content/dam/nissan/brazil/vehicles/kicks/2024/gallery/exterior/kicks-2024-exterior-01.jpg',
  'nissan versa': 'https://www.nissan.com.br/content/dam/nissan/brazil/vehicles/versa/2024/gallery/exterior/versa-2024-exterior-01.jpg',
  'nissan sentra': 'https://www.nissan.com.br/content/dam/nissan/brazil/vehicles/sentra/2024/gallery/exterior/sentra-2024-exterior-01.jpg',
  'nissan frontier': 'https://www.nissan.com.br/content/dam/nissan/brazil/vehicles/frontier/2024/gallery/exterior/frontier-2024-exterior-01.jpg',

  // Ford
  'ford ka': 'https://www.ford.com.br/content/dam/ford/brazil/vehicles/ka/2024/gallery/exterior/ka-2024-exterior-01.jpg',
  'ford ecosport': 'https://www.ford.com.br/content/dam/ford/brazil/vehicles/ecosport/2024/gallery/exterior/ecosport-2024-exterior-01.jpg',
  'ford ranger': 'https://www.ford.com.br/content/dam/ford/brazil/vehicles/ranger/2024/gallery/exterior/ranger-2024-exterior-01.jpg',
  'ford territory': 'https://www.ford.com.br/content/dam/ford/brazil/vehicles/territory/2024/gallery/exterior/territory-2024-exterior-01.jpg',

  // Fiat
  'fiat argo': 'https://www.fiat.com.br/content/dam/fiat/brazil/vehicles/argo/2024/gallery/exterior/argo-2024-exterior-01.jpg',
  'fiat mobi': 'https://www.fiat.com.br/content/dam/fiat/brazil/vehicles/mobi/2024/gallery/exterior/mobi-2024-exterior-01.jpg',
  'fiat cronos': 'https://www.fiat.com.br/content/dam/fiat/brazil/vehicles/cronos/2024/gallery/exterior/cronos-2024-exterior-01.jpg',
  'fiat pulse': 'https://www.fiat.com.br/content/dam/fiat/brazil/vehicles/pulse/2024/gallery/exterior/pulse-2024-exterior-01.jpg',

  // Renault
  'renault kwid': 'https://www.renault.com.br/content/dam/renault/brazil/vehicles/kwid/2024/gallery/exterior/kwid-2024-exterior-01.jpg',
  'renault sandero': 'https://www.renault.com.br/content/dam/renault/brazil/vehicles/sandero/2024/gallery/exterior/sandero-2024-exterior-01.jpg',
  'renault logan': 'https://www.renault.com.br/content/dam/renault/brazil/vehicles/logan/2024/gallery/exterior/logan-2024-exterior-01.jpg',
  'renault duster': 'https://www.renault.com.br/content/dam/renault/brazil/vehicles/duster/2024/gallery/exterior/duster-2024-exterior-01.jpg',

  // Jeep
  'jeep renegade': 'https://www.jeep.com.br/content/dam/jeep/brazil/vehicles/renegade/2024/gallery/exterior/renegade-2024-exterior-01.jpg',
  'jeep compass': 'https://www.jeep.com.br/content/dam/jeep/brazil/vehicles/compass/2024/gallery/exterior/compass-2024-exterior-01.jpg',
  'jeep commander': 'https://www.jeep.com.br/content/dam/jeep/brazil/vehicles/commander/2024/gallery/exterior/commander-2024-exterior-01.jpg',
  'jeep wrangler': 'https://www.jeep.com.br/content/dam/jeep/brazil/vehicles/wrangler/2024/gallery/exterior/wrangler-2024-exterior-01.jpg'
};

// URLs de fallback para marcas
const brandFallbackImages = {
  'toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop&crop=center',
  'honda': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&crop=center',
  'volkswagen': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&crop=center',
  'chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop&crop=center',
  'hyundai': 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop&crop=center',
  'nissan': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop&crop=center',
  'ford': 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop&crop=center',
  'fiat': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop&crop=center',
  'renault': 'https://images.unsplash.com/photo-1494976688153-ca3ce0b3e985?w=800&h=600&fit=crop&crop=center',
  'jeep': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&crop=center'
};

// Imagem padrão para carros não encontrados
const defaultCarImage = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop&crop=center';

/**
 * Busca imagem para um carro específico
 * @param {string} make - Marca do carro
 * @param {string} model - Modelo do carro
 * @returns {string} URL da imagem
 */
function getCarImage(make, model) {
  if (!make || !model) {
    return defaultCarImage;
  }

  // Normaliza os nomes para busca
  const normalizedMake = make.toLowerCase().trim();
  const normalizedModel = model.toLowerCase().trim();
  const carKey = `${normalizedMake} ${normalizedModel}`;

  // Busca imagem específica do modelo
  if (carImageMap[carKey]) {
    return carImageMap[carKey];
  }

  // Busca por variações do nome
  const modelVariations = [
    carKey,
    `${normalizedMake} ${normalizedModel.replace('-', ' ')}`,
    `${normalizedMake} ${normalizedModel.replace(' ', '-')}`,
    normalizedModel
  ];

  for (const variation of modelVariations) {
    if (carImageMap[variation]) {
      return carImageMap[variation];
    }
  }

  // Fallback para imagem da marca
  if (brandFallbackImages[normalizedMake]) {
    return brandFallbackImages[normalizedMake];
  }

  // Imagem padrão
  return defaultCarImage;
}

/**
 * Busca múltiplas imagens para um carro
 * @param {string} make - Marca do carro
 * @param {string} model - Modelo do carro
 * @returns {Array} Array de URLs de imagens
 */
function getCarImages(make, model) {
  const primaryImage = getCarImage(make, model);
  
  // Retorna array com imagem principal e algumas variações
  return [
    primaryImage,
    primaryImage.replace('exterior-01', 'exterior-02'),
    primaryImage.replace('exterior-01', 'interior-01'),
    primaryImage.replace('exterior-01', 'interior-02')
  ].filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicatas
}

/**
 * Valida se uma URL de imagem é válida
 * @param {string} imageUrl - URL da imagem
 * @returns {Promise<boolean>} True se a imagem é válida
 */
async function validateImageUrl(imageUrl) {
  try {
    const response = await axios.head(imageUrl, { timeout: 5000 });
    return response.status === 200 && response.headers['content-type']?.startsWith('image/');
  } catch (error) {
    console.warn(`Image validation failed for ${imageUrl}:`, error.message);
    return false;
  }
}

/**
 * Busca imagem com validação
 * @param {string} make - Marca do carro
 * @param {string} model - Modelo do carro
 * @returns {Promise<string>} URL da imagem válida
 */
async function getValidatedCarImage(make, model) {
  const imageUrl = getCarImage(make, model);
  
  try {
    const isValid = await validateImageUrl(imageUrl);
    if (isValid) {
      return imageUrl;
    }
  } catch (error) {
    console.warn(`Failed to validate image for ${make} ${model}:`, error.message);
  }
  
  // Fallback para imagem padrão
  return defaultCarImage;
}

/**
 * Enriquece dados do carro com imagem
 * @param {Object} carData - Dados do carro
 * @returns {Object} Dados do carro com imagem
 */
function enrichCarWithImage(carData) {
  if (!carData) return carData;
  
  const imageUrl = getCarImage(carData.make, carData.model);
  
  return {
    ...carData,
    image: imageUrl,
    images: getCarImages(carData.make, carData.model),
    imageSource: 'car_image_service'
  };
}

/**
 * Enriquece array de carros com imagens
 * @param {Array} carsArray - Array de carros
 * @returns {Array} Array de carros com imagens
 */
function enrichCarsWithImages(carsArray) {
  if (!Array.isArray(carsArray)) return carsArray;
  
  return carsArray.map(car => enrichCarWithImage(car));
}

module.exports = {
  getCarImage,
  getCarImages,
  validateImageUrl,
  getValidatedCarImage,
  enrichCarWithImage,
  enrichCarsWithImages,
  carImageMap,
  brandFallbackImages,
  defaultCarImage
}; 