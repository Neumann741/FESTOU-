import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Interacao } from '../../services/interacao';

@Component({
  imports: [RouterLink],
  selector: 'app-perfil',
  styleUrl: './perfil.css',
  templateUrl: './perfil.html',
})
export class Perfil {
  readonly interacao = inject(Interacao);
  readonly amigos = [
    { nome: 'Ana', estilo: 'Pagode e funk' },
    { nome: 'João', estilo: 'Eletrônica' },
    { nome: 'Lívia', estilo: 'Festivais' },
    { nome: 'Pedro', estilo: 'Rock' },
  ];
}
