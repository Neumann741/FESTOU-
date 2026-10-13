import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Festa } from '../../models/festa';
import { Avisos } from '../../services/avisos';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-card-gerenciamento',
  styleUrl: './card-gerenciamento.css',
  templateUrl: './card-gerenciamento.html',
})
export class CardGerenciamento {
  @Input() festa!: Festa;
  readonly interacao = inject(Interacao);
  private readonly festaService = inject(FestaService);
  private readonly avisos = inject(Avisos);

  alterarStatus(status: Festa['status']): void {
    if (!status || this.festa.status === status) return;
    this.festaService.atualizarFesta({ ...this.festa, status });
    this.avisos.adicionar(`${this.festa.nome}: status alterado para ${status}.`, this.festa.id);
  }

  excluir(): void { this.festaService.removerFesta(this.festa.id); }

  tipoDaFesta(): string {
    if (this.festa.tipo === 'privada') return 'Privada';
    return 'Pública';
  }

  semVagas(): boolean {
    const limite = this.festa.limiteParticipantes;
    if (!limite) return false;
    return this.festa.pessoasConfirmadas >= limite;
  }
}
