import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Interacao } from '../../services/interacao';
import { FestaService } from '../../services/festa.service';
import { Festa } from '../../models/festa';
import { Avisos } from '../../services/avisos';
import { Usuario } from '../../services/usuario';

@Component({
  imports: [RouterLink],
  selector: 'app-perfil',
  styleUrl: './perfil-page.css',
  templateUrl: './perfil-page.html',
})
export class PerfilPage {
  readonly usuario = inject(Usuario);
  fotoFalhou = false;
  estilos(): string[] {
    const estilos: string[] = [];
    for (const estilo of this.usuario.perfil().estilos.split(',')) {
      if (estilo.trim()) {
        estilos.push(estilo.trim());
      }
    }
    return estilos;
  }

  iniciais(): string {
    let resultado = '';
    for (const nome of this.usuario.perfil().nome.split(' ')) {
      if (nome && resultado.length < 2) {
        resultado += nome[0];
      }
    }
    return resultado.toUpperCase();
  }
  readonly avisos = inject(Avisos);
  readonly interacao = inject(Interacao);
  readonly festas = inject(FestaService).festas;
  readonly aba = signal('confirmadas');
  confirmadas(): Festa[] {
    return this.festas().filter((festa) => this.interacao.confirmadas().includes(festa.id));
  }

  salvas(): Festa[] {
    return this.festas().filter((festa) => this.interacao.favoritos().includes(festa.id));
  }

  exibidas(): Festa[] {
    if (this.aba() === 'confirmadas') {
      return this.confirmadas();
    }
    return this.salvas();
  }

  mudarAba(nome: string): void {
    this.aba.set(nome);
  }

  textoDaFesta(): string {
    if (this.aba() === 'confirmadas') return '✓ Presença confirmada';
    return '♡ Na sua lista';
  }

  textoVazio(): string {
    if (this.aba() === 'confirmadas') {
      return 'Confirme presença em uma festa para encontrá-la aqui.';
    }
    return 'Salve as festas que você quer conhecer.';
  }

  readonly amigos = [
    { nome: 'Ana', estilo: 'Pagode e funk' },
    { nome: 'João', estilo: 'Eletrônica' },
    { nome: 'Lívia', estilo: 'Festivais' },
    { nome: 'Pedro', estilo: 'Rock' },
  ];
}
