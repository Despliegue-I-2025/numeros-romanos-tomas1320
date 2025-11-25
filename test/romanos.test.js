const request = require('supertest');
const { app, romanToArabic, arabicToRoman } = require('../romanos');

describe('Pruebas de conversión Romano a Arábigo', () => {
  test('Debe convertir I a 1', () => {
    expect(romanToArabic('I')).toBe(1);
  });

  test('Debe convertir V a 5', () => {
    expect(romanToArabic('V')).toBe(5);
  });

  test('Debe convertir X a 10', () => {
    expect(romanToArabic('X')).toBe(10);
  });

  test('Debe convertir IV a 4', () => {
    expect(romanToArabic('IV')).toBe(4);
  });

  test('Debe convertir IX a 9', () => {
    expect(romanToArabic('IX')).toBe(9);
  });

  test('Debe convertir MCMXCIV a 1994', () => {
    expect(romanToArabic('MCMXCIV')).toBe(1994);
  });

  test('Debe manejar minúsculas', () => {
    expect(romanToArabic('mcmxciv')).toBe(1994);
  });

  test('Debe retornar null para entrada inválida', () => {
    expect(romanToArabic('ABC')).toBe(null);
  });

  test('Debe retornar null para entrada vacía', () => {
    expect(romanToArabic('')).toBe(null);
  });
});

describe('Pruebas de conversión Arábigo a Romano', () => {
  test('Debe convertir 1 a I', () => {
    expect(arabicToRoman(1)).toBe('I');
  });

  test('Debe convertir 4 a IV', () => {
    expect(arabicToRoman(4)).toBe('IV');
  });

  test('Debe convertir 5 a V', () => {
    expect(arabicToRoman(5)).toBe('V');
  });

  test('Debe convertir 9 a IX', () => {
    expect(arabicToRoman(9)).toBe('IX');
  });

  test('Debe convertir 1994 a MCMXCIV', () => {
    expect(arabicToRoman(1994)).toBe('MCMXCIV');
  });

  test('Debe convertir 3999 a MMMCMXCIX', () => {
    expect(arabicToRoman(3999)).toBe('MMMCMXCIX');
  });

  test('Debe retornar null para 0', () => {
    expect(arabicToRoman(0)).toBe(null);
  });

  test('Debe retornar null para números negativos', () => {
    expect(arabicToRoman(-5)).toBe(null);
  });

  test('Debe retornar null para números mayores a 3999', () => {
    expect(arabicToRoman(4000)).toBe(null);
  });

  test('Debe retornar null para números decimales', () => {
    expect(arabicToRoman(3.5)).toBe(null);
  });
});

describe('Pruebas de endpoints HTTP', () => {
  describe('GET /r2a', () => {
    test('Debe convertir romano a arábigo correctamente', async () => {
      const response = await request(app)
        .get('/r2a?roman=XIV')
        .expect(200);
      
      expect(response.body).toEqual({ arabic: 14 });
    });

    test('Debe retornar error 400 sin parámetro roman', async () => {
      const response = await request(app)
        .get('/r2a')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('Debe retornar error 400 para número romano inválido', async () => {
      const response = await request(app)
        .get('/r2a?roman=ABC')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /a2r', () => {
    test('Debe convertir arábigo a romano correctamente', async () => {
      const response = await request(app)
        .get('/a2r?arabic=14')
        .expect(200);
      
      expect(response.body).toEqual({ roman: 'XIV' });
    });

    test('Debe retornar error 400 sin parámetro arabic', async () => {
      const response = await request(app)
        .get('/a2r')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });

    test('Debe retornar error 400 para número arábigo inválido', async () => {
      const response = await request(app)
        .get('/a2r?arabic=0')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
    });
  });
});