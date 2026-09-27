import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

interface RespostaGeoapify {
  features: Array<{
    properties: { formatted: string; city?: string; county?: string };
    geometry: { coordinates: [number, number] };
  }>;
}

@Injectable({ providedIn: 'root' })
export class Localizacao {
  private readonly http = inject(HttpClient);

  private readonly chaveApi = '64b054def5d34f27ba2f41a3b2bd9ee3';

  buscar(endereco: string) {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(endereco)}&format=geojson&apiKey=${this.chaveApi}`;
    return this.http.get<RespostaGeoapify>(url);
  }
}
