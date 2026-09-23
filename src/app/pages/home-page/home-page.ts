import { Component } from '@angular/core';
import { Header } from '../../componentes/header/header';
import { Main } from '../../componentes/main/main';
import { Footer } from '../../componentes/footer/footer';
import { RouterOutlet } from '../../../../node_modules/@angular/router/types/_router_module-chunk';

@Component({
  imports: [Header, Main, Footer],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {}
