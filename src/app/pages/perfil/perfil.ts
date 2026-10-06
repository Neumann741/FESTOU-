import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Interacao } from '../../services/interacao';
import { FestaService } from '../../services/festa.service';
import { Festa } from '../../models/festa';
import { Avisos } from '../../services/avisos';
import { Usuario } from '../../services/usuario';

@Component({
  imports: [RouterLink],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil {
  readonly usuario = inject(Usuario);
  fotoFalhou = false;
  readonly estilos = computed(() => this.usuario.perfil().estilos.split(',').map(estilo => estilo.trim()).filter(Boolean));
  readonly iniciais = computed(() => this.usuario.perfil().nome.split(' ').filter(Boolean).slice(0, 2).map(nome => nome[0]).join('').toUpperCase());
  readonly avisos = inject(Avisos);
  readonly interacao = inject(Interacao);
  readonly festas = signal<Festa[]>([]);
  readonly aba = signal('confirmadas');
  readonly confirmadas = computed(() => this.festas().filter(festa => this.interacao.confirmadas().includes(festa.id)));
  readonly salvas = computed(() => this.festas().filter(festa => this.interacao.favoritos().includes(festa.id)));
  readonly exibidas = computed(() => this.aba() === 'confirmadas' ? this.confirmadas() : this.salvas());

  constructor() {
    inject(FestaService).getFestas().pipe(takeUntilDestroyed()).subscribe(festas => this.festas.set(festas));
  }
  readonly amigos = [
    { nome: 'Ana', estilo: 'Pagode e funk' },
    { nome: 'João', estilo: 'Eletrônica' },
    { nome: 'Lívia', estilo: 'Festivais' },
    { nome: 'Pedro', estilo: 'Rock' },
  ];
}
