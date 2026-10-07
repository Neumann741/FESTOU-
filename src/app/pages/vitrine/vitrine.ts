import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';

@Component({
  imports: [FormsModule],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
})
export class Vitrine {
  readonly festas = signal<Festa[]>([]);
  busca = signal('');
  categoria = signal('');
  limitePreco = signal('');
  comAmigos = signal(false);
  categorias = computed(() => [...new Set(this.festas().map((festa) => festa.categoria))].sort());
  filtradas = computed(() =>
    this.festas().filter((festa) => {
      const texto = this.normalizar(
        `${festa.nome} ${festa.cidade} ${festa.local} ${festa.categoria}`,
      );
      return (
        texto.includes(this.normalizar(this.busca().trim())) &&
        (!this.categoria() || festa.categoria === this.categoria()) &&
        (this.limitePreco() === '' ||
          (festa.preco !== undefined && festa.preco <= Number(this.limitePreco()))) &&
        (!this.comAmigos() || this.interacao.amigosNaFesta(festa.id).length > 0)
      );
    }),
  );

  limparFiltros(): void {
    this.busca.set('');
    this.categoria.set('');
    this.limitePreco.set('');
    this.comAmigos.set(false);
  }
  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
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

  pedirParticipacao(festa: Festa): void {
    if (!this.interacao.fechada(festa) && !this.interacao.lotada(festa))
      this.interacao.pedirParticipacao(festa.id);
    else this.verDetalhes(festa);
  }

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
