import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Galeria } from '../../services/galeria';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-galeria',
  styleUrl: './galeria-page.css',
  templateUrl: './galeria-page.html',
})
export class GaleriaPage {
  readonly galeria = inject(Galeria);
  foto = '';
  fotoEditando = -1;
  novoLink = '';
  festaId = signal(1);
  private readonly rota = inject(ActivatedRoute);

  constructor() { this.festaId.set(Number(this.rota.snapshot.paramMap.get('id')) || 1); }
  publicar(): void { this.galeria.adicionar(this.festaId(), this.foto); this.foto = ''; }

  iniciarEdicao(indice: number, link: string): void {
    this.fotoEditando = indice;
    this.novoLink = link;
  }

  salvarEdicao(): void {
    this.galeria.editar(this.festaId(), this.fotoEditando, this.novoLink);
    this.cancelarEdicao();
  }

  cancelarEdicao(): void {
    this.fotoEditando = -1;
    this.novoLink = '';
  }
}
