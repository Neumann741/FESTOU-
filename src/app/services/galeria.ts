import { Injectable, signal } from '@angular/core';
import { lerDados, salvarDados } from '../integracoes/armazenamento';

export interface FotoGaleria {
  festaId: number;
  link: string;
  pessoa: string;
}

@Injectable({ providedIn: 'root' })
export class Galeria {
  fotos = signal<FotoGaleria[]>(lerDados('festou-galeria', []));

  adicionar(festaId: number, link: string): void {
    if (!link.trim()) return;
    const fotos = [...this.fotos(), { festaId, link, pessoa: 'Você' }];
    this.fotos.set(fotos);
    salvarDados('festou-galeria', fotos);
  }

  fotosDaFesta(id: number): FotoGaleria[] {
    const resultado: FotoGaleria[] = [];
    for (const foto of this.fotos()) {
      if (foto.festaId === id) {
        resultado.push(foto);
      }
    }
    return resultado;
  }
}
