import { Injectable, inject, signal } from '@angular/core';
import { Avisos } from './avisos';
import { Festa } from '../models/festa';

export interface Comentario {
  pessoa: string;
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class Interacao {
  private readonly avisos = inject(Avisos);
  favoritos = signal<number[]>(this.ler('festou-favoritos', [2, 5]));
  confirmadas = signal<number[]>(this.ler('festou-confirmadas', [1, 4]));
  pedidos = signal<number[]>(this.ler('festou-pedidos', []));
  respostas = signal<Record<number, string>>(this.ler('festou-respostas', {}));
  ingressos = signal<number[]>(this.ler('festou-ingressos', []));
  pessoas = ['Ana', 'João', 'Lívia', 'Pedro', 'Marina', 'Caio'];
  amigosPorFesta = signal<Record<number, string[]>>(this.ler('festou-amigos-festas', {
    1: ['Ana', 'João'],
    2: ['Lívia'],
    5: ['Pedro', 'Marina'],
  }));
  comentarios = signal<Record<number, Comentario[]>>(this.ler('festou-comentarios', {
    1: [{ pessoa: 'Ana', texto: 'Eu vou! Vai ser demais.' }],
    2: [{ pessoa: 'João', texto: 'Já chamei toda a galera.' }],
  }));

  favoritar(id: number): void {
    const lista = this.favoritos();
    const favoritos = lista.includes(id) ? lista.filter((festa) => festa !== id) : [...lista, id];
    this.favoritos.set(favoritos);
    this.salvar('festou-favoritos', favoritos);
  }

  confirmar(id: number): void {
    const lista = this.confirmadas();
    const confirmadas = lista.includes(id) ? lista.filter((festa) => festa !== id) : [...lista, id];
    this.confirmadas.set(confirmadas);
    this.salvar('festou-confirmadas', confirmadas);
  }

  pedirParticipacao(id: number): void {
    if (this.pedidos().includes(id) || this.confirmadas().includes(id)) return;
    const pedidos = [...this.pedidos(), id];
    this.pedidos.set(pedidos);
    this.salvar('festou-pedidos', pedidos);
    this.avisos.adicionar('Seu pedido de participação foi enviado.', id);
    this.respostas.update(lista => ({ ...lista, [id]: 'pendente' }));
    this.salvar('festou-respostas', this.respostas());
  }

  responderPedido(festa: Festa, aprovar: boolean): void {
    if (!this.pedidos().includes(festa.id) || festa.tipo !== 'privada') return;
    if (aprovar && festa.limiteParticipantes && festa.pessoasConfirmadas >= festa.limiteParticipantes) return;
    this.pedidos.update(lista => lista.filter(id => id !== festa.id));
    this.salvar('festou-pedidos', this.pedidos());
    this.respostas.update(lista => ({ ...lista, [festa.id]: aprovar ? 'aprovado' : 'recusado' }));
    this.salvar('festou-respostas', this.respostas());
    if (aprovar && !this.confirmadas().includes(festa.id)) this.confirmar(festa.id);
    this.avisos.adicionar(`Seu pedido para ${festa.nome} foi ${aprovar ? 'aprovado' : 'recusado'}.`, festa.id);
  }

  comprarIngresso(id: number): void {
    if (this.ingressos().includes(id)) return;
    const ingressos = [...this.ingressos(), id];
    this.ingressos.set(ingressos);
    this.salvar('festou-ingressos', ingressos);
  }

  comentar(id: number, texto: string): void {
    if (!texto.trim()) return;
    const lista = this.comentarios();
    const comentario = { pessoa: 'Você', texto };
    const comentarios = { ...lista, [id]: [...(lista[id] || []), comentario] };
    this.comentarios.set(comentarios);
    this.salvar('festou-comentarios', comentarios);
  }

  adicionarAmigo(id: number, pessoa: string): void {
    if (!pessoa) return;
    const lista = this.amigosPorFesta();
    const amigos = lista[id] || [];
    if (amigos.includes(pessoa)) return;
    const atualizado = { ...lista, [id]: [...amigos, pessoa] };
    this.amigosPorFesta.set(atualizado);
    this.salvar('festou-amigos-festas', atualizado);
  }

  amigosNaFesta(id: number): string[] {
    return this.amigosPorFesta()[id] || [];
  }

  private ler<T>(chave: string, padrao: T): T {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : padrao;
  }

  private salvar(chave: string, dados: unknown): void {
    localStorage.setItem(chave, JSON.stringify(dados));
  }
}
