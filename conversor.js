// conversor.js
function romanToArabic(roman) {
  console.log("Convirtiendo romano a arábigo:", roman); // Para depuración
  
  if (!roman || typeof roman !== 'string') {
    console.log("Entrada no válida");
    return null;
  }

  const romanUpper = roman.toUpperCase();
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
    console.log("Caracteres no válidos");
    return null;
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

  // Validar que el resultado sea positivo
  if (result <= 0) {
    console.log("Resultado no positivo");
    return null;
  }

  console.log("Resultado:", result); // Para depuración
  return result;
}

function arabicToRoman(arabic) {
  console.log("Convirtiendo arábigo a romano:", arabic); // Para depuración
  
  if (typeof arabic !== 'number' || arabic < 1 || arabic > 3999 || !Number.isInteger(arabic)) {
    console.log("Número arábigo no válido");
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
  let remaining = arabic;

  for (const { value, numeral } of romanNumerals) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  console.log("Resultado:", result); // Para depuración
  return result;
}

// Eliminar la exportación de Node.js ya que no es necesaria en el navegador