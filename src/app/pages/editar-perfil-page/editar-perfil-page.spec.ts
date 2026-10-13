import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EditarPerfilPage } from './editar-perfil-page';

describe('EditarPerfilPage', () => {
  let componente: EditarPerfilPage;
  let fixture: ComponentFixture<EditarPerfilPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [EditarPerfilPage],
      providers: [
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilPage);
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

