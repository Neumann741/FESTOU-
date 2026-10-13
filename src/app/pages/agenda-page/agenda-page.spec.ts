import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AgendaPage } from './agenda-page';

describe('AgendaPage', () => {
  let componente: AgendaPage;
  let fixture: ComponentFixture<AgendaPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AgendaPage],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgendaPage);
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

