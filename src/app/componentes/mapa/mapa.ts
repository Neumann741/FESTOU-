import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { calcularDistancia, formatarDistancia, Localizacao, LocationService } from '../../services/location.service';
import { MAPA_CONFIG } from './mapa.config';

@Component({
  imports: [RouterLink],
  selector: 'app-mapa',
  styleUrl: './mapa.css',
  templateUrl: './mapa.html',
})
export class Mapa {
  readonly config = MAPA_CONFIG;
  readonly categorias = ['Eletrônica', 'Sertanejo', 'Pagode', 'Funk', 'Rock', 'Festival', 'Universitária', 'Bar/Balada'];
  readonly festas = signal<(Festa & { distancia?: number })[]>([]);
  readonly selecionada = signal<number | null>(null);
  readonly perto = signal(false);
  readonly carregandoLocal = signal(false);
  readonly carregando = signal(true);
  readonly mensagem = signal('');
  readonly erroMapa = signal(false);
  readonly busca = signal('');
  readonly periodo = signal('');
  readonly categoria = signal('');
  readonly formatarDistancia = formatarDistancia;
  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('mapa');
  private readonly lista = viewChild.required<ElementRef<HTMLElement>>('lista');
  private readonly service = inject(FestaService);
  private readonly location = inject(LocationService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private todos: Festa[] = [];
  private usuario?: Localizacao;
  private map?: L.Map;
  private markers = new Map<number, L.Marker>();
  private circulo?: L.Circle;
  private usuarioMarker?: L.CircleMarker;
  private observer?: ResizeObserver;

  constructor() {
    this.service.getFestas().pipe(takeUntilDestroyed()).subscribe({
      next: festas => { this.todos = festas; this.carregando.set(false); this.filtrar(); },
      error: () => { this.carregando.set(false); this.mensagem.set('Não conseguimos carregar as festas. Tente recarregar a página.'); },
    });
    afterNextRender(() => {
      this.map = L.map(this.container().nativeElement).setView(this.config.centro, this.config.zoom);
      L.tileLayer(this.config.tiles, { attribution: this.config.attribution, maxZoom: this.config.maxZoom })
        .on('tileerror', () => this.erroMapa.set(true)).addTo(this.map);
      this.atualizarMarkers();
      if (typeof ResizeObserver !== 'undefined') {
        this.observer = new ResizeObserver(() => this.map?.invalidateSize());
        this.observer.observe(this.container().nativeElement);
      }
    });
    this.destroyRef.onDestroy(() => {
      this.observer?.disconnect();
      this.map?.remove();
      this.markers.clear();
      this.usuario = undefined;
    });
  }

  filtrar(): void {
    const normalizar = (texto: string) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1);
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() + (hoje.getDay() === 0 ? -1 : (6 - hoje.getDay() + 7) % 7));
    const fim = new Date(inicio); fim.setDate(inicio.getDate() + 2);
    const resultado = this.todos.map(festa => ({ ...festa, distancia: this.usuario
      ? calcularDistancia(this.usuario.latitude, this.usuario.longitude, festa.latitude, festa.longitude) : undefined }))
      .filter(festa => {
        const dia = new Date(`${festa.data}T00:00:00`).getTime();
        return normalizar(`${festa.nome} ${festa.local} ${festa.cidade} ${festa.categoria}`).includes(normalizar(this.busca().trim()))
          && (!this.categoria() || festa.categoria === this.categoria())
          && (!this.periodo() || (this.periodo() === 'hoje' ? dia === +hoje : this.periodo() === 'amanha' ? dia === +amanha : dia >= +inicio && dia < +fim))
          && (!this.perto() || (festa.distancia !== undefined && festa.distancia <= this.config.raioKm));
      });
    if (this.perto()) resultado.sort((a, b) => a.distancia! - b.distancia!);
    this.festas.set(resultado);
    if (!resultado.some(f => f.id === this.selecionada())) this.selecionada.set(null);
    this.atualizarMarkers();
  }

  mudarPeriodo(periodo: string): void { this.periodo.set(this.periodo() === periodo ? '' : periodo); this.filtrar(); }
  dataLabel(data: string): string { return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }); }
  preco(festa: Festa): string { return festa.preco === undefined ? 'Preço a confirmar' : festa.preco === 0 ? 'Grátis' : festa.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

  selecionar(festa: Festa): void {
    this.selecionada.set(festa.id);
    this.destacar(festa.id);
    this.map?.flyTo([festa.latitude, festa.longitude], this.config.zoomFesta, { animate: !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches });
    this.markers.get(festa.id)?.openPopup();
  }

  destacar(id: number | null): void {
    this.markers.forEach((marker, key) => {
      const ativo = key === id || key === this.selecionada();
      marker.getElement()?.classList.toggle('is-active', ativo);
      marker.setZIndexOffset(ativo ? 1000 : 0);
    });
  }

  async alternarPerto(): Promise<void> {
    if (this.carregandoLocal()) return;
    if (this.perto()) { this.desativarPerto(); return; }
    this.mensagem.set('');
    this.carregandoLocal.set(true);
    try {
      const usuario = this.usuario ?? await this.location.getCurrentLocation();
      if (this.destroyRef.destroyed) return;
      this.usuario = usuario;
      this.perto.set(true);
      const ponto: L.LatLngExpression = [usuario.latitude, usuario.longitude];
      if (this.map) {
        this.usuarioMarker = L.circleMarker(ponto, { radius: 8, color: '#fff', fillColor: '#348cff', fillOpacity: 1 }).bindTooltip('Você está aqui').addTo(this.map);
        this.circulo = L.circle(ponto, { radius: this.config.raioKm * 1000, color: '#e4c049', weight: 1, fillOpacity: 0.08 }).addTo(this.map);
        this.map.fitBounds(this.circulo.getBounds());
      }
      this.filtrar();
    } catch (error) {
      if (!this.destroyRef.destroyed) this.mensagem.set(error instanceof Error ? error.message : 'Não conseguimos acessar sua localização.');
    } finally {
      if (!this.destroyRef.destroyed) this.carregandoLocal.set(false);
    }
  }

  desativarPerto(): void {
    this.perto.set(false);
    this.circulo?.remove(); this.usuarioMarker?.remove();
    this.filtrar();
    this.map?.setView(this.config.centro, this.config.zoom);
  }

  verTodas(): void { this.busca.set(''); this.periodo.set(''); this.categoria.set(''); this.desativarPerto(); }

  private atualizarMarkers(): void {
    if (!this.map) return;
    const ids = new Set(this.festas().map(festa => festa.id));
    this.markers.forEach((marker, id) => { if (!ids.has(id)) { marker.remove(); this.markers.delete(id); } });
    for (const festa of this.festas()) {
      if (this.markers.has(festa.id)) continue;
      const badge = document.createElement('span');
      badge.textContent = `● ${festa.pessoasConfirmadas}`;
      const marker = L.marker([festa.latitude, festa.longitude], {
        title: festa.nome,
        icon: L.divIcon({ className: 'festou-marker', html: badge, iconSize: [62, 34], iconAnchor: [31, 34] }),
      }).bindPopup(this.popup(festa), { className: 'festou-popup', maxWidth: 260 }).addTo(this.map);
      marker.on('click', () => {
        this.selecionada.set(festa.id); this.destacar(festa.id);
        const card = this.lista().nativeElement.querySelector<HTMLElement>(`[data-festa="${festa.id}"]`);
        if (card) this.lista().nativeElement.scrollTo({ top: card.offsetTop - this.lista().nativeElement.offsetTop, behavior: 'smooth' });
      });
      this.markers.set(festa.id, marker);
    }
    this.destacar(null);
  }

  private popup(festa: Festa): HTMLElement {
    const content = document.createElement('div');
    if (festa.imagem) {
      const img = document.createElement('img'); img.src = festa.imagem; img.alt = festa.nome;
      content.append(img);
    }
    for (const [tag, texto] of [['h3', festa.nome], ['p', `${festa.local} · ${festa.cidade}`], ['p', `${this.dataLabel(festa.data)} · ${festa.horario}`], ['p', festa.categoria], ['p', `${festa.pessoasConfirmadas} pessoas vão`], ['strong', this.preco(festa)]]) {
      const element = document.createElement(tag); element.textContent = texto; content.append(element);
    }
    const button = document.createElement('button'); button.type = 'button'; button.textContent = 'VER FESTA';
    button.addEventListener('click', () => {
      if (this.config.detalhesDisponiveis) void this.router.navigate(['/festa', festa.id]);
      else this.mensagem.set('A página de detalhes da festa estará disponível em breve.');
    });
    content.append(button);
    return content;
  }
}
