import { Component } from '@angular/core';
import { Header } from '../../componentes/header/header';
import { Main } from '../../componentes/main/main';
import { Footer } from '../../componentes/footer/footer';

@Component({
  imports: [Header, Main, Footer],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {}
