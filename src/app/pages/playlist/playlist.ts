import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Playlist } from '../../services/playlist';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-playlist',
  styleUrl: './playlist.css',
  templateUrl: './playlist.html',
})
export class PlaylistPage {
  readonly playlist = inject(Playlist);
  festaId = signal(1);
  nome = '';
  artista = '';
  link = '';
  private readonly rota = inject(ActivatedRoute);
  constructor() { this.festaId.set(Number(this.rota.snapshot.paramMap.get('id')) || 1); }
  adicionar(): void { this.playlist.adicionar(this.festaId(), { nome: this.nome, artista: this.artista, link: this.link }); this.nome = ''; this.artista = ''; this.link = ''; }
  remover(indice: number): void { this.playlist.remover(this.festaId(), indice); }
}
