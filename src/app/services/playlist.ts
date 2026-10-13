import { Injectable, signal } from '@angular/core';
import { Musica, MusicaDaFesta } from '../models/interacoes';
import { lerMusicas, salvarMusicas } from '../integracoes/armazenamento';

@Injectable({ providedIn: 'root' })
export class Playlist {
  readonly votantes = ['Você', 'Ana', 'João', 'Lívia', 'Pedro', 'Marina', 'Caio'];
  musicas = signal<MusicaDaFesta[]>(lerMusicas());

  daFesta(id: number): MusicaDaFesta[] {
    const resultado: MusicaDaFesta[] = [];
    for (const musica of this.musicas()) {
      if (musica.festaId === id) {
        resultado.push(musica);
      }
    }
    return resultado;
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
    const lista: MusicaDaFesta[] = [];
    for (const item of this.musicas()) {
      if (item !== musica) {
        lista.push(item);
      }
    }
    this.musicas.set(lista);
    salvarMusicas(lista);
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
      const votosRestantes: string[] = [];
      for (const nome of votos) {
        if (nome !== pessoa) {
          votosRestantes.push(nome);
        }
      }
      votos = votosRestantes;
    } else {
      votos = [...votos, pessoa];
    }

    const lista: MusicaDaFesta[] = [];
    for (const item of this.musicas()) {
      if (item === musica) {
        lista.push({ ...item, votos });
      } else {
        lista.push(item);
      }
    }
    this.musicas.set(lista);
    salvarMusicas(lista);
  }
}
