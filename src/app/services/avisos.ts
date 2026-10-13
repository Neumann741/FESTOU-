import { Injectable, signal } from '@angular/core';
import { lerDados, salvarDados } from '../integracoes/armazenamento';

export interface Aviso {
  id: number;
  texto: string;
  festaId: number;
  lido: boolean;
  data: string;
}

@Injectable({ providedIn: 'root' })
export class Avisos {
  lista = signal<Aviso[]>(lerDados('festou-avisos', []));
  naoLidos(): number {
    let quantidade = 0;
    for (const aviso of this.lista()) {
      if (!aviso.lido) {
        quantidade++;
      }
    }
    return quantidade;
  }

  adicionar(texto: string, festaId: number): void {
    let id = Date.now();
    for (const aviso of this.lista()) {
      if (aviso.id >= id) {
        id = aviso.id + 1;
      }
    }
    this.lista.update((lista) => [
      { id, texto, festaId, lido: false, data: new Date().toLocaleString('pt-BR') },
      ...lista,
    ]);
    this.salvar();
  }

  marcarLidos(): void {
    const lista: Aviso[] = [];
    for (const aviso of this.lista()) {
      aviso.lido = true;
      lista.push(aviso);
    }
    this.lista.set(lista);
    this.salvar();
  }

  private salvar(): void {
    salvarDados('festou-avisos', this.lista());
  }
}
