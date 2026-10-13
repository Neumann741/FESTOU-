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

  adicionar(festaId: number, link: string) {
    if (!link.trim()) return;
    const fotos = [...this.fotos(), { festaId, link, pessoa: 'Você' }];
    this.fotos.set(fotos);
    salvarDados('festou-galeria', fotos);
  }

  editar(festaId: number, indice: number, link: string) {
    if (!link.trim()) return;

    const fotos = [...this.fotos()];
    let posicaoNaFesta = 0;

    for (let i = 0; i < fotos.length; i++) {
      if (fotos[i].festaId === festaId) {
        if (posicaoNaFesta === indice) {
          fotos[i] = { ...fotos[i], link };
          this.fotos.set(fotos);
          salvarDados('festou-galeria', fotos);
          return;
        }
        posicaoNaFesta++;
      }
    }
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
