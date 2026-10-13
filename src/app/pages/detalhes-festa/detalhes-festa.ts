import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Festa } from '../../models/festa';
import { FestaService } from '../../services/festa.service';
import { Interacao } from '../../services/interacao';
import { RecursosFesta } from '../../componentes/recursos-festa/recursos-festa';
import { Experiencias } from '../../services/experiencias';

@Component({
  imports: [FormsModule, RouterLink, RecursosFesta],
  selector: 'app-detalhes-festa',
  styleUrl: './detalhes-festa.css',
  templateUrl: './detalhes-festa.html',
})
export class DetalhesFesta {
  comentario = '';
  amigoEscolhido = '';
  readonly interacao = inject(Interacao);
  readonly experiencias = inject(Experiencias);
  avisoIngresso = '';
  private readonly rota = inject(ActivatedRoute);
  private readonly festaService = inject(FestaService);

  festa(): Festa | undefined {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    return this.festaService.festas().find((festa) => festa.id === id);
  }

  imagemDaCapa(festa: Festa): string {
    return 'url(' + festa.imagem + ')';
  }

  preco(festa: Festa): string {
    if (festa.preco === 0) return 'Grátis';
    return 'Ingresso R$ ' + festa.preco;
  }

  textoEspera(festa: Festa): string {
    if (this.interacao.espera().includes(festa.id)) return 'Sair da lista de espera';
    return 'Festa lotada · Entrar na lista de espera';
  }

  textoPedido(festa: Festa): string {
    if (this.interacao.pedidos().includes(festa.id)) return 'Pedido enviado';
    return 'Pedir para participar';
  }

  textoPresenca(festa: Festa): string {
    if (this.interacao.confirmadas().includes(festa.id)) return 'Cancelar presença';
    return 'Confirmar presença';
  }

  textoFavorito(festa: Festa): string {
    if (this.interacao.favoritos().includes(festa.id)) return '♥ Salva';
    return '♡ Salvar festa';
  }

  textoIngresso(festa: Festa): string {
    if (this.interacao.ingressos().includes(festa.id)) return 'Ingresso adquirido';
    return 'Comprar ingresso fictício';
  }

  textoListaEspera(festa: Festa): string {
    if (this.interacao.lotada(festa)) return 'A festa ainda está lotada.';
    return 'Há vagas! Confirme presença ou peça aprovação se a festa for privada.';
  }

  textoLimite(festa: Festa): string {
    if (festa.limiteParticipantes) return '· Limite: ' + festa.limiteParticipantes;
    return '· Sem limite definido';
  }

  confirmar(): void {
    const festa = this.festa();
    if (!festa || this.interacao.fechada(festa)) return;
    const confirmada = this.interacao.confirmadas().includes(festa.id);
    if (!confirmada && (festa.tipo === 'privada' || this.interacao.lotada(festa))) return;
    this.interacao.confirmar(festa.id);
  }
  pedirParticipacao(): void {
    const festa = this.festa();
    if (festa && !this.interacao.fechada(festa) && !this.interacao.lotada(festa))
      this.interacao.pedirParticipacao(festa.id);
  }
  comprarIngresso(): void {
    const festa = this.festa();
    if (festa) this.avisoIngresso = this.experiencias.emitir(festa);
  }
  favoritar(): void {
    const festa = this.festa();
    if (festa) this.interacao.favoritar(festa.id);
  }
  enviarComentario(): void {
    const festa = this.festa();
    if (!festa) return;
    this.interacao.comentar(festa.id, this.comentario);
    this.comentario = '';
  }
  adicionarAmigo(): void {
    const festa = this.festa();
    if (!festa) return;
    this.interacao.adicionarAmigo(festa.id, this.amigoEscolhido);
    this.amigoEscolhido = '';
  }
}
