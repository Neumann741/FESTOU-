import { Injectable } from '@angular/core';

export interface Localizacao { latitude: number; longitude: number; }

/** Distância em linha reta, em quilômetros. */
export function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = (graus: number) => graus * Math.PI / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

export function formatarDistancia(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  getCurrentLocation(): Promise<Localizacao> {
    return new Promise((resolve, reject) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        reject(new Error('Seu navegador não oferece localização. Explore as festas pelo mapa.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
        ({ code }) => reject(new Error(code === 1
          ? 'Permita o acesso à localização no navegador para encontrar festas perto de você.'
          : code === 2 ? 'Não foi possível determinar sua localização. Tente novamente.'
          : 'A localização demorou para responder. Tente novamente.')),
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
      );
    });
  }
}
