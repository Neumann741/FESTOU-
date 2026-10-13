import { Component, inject, input, signal } from '@angular/core';
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
  festa = input.required<Festa>();
  mensagem = signal('');
  readonly interacao = inject(Interacao);
  readonly experiencias = inject(Experiencias);
  avaliador = 'Você';
  nota = 5;
  comentario = '';
  avisoAvaliacao = '';
  avisoIngresso = '';
  avaliar(): void {
    this.avisoAvaliacao = this.experiencias.avaliar(
      this.festa(),
      this.avaliador,
      Number(this.nota),
      this.comentario,
    );
  }
  amigo = '';
  avisoConvite = '';
  convidar(): void {
    this.avisoConvite = this.interacao.convidar(this.festa(), this.amigo);
  }

  link(): string {
    return linkDaFesta(this.festa().id);
  }
  whatsapp(): string {
    return linkDoWhatsapp(this.festa().nome, this.link());
  }
  async copiar(): Promise<void> {
    const mensagem = await copiarLink(this.link());
    this.mensagem.set(mensagem);
  }
}
