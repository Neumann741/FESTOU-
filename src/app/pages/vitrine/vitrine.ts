import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';

@Component({
  imports: [],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
})
export class Vitrine {
  readonly festas = signal<Festa[]>([]);
  private readonly festaService = inject(FestaService);
  readonly interacao = inject(Interacao);
  private readonly router = inject(Router);

  constructor() {
    this.festaService.getFestas().subscribe((festas) => this.festas.set(festas));
  }

  abrirNoMapa(festa: Festa): void {
    void this.router.navigate(['/mapa-page'], { queryParams: { festa: festa.id } });
  }

  verTodasNoMapa(): void {
    void this.router.navigate(['/mapa-page']);
  }

  verDetalhes(festa: Festa): void {
    void this.router.navigate(['/festa', festa.id]);
  }

  pedirParticipacao(festa: Festa): void { this.interacao.pedirParticipacao(festa.id); }

  dataLabel(data: string): string {
    return new Date(`${data}T00:00:00`)
      .toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
      .replace('.', '')
      .toUpperCase();
  }

  preco(festa: Festa): string {
    if (festa.preco === undefined) return 'A confirmar';
    if (festa.preco === 0) return 'Grátis';
    return festa.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
