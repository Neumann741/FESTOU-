import { Component, signal } from '@angular/core';

interface PartyCard {
  id: number;
  image: string;
  tone: string;
}

@Component({
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  readonly paused = signal(false);
  readonly copies = [0, 1];

  // Salve as fotos em public/assets e preencha image: 'assets/nome.jpg'.
  // As cópias da animação recebem a mesma imagem automaticamente.
  readonly rows: PartyCard[][] = [
    [
      { id: 1, image: '', tone: 'olive' },
      { id: 2, image: '', tone: 'dark' },
      { id: 3, image: '', tone: 'warm' },
      { id: 4, image: '', tone: 'dark' },
      { id: 5, image: '', tone: 'olive' },
      { id: 6, image: '', tone: 'dark' },
    ],
    [
      { id: 7, image: '', tone: 'dark' },
      { id: 8, image: '', tone: 'warm' },
      { id: 9, image: '', tone: 'dark' },
      { id: 10, image: '', tone: 'olive' },
      { id: 11, image: '', tone: 'dark' },
      { id: 12, image: '', tone: 'warm' },
    ],
  ];
}
