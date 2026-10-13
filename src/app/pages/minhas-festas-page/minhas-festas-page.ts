import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FestaService } from '../../services/festa.service';
import { CardGerenciamento } from '../../componentes/card-gerenciamento/card-gerenciamento';

@Component({
  imports: [RouterLink, CardGerenciamento],
  selector: 'app-minhas-festas',
  styleUrl: '../../componentes/card-gerenciamento/card-gerenciamento.css',
  templateUrl: './minhas-festas-page.html',
})
export class MinhasFestasPage {
  readonly festas = inject(FestaService).festas;
}
