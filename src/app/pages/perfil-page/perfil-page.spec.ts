import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PerfilPage } from './perfil-page';

describe('PerfilPage', () => {
  let componente: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PerfilPage],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
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

