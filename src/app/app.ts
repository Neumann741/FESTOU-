import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './componentes/header/header';
import { HomePage } from './pages/home-page/home-page';

@Component({
  imports: [RouterOutlet, Header, HomePage],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('festou');
}
