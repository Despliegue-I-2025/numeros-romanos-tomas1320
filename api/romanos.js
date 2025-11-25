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

  // Validar que solo contenga caracteres romanos válidos
  if (!/^[IVXLCDM]+$/.test(romanUpper)) {
    return null;
  }

  // Validar repeticiones excesivas (IIII, XXXX, etc)
  if (/I{4,}|X{4,}|C{4,}|M{4,}/.test(romanUpper)) {
    return null;
  }

  // Validar sustracciones inválidas
  // I solo puede restar de V y X
  // X solo puede restar de L y C
  // C solo puede restar de D y M
  // V, L, D nunca restan
  const invalidSubtractions = [
    'IL', 'IC', 'ID', 'IM',           // I no puede restar de L, C, D, M
    'XD', 'XM',                       // X no puede restar de D, M
    'VX', 'VL', 'VC', 'VD', 'VM',    // V nunca resta
    'LC', 'LD', 'LM',                 // L nunca resta
    'DM'                              // D nunca resta
  ];
  
  for (const pattern of invalidSubtractions) {
    if (romanUpper.includes(pattern)) {
      return null;
    }
  }

  let result = 0;
  let prevValue = 0;

  for (let i = romanUpper.length - 1; i >= 0; i--) {
    const currentValue = romanValues[romanUpper[i]];
    
    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }
    
    prevValue = currentValue;
  }

  if (result <= 0) {
    return null;
  }

  return result;
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

module.exports = async (req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url.split('?')[0];

  // Endpoint: /r2a - Romano a Arábigo
  if (path === '/r2a' || path === '/api/romanos/r2a') {
    const { roman } = req.query;

    if (!roman || roman.trim() === '') {
      return res.status(400).json({ 
        error: 'Parámetro "roman" requerido y no puede estar vacío' 
      });
    }

    const arabic = romanToArabic(roman);

    if (arabic === null) {
      return res.status(400).json({ 
        error: 'Número romano inválido' 
      });
    }

    return res.status(200).json({ arabic });
  }

  // Endpoint: /a2r - Arábigo a Romano
  if (path === '/a2r' || path === '/api/romanos/a2r') {
    const { arabic } = req.query;

    if (!arabic || arabic.trim() === '') {
      return res.status(400).json({ 
        error: 'Parámetro "arabic" requerido y no puede estar vacío' 
      });
    }

    // Validar que sea un número válido
    if (!/^\d+$/.test(arabic.trim())) {
      return res.status(400).json({ 
        error: 'El parámetro "arabic" debe ser un número válido' 
      });
    }

    const roman = arabicToRoman(arabic);

    if (roman === null) {
      return res.status(400).json({ 
        error: 'Número arábigo inválido. Debe estar entre 1 y 3999' 
      });
    }

    return res.status(200).json({ roman });
  }

  // Ruta no encontrada
  return res.status(404).json({ error: 'Endpoint no encontrado' });
};