import { Injectable } from '@angular/core';

export interface Localizacao {
  latitude: number;
  longitude: number;
}

export function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (graus: number) => (graus * Math.PI) / 180;
  const latitude = Math.sin(rad(lat2 - lat1) / 2) ** 2;
  const longitude = Math.sin(rad(lng2 - lng1) / 2) ** 2;
  const a = latitude + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * longitude;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function formatarDistancia(km: number): string {
  if (km < 1) {
    return Math.round(km * 1000) + ' m';
  }
  return km.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' km';
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  getCurrentLocation(): Promise<Localizacao> {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Seu navegador não oferece localização. Use o mapa para buscar festas.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
        ({ code }) => {
          let mensagem = 'A localização demorou para responder. Tente novamente.';
          if (code === 1) {
            mensagem =
              'Permita o acesso à localização no navegador para encontrar festas perto de você.';
          }
          if (code === 2) {
            mensagem = 'Não foi possível determinar sua localização. Tente novamente.';
          }
          reject(new Error(mensagem));
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
      );
    });
  }
}
