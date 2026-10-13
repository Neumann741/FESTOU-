import { Component } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { Header } from '../../componentes/header/header';
import { Login as FormularioLogin } from '../../componentes/login/login';

@Component({
  imports: [Footer, Header, FormularioLogin],
  selector: 'app-login-page',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {}
