import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';
import { FormsModule } from '@angular/forms';
import { Avisos } from '../../services/avisos';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-minhas-festas',
  styleUrl: './minhas-festas.css',
  templateUrl: './minhas-festas.html',
})
export class MinhasFestas {
  readonly interacao = inject(Interacao);
  readonly festas = inject(FestaService).festas;
  private readonly festaService = inject(FestaService);
  private readonly avisos = inject(Avisos);

  alterarStatus(festa: Festa, status: Festa['status']): void {
    if (!status || festa.status === status) return;
    this.festaService.atualizarFesta({ ...festa, status });
    this.avisos.adicionar(`${festa.nome}: status alterado para ${status}.`, festa.id);
  }

  excluir(id: number): void {
    this.festaService.removerFesta(id);
  }

  tipoDaFesta(festa: Festa): string {
    if (festa.tipo === 'privada') return 'Privada';
    return 'Pública';
  }

  semVagas(festa: Festa): boolean {
    if (!festa.limiteParticipantes) return false;
    return festa.pessoasConfirmadas >= festa.limiteParticipantes;
  }
}
