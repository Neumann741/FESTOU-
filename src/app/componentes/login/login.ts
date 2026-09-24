import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginInter } from './login-inter';
import { email, form, required, FormField } from '@angular/forms/signals';

@Component({
  imports: [CommonModule, FormsModule, FormField],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

protected usuarioModel = signal <LoginInter> ({
  email: '',
  senha: ''
})

 private router = inject(Router);


protected usuarioForm = form(this.usuarioModel, (s) => {
  required(s.email, {message: 'o email é obrigatório'});
  email(s.email, {message: 'O email não condiz com um email'});

  required(s.senha, {message: 'A senha é obrigatória'});
});

private usuario =  signal<string> ('arthurneumann18@gmail.com');
private senha =  signal<string> ('123');





protected verificaInfo(event: SubmitEvent) {
  if( this.usuarioModel().email === this.usuario() && this.usuarioModel().senha === this.senha()) {
    this.router.navigate(['/main-page']);
  }

  event.preventDefault();
  
}




}
