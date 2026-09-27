import { Component, inject, signal } from '@angular/core';
import { FormField, form, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { FestaService } from '../../services/festa.service';
import { Localizacao } from '../../services/localizacao';

interface DadosFesta {
  nome: string;
  categoria: string;
  data: string;
  horario: string;
  local: string;
  preco: string;
  tipo: 'publica' | 'privada';
}

@Component({
  imports: [FormField],
  selector: 'app-criar-festa',
  styleUrl: './criar-festa.css',
  templateUrl: './criar-festa.html',
})
export class CriarFesta {
  protected dados = signal<DadosFesta>({
    nome: '',
    categoria: '',
    data: '',
    horario: '',
    local: '',
    preco: '',
    tipo: 'publica',
  });

  protected formulario = form(this.dados, (dados) => {
    required(dados.nome, { message: 'Digite o nome da festa' });
    minLength(dados.nome, 3, { message: 'O nome deve ter pelo menos 3 letras' });
    required(dados.categoria, { message: 'Escolha uma categoria' });
    required(dados.data, { message: 'Escolha a data' });
    required(dados.horario, { message: 'Escolha o horário' });
    required(dados.local, { message: 'Digite o endereço da festa' });
  });

  private readonly festaService = inject(FestaService);
  private readonly localizacao = inject(Localizacao);
  private readonly router = inject(Router);
  protected buscando = signal(false);
  protected mensagem = signal('');
  private latitude = 0;
  private longitude = 0;
  private cidade = '';

  protected criarFesta(event: SubmitEvent): void {
    event.preventDefault();

    if (this.formulario().invalid()) return;

    if (!this.latitude || !this.longitude) {
      this.mensagem.set('Clique em buscar localização antes de publicar.');
      return;
    }

    const dados = this.dados();
    const festa = this.festaService.criarFesta({
      nome: dados.nome,
      descricao: '',
      categoria: dados.categoria,
      data: dados.data,
      horario: dados.horario,
      local: dados.local,
      cidade: this.cidade,
      preco: dados.preco ? Number(dados.preco) : 0,
      imagem: 'assets/img1.jpg',
      latitude: this.latitude,
      longitude: this.longitude,
      pessoasConfirmadas: 0,
      tipo: dados.tipo,
    });

    void this.router.navigate(['/mapa-page'], { queryParams: { festa: festa.id } });
  }

  protected cancelar(): void {
    void this.router.navigate(['/main-page']);
  }

  protected buscarLocalizacao(): void {
    const endereco = this.dados().local;
    if (!endereco) {
      this.mensagem.set('Digite o endereço primeiro.');
      return;
    }

    this.buscando.set(true);
    this.mensagem.set('Buscando localização...');

    this.localizacao.buscar(endereco).subscribe({
      next: (resposta) => {
        const lugar = resposta.features[0];
        if (!lugar) {
          this.mensagem.set('Endereço não encontrado. Tente escrever mais detalhes.');
          this.buscando.set(false);
          return;
        }

        this.longitude = lugar.geometry.coordinates[0];
        this.latitude = lugar.geometry.coordinates[1];
        this.cidade = lugar.properties.city || lugar.properties.county || 'Blumenau';
        this.mensagem.set(`Local encontrado: ${lugar.properties.formatted}`);
        this.buscando.set(false);
      },
      error: () => {
        this.mensagem.set('Não foi possível buscar o endereço. Confira a chave da Geoapify.');
        this.buscando.set(false);
      },
    });
  }
}
