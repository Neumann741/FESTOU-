import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Festa } from '../models/festa';
import { criarFestasMock } from './festas.mock';

@Injectable({ providedIn: 'root' })
export class FestaService {
  private readonly chave = 'festou-festas';
  private readonly festas = new BehaviorSubject<Festa[]>(this.buscarFestas());

  getFestas(): Observable<Festa[]> {
    return this.festas.asObservable();
  }

  criarFesta(dados: Omit<Festa, 'id'>): Festa {
    const festa: Festa = {
      ...dados,
      id: new Date().getTime(),
    };

    const lista = [...this.festas.value, festa];
    this.salvarFestas(lista);
    this.festas.next(lista);
    return festa;
  }

  removerFesta(id: number): void {
    const lista = this.festas.value.filter((festa) => festa.id !== id);
    this.salvarFestas(lista);
    this.festas.next(lista);
  }

  atualizarFesta(festaAtualizada: Festa): void {
    const lista = this.festas.value.map((festa) => festa.id === festaAtualizada.id ? festaAtualizada : festa);
    this.salvarFestas(lista);
    this.festas.next(lista);
  }

  private buscarFestas(): Festa[] {
    const dados = localStorage.getItem(this.chave);
    return dados ? JSON.parse(dados) : criarFestasMock();
  }

  private salvarFestas(festas: Festa[]): void {
    localStorage.setItem(this.chave, JSON.stringify(festas));
  }
}
