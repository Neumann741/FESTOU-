import { Component } from '@angular/core';
import { Login as FormularioLogin } from '../../componentes/login/login';

@Component({
  imports: [FormularioLogin],
  selector: 'app-login-page',
  templateUrl: './login-page.html',
})
export class LoginPage {}
