import { Component, inject, signal } from '@angular/core';
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
  readonly festas = inject(FestaService).festas;
  busca = signal('');
  categoria = signal('');
  limitePreco = signal('');
  comAmigos = signal(false);
  categorias(): string[] {
    const categorias: string[] = [];
    for (const festa of this.festas()) {
      if (!categorias.includes(festa.categoria)) {
        categorias.push(festa.categoria);
      }
    }
    return categorias.sort();
  }

  filtradas(): Festa[] {
    const resultado: Festa[] = [];
    const busca = this.normalizar(this.busca().trim());

    for (const festa of this.festas()) {
      const texto = this.normalizar(
        festa.nome + ' ' + festa.cidade + ' ' + festa.local + ' ' + festa.categoria,
      );
      if (!texto.includes(busca)) {
        continue;
      }
      if (this.categoria() && festa.categoria !== this.categoria()) {
        continue;
      }
      if (this.limitePreco() !== '') {
        if (festa.preco === undefined || festa.preco > Number(this.limitePreco())) {
          continue;
        }
      }
      if (this.comAmigos() && this.interacao.amigosNaFesta(festa.id).length === 0) {
        continue;
      }
      resultado.push(festa);
    }
    return resultado;
  }

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
  readonly interacao = inject(Interacao);
  private readonly router = inject(Router);

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

  amigos(festa: Festa): string {
    const amigos = this.interacao.amigosNaFesta(festa.id);
    if (amigos.length === 1) return '👥 ' + amigos.join(', ') + ' vai';
    return '👥 ' + amigos.join(', ') + ' vão';
  }

  participacaoDesabilitada(festa: Festa): boolean {
    return (
      this.interacao.pedidos().includes(festa.id) || this.interacao.confirmadas().includes(festa.id)
    );
  }

  textoParticipacao(festa: Festa): string {
    if (this.interacao.confirmadas().includes(festa.id)) return 'Participação aprovada';
    if (this.interacao.pedidos().includes(festa.id)) return 'Pedido enviado';
    return 'Pedir para participar';
  }

  imagem(festa: Festa): string {
    if (festa.imagem) return 'url(' + festa.imagem + ')';
    return '';
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
