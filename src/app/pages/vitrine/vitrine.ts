import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

interface Festa {
  nome: string;
  data: string;
  categoria: string;
  local: string;
  preco: number;
  imagem: string;
  ficticia?: boolean;
}

@Component({
  imports: [CurrencyPipe],
  selector: 'app-vitrine',
  styleUrl: './vitrine.css',
  templateUrl: './vitrine.html',
})
export class Vitrine {
  festas: Festa[] = [
    {
      nome: 'MATAHARI',
      data: 'SÁB, 28 SET',
      categoria: 'Eletrônica',
      local: 'Belo Horizonte, MG',
      preco: 80,
      imagem: '/assets/img1.jpg',
    },
    {
      nome: 'RIVAGE',
      data: 'SEX, 04 OUT',
      categoria: 'Open format',
      local: 'Nova Lima, MG',
      preco: 60,
      imagem: '/assets/img2.jpg',
    },
    {
      nome: 'THE BASEMENT',
      data: 'SÁB, 12 OUT',
      categoria: 'House & Techno',
      local: 'Belo Horizonte, MG',
      preco: 75,
      imagem: '/assets/img3.jpg',
    },
    {
      nome: 'NEON PULSE',
      data: 'SEX, 18 OUT',
      categoria: 'Synthwave',
      local: 'Galpão 54 · BH',
      preco: 45,
      imagem: '/assets/img4.jpg',
      ficticia: true,
    },
    {
      nome: 'AURORA CLUB',
      data: 'SÁB, 26 OUT',
      categoria: 'Pop & Disco',
      local: 'Terraço Central · BH',
      preco: 55,
      imagem: '/assets/img5.jpg',
      ficticia: true,
    },
    {
      nome: 'NOITE SOLAR',
      data: 'SÁB, 09 NOV',
      categoria: 'Brasilidades',
      local: 'Mirante 360 · BH',
      preco: 40,
      imagem: '/assets/img6.jpg',
      ficticia: true,
    },
  ];
}
