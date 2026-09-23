import { Component } from '@angular/core';
import { Header } from '../../componentes/header/header';
import { HeaderMain } from '../../componentes/header-main/header-main';

@Component({
  imports: [Header, HeaderMain],
  selector: 'app-main-page',
  styleUrl: './main-page.css',
  templateUrl: './main-page.html',
})
export class MainPage {}
