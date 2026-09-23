import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  constructor(private router: Router) {}

 email = '';
  password = '';
  showPassword = false;
  message = '';
  isError = false;

  // Usuários de teste
  users = [
    { email: 'admin@festa.com', password: '123456', name: 'Admin' },
    { email: 'user@festa.com', password: '123456', name: 'Usuário' }
  ];

  // Mostrar / ocultar senha
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Função de login
  onSubmit() {
    // Verifica se preencheu os campos
    if (this.email === '' || this.password === '') {
      this.message = 'Preencha todos os campos';
      this.isError = true;
      return;
    }

    // Procura o usuário
    const user = this.users.find(
      u => u.email === this.email && u.password === this.password
    );

    if (user) {
      this.message = 'Login realizado com sucesso! Bem-vindo ' + user.name;
      this.isError = false;

      this.router.navigate(['/home-page']);
    } else {
      this.message = 'E-mail ou senha inválidos';
      this.isError = true;
    }
  }

  // Login social (simulado)
  socialLogin(provider: string) {
    this.message = 'Login com ' + provider + ' realizado!';
    this.isError = false;
    this.router.navigate(['/home-page']);
  }
}
