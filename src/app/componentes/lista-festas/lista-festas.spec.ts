import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListaFestas } from './lista-festas';

describe('ListaFestas', () => {
  let component: ListaFestas;
  let fixture: ComponentFixture<ListaFestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaFestas],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaFestas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
