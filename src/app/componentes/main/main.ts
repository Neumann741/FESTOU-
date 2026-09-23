import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  NgZone,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-main',
  styleUrls: ['./main.css', './main-motion.css'],
  templateUrl: './main.html',
})
export class Main {
  readonly activeCard = signal(0);
  readonly staticMode = signal(false);
  readonly reducedMotion = signal(false);
  readonly cards = [
    {
      label: 'Descubra',
      title: 'SEU PRÓXIMO',
      accent: '“EU FUI”.',
      text: 'Tem uma festa esperando para virar a sua melhor história. Encontre a sua.',
      image: 'assets/img1.jpg',
      tags: ['Novos lugares', 'Novas histórias'],
      color: '#292b1d',
    },
    {
      label: 'Conecte',
      title: 'O ROLÊ É BOM.',
      accent: 'JUNTO É MELHOR.',
      text: 'Descubra quem vai, chame sua galera e encontre quem está na mesma sintonia.',
      image: 'assets/img5.jpg',
      tags: ['Sua galera', 'Novas conexões'],
      color: '#30252c',
    },
    {
      label: 'Viva',
      title: 'MENOS “E SE?”.',
      accent: 'MAIS “BORA!”.',
      text: 'Do primeiro convite à última música. Viva festas que combinam com você.',
      image: 'assets/img3.jpg',
      tags: ['Sua música', 'Sua vibe'],
      color: '#25302d',
    },
    {
      label: 'Festou!',
      title: 'A FESTA ACABA.',
      accent: 'A HISTÓRIA FICA.',
      text: 'Pessoas, lugares e lembranças. Tudo conectado em um só lugar.',
      image: 'assets/img1.jpg',
      tags: ['Compartilhe momentos', 'Faça parte'],
      color: '#35301b',
    },
  ];

  private readonly story = viewChild.required<ElementRef<HTMLElement>>('story');
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private frame = 0;
  private motionQuery?: MediaQueryList;
  private manualStatic = false;

  constructor() {
    // A rolagem controla apenas transforms; nenhum evento de wheel/touch é bloqueado.
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
    const target = section.getBoundingClientRect().top + window.scrollY;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: target + (distance * index) / (this.cards.length - 1),
      behavior: 'auto',
    });
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
    const position = progress * (this.cards.length - 1);
    const active = Math.min(this.cards.length - 1, Math.floor(position + 0.05));

    cards.forEach((card, index) => {
      const remaining = Math.max(0, index - position);
      const covered = Math.min(1, Math.max(0, position - index));
      const x = remaining * (card.offsetWidth + 28) + index * 5;
      card.style.transform = `translate3d(${x}px, ${index * 3}px, 0) rotate(${covered * -2}deg) scale(${1 - covered * 0.025})`;
    });
    section.style.setProperty('--scene-color', this.cards[active].color);
    if (active !== this.activeCard()) this.zone.run(() => this.activeCard.set(active));
  }
}
