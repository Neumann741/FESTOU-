import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaPage } from './mapa-page';

describe('MapaPage', () => {
  let component: MapaPage;
  let fixture: ComponentFixture<MapaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
