import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FestaService } from '../../services/festa.service';
import { Mapa } from './mapa';
import { provideRouter } from '@angular/router';

describe('Mapa', () => {
  let component: Mapa;
  let fixture: ComponentFixture<Mapa>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Mapa],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Mapa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => localStorage.clear());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('busca sem acentos e sincroniza filtros de categoria', () => {
    component.busca.set('ELETRONICA');
    component.filtrar();
    expect(component.festas().length).toBe(1);
    expect(component.festas()[0].nome).toBe('Festou Night');
    component.categoria.set('Rock');
    component.filtrar();
    expect(component.festas()).toEqual([]);
    component.verTodas();
    expect(component.festas()).toHaveLength(TestBed.inject(FestaService).festas().length);
  });
  it('recebe festas novas sem perder o filtro selecionado', async () => {
    const servico = TestBed.inject(FestaService);
    component.categoria.set('Rock');
    component.filtrar();
    const criada = servico.criarFesta({ ...servico.festas()[0], nome: 'Rock novo', categoria: 'Rock' });
    await fixture.whenStable();
    expect(component.categoria()).toBe('Rock');
    expect(component.festas().some((festa) => festa.id === criada.id)).toBe(true);
    servico.removerFesta(criada.id);
    await fixture.whenStable();
    expect(component.festas().some((festa) => festa.id === criada.id)).toBe(false);
  });
});
