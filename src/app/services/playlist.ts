import { Injectable, signal } from '@angular/core';

export interface Musica {
  nome: string;
  artista: string;
  link: string;
  votos?: string[];
}

// Mantém o formato já salvo no navegador: músicas separadas pelo id da festa.
interface MusicasPorFesta {
  [festaId: number]: Musica[];
}

@Injectable({ providedIn: 'root' })
export class Playlist {
  readonly votantes = ['Você', 'Ana', 'João', 'Lívia', 'Pedro', 'Marina', 'Caio'];
  musicas = signal<MusicasPorFesta>(this.ler());

  votar(festaId: number, indice: number, pessoa: string): void {
    if (!this.votantes.includes(pessoa)) {
      return;
    }
    const musicas = [...this.daFesta(festaId)];
    const musica = musicas[indice];
    if (!musica) {
      return;
    }

    let votos = [...(musica.votos || [])];
    if (votos.includes(pessoa)) {
      votos = votos.filter((nome) => nome !== pessoa);
    } else {
      votos.push(pessoa);
    }

    musicas[indice] = { ...musica, votos };
    this.salvar(festaId, musicas);
  }

  adicionar(festaId: number, musica: Musica): void {
    if (!musica.nome.trim()) return;
    const musicas = [...this.daFesta(festaId), musica];
    this.salvar(festaId, musicas);
  }

  remover(festaId: number, indice: number): void {
    const musicas = this.daFesta(festaId).filter((musica, posicao) => posicao !== indice);
    this.salvar(festaId, musicas);
  }

  private salvar(festaId: number, musicas: Musica[]): void {
    const lista = { ...this.musicas() };
    lista[festaId] = musicas;
    this.musicas.set(lista);
    localStorage.setItem('festou-playlist', JSON.stringify(lista));
  }

  daFesta(id: number): Musica[] {
    return this.musicas()[id] || [];
  }
  private ler(): MusicasPorFesta {
    const dados = localStorage.getItem('festou-playlist');
    return dados ? JSON.parse(dados) : {};
  }
}
