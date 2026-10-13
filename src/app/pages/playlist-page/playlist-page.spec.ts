import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { PlaylistPage } from './playlist-page';

describe('PlaylistPage', () => {
  let componente: PlaylistPage;
  let fixture: ComponentFixture<PlaylistPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PlaylistPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistPage);
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

