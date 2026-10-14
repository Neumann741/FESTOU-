import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { CriarFestaPage } from './criar-festa-page';
import { FestaService } from '../../services/festa.service';
import { Localizacao } from '../../services/localizacao';

describe('Edição de festas', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
        { provide: Localizacao, useValue: {} },
      ],
    });
  });
  afterEach(() => localStorage.clear());

  it('carrega a festa e salva sem buscar novamente o mesmo endereço', () => {
    const componente = TestBed.createComponent(CriarFestaPage).componentInstance;
    const servico = TestBed.inject(FestaService);
    const atualizar = vi.spyOn(servico, 'atualizarFesta');
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    componente['dados'].update((dados) => ({
      ...dados,
      nome: 'Nome editado',
      imagem: 'https://exemplo.com/nova-capa.jpg',
    }));
    componente['criarFesta'](new Event('submit') as SubmitEvent);
    expect(atualizar).toHaveBeenCalledOnce();
    expect(atualizar.mock.calls[0][0].nome).toBe('Nome editado');
    expect(atualizar.mock.calls[0][0].imagem).toBe('https://exemplo.com/nova-capa.jpg');
    expect(atualizar.mock.calls[0][0].id).toBe(1);
  });

  it('impede salvar endereço alterado sem localizar novamente', () => {
    const componente = TestBed.createComponent(CriarFestaPage).componentInstance;
    const atualizar = vi.spyOn(TestBed.inject(FestaService), 'atualizarFesta');
    componente['dados'].update((dados) => ({ ...dados, local: 'Outro endereço' }));
    componente['criarFesta'](new Event('submit') as SubmitEvent);
    expect(atualizar).not.toHaveBeenCalled();
    expect(componente['mensagem']()).toContain('buscar localização');
  });

  it('rejeita limite negativo e preço negativo', () => {
    const componente = TestBed.createComponent(CriarFestaPage).componentInstance;
    const atualizar = vi.spyOn(TestBed.inject(FestaService), 'atualizarFesta');
    componente['dados'].update((dados) => ({ ...dados, limite: '-1' }));
    componente['criarFesta'](new Event('submit') as SubmitEvent);
    expect(atualizar).not.toHaveBeenCalled();
    componente['dados'].update((dados) => ({ ...dados, limite: '', preco: '-1' }));
    componente['criarFesta'](new Event('submit') as SubmitEvent);
    expect(atualizar).not.toHaveBeenCalled();
  });
});
