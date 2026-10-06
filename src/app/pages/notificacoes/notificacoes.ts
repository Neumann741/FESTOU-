import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avisos } from '../../services/avisos';

@Component({
  imports: [RouterLink],
  selector: 'app-notificacoes',
  styleUrl: './notificacoes.css',
  templateUrl: './notificacoes.html',
})
export class Notificacoes {
  readonly avisos = inject(Avisos);
}
