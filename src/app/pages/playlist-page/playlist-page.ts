import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Playlist } from '../../services/playlist';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-playlist',
  styleUrl: './playlist-page.css',
  templateUrl: './playlist-page.html',
})
export class PlaylistPage {
  private readonly festaService = inject(FestaService);
  readonly playlist = inject(Playlist);
  festaId = 1;
  nome = '';
  artista = '';
  link = '';
  private readonly rota = inject(ActivatedRoute);
  constructor() {
    this.festaId = Number(this.rota.snapshot.paramMap.get('id')) || 1;
  }
  festa(): Festa | undefined {
    return this.festaService.festas().find((festa) => festa.id === this.festaId);
  }

  imagemDaFesta(): string {
    const festa = this.festa();
    if (festa && festa.imagem) return festa.imagem;
    return 'assets/img1.jpg';
  }

  nomeDaFesta(): string {
    const festa = this.festa();
    if (festa) return festa.nome;
    return 'Playlist da festa';
  }

  artistaDaMusica(artista: string): string {
    if (artista) return artista;
    return 'Artista não informado';
  }

  votou(votos: string[] | undefined): boolean {
    if (!votos) return false;
    return votos.includes('Você');
  }

  textoVoto(votos: string[] | undefined): string {
    let quantidade = 0;
    if (votos) quantidade = votos.length;
    if (this.votou(votos)) return '♥ ' + quantidade + ' votos';
    return quantidade + ' votos';
  }

  adicionar() {
    this.playlist.adicionar(this.festaId, {
      nome: this.nome,
      artista: this.artista,
      link: this.link,
    });
    this.nome = '';
    this.artista = '';
    this.link = '';
  }
  remover(indice: number) {
    this.playlist.remover(this.festaId, indice);
  }
}
