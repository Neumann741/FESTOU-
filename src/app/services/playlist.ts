import { Injectable, signal } from '@angular/core';

export interface Musica { nome: string; artista: string; link: string; }

@Injectable({ providedIn: 'root' })
export class Playlist {
  musicas = signal<Record<number, Musica[]>>(this.ler());

  adicionar(festaId: number, musica: Musica): void {
    if (!musica.nome.trim()) return;
    const lista = this.musicas();
    const atualizado = { ...lista, [festaId]: [...(lista[festaId] || []), musica] };
    this.musicas.set(atualizado);
    localStorage.setItem('festou-playlist', JSON.stringify(atualizado));
  }

  remover(festaId: number, indice: number): void {
    const lista = this.musicas();
    const atualizado = { ...lista, [festaId]: (lista[festaId] || []).filter((_, posicao) => posicao !== indice) };
    this.musicas.set(atualizado);
    localStorage.setItem('festou-playlist', JSON.stringify(atualizado));
  }

  daFesta(id: number): Musica[] { return this.musicas()[id] || []; }
  private ler(): Record<number, Musica[]> { const dados = localStorage.getItem('festou-playlist'); return dados ? JSON.parse(dados) : {}; }
}
