import { Component } from '@angular/core';
import { Header } from '../../componentes/header/header';
import { HeaderMain } from '../../componentes/header-main/header-main';
import { Footer } from '../../componentes/footer/footer';
import { Vitrine } from '../vitrine/vitrine';
import { Mapa } from '../../componentes/mapa/mapa';
import { GaleriaGeral } from '../../componentes/galeria-geral/galeria-geral';

@Component({
  imports: [Header, HeaderMain, Footer, Vitrine, Mapa, GaleriaGeral],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage {}
