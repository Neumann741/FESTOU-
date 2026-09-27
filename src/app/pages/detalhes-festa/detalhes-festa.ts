import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-detalhes-festa',
  styleUrl: './detalhes-festa.css',
  templateUrl: './detalhes-festa.html',
})
export class DetalhesFesta {
  festa = signal<Festa | undefined>(undefined);
  comentario = '';
  amigoEscolhido = '';
  readonly interacao = inject(Interacao);
  private readonly rota = inject(ActivatedRoute);
  private readonly festaService = inject(FestaService);

  constructor() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.festaService.getFestas().subscribe((festas) => this.festa.set(festas.find((festa) => festa.id === id)));
  }

  confirmar(): void { const festa = this.festa(); if (festa) this.interacao.confirmar(festa.id); }
  pedirParticipacao(): void { const festa = this.festa(); if (festa) this.interacao.pedirParticipacao(festa.id); }
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
