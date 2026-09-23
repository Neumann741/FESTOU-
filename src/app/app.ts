import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './componentes/header/header';
import { Footer } from './componentes/footer/footer';
import { HomePage } from './pages/home-page/home-page';
import { Main } from './componentes/main/main';

@Component({
  imports: [RouterOutlet, Header, Footer, Main, HomePage],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('festou');
}
