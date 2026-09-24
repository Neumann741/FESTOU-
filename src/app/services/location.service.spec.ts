import { calcularDistancia, formatarDistancia, LocationService } from './location.service';

describe('Localização', () => {
  it('calcula distâncias em quilômetros e respeita o limite de 5 km', () => {
    expect(calcularDistancia(0, 0, 0, 0)).toBe(0);
    expect(calcularDistancia(0, 0, 0, 1)).toBeCloseTo(111.195, 2);
    expect(calcularDistancia(0, 0, 0, 0.044)).toBeLessThan(5);
    expect(calcularDistancia(0, 0, 0, 0.046)).toBeGreaterThan(5);
    expect(Number.isFinite(calcularDistancia(0, 0, 0, 180))).toBe(true);
  });
  it('formata metros e quilômetros', () => {
    expect(formatarDistancia(0.85)).toBe('850 m');
    expect(formatarDistancia(1.8)).toBe('1,8 km');
  });
  it('trata a ausência da API sem solicitar permissão na criação', async () => {
    const service = new LocationService();
    if (!navigator.geolocation) await expect(service.getCurrentLocation()).rejects.toThrow('Seu navegador');
  });
});
