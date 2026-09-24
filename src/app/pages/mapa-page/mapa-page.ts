import { Component } from '@angular/core';
import { HeaderMain } from '../../componentes/header-main/header-main';
import { Mapa } from '../../componentes/mapa/mapa';
import { Footer } from '../../componentes/footer/footer';

@Component({
  imports: [HeaderMain, Mapa, Footer],
  selector: 'app-mapa-page',
  styleUrl: './mapa-page.css',
  templateUrl: './mapa-page.html',
})
export class MapaPage {}
