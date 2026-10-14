import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { NavegacaoInterna } from './componentes/navegacao-interna/navegacao-interna';

@Component({
  imports: [RouterOutlet, NavegacaoInterna],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  readonly paginaSemMenu = signal(true);

  constructor() {
    const atualizar = (url: string) => {
      const pagina = url.split(/[?#]/)[0];
      this.paginaSemMenu.set(pagina === '/home-page' || pagina === '/login' || pagina === '/');
    };
    atualizar(this.router.url);
    this.router.events.subscribe((evento) => {
      if (evento instanceof NavigationEnd) atualizar(evento.urlAfterRedirects);
    });
  }
}
