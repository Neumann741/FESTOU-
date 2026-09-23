import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-main',
  styleUrls: ['./main.css', './main-motion.css'],
  templateUrl: './main.html',
})
export class Main {
  readonly activeCard = signal(0);
  readonly staticMode = signal(false);
  readonly reducedMotion = signal(false);
  readonly showRegistration = signal(false);
  // Conecte este evento à futura tela de cadastro.
  readonly registerRequested = output<void>();
  readonly cards = [
    { label: 'Descubra', title: 'SEU PRÓXIMO', accent: '“EU FUI”.', image: 'assets/img1.jpg' },
    { label: 'Conecte', title: 'SUA GALERA.', accent: 'SEU LUGAR.', image: 'assets/img5.jpg' },
    { label: 'Explore', title: 'SAIA DO', accent: 'MESMO ROLÊ.', image: 'assets/img2.jpg' },
    { label: 'Sinta', title: 'ENCONTRE', accent: 'SUA BATIDA.', image: 'assets/img4.jpg' },
    { label: 'Viva', title: 'MENOS “E SE?”.', accent: 'MAIS “BORA!”.', image: 'assets/img3.jpg' },
    {
      label: 'Faça parte',
      title: 'A PRÓXIMA',
      accent: 'HISTÓRIA É SUA.',
      image: 'assets/img6.jpg',
    },
  ];

  private readonly story = viewChild.required<ElementRef<HTMLElement>>('story');
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private frame = 0;
  private motionQuery?: MediaQueryList;
  private manualStatic = false;
  // Cinco entradas, uma breve leitura do sexto card, transformação e pausa final.
  private readonly timeline = 6.6;

  constructor() {
    afterNextRender(() => {
      this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const updatePreference = () => {
        this.reducedMotion.set(!!this.motionQuery?.matches);
        this.staticMode.set(this.manualStatic || !!this.motionQuery?.matches);
        this.scheduleUpdate();
      };
      updatePreference();
      this.zone.runOutsideAngular(() => {
        window.addEventListener('scroll', this.scheduleUpdate, { passive: true });
        window.addEventListener('resize', this.scheduleUpdate, { passive: true });
        this.motionQuery?.addEventListener('change', updatePreference);
        this.scheduleUpdate();
      });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', this.scheduleUpdate);
        window.removeEventListener('resize', this.scheduleUpdate);
        this.motionQuery?.removeEventListener('change', updatePreference);
        window.cancelAnimationFrame(this.frame);
      });
    });
  }

  toggleMotion(): void {
    const top = this.story().nativeElement.getBoundingClientRect().top + window.scrollY;
    this.manualStatic = !this.staticMode();
    this.staticMode.set(this.manualStatic || !!this.motionQuery?.matches);
    this.scheduleUpdate();
    window.scrollTo({ top, behavior: 'auto' });
  }

  goToCard(index: number): void {
    const section = this.story().nativeElement;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (distance * index) / this.timeline, behavior: 'auto' });
  }

  private readonly scheduleUpdate = (): void => {
    if (this.frame) return;
    this.frame = window.requestAnimationFrame(() => {
      this.frame = 0;
      this.updateCards();
    });
  };

  private updateCards(): void {
    const section = this.story().nativeElement;
    const cards = section.querySelectorAll<HTMLElement>('.story-card');
    if (this.staticMode()) {
      section.classList.remove('is-animated');
      return;
    }
    section.classList.add('is-animated');
    const distance = section.offsetHeight - window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, -section.getBoundingClientRect().top / Math.max(1, distance)),
    );
    const position = progress * this.timeline;
    const active = Math.min(this.cards.length - 1, Math.floor(position + 0.05));
    const rawMorph = Math.min(1, Math.max(0, position - 5.25));
    const morph = rawMorph * rawMorph * (3 - 2 * rawMorph);
    const width = cards[0].offsetWidth;
    const height = cards[0].offsetHeight;
    const buttonWidth = Math.min(260, width);
    const finalWidth = width + (buttonWidth - width) * morph;
    const finalHeight = height + (64 - height) * morph;

    section.style.setProperty('--morph', String(morph));
    section.style.setProperty('--final-width', finalWidth + 'px');
    section.style.setProperty('--final-height', finalHeight + 'px');
    section.style.setProperty('--final-radius', 20 + 16 * morph + 'px');
    section.style.setProperty('--content-opacity', String(Math.max(0, 1 - morph * 2.5)));
    section.style.setProperty('--button-opacity', String(Math.max(0, (morph - 0.7) / 0.3)));

    cards.forEach((card, index) => {
      const remaining = Math.max(0, index - position);
      const covered = Math.min(1, Math.max(0, position - index));
      const final = index === this.cards.length - 1;
      const x = remaining * (width + 28) + index * 4 + (final ? (width - finalWidth) / 2 : 0);
      const y = index * 2 + (final ? (height - finalHeight) / 2 : 0);
      card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${final ? 0 : covered * -1.5}deg)`;
      card.style.opacity = final ? '1' : String(1 - morph);
    });

    const ready = rawMorph >= 1;
    if (active !== this.activeCard() || ready !== this.showRegistration()) {
      this.zone.run(() => {
        this.activeCard.set(active);
        this.showRegistration.set(ready);
      });
    }
  }
}
