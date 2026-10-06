import { Injectable, inject, signal } from '@angular/core';
import { Festa } from '../models/festa';
import { Interacao } from './interacao';

export interface Avaliacao { pessoa: string; nota: number; comentario: string; }

@Injectable({ providedIn: 'root' })
export class Experiencias {
  readonly interacao = inject(Interacao);
  avaliacoes = signal<Record<number, Avaliacao[]>>(JSON.parse(localStorage.getItem('festou-avaliacoes') || '{}'));

  podeAvaliar(festa: Festa, pessoa: string): boolean {
    return this.interacao.status(festa) === 'encerrada' && (pessoa === 'Você' ? this.interacao.confirmadas().includes(festa.id) : this.interacao.amigosNaFesta(festa.id).includes(pessoa));
  }

  avaliar(festa: Festa, pessoa: string, nota: number, comentario: string): string {
    if (!this.podeAvaliar(festa, pessoa)) return 'Somente participantes podem avaliar uma festa encerrada.';
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) return 'Escolha uma nota de 1 a 5.';
    const avaliacao = { pessoa, nota, comentario: comentario.trim().slice(0, 500) };
    this.avaliacoes.update(lista => ({ ...lista, [festa.id]: [...(lista[festa.id] || []).filter(item => item.pessoa !== pessoa), avaliacao] }));
    localStorage.setItem('festou-avaliacoes', JSON.stringify(this.avaliacoes()));
    return 'Avaliação salva! Uma nova avaliação substitui a anterior da mesma pessoa.';
  }

  media(id: number): string {
    const lista = this.avaliacoes()[id] || [];
    return lista.length ? (lista.reduce((soma, item) => soma + item.nota, 0) / lista.length).toFixed(1) : '—';
  }
}
