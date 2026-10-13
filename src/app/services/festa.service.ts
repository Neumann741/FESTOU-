import { Injectable, signal } from '@angular/core';
import { CadastroFesta } from '../models/cadastro-festa';
import { Festa } from '../models/festa';
import { criarFestasMock } from './festas.mock';

@Injectable({ providedIn: 'root' })
export class FestaService {
  private readonly chave = 'festou-festas';
  readonly festas = signal<Festa[]>(this.buscarFestas());

  criarFesta(dados: CadastroFesta): Festa {
    const festa: Festa = {
      ...dados,
      id: new Date().getTime(),
    };

    const lista = [...this.festas(), festa];
    this.salvarFestas(lista);
    this.festas.set(lista);
    return festa;
  }

  removerFesta(id: number): void {
    const lista = this.festas().filter((festa) => festa.id !== id);
    this.salvarFestas(lista);
    this.festas.set(lista);
  }

  atualizarFesta(festaAtualizada: Festa): void {
    const lista = this.festas().map((festa) =>
      festa.id === festaAtualizada.id ? festaAtualizada : festa,
    );
    this.salvarFestas(lista);
    this.festas.set(lista);
  }

  private buscarFestas(): Festa[] {
    const dados = localStorage.getItem(this.chave);
    const padrao = criarFestasMock();
    if (!dados) return padrao;
    const salvas: Festa[] = JSON.parse(dados);
    const normalizadas = salvas.map(
      (festa) => ({ ...festa, tipo: festa.tipo || 'publica' }) as Festa,
    );
    for (const festa of padrao) {
      const existe = normalizadas.some((item) => item.id === festa.id);
      if (!existe) {
        normalizadas.push(festa);
      }
    }
    return normalizadas;
  }

  private salvarFestas(festas: Festa[]): void {
    localStorage.setItem(this.chave, JSON.stringify(festas));
  }
}
