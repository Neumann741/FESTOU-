import { Component } from '@angular/core';
import { Footer } from '../../componentes/footer/footer';
import { Header } from '../../componentes/header/header';
import { Login as FormularioLogin } from '../../componentes/login/login';

@Component({
  imports: [Footer, Header, FormularioLogin],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {}
