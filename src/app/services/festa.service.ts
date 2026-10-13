import { Injectable, signal } from '@angular/core';
import { CadastroFesta } from '../models/cadastro-festa';
import { Festa } from '../models/festa';
import { criarFestasMock } from './festas.mock';
import { lerDados, salvarDados } from '../integracoes/armazenamento';

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
    const lista = this.festas().map((festa) => {
      if (festa.id === festaAtualizada.id) {
        return festaAtualizada;
      }
      return festa;
    });
    this.salvarFestas(lista);
    this.festas.set(lista);
  }

  private buscarFestas(): Festa[] {
    const padrao = criarFestasMock();
    const salvas = lerDados<Festa[] | null>(this.chave, null);
    if (!salvas) {
      return padrao;
    }
    const normalizadas: Festa[] = [];
    for (const festa of salvas) {
      if (!festa.tipo) {
        festa.tipo = 'publica';
      }
      normalizadas.push(festa);
    }
    for (const festa of padrao) {
      const existe = normalizadas.some((item) => item.id === festa.id);
      if (!existe) {
        normalizadas.push(festa);
      }
    }
    return normalizadas;
  }

  private salvarFestas(festas: Festa[]): void {
    salvarDados(this.chave, festas);
  }
}
