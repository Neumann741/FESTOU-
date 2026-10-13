import { Injectable, signal } from '@angular/core';
import { Musica, MusicaDaFesta } from '../models/interacoes';
import { lerMusicas, salvarMusicas } from '../integracoes/armazenamento';

@Injectable({ providedIn: 'root' })
export class Playlist {
  readonly votantes = ['Você', 'Ana', 'João', 'Lívia', 'Pedro', 'Marina', 'Caio'];
  musicas = signal<MusicaDaFesta[]>(lerMusicas());

  daFesta(id: number): MusicaDaFesta[] {
    return this.musicas().filter((musica) => musica.festaId === id);
  }

  adicionar(festaId: number, musica: Musica): void {
    if (!musica.nome.trim()) {
      return;
    }
    const novaMusica: MusicaDaFesta = { ...musica, festaId };
    this.musicas.update((lista) => [...lista, novaMusica]);
    salvarMusicas(this.musicas());
  }

  remover(festaId: number, indice: number): void {
    const musica = this.daFesta(festaId)[indice];
    this.musicas.update((lista) => lista.filter((item) => item !== musica));
    salvarMusicas(this.musicas());
  }

  votar(festaId: number, indice: number, pessoa: string): void {
    if (!this.votantes.includes(pessoa)) {
      return;
    }
    const musica = this.daFesta(festaId)[indice];
    if (!musica) {
      return;
    }

    let votos = musica.votos || [];
    if (votos.includes(pessoa)) {
      votos = votos.filter((nome) => nome !== pessoa);
    } else {
      votos = [...votos, pessoa];
    }

    const lista = this.musicas().map((item) => {
      if (item === musica) {
        return { ...item, votos };
      }
      return item;
    });
    this.musicas.set(lista);
    salvarMusicas(lista);
  }
}
