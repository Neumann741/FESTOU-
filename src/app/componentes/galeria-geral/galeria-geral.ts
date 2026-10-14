import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Galeria } from '../../services/galeria';

@Component({
  imports: [RouterLink],
  selector: 'app-galeria-geral',
  styleUrl: './galeria-geral.css',
  templateUrl: './galeria-geral.html',
})
export class GaleriaGeral {
  readonly galeria = inject(Galeria);
}
