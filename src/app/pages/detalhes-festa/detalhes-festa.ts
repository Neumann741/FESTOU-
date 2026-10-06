import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';
import { RecursosFesta } from '../../componentes/recursos-festa/recursos-festa';
import { Experiencias } from '../../services/experiencias';

@Component({
  imports: [FormsModule, RouterLink, RecursosFesta],
  selector: 'app-detalhes-festa',
  styleUrl: './detalhes-festa.css',
  templateUrl: './detalhes-festa.html',
})
export class DetalhesFesta {
  festa = signal<Festa | undefined>(undefined);
  comentario = '';
  amigoEscolhido = '';
  readonly interacao = inject(Interacao);
  readonly experiencias = inject(Experiencias);
  avisoIngresso = '';
  private readonly rota = inject(ActivatedRoute);
  private readonly festaService = inject(FestaService);

  constructor() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.festaService.getFestas().subscribe((festas) => this.festa.set(festas.find((festa) => festa.id === id)));
  }

  confirmar(): void {
    const festa = this.festa();
    if (!festa || this.interacao.fechada(festa)) return;
    const confirmada = this.interacao.confirmadas().includes(festa.id);
    if (!confirmada && (festa.tipo === 'privada' || this.interacao.lotada(festa))) return;
    this.interacao.confirmar(festa.id);
  }
  pedirParticipacao(): void { const festa = this.festa(); if (festa && !this.interacao.fechada(festa) && !this.interacao.lotada(festa)) this.interacao.pedirParticipacao(festa.id); }
  comprarIngresso(): void { const festa = this.festa(); if (festa) this.avisoIngresso = this.experiencias.emitir(festa); }
  favoritar(): void { const festa = this.festa(); if (festa) this.interacao.favoritar(festa.id); }
  enviarComentario(): void {
    const festa = this.festa();
    if (!festa) return;
    this.interacao.comentar(festa.id, this.comentario);
    this.comentario = '';
  }
  adicionarAmigo(): void {
    const festa = this.festa();
    if (!festa) return;
    this.interacao.adicionarAmigo(festa.id, this.amigoEscolhido);
    this.amigoEscolhido = '';
  }
}
