import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Interacao } from '../../services/interacao';
import { Experiencias } from '../../services/experiencias';
import { Festa } from '../../models/festa';

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
  avaliar(): void { this.avisoAvaliacao = this.experiencias.avaliar(this.festa(), this.avaliador, Number(this.nota), this.comentario); }
  amigo = '';
  avisoConvite = '';
  convidar(): void { this.avisoConvite = this.interacao.convidar(this.festa(), this.amigo); }

  link(): string { return `${window.location.origin}/festa/${this.festa().id}`; }
  whatsapp(): string {
    return `https://wa.me/?text=${encodeURIComponent('Bora para ' + this.festa().nome + '? ' + this.link() + ' (demonstração local)')}`;
  }
  async copiar(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.link());
      this.mensagem.set('Link copiado!');
    } catch {
      this.mensagem.set('Não foi possível copiar automaticamente. Selecione o link abaixo e copie.');
    }
  }
}
