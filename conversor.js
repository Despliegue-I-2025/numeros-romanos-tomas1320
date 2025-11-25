// conversor.js
function romanToArabic(roman) {
  if (!roman || typeof roman !== 'string') {
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
    return null;
  }

  return result;
}

function arabicToRoman(arabic) {
  if (typeof arabic !== 'number' || arabic < 1 || arabic > 3999 || !Number.isInteger(arabic)) {
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

  return result;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { romanToArabic, arabicToRoman };
}