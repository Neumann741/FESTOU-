import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { GaleriaPage } from './galeria';

describe('GaleriaPage', () => {
  let componente: GaleriaPage;
  let fixture: ComponentFixture<GaleriaPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [GaleriaPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GaleriaPage);
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

  it('deve editar o link de uma foto', () => {
    componente.galeria.adicionar(1, 'foto-antiga.jpg');
    componente.iniciarEdicao(0, 'foto-antiga.jpg');
    componente.novoLink = 'foto-nova.jpg';
    componente.salvarEdicao();

    expect(componente.galeria.fotosDaFesta(1)[0].link).toBe('foto-nova.jpg');
    expect(componente.fotoEditando).toBe(-1);
  });
});

