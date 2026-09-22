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
      { id: 1, image: 'assets/img1.jpg', tone: 'olive' },
      { id: 2, image: 'assets/img2.jpg', tone: 'dark' },
      { id: 3, image: 'assets/img3.jpg', tone: 'warm' },
      { id: 4, image: 'assets/img4.jpg', tone: 'dark' },
      { id: 5, image: 'assets/img5.jpg', tone: 'olive' },
      { id: 6, image: 'assets/img6.jpg', tone: 'dark' },
    ],
    [
      { id: 7, image: 'assets/img1.jpg', tone: 'dark' },
      { id: 8, image: 'assets/img2.jpg', tone: 'warm' },
      { id: 9, image: 'assets/img3.jpg', tone: 'dark' },
      { id: 10, image: 'assets/img4.jpg', tone: 'olive' },
      { id: 11, image: 'assets/img5.jpg', tone: 'dark' },
      { id: 12, image: 'assets/img6.jpg', tone: 'warm' },
    ],
  ];
}
