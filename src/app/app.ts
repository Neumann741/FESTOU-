import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavegacaoInterna } from './componentes/navegacao-interna/navegacao-interna';

@Component({
  imports: [RouterOutlet, NavegacaoInterna],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  readonly home = signal(true);

  constructor() {
    const atualizar = (url: string) =>
      this.home.set(url.split(/[?#]/)[0] === '/home-page' || url === '/');
    atualizar(this.router.url);
    this.router.events.pipe(takeUntilDestroyed()).subscribe((evento) => {
      if (evento instanceof NavigationEnd) atualizar(evento.urlAfterRedirects);
    });
  }
  protected readonly title = signal('festou');
}
