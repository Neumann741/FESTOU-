import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header-main',
  styleUrl: './header-main.css',
  templateUrl: './header-main.html',
})
export class HeaderMain {
  currentSlide = 0;

  nextSlide(): void { this.currentSlide = (this.currentSlide + 1) % 3; }
  previousSlide(): void { this.currentSlide = (this.currentSlide + 2) % 3; }
  goToSlide(index: number): void { this.currentSlide = index; }
}
