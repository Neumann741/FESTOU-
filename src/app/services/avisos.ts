import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  texto: string;
  festaId: number;
  lido: boolean;
  data: string;
}

@Injectable({ providedIn: 'root' })
export class Avisos {
  lista = signal<Aviso[]>(JSON.parse(localStorage.getItem('festou-avisos') || '[]'));
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
    const id = Math.max(Date.now(), ...this.lista().map((aviso) => aviso.id + 1));
    this.lista.update((lista) => [
      { id, texto, festaId, lido: false, data: new Date().toLocaleString('pt-BR') },
      ...lista,
    ]);
    this.salvar();
  }

  marcarLidos(): void {
    this.lista.update((lista) => lista.map((aviso) => ({ ...aviso, lido: true })));
    this.salvar();
  }

  private salvar(): void {
    localStorage.setItem('festou-avisos', JSON.stringify(this.lista()));
  }
}
