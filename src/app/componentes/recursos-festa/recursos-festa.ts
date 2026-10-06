import { Component, input, signal } from '@angular/core';
import { Festa } from '../../models/festa';

@Component({
  imports: [],
  selector: 'app-recursos-festa',
  styleUrl: './recursos-festa.css',
  templateUrl: './recursos-festa.html',
})
export class RecursosFesta {
  festa = input.required<Festa>();
  mensagem = signal('');

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
