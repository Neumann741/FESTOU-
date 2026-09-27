import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Galeria } from '../../services/galeria';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-galeria',
  styleUrl: './galeria.css',
  templateUrl: './galeria.html',
})
export class GaleriaPage {
  readonly galeria = inject(Galeria);
  foto = '';
  festaId = signal(1);
  private readonly rota = inject(ActivatedRoute);

  constructor() { this.festaId.set(Number(this.rota.snapshot.paramMap.get('id')) || 1); }
  publicar(): void { this.galeria.adicionar(this.festaId(), this.foto); this.foto = ''; }
}
