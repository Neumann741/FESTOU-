import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Usuario } from '../../services/usuario';
import { Avisos } from '../../services/avisos';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navegacao-interna',
  styleUrl: './navegacao-interna.css',
  templateUrl: './navegacao-interna.html',
})
export class NavegacaoInterna {
  readonly usuario = inject(Usuario);
  readonly avisos = inject(Avisos);
  menuAberto = false;

  textoMenu(): string {
    if (this.menuAberto) return 'Fechar';
    return 'Menu';
  }
}
