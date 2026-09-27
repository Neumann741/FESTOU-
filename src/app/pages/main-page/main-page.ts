import { Component } from '@angular/core';
import { Header } from '../../componentes/header/header';
import { HeaderMain } from '../../componentes/header-main/header-main';
import { Footer } from '../../componentes/footer/footer';
import { Vitrine } from '../vitrine/vitrine';
import { Mapa } from '../../componentes/mapa/mapa';

@Component({
  imports: [Header, HeaderMain, Footer, Vitrine, Mapa],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage {}
