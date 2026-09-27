import { Injectable, signal } from '@angular/core';

export interface FotoGaleria { festaId: number; link: string; pessoa: string; }

@Injectable({ providedIn: 'root' })
export class Galeria {
  fotos = signal<FotoGaleria[]>(this.ler());

  adicionar(festaId: number, link: string): void {
    if (!link.trim()) return;
    const fotos = [...this.fotos(), { festaId, link, pessoa: 'Você' }];
    this.fotos.set(fotos);
    localStorage.setItem('festou-galeria', JSON.stringify(fotos));
  }

  fotosDaFesta(id: number): FotoGaleria[] { return this.fotos().filter((foto) => foto.festaId === id); }

  private ler(): FotoGaleria[] {
    const dados = localStorage.getItem('festou-galeria');
    return dados ? JSON.parse(dados) : [];
  }
}
