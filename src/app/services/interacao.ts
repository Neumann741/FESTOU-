import { Injectable, inject, signal } from '@angular/core';
import { Avisos } from './avisos';
import { Festa } from '../models/festa';
import { AmigoNaFesta, Comentario, Convite, Resposta } from '../models/interacoes';
import {
  lerDados,
  salvarDados,
  lerAmigos,
  salvarAmigos,
  lerComentarios,
  salvarComentarios,
  lerConvites,
  salvarConvites,
  lerRespostas,
  salvarRespostas,
} from '../integracoes/armazenamento';

@Injectable({ providedIn: 'root' })
export class Interacao {
  private readonly avisos = inject(Avisos);
  favoritos = signal<number[]>(lerDados('festou-favoritos', [2, 5]));
  confirmadas = signal<number[]>(lerDados('festou-confirmadas', [1, 4]));
  pedidos = signal<number[]>(lerDados('festou-pedidos', []));
  espera = signal<number[]>(lerDados('festou-espera', []));
  ingressos = signal<number[]>(lerDados('festou-ingressos', []));
  respostas = signal<Resposta[]>(lerRespostas());
  convites = signal<Convite[]>(lerConvites());
  amigosPorFesta = signal<AmigoNaFesta[]>(lerAmigos());
  comentarios = signal<Comentario[]>(lerComentarios());
  pessoas = ['Ana', 'João', 'Lívia', 'Pedro', 'Marina', 'Caio'];

  convitesDaFesta(id: number): Convite[] {
    const resultado: Convite[] = [];
    for (const convite of this.convites()) {
      if (convite.festaId === id) {
        resultado.push(convite);
      }
    }
    return resultado;
  }

  comentariosDaFesta(id: number): Comentario[] {
    const resultado: Comentario[] = [];
    for (const comentario of this.comentarios()) {
      if (comentario.festaId === id) {
        resultado.push(comentario);
      }
    }
    return resultado;
  }

  respostaDaFesta(id: number): string {
    for (const resposta of this.respostas()) {
      if (resposta.festaId === id) {
        return resposta.status;
      }
    }
    return '';
  }

  convidar(festa: Festa, pessoa: string): string {
    if (!this.pessoas.includes(pessoa)) {
      return 'Escolha um amigo.';
    }
    if (this.fechada(festa) || this.lotada(festa)) {
      return 'Esta festa não está recebendo convites.';
    }
    const jaConvidado = this.buscarConvite(festa.id, pessoa) !== undefined;
    if (this.amigosNaFesta(festa.id).includes(pessoa) || jaConvidado) {
      return 'Esse amigo já participa ou já recebeu um convite.';
    }

    const convite: Convite = { festaId: festa.id, pessoa, status: 'pendente' };
    this.convites.update((lista) => [...lista, convite]);
    salvarConvites(this.convites());
    this.avisos.adicionar('Convite enviado para ' + pessoa + ': ' + festa.nome + '.', festa.id);
    return 'Convite enviado! Simule a resposta abaixo.';
  }

  responderConvite(festa: Festa, pessoa: string, aceitar: boolean): void {
    const convite = this.buscarConvite(festa.id, pessoa);
    if (!convite || convite.status !== 'pendente') {
      return;
    }
    if (aceitar && (this.fechada(festa) || this.lotada(festa))) {
      return;
    }

    let status = 'recusado';
    if (aceitar) {
      status = 'confirmado';
      if (festa.tipo === 'privada') {
        status = 'aguardando aprovação';
      }
    }
    this.atualizarConvite(festa, pessoa, status);
  }

  aprovarConvite(festa: Festa, pessoa: string, aprovar: boolean): void {
    const convite = this.buscarConvite(festa.id, pessoa);
    if (!convite || convite.status !== 'aguardando aprovação') {
      return;
    }
    if (aprovar && (this.fechada(festa) || this.lotada(festa))) {
      return;
    }

    let status = 'recusado';
    if (aprovar) {
      status = 'confirmado';
    }
    this.atualizarConvite(festa, pessoa, status);
  }

  private atualizarConvite(festa: Festa, pessoa: string, status: string): void {
    const lista: Convite[] = [];
    for (const convite of this.convites()) {
      if (convite.festaId === festa.id && convite.pessoa === pessoa) {
        lista.push({ ...convite, status });
      } else {
        lista.push(convite);
      }
    }
    this.convites.set(lista);
    salvarConvites(lista);
    this.avisos.adicionar(pessoa + ' em ' + festa.nome + ': ' + status + '.', festa.id);
  }

  total(festa: Festa): number {
    let quantidade = festa.pessoasConfirmadas;
    if (this.confirmadas().includes(festa.id)) {
      quantidade++;
    }
    for (const convite of this.convitesDaFesta(festa.id)) {
      if (convite.status === 'confirmado') {
        quantidade++;
      }
    }
    return quantidade;
  }

  lotada(festa: Festa): boolean {
    if (festa.status === 'esgotada') {
      return true;
    }
    if (festa.limiteParticipantes) {
      return this.total(festa) >= festa.limiteParticipantes;
    }
    return false;
  }

  status(festa: Festa): string {
    if (festa.status === 'cancelada' || festa.status === 'encerrada') {
      return festa.status;
    }
    const fim = new Date(festa.data + 'T23:59:59');
    if (fim.getTime() < Date.now()) {
      return 'encerrada';
    }
    if (this.lotada(festa)) {
      return 'esgotada';
    }
    return 'publicada';
  }

  fechada(festa: Festa): boolean {
    const status = this.status(festa);
    return status === 'cancelada' || status === 'encerrada';
  }

  alternarEspera(festa: Festa): void {
    if (this.fechada(festa) || this.confirmadas().includes(festa.id)) {
      return;
    }
    if (this.espera().includes(festa.id)) {
      this.removerEspera(festa.id);
    } else if (this.lotada(festa)) {
      this.espera.update((lista) => [...lista, festa.id]);
      salvarDados('festou-espera', this.espera());
      this.avisos.adicionar(
        'Você entrou na lista de espera de ' +
          festa.nome +
          '. Consulte a festa para verificar vagas.',
        festa.id,
      );
    }
  }

  private removerEspera(id: number): void {
    this.espera.set(this.removerNumero(this.espera(), id));
    salvarDados('festou-espera', this.espera());
  }

  favoritar(id: number): void {
    if (this.favoritos().includes(id)) {
      this.favoritos.set(this.removerNumero(this.favoritos(), id));
    } else {
      this.favoritos.update((lista) => [...lista, id]);
    }
    salvarDados('festou-favoritos', this.favoritos());
  }

  confirmar(id: number): void {
    if (this.confirmadas().includes(id)) {
      this.confirmadas.set(this.removerNumero(this.confirmadas(), id));
    } else {
      this.confirmadas.update((lista) => [...lista, id]);
    }
    salvarDados('festou-confirmadas', this.confirmadas());
    this.removerEspera(id);
  }

  private salvarResposta(id: number, status: string): void {
    const lista: Resposta[] = [];
    for (const resposta of this.respostas()) {
      if (resposta.festaId !== id) {
        lista.push(resposta);
      }
    }
    this.respostas.set([...lista, { festaId: id, status }]);
    salvarRespostas(this.respostas());
  }

  pedirParticipacao(id: number): void {
    if (this.pedidos().includes(id) || this.confirmadas().includes(id)) {
      return;
    }
    this.pedidos.update((lista) => [...lista, id]);
    salvarDados('festou-pedidos', this.pedidos());
    this.salvarResposta(id, 'pendente');
    this.avisos.adicionar('Seu pedido de participação foi enviado.', id);
  }

  responderPedido(festa: Festa, aprovar: boolean): void {
    if (!this.pedidos().includes(festa.id) || festa.tipo !== 'privada') {
      return;
    }
    if (aprovar && (this.fechada(festa) || this.lotada(festa))) {
      return;
    }
    this.pedidos.set(this.removerNumero(this.pedidos(), festa.id));
    salvarDados('festou-pedidos', this.pedidos());

    let status = 'recusado';
    if (aprovar) {
      status = 'aprovado';
      if (!this.confirmadas().includes(festa.id)) {
        this.confirmar(festa.id);
      }
    }
    this.salvarResposta(festa.id, status);
    this.avisos.adicionar('Seu pedido para ' + festa.nome + ' foi ' + status + '.', festa.id);
  }

  comprarIngresso(id: number): void {
    if (!this.ingressos().includes(id)) {
      this.ingressos.update((lista) => [...lista, id]);
      salvarDados('festou-ingressos', this.ingressos());
    }
  }

  comentar(id: number, texto: string): void {
    if (!texto.trim()) {
      return;
    }
    const comentario: Comentario = { festaId: id, pessoa: 'Você', texto };
    this.comentarios.update((lista) => [...lista, comentario]);
    salvarComentarios(this.comentarios());
  }

  adicionarAmigo(id: number, pessoa: string): void {
    if (!pessoa) {
      return;
    }
    let existe = false;
    for (const amigo of this.amigosPorFesta()) {
      if (amigo.festaId === id && amigo.pessoa === pessoa) {
        existe = true;
      }
    }
    if (!existe) {
      this.amigosPorFesta.update((lista) => [...lista, { festaId: id, pessoa }]);
      salvarAmigos(this.amigosPorFesta());
    }
  }

  amigosNaFesta(id: number): string[] {
    const amigos: string[] = [];
    for (const amigo of this.amigosPorFesta()) {
      if (amigo.festaId === id && !amigos.includes(amigo.pessoa)) {
        amigos.push(amigo.pessoa);
      }
    }
    for (const convite of this.convitesDaFesta(id)) {
      if (convite.status === 'confirmado' && !amigos.includes(convite.pessoa)) {
        amigos.push(convite.pessoa);
      }
    }
    return amigos;
  }

  private buscarConvite(id: number, pessoa: string): Convite | undefined {
    for (const convite of this.convites()) {
      if (convite.festaId === id && convite.pessoa === pessoa) {
        return convite;
      }
    }
    return undefined;
  }

  private removerNumero(lista: number[], numero: number): number[] {
    const resultado: number[] = [];
    for (const item of lista) {
      if (item !== numero) {
        resultado.push(item);
      }
    }
    return resultado;
  }
}
