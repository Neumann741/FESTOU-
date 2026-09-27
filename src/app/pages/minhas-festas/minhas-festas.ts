import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';

@Component({
  imports: [RouterLink],
  selector: 'app-minhas-festas',
  styleUrl: './minhas-festas.css',
  templateUrl: './minhas-festas.html',
})
export class MinhasFestas {
  festas = signal<Festa[]>([]);
  private readonly festaService = inject(FestaService);

  constructor() { this.festaService.getFestas().subscribe((festas) => this.festas.set(festas)); }

  excluir(id: number): void { this.festaService.removerFesta(id); }
}
