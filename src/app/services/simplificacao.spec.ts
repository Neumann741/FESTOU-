import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { FestaService } from './festa.service';
import { Perfil } from '../pages/perfil/perfil';
import { ListaFestas } from '../componentes/lista-festas/lista-festas';
import { DetalhesFesta } from '../pages/detalhes-festa/detalhes-festa';
import { PlaylistPage } from '../pages/playlist/playlist';

describe('Lista de festas compartilhada', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    });
  });

  afterEach(() => localStorage.clear());

  it('atualiza perfil e destaques usando a mesma lista do serviço', () => {
    const servico = TestBed.inject(FestaService);
    const perfil = TestBed.createComponent(Perfil).componentInstance;
    const vitrine = TestBed.createComponent(ListaFestas).componentInstance;
    const festa = servico.festas()[0];

    servico.atualizarFesta({ ...festa, nome: 'Nome atualizado' });

    expect(perfil.festas()).toBe(servico.festas());
    expect(vitrine.festas()).toBe(servico.festas());
    expect(perfil.confirmadas()[0].nome).toBe('Nome atualizado');
    expect(vitrine.filtradas()[0].nome).toBe('Nome atualizado');
  });

  it('atualiza detalhes e playlist depois de editar a festa', () => {
    const servico = TestBed.inject(FestaService);
    const detalhes = TestBed.createComponent(DetalhesFesta).componentInstance;
    const playlist = TestBed.createComponent(PlaylistPage).componentInstance;
    const festa = servico.festas()[0];

    servico.atualizarFesta({ ...festa, nome: 'Festa editada' });

    expect(detalhes.festa()?.nome).toBe('Festa editada');
    expect(playlist.festa()?.nome).toBe('Festa editada');
    servico.removerFesta(festa.id);
    expect(detalhes.festa()).toBeUndefined();
    expect(playlist.festa()).toBeUndefined();
  });

  it('mantém categorias sem repetição e ordenadas', () => {
    const vitrine = TestBed.createComponent(ListaFestas).componentInstance;
    const festa = vitrine.festas()[0];
    vitrine.festas.set([
      { ...festa, categoria: 'Rock' },
      { ...festa, id: 2, categoria: 'Pagode' },
      { ...festa, id: 3, categoria: 'Rock' },
    ]);
    expect(vitrine.categorias()).toEqual(['Pagode', 'Rock']);
  });

  it('monta iniciais e estilos sem depender de computed', () => {
    const perfil = TestBed.createComponent(Perfil).componentInstance;
    perfil.usuario.salvar({
      nome: '  Ana   Maria Silva ',
      foto: '',
      bio: '',
      estilos: ' Rock, , Pagode ',
    });
    expect(perfil.iniciais()).toBe('AM');
    expect(perfil.estilos()).toEqual(['Rock', 'Pagode']);
  });
});
