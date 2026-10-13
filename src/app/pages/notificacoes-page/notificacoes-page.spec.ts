import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotificacoesPage } from './notificacoes-page';

describe('NotificacoesPage', () => {
  let componente: NotificacoesPage;
  let fixture: ComponentFixture<NotificacoesPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [NotificacoesPage],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacoesPage);
    componente = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture?.destroy();
    localStorage.clear();
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('deve renderizar o conteúdo', () => {
    expect(fixture.nativeElement.textContent.trim().length).toBeGreaterThan(0);
  });
});

