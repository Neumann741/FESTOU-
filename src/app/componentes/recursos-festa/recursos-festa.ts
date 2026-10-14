import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Interacao } from '../../services/interacao';
import { Experiencias } from '../../services/experiencias';
import { Festa } from '../../models/festa';
import { copiarLink, linkDaFesta, linkDoWhatsapp } from '../../integracoes/compartilhamento';

@Component({
  imports: [FormsModule],
  selector: 'app-recursos-festa',
  styleUrl: './recursos-festa.css',
  templateUrl: './recursos-festa.html',
})
export class RecursosFesta {
  @Input() festa!: Festa;
  mensagem = signal('');
  readonly interacao = inject(Interacao);
  readonly experiencias = inject(Experiencias);
  avaliador = 'Você';
  nota = 5;
  comentario = '';
  avisoAvaliacao = '';
  avisoIngresso = '';
  avaliar() {
    this.avisoAvaliacao = this.experiencias.avaliar(
      this.festa,
      this.avaliador,
      Number(this.nota),
      this.comentario,
    );
  }
  amigo = '';
  avisoConvite = '';
  convidar() {
    this.avisoConvite = this.interacao.convidar(this.festa, this.amigo);
  }

  textoBotaoIngresso(): string {
    if (this.interacao.ingressos().includes(this.festa.id)) {
      return 'Validar minha reserva';
    }
    return 'Emitir ingresso';
  }

  situacaoIngresso(): string {
    const festa = this.festa;
    if (this.interacao.fechada(festa)) {
      return 'Ingresso indisponível: festa ' + this.interacao.status(festa);
    }
    if (this.experiencias.checkins().includes(festa.id)) {
      return 'Ingresso utilizado · Check-in realizado';
    }
    if (this.interacao.confirmadas().includes(festa.id)) return 'Reserva confirmada';
    return 'Presença cancelada · Valide a reserva novamente';
  }

  checkinDesabilitado(): boolean {
    const festa = this.festa;
    if (this.experiencias.checkins().includes(festa.id)) return true;
    if (this.interacao.fechada(festa)) return true;
    return !this.interacao.confirmadas().includes(festa.id);
  }

  conviteDesabilitado(): boolean {
    if (!this.amigo) return true;
    if (this.interacao.fechada(this.festa)) return true;
    return this.interacao.lotada(this.festa);
  }

  emitirIngresso() {
    this.avisoIngresso = this.experiencias.emitir(this.festa);
  }

  fazerCheckin() {
    this.avisoIngresso = this.experiencias.checkin(this.festa);
  }

  link(): string {
    return linkDaFesta(this.festa.id);
  }
  whatsapp(): string {
    return linkDoWhatsapp(this.festa.nome, this.link());
  }
  async copiar() {
    const mensagem = await copiarLink(this.link());
    this.mensagem.set(mensagem);
  }
}
