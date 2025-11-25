// api/romanos.js - API serverless para Vercel

function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') {
    return null;
  }

  const romanUpper = roman.toUpperCase().trim();
  const romanValues = {
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
  };

  // 1. Validar que solo contenga caracteres romanos válidos
  if (!/^[IVXLCDM]+$/.test(romanUpper)) {
    return null;
  }

  // 2. Validar repeticiones excesivas (I, X, C, M no más de 3. V, L, D nunca 2 o más)
  if (/I{4,}|X{4,}|C{4,}|M{4,}|V{2,}|L{2,}|D{2,}/.test(romanUpper)) {
    return null;
  }
  
  // 3. (Opcional) Eliminar validaciones de sustracción inválida porque la re-conversión
  //    (punto 6) validará la estructura canónica de forma más robusta.

  let result = 0;
  let prevValue = 0;

  // 4. Implementación del algoritmo de conversión aditiva/sustractiva (lectura de derecha a izquierda)
  for (let i = romanUpper.length - 1; i >= 0; i--) {
    const currentValue = romanValues[romanUpper[i]];
    
    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }
    
    prevValue = currentValue;
  }

  // 5. Validar que el número no sea cero o esté fuera del rango manejado (1 a 3999)
  if (result <= 0 || result > 3999) {
    return null;
  }
  
  // 6. Validación Estructural (Canónica): El arábigo resultante debe convertir
  //    de vuelta al *mismo* romano de entrada para ser considerado válido.
  const reConvertedRoman = arabicToRoman(result);

  if (reConvertedRoman === romanUpper) {
    return result;
  } else {
    // Esto captura números como "MMMCMMM" (que se convierten a 3900 pero no son su forma canónica)
    return null; 
  }
}

function arabicToRoman(arabic) {
  const num = parseInt(arabic, 10);
  
  if (isNaN(num) || num < 1 || num > 3999) {
    return null;
  }

  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];

  let result = '';
  let remaining = num;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

module.exports = (req, res) => {
  // Habilitar CORS - IMPORTANTE para el evaluador
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Extraer path de la URL
  const urlParts = req.url.split('?');
  const path = urlParts[0];

  // Endpoint: /r2a - Romano a Arábigo
  if (path === '/r2a' || path === '/api/romanos') {
    const { roman } = req.query;

    if (!roman || roman.trim() === '') {
      res.status(400).json({ 
        error: 'Parámetro "roman" requerido y no puede estar vacío' 
      });
      return;
    }

    const arabic = romanToArabic(roman);

    if (arabic === null) {
      res.status(400).json({ 
        error: 'Número romano inválido' 
      });
      return;
    }

    res.status(200).json({ arabic });
    return;
  }

  // Endpoint: /a2r - Arábigo a Romano
  if (path === '/a2r') {
    const { arabic } = req.query;

    if (!arabic || arabic.trim() === '') {
      res.status(400).json({ 
        error: 'Parámetro "arabic" requerido y no puede estar vacío' 
      });
      return;
    }

    // Validar que sea un número válido
    if (!/^\d+$/.test(arabic.trim())) {
      res.status(400).json({ 
        error: 'El parámetro "arabic" debe ser un número válido' 
      });
      return;
    }

    const roman = arabicToRoman(arabic);

    if (roman === null) {
      res.status(400).json({ 
        error: 'Número arábigo inválido. Debe estar entre 1 y 3999' 
      });
      return;
    }

    res.status(200).json({ roman });
    return;
  }

  // Ruta no encontrada
  res.status(404).json({ error: 'Endpoint no encontrada' });
};