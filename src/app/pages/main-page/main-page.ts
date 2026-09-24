import { Component } from '@angular/core';
import { Header } from '../../componentes/header/header';
import { HeaderMain } from '../../componentes/header-main/header-main';
import { Footer } from '../../componentes/footer/footer';

@Component({
  imports: [Header, HeaderMain, Footer],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage {}
