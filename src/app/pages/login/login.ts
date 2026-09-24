import { Component } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { Header } from '../../componentes/header/header';

@Component({
  imports: [Footer, Header],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {}
