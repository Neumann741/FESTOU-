import { Injectable, signal } from '@angular/core';

export interface DadosPerfil {
  nome: string;
  foto: string;
  bio: string;
  estilos: string;
}

@Injectable({ providedIn: 'root' })
export class Usuario {
  perfil = signal<DadosPerfil>(JSON.parse(localStorage.getItem('festou-perfil') || 'null') || {
    nome: 'Lucas Festou', foto: '', bio: 'Blumenau, SC · Música boa e a galera por perto.',
    estilos: 'Pagode, Eletrônica, Festivais',
  });

  salvar(perfil: DadosPerfil): void {
    this.perfil.set(perfil);
    localStorage.setItem('festou-perfil', JSON.stringify(perfil));
  }
}
