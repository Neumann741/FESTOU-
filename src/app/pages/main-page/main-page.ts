import { Component } from '@angular/core';
import { HeaderMain } from '../../componentes/header-main/header-main';
import { Footer } from '../../componentes/footer/footer';
import { ListaFestas } from '../../componentes/lista-festas/lista-festas';
import { Mapa } from '../../componentes/mapa/mapa';
import { GaleriaGeral } from '../../componentes/galeria-geral/galeria-geral';
import { SobreNos } from '../../componentes/sobre-nos/sobre-nos';

@Component({
  imports: [HeaderMain, Footer, ListaFestas, Mapa, GaleriaGeral, SobreNos],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage {}
