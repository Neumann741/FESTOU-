import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RecursosFesta } from './recursos-festa';
import { criarFestasMock } from '../../services/festas.mock';

describe('RecursosFesta', () => {
  let componente: RecursosFesta;
  let fixture: ComponentFixture<RecursosFesta>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RecursosFesta],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecursosFesta);
    fixture.componentRef.setInput('festa', criarFestasMock()[0]);
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

