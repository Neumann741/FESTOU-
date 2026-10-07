import { Injectable, signal } from '@angular/core';

export interface Musica {
  nome: string;
  artista: string;
  link: string;
  votos?: string[];
}

@Injectable({ providedIn: 'root' })
export class Playlist {
  readonly votantes = ['Você', 'Ana', 'João', 'Lívia', 'Pedro', 'Marina', 'Caio'];
  musicas = signal<Record<number, Musica[]>>(this.ler());

  votar(festaId: number, indice: number, pessoa: string): void {
    if (!this.votantes.includes(pessoa)) return;
    const musicas = this.daFesta(festaId);
    if (!musicas[indice]) return;
    const atualizado = {
      ...this.musicas(),
      [festaId]: musicas.map((musica, posicao) => {
        if (posicao !== indice) return musica;
        const votos = musica.votos || [];
        return {
          ...musica,
          votos: votos.includes(pessoa)
            ? votos.filter((nome) => nome !== pessoa)
            : [...votos, pessoa],
        };
      }),
    };
    this.musicas.set(atualizado);
    localStorage.setItem('festou-playlist', JSON.stringify(atualizado));
  }

  adicionar(festaId: number, musica: Musica): void {
    if (!musica.nome.trim()) return;
    const lista = this.musicas();
    const atualizado = { ...lista, [festaId]: [...(lista[festaId] || []), musica] };
    this.musicas.set(atualizado);
    localStorage.setItem('festou-playlist', JSON.stringify(atualizado));
  }

  remover(festaId: number, indice: number): void {
    const lista = this.musicas();
    const atualizado = {
      ...lista,
      [festaId]: (lista[festaId] || []).filter((_, posicao) => posicao !== indice),
    };
    this.musicas.set(atualizado);
    localStorage.setItem('festou-playlist', JSON.stringify(atualizado));
  }

  daFesta(id: number): Musica[] {
    return this.musicas()[id] || [];
  }
  private ler(): Record<number, Musica[]> {
    const dados = localStorage.getItem('festou-playlist');
    return dados ? JSON.parse(dados) : {};
  }
}
