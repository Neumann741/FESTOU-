import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Mapa } from './mapa';
import { provideRouter } from '@angular/router';

describe('Mapa', () => {
  let component: Mapa;
  let fixture: ComponentFixture<Mapa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapa],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Mapa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

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
    expect(component.festas().length).toBe(6);
  });
});
