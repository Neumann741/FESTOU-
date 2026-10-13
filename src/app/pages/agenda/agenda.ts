import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-agenda',
  styleUrl: './agenda.css',
  templateUrl: './agenda.html',
})
export class Agenda {
  readonly interacao = inject(Interacao);
  readonly festas = inject(FestaService).festas;
  aba = signal('proximas');

  mudarAba(nome: string): void {
    this.aba.set(nome);
  }
  lista(): Festa[] {
    const resultado: Festa[] = [];

    for (const festa of this.festas()) {
      if (!this.interacao.confirmadas().includes(festa.id)) {
        continue;
      }

      const status = this.interacao.status(festa);
      if (this.aba() === 'historico' && status === 'encerrada') {
        resultado.push(festa);
      } else if (this.aba() === 'canceladas' && status === 'cancelada') {
        resultado.push(festa);
      } else if (this.aba() === 'proximas' && !this.interacao.fechada(festa)) {
        resultado.push(festa);
      }
    }

    resultado.sort((primeira, segunda) => {
      const ordem = (primeira.data + primeira.horario).localeCompare(
        segunda.data + segunda.horario,
      );
      if (this.aba() === 'historico') {
        return -ordem;
      }
      return ordem;
    });
    return resultado;
  }
}
