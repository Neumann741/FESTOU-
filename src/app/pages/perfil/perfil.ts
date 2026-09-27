import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Interacao } from '../../services/interacao';
import { FestaService } from '../../services/festa.service';
import { Festa } from '../../models/festa';

@Component({
  imports: [RouterLink],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil {
  readonly interacao = inject(Interacao);
  readonly festas = signal<Festa[]>([]);
  readonly aba = signal('confirmadas');
  readonly confirmadas = computed(() => this.festas().filter(festa => this.interacao.confirmadas().includes(festa.id)));
  readonly salvas = computed(() => this.festas().filter(festa => this.interacao.favoritos().includes(festa.id)));
  readonly exibidas = computed(() => this.aba() === 'confirmadas' ? this.confirmadas() : this.salvas());

  constructor() {
    inject(FestaService).getFestas().pipe(takeUntilDestroyed()).subscribe(festas => this.festas.set(festas));
  }
  readonly amigos = [
    { nome: 'Ana', estilo: 'Pagode e funk' },
    { nome: 'João', estilo: 'Eletrônica' },
    { nome: 'Lívia', estilo: 'Festivais' },
    { nome: 'Pedro', estilo: 'Rock' },
  ];
}
