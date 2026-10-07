import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  festas = signal<Festa[]>([]);
  aba = signal('proximas');
  lista = computed(() =>
    this.festas()
      .filter((festa) => {
        if (!this.interacao.confirmadas().includes(festa.id)) return false;
        const status = this.interacao.status(festa);
        return this.aba() === 'historico'
          ? status === 'encerrada'
          : this.aba() === 'canceladas'
            ? status === 'cancelada'
            : !this.interacao.fechada(festa);
      })
      .sort(
        (a, b) =>
          (a.data + a.horario).localeCompare(b.data + b.horario) *
          (this.aba() === 'historico' ? -1 : 1),
      ),
  );

  constructor() {
    inject(FestaService)
      .getFestas()
      .pipe(takeUntilDestroyed())
      .subscribe((festas) => this.festas.set(festas));
  }
}
