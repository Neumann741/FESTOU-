import { Injectable, signal } from '@angular/core';
import { lerDados, salvarDados } from '../integracoes/armazenamento';

export interface DadosPerfil {
  nome: string;
  foto: string;
  bio: string;
  estilos: string;
}

@Injectable({ providedIn: 'root' })
export class Usuario {
  perfil = signal<DadosPerfil>(
    lerDados<DadosPerfil | null>('festou-perfil', null) || {
      nome: 'Lucas Festou',
      foto: '',
      bio: 'Blumenau, SC · Música boa e a galera por perto.',
      estilos: 'Pagode, Eletrônica, Festivais',
    },
  );

  salvar(perfil: DadosPerfil): void {
    this.perfil.set(perfil);
    salvarDados('festou-perfil', perfil);
  }
}
