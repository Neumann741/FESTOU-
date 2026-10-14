import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CardGerenciamento } from './card-gerenciamento';
import { Festa } from '../../models/festa';

describe('CardGerenciamento', () => {
  let component: CardGerenciamento;
  let fixture: ComponentFixture<CardGerenciamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGerenciamento],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGerenciamento);
    component = fixture.componentInstance;
    const festa: Festa = {
      id: 1,
      nome: 'Festa teste',
      latitude: 0,
      longitude: 0,
      local: 'Centro',
      cidade: 'Blumenau',
      data: '2026-12-10',
      horario: '20:00',
      categoria: 'Rock',
      pessoasConfirmadas: 0,
      tipo: 'publica',
    };
    fixture.componentRef.setInput('festa', festa);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
